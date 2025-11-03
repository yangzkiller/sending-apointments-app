import api from '@/axios';
import { route } from 'ziggy-js';
import { router } from '@inertiajs/react';
import { useState } from "react";
import GuestLayout from "@/Components/Layouts/GuestLayout";
import AuthenticationCard from "@/Pages/Authentication/Partials/AuthenticationCard";

export default function Authentication() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errors, setErrors] = useState({});

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});

        try {
            await api.post(route('authentication.login'), {
                email,
                password,
            });

            // Redireciona para home via Inertia
            router.visit(route('home'));
        } catch (err) {
            if (!err.response) return;
            setErrors(err.response.data.errors || { general: err.response.data.message });
        }
    };

    return (
        <GuestLayout>
            <AuthenticationCard
                email={email}
                setEmail={setEmail}
                password={password}
                setPassword={setPassword}
                errors={errors}
                onSubmit={handleSubmit}
            />
        </GuestLayout>
    );
}
