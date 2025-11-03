<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Institution\Institution;

class InstitutionSeeder extends Seeder
{
    public function run(): void
    {
        $institutions = [
            ['name' => 'USB de São Paulo', 'active' => 1],
            ['name' => 'UBS de Campinas', 'active' => 1],
            ['name' => 'UBS do Rio de Janeiro', 'active' => 1],
        ];

        foreach ($institutions as $inst) {
            Institution::create($inst);
        }
    }
}
