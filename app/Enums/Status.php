<?php

namespace App\Enums;

enum Status: int
{
    case FINISHED = 0;
    case SPREADSHEET_SENT = 1;
    case DOWNLOAD_COMPLETED = 2;
    case PROCESSING = 3;

    /**
     * Get name of role
     */
    public function name(): string
    {
        return match($this) {
            self::FINISHED => "FINALIZADA",
            self::SPREADSHEET_SENT => "PLANILHA ENVIADA",
            self::DOWNLOAD_COMPLETED => "DOWNLOAD REALIZADO",
            self::PROCESSING => "EM PROCESSAMENTO",
        };
    }

    /**
     *  Return roles with exeption
     */
    public function except(array|self $items): array
    {
        if (!is_array($items)) {
            { $items = [ $items ]; }
        }
        return collect(self::cases())->filter(function ($item) use ($items) {
            return !in_array($item, $items);
        })->toArray();
    }
}
