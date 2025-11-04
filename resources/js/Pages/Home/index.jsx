import api from "@/axios";
import { usePage, router } from "@inertiajs/react";
import { route } from "ziggy-js";
import AuthenticationLayout from "@/Components/Layouts/AuthenticationLayout";
import SenderHome from "@/Pages/Home/Partials/SenderHome";

export default function Home() {
    const { auth } = usePage().props;

    const handleLogout = async () => {
        try {
            await api.post(route("authentication.logout"));
            router.visit(route("authentication.index"));
        } catch (err) {
            console.error("Logout failed:", err);
        }
    };

    const handleChangePassword = () => {
        console.log("Abrir modal de mudar senha");
    };

    return (
        <AuthenticationLayout
            user={auth.user}
            onLogout={handleLogout}
            onChangePassword={handleChangePassword}
        >
            <div className="mt-24 px-6 w-full max-w-5xl mx-auto space-y-6">
                {auth.user.role === 0 && <SenderHome />}
                {auth.user.role === "admin" && <p>Admin area</p>}
                {auth.user.role === "receiver" && <p>Receiver area</p>}
            </div>
        </AuthenticationLayout>
    );
}
