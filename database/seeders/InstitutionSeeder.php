<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\Institution\Institution;

class InstitutionSeeder extends Seeder
{
    public function run(): void
    {
        $institutions = [
            ['name' => 'UBS de São Paulo', 'active' => 1],
            ['name' => 'UBS de Campinas', 'active' => 1],
            ['name' => 'UBS do Rio de Janeiro', 'active' => 1],
            ['name' => 'UBS de Belo Horizonte', 'active' => 1],
            ['name' => 'UBS de Salvador', 'active' => 1],
            ['name' => 'UBS de Curitiba', 'active' => 1],
            ['name' => 'UBS de Porto Alegre', 'active' => 1],
            ['name' => 'UBS de Recife', 'active' => 1],
            ['name' => 'UBS de Fortaleza', 'active' => 1],
            ['name' => 'UBS de Brasília', 'active' => 1],
            ['name' => 'UBS de Goiânia', 'active' => 1],
            ['name' => 'UBS de Manaus', 'active' => 1],
            ['name' => 'UBS de Belém', 'active' => 1],
            ['name' => 'UBS de Natal', 'active' => 1],
            ['name' => 'UBS de João Pessoa', 'active' => 1],
            ['name' => 'UBS de Maceió', 'active' => 1],
            ['name' => 'UBS de Teresina', 'active' => 1],
            ['name' => 'UBS de Florianópolis', 'active' => 1],
            ['name' => 'UBS de Vitória', 'active' => 1],
            ['name' => 'UBS de São Luís', 'active' => 1],
            ['name' => 'UBS de Campo Grande', 'active' => 1],
            ['name' => 'UBS de Cuiabá', 'active' => 1],
            ['name' => 'UBS de Aracaju', 'active' => 1],
            ['name' => 'UBS de Londrina', 'active' => 1],
            ['name' => 'UBS de Sorocaba', 'active' => 1],
            ['name' => 'UBS de Ribeirão Preto', 'active' => 1],
            ['name' => 'UBS de Niterói', 'active' => 1],
            ['name' => 'UBS de Santos', 'active' => 1],
            ['name' => 'UBS de Maringá', 'active' => 1],
            ['name' => 'UBS de Blumenau', 'active' => 1],
            ['name' => 'UBS de Pelotas', 'active' => 1],
            ['name' => 'UBS de Uberlândia', 'active' => 1],
            ['name' => 'UBS de São José dos Campos', 'active' => 1],
            ['name' => 'UBS de Feira de Santana', 'active' => 1],
            ['name' => 'UBS de Anápolis', 'active' => 1],
            ['name' => 'UBS de Montes Claros', 'active' => 1],
            ['name' => 'UBS de Caruaru', 'active' => 1],
            ['name' => 'UBS de Araraquara', 'active' => 1],
            ['name' => 'UBS de Juiz de Fora', 'active' => 1],
            ['name' => 'UBS de Caxias do Sul', 'active' => 1],
        ];

        foreach ($institutions as $inst) {
            Institution::create($inst);
        }
    }
}
