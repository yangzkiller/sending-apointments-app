import api from "@/axios";
import { useState,useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import AuthenticationLayout from "@/Components/Layouts/AuthenticationLayout";
import SenderHome from "@/Pages/Home/Partials/SenderHome";
import AdminHome from "@/Pages/Home/Partials/AdminHome";
import ChangePasswordModal from "@/Pages/Authentication/Partials/ChangePasswordModal";

export default function Home() {
    const { auth } = usePage().props;
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        const justLoggedIn = sessionStorage.getItem('justLoggedIn');

        if (justLoggedIn && auth?.user?.name) {
            toast.success(`Seja bem-vindo, ${auth.user.name}!`);
            sessionStorage.removeItem('justLoggedIn');
        }
    }, [auth?.user?.name]);

    const handleLogout = async () => {
        try {
            await api.post(route("authentication.logout"));
            toast.info(`Até breve, ${auth.user.name}!`);
            setTimeout(() => router.visit(route("authentication.index")), 500);
        } catch (err) {
            console.error("Logout failed:", err);
            toast.error("Erro ao sair. Tente novamente.");
        }
    };

    const handleChangePassword = () => {
        setIsChangePasswordModalOpen(true);
    };

    const closeChangePasswordModal = () => {
        setIsChangePasswordModalOpen(false);
    };

    return (
        <AuthenticationLayout
            user={auth.user}
            onLogout={handleLogout}
            onChangePassword={handleChangePassword}
        >
            <div className="mt-24 px-6 w-full max-w-5xl mx-auto space-y-6">
                {auth.user.role === 0 && <SenderHome />}
                {auth.user.role === 2 && <AdminHome />}
                {auth.user.role === 1 && (
                    <div className="text-center py-12">
                        <p className="text-gray-600 text-lg">Área do Destinatário - Em desenvolvimento</p>
                    </div>
                )}
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={closeChangePasswordModal}
            />
        </AuthenticationLayout>
    );
}

