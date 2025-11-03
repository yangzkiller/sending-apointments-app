<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use App\Models\User\User;
use App\Enums\Roles;
use Illuminate\Support\Facades\Hash;

class UserSeeder extends Seeder
{
    public function run(): void
    {
        User::create([
            'name' => 'User Admin',
            'email' => 'user_admin@example.com',
            'password' => Hash::make('password'),
            'role' => Roles::ADMINISTRATOR->value,
            'active' => 1,
            'id_institution' => null,
        ]);

        User::create([
            'name' => 'User Receiver',
            'email' => 'user_receiver@example.com',
            'password' => Hash::make('password'),
            'role' => Roles::RECEIVER->value,
            'active' => 1,
            'id_institution' => null,
        ]);

        $senders = [
            ['name' => 'User Sender 1', 'email' => 'user_sender1@example.com', 'id_institution' => 1],
            ['name' => 'User Sender 2', 'email' => 'user_sender2@example.com', 'id_institution' => 1],
            ['name' => 'User Sender 3', 'email' => 'user_sender3@example.com', 'id_institution' => 2],
            ['name' => 'User Sender 4', 'email' => 'user_sender4@example.com', 'id_institution' => 3],
        ];

        foreach ($senders as $sender) {
            User::create([
                'name' => $sender['name'],
                'email' => $sender['email'],
                'password' => Hash::make('password'),
                'role' => Roles::SENDER->value,
                'active' => 1,
                'id_institution' => $sender['id_institution'],
            ]);
        }
    }
}
