import { useState } from "react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import api from "@/axios";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";
import Modal from "@/Components/Generals/Modal";
import { Mail, Lock, KeyRound, ArrowLeft } from "lucide-react";

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState("");
    const [code, setCode] = useState("");
    const [password, setPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const resetModal = () => {
        setCurrentStep(1);
        setLoading(false);
        setErrors({});
        setEmail("");
        setCode("");
        setPassword("");
        setPasswordConfirmation("");
        onClose();
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post(route("authentication.forgot-password.send-code"), { email });
            setCurrentStep(2);
        } catch (err) {
            if (err.response) {
                setErrors(err.response.data.errors || { general: err.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleValidateCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post(route("authentication.forgot-password.validate-code"), { email, code });
            setCurrentStep(3);
        } catch (err) {
            if (err.response) {
                setErrors(err.response.data.errors || { general: err.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post(route("authentication.forgot-password.reset"), {
                email,
                code,
                password,
                password_confirmation: passwordConfirmation,
            });

            toast.success("Senha redefinida com sucesso! Você já pode fazer login.");
            resetModal();
        } catch (err) {
            if (err.response) {
                setErrors(err.response.data.errors || { general: err.response.data.message });
            }
        } finally {
            setLoading(false);
        }
    };

    const goBackStep = () => {
        setCurrentStep(currentStep - 1);
        setErrors({});
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={resetModal}
            title={
                <div className="flex items-center space-x-2">
                    {currentStep > 1 && (
                        <button
                            onClick={goBackStep}
                            className="text-[#1382be] hover:text-white transition-colors"
                            disabled={loading}
                        >
                            <ArrowLeft size={20} />
                        </button>
                    )}
                    <span>Recuperar Senha</span>
                </div>
            }
        >
            {errors.general && (
                <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>
            )}

            {currentStep === 1 && (
                <form onSubmit={handleSendCode} className="space-y-4">
                    <p className="text-gray-300 text-center mb-4">
                        Informe seu email para receber o código de recuperação
                    </p>

                    <FormField
                        label="E-MAIL"
                        iconClassName="text-[#1382be9b]"
                        icon={<Mail size={18} />}
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={errors.email}
                        disabled={loading}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "ENVIANDO..." : "ENVIAR CÓDIGO"}
                    </Button>
                </form>
            )}

            {currentStep === 2 && (
                <form onSubmit={handleValidateCode} className="space-y-4">
                    <p className="text-gray-300 text-center mb-4">
                        Se o email for válido, você receberá um código de recuperação. <br />
                        Digite o código de 6 dígitos para{" "}
                        <span className="text-[#1382be]">{email}</span>
                    </p>

                    <FormField
                        label="CÓDIGO DE RECUPERAÇÃO"
                        iconClassName="text-[#1382be9b]"
                        icon={<KeyRound size={18} />}
                        type="text"
                        value={code}
                        onChange={(e) =>
                        setCode(e.target.value.replace(/\D/g, "").slice(0, 6))
                        }
                        error={errors.code}
                        disabled={loading}
                        placeholder="123456"
                        maxLength={6}
                    />

                    <Button
                        type="submit"
                        disabled={loading || code.length !== 6}
                        className="w-full"
                    >
                        {loading ? "VALIDANDO..." : "VALIDAR CÓDIGO"}
                    </Button>
                </form>
            )}

            {currentStep === 3 && (
                <form onSubmit={handleResetPassword} className="space-y-4">
                    <p className="text-gray-300 text-center mb-4">
                        Digite sua nova senha
                    </p>

                    <FormField
                        label="NOVA SENHA"
                        iconClassName="text-[#1382be9b]"
                        icon={<Lock size={18} />}
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={errors.password}
                        disabled={loading}
                    />

                    <FormField
                        label="CONFIRMAR NOVA SENHA"
                        iconClassName="text-[#1382be9b]"
                        icon={<Lock size={18} />}
                        type="password"
                        value={passwordConfirmation}
                        onChange={(e) => setPasswordConfirmation(e.target.value)}
                        error={errors.password_confirmation}
                        disabled={loading}
                    />

                    <Button type="submit" disabled={loading} className="w-full">
                        {loading ? "REDEFININDO..." : "REDEFINIR SENHA"}
                    </Button>
                </form>
            )}
        </Modal>
    );
}
