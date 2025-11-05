import { useState } from "react";
import { route } from "ziggy-js";
import api from "@/axios";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";
import Modal from "@/Components/Generals/Modal";
import { Lock } from "lucide-react";

export default function ChangePasswordModal({ isOpen, onClose }) {
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [newPasswordConfirmation, setNewPasswordConfirmation] = useState("");

    const resetModal = () => {
        setLoading(false);
        setErrors({});
        setCurrentPassword("");
        setNewPassword("");
        setNewPasswordConfirmation("");
        onClose();
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post(route("change-password"), {
                current_password: currentPassword,
                password: newPassword,
                password_confirmation: newPasswordConfirmation,
            });

            alert("Senha alterada com sucesso!");
            resetModal();
        } catch (err) {
            if (err.response) {
                setErrors(err.response.data.errors || { general: err.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={resetModal}
            title="Mudar Senha"
        >
            {errors.general && (
                <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>
            )}

            <form onSubmit={handleChangePassword} className="space-y-4">
                <p className="text-gray-300 text-center mb-4">
                    Digite sua senha atual e a nova senha
                </p>

                <FormField
                    label="SENHA ATUAL"
                    iconClassName="text-[#1382be9b]"
                    icon={<Lock size={18} />}
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    error={errors.current_password}
                    disabled={loading}
                />

                <FormField
                    label="NOVA SENHA"
                    iconClassName="text-[#1382be9b]"
                    icon={<Lock size={18} />}
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    error={errors.password}
                    disabled={loading}
                />

                <FormField
                    label="CONFIRMAR NOVA SENHA"
                    iconClassName="text-[#1382be9b]"
                    icon={<Lock size={18} />}
                    type="password"
                    value={newPasswordConfirmation}
                    onChange={(e) => setNewPasswordConfirmation(e.target.value)}
                    error={errors.password_confirmation}
                    disabled={loading}
                />

                <Button type="submit" disabled={loading} className="w-full">
                    {loading ? "ALTERANDO..." : "ALTERAR SENHA"}
                </Button>
            </form>
        </Modal>
    );
}
