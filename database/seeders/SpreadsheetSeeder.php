<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Spreadsheet\Spreadsheet;
use App\Models\Spreadsheet\SpreadsheetRow;
use App\Models\Institution\Institution;
use Illuminate\Support\Str;

class SpreadsheetSeeder extends Seeder
{
    public function run(): void
    {
        $users = [
            ['id' => 3, 'institution_id' => 1, 'name' => 'User Sender 1'],
            ['id' => 4, 'institution_id' => 1, 'name' => 'User Sender 2'],
            ['id' => 5, 'institution_id' => 2, 'name' => 'User Sender 3'],
            ['id' => 6, 'institution_id' => 3, 'name' => 'User Sender 4'],
        ];

        foreach ($users as $user) {
            for ($i = 1; $i <= 3; $i++) {
                $spreadsheet = Spreadsheet::create([
                    'name' => "Planilha {$i} - {$user['name']}",
                    'rows' => rand(5, 15),
                    'status' => 1,
                    'id_institution' => $user['institution_id'],
                    'id_user' => $user['id'],
                ]);

                Institution::where('id', $user['institution_id'])
                    ->update(['status' => 1]);

                for ($j = 1; $j <= $spreadsheet->rows; $j++) {
                    SpreadsheetRow::create([
                        'name' => fake()->name(),
                        'ddi' => '55',
                        'ddd' => str_pad(rand(11, 99), 2, '0', STR_PAD_LEFT),
                        'phone' => '9' . rand(1000, 9999) . rand(1000, 9999),
                        'speciality' => fake()->randomElement([
                            'Cardiologia', 'Pediatria', 'Clínico Geral', 'Ortopedia'
                        ]),
                        'institution' => "Instituição {$user['institution_id']}",
                        'address' => fake()->streetAddress(),
                        'identifier' => strtoupper(Str::random(6)),
                        'date' => now(),
                        'hour' => now(),
                        'id_spreadsheet' => $spreadsheet->id,
                    ]);
                }
            }
        }
    }
}
