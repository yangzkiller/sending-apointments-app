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
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setLoading(true);

        try {
            await api.post(route('authentication.login'), {
                email,
                password,
            });

            setTimeout(() => {
                router.visit(route('home'));
            }, 1000);

        } catch (err) {
            if (err.response) {
                setErrors(err.response.data.errors || { general: err.response.data.message });
            }
            setLoading(false);
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
                loading={loading}
            />
        </GuestLayout>
    );
}
