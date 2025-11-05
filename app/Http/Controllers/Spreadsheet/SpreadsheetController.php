<?php

namespace App\Http\Controllers\Spreadsheet;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Spreadsheet\Spreadsheet;
use App\Models\Spreadsheet\SpreadsheetRow;
use App\Models\General\Log;
use Carbon\Carbon;
use Illuminate\Http\JsonResponse;

class SpreadsheetController extends Controller
{
    /**
     * Store imported spreadsheet data.
     *
     * Validates the uploaded file, checks for empty rows,
     * inserts valid rows in batches, and logs the import action.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'rows' => 'required|array|min:1',
            'file_name' => 'required|string',
        ], [
            'rows.required' => 'A planilha não pode estar vazia. Preencha pelo menos uma linha para enviar.',
            'rows.array' => 'Formato inválido da planilha.',
            'rows.min' => 'A planilha deve conter pelo menos uma linha.',
            'file_name.required' => 'O nome do arquivo é obrigatório.',
        ]);

        $user = Auth::user();
        $institutionId = $user->id_institution;

        $date = now()->format('Y-m-d');
        $safeInstitution = preg_replace('/\s+/', '_', strtolower($user->institution->name ?? 'default'));
        $expectedFileName = "default-{$safeInstitution}-{$date}.xlsx";

        if (!preg_match("/^" . preg_quote(pathinfo($expectedFileName, PATHINFO_FILENAME), '/') . "(\s*\(\d+\))?\.xlsx$/i", $validated['file_name'])) {
            return response()->json([
                'message' => "Nome do arquivo inválido. Esperado formato: {$expectedFileName}, recebido: {$validated['file_name']}"
            ], 422);
        }

        $rows = $validated['rows'];

        $expectedHeaders = ['DATA', 'HORA', 'NOME', 'DDI', 'DDD', 'CELULAR', 'ESPECIALIDADE', 'UNIDADE', 'ENDERECO'];
        $headers = array_keys($rows[0] ?? []);

        $missing = array_diff($expectedHeaders, $headers);
        $unexpected = array_diff($headers, $expectedHeaders);

        if (!empty($missing) || !empty($unexpected)) {
            $message = "Erro no cabeçalho da planilha:";

            if (!empty($missing)) {
                $message .= " Colunas faltando: " . implode(', ', $missing) . ".";
            }

            if (!empty($unexpected)) {
                $message .= " Colunas incorretas ou não esperadas: " . implode(', ', $unexpected) . ".";
            }

            $message .= " O formato esperado é exatamente: " . implode(', ', $expectedHeaders) . ".";

            return response()->json([
                'message' => $message,
                'missing' => array_values($missing),
                'unexpected' => array_values($unexpected),
                'expected' => $expectedHeaders,
                'received' => $headers,
            ], 422);
        }

        $validRows = [];
        $invalidCells = [];

        foreach ($rows as $index => $row) {
            $rowNumber = $index + 2;

            $filledCount = count(array_filter($row, fn($v) => trim((string)$v) !== ''));
            if ($filledCount > 0 && $filledCount < count($expectedHeaders)) {
                $emptyCols = [];
                foreach ($expectedHeaders as $col) {
                    if (trim((string)($row[$col] ?? '')) === '') {
                        $emptyCols[] = "{$col}{$rowNumber}";
                    }
                }
                $invalidCells[] = [
                    'row' => $rowNumber,
                    'empty_columns' => $emptyCols
                ];
                continue;
            }

            if ($filledCount === 0) continue;

            $ddi = '51';
            $ddd = str_pad(preg_replace('/\D/', '', $row['DDD'] ?? ''), 2, '0', STR_PAD_LEFT);
            $phone = preg_replace('/\D/', '', $row['CELULAR'] ?? '');
            if (strlen($phone) > 9) $phone = substr($phone, -9);

            $date = $this->normalizeDate($row['DATA'] ?? null);
            $time = $this->normalizeTime($row['HORA'] ?? null);

            $validRows[] = [
                'name' => trim((string)($row['NOME'] ?? '')),
                'ddi' => $ddi,
                'ddd' => $ddd,
                'phone' => $phone,
                'speciality' => trim((string)($row['ESPECIALIDADE'] ?? '')),
                'institution' => trim((string)($row['UNIDADE'] ?? '')),
                'address' => trim((string)($row['ENDERECO'] ?? '')),
                'date' => $date,
                'hour' => $time,
                'identifier' => preg_replace('/\D/', '', "{$ddi}{$ddd}{$phone}"),
                'id_spreadsheet' => null,
                'created_at' => now(),
                'updated_at' => now(),
            ];
        }

        if (!empty($invalidCells)) {
            $rowsWithErrors = array_column($invalidCells, 'row');
            $rowsList = implode(', ', $rowsWithErrors);

            return response()->json([
                'message' => "Há linhas que não estão totalmente preenchidas (Linhas: {$rowsList})",
                'details' => $invalidCells,
            ], 422);
        }

        $spreadsheet = Spreadsheet::create([
            'name' => 'Import ' . now()->format('Y-m-d H:i:s'),
            'rows' => count($validRows),
            'status' => 0,
            'id_user' => $user->id,
            'id_institution' => $institutionId,
        ]);

        foreach (array_chunk($validRows, 500) as $chunk) {
            foreach ($chunk as &$row) {
                $row['id_spreadsheet'] = $spreadsheet->id;
            }
            SpreadsheetRow::insert($chunk);
        }

        Log::create([
            'action' => 'IMPORT_SPREADSHEET',
            'description' => "User {$user->name} imported {$spreadsheet->rows} rows successfully.",
            'id_user' => $user->id,
        ]);

        return response()->json([
            'message' => 'Spreadsheet imported successfully!',
            'spreadsheet_id' => $spreadsheet->id,
            'valid_rows' => count($validRows),
            'total_received' => count($rows),
        ], 201);
    }

    /**
     * Normalize date values from spreadsheet to Y-m-d.
     *
     * Accepts:
     *  - "dd/mm/yyyy" -> converted to "yyyy-mm-dd"
     *  - "dd-mm-yyyy" -> converted to "yyyy-mm-dd"
     *  - Excel serial numbers (numeric) -> converted to "yyyy-mm-dd"
     *  - other date strings parseable by Carbon
     *
     * Returns null when the value cannot be parsed.
     *
     * @param mixed $value
     * @return string|null
     */
    private function normalizeDate($value): ?string
    {
        if (!$value) return null;

        try {
            if (preg_match('/^\d{2}\/\d{2}\/\d{4}$/', $value)) {
                return $value;
            }
            if (preg_match('/^\d{2}-\d{2}-\d{4}$/', $value)) {
                return str_replace('-', '/', $value);
            }
            if (is_numeric($value)) {
                $date = Carbon::createFromDate(1899, 12, 30)->addDays((int)$value);
                return $date->format('Y-m-d');
            }
            $date = Carbon::parse($value);
            return $date->format('Y-m-d');
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Normalize time values from spreadsheet to H:i:s.
     *
     * Accepts:
     *  - Excel numeric time (e.g. 0.5 -> 12:00:00)
     *  - "HH:MM" or "HH:MM:SS"
     *  - other time strings parseable by Carbon
     *
     * Returns null when the value cannot be parsed.
     *
     * @param mixed $value
     * @return string|null
     */
    private function normalizeTime($value): ?string
    {
        if (!$value) return null;

        try {
            if (is_numeric($value)) {
                $seconds = round($value * 24 * 60 * 60);
                $hours = floor($seconds / 3600);
                $minutes = floor(($seconds % 3600) / 60);
                $seconds = $seconds % 60;
                return sprintf('%02d:%02d:%02d', $hours, $minutes, $seconds);
            }

            if (preg_match('/^\d{2}:\d{2}(:\d{2})?$/', $value)) {
                $parts = explode(':', $value);
                if (count($parts) === 2) $value .= ':00';
                return $value;
            }

            $time = Carbon::parse($value);
            return $time->format('H:i:s');
        } catch (\Exception $e) {
            return null;
        }
    }
}
