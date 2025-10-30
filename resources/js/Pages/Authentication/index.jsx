import api from '@/axios';
import { route } from 'ziggy-js';
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
            const response = await api.post(route('authentication.login'), {
                email,
                password,
            });

            window.location.href = route('home');
        } catch (error) {
            if (error.response) {
                if (error.response.status === 401 || error.response.status === 422) {
                    setErrors(error.response.data.errors || { general: "Credenciais inválidas" });
                } else {
                    console.error("Erro inesperado no login:", error.response);
                }
            } else {
                console.error("Erro de conexão:", error);
            }
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
