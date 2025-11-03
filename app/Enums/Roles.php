<?php

namespace App\Enums;

enum Roles: int
{
    case SENDER = 0;
    case RECEIVER = 1;
    case ADMINISTRATOR = 2;

    /**
     * Get name of role
     */
    public function name(): string
    {
        return match($this) {
            self::SENDER => "Remetente",
            self::RECEIVER => "Destinatário",
            self::ADMINISTRATOR => "Administrador",
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
