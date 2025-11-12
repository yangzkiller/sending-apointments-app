import api from "@/axios";
import { useState,useEffect } from "react";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import SenderHome from "@/Pages/Home/Partials/Homes/SenderHome";
import ReceiverHome from "@/Pages/Home/Partials/Homes/ReceiverHome";
import AdminHome from "@/Pages/Home/Partials/Homes/AdminHome";
import AuthenticationLayout from "@/Components/Layouts/AuthenticationLayout";
import ChangePasswordModal from "@/Pages/Home/Partials/Modals/ChangePasswordModal";

export default function Home() {
    const { auth } = usePage().props;
    const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState(false);

    useEffect(() => {
        document.title = "Home";
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
                {auth.user.role === 1 && <ReceiverHome />}
                {auth.user.role === 2 && <AdminHome />}
            </div>

            <ChangePasswordModal
                isOpen={isChangePasswordModalOpen}
                onClose={closeChangePasswordModal}
            />
        </AuthenticationLayout>
    );
}

