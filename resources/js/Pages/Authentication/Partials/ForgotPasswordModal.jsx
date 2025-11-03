import { useState } from 'react';
import { route } from 'ziggy-js';
import api from '@/axios';
import Card from '@/Components/Generals/Card';
import FormField from '@/Components/Generals/FormField';
import Button from '@/Components/Generals/Button';
import { Mail, Lock, KeyRound, X, ArrowLeft } from 'lucide-react';

export default function ForgotPasswordModal({ isOpen, onClose }) {
    const [currentStep, setCurrentStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});
    const [email, setEmail] = useState('');
    const [code, setCode] = useState('');
    const [password, setPassword] = useState('');
    const [passwordConfirmation, setPasswordConfirmation] = useState('');

    const resetModal = () => {
        setCurrentStep(1);
        setLoading(false);
        setErrors({});
        setEmail('');
        setCode('');
        setPassword('');
        setPasswordConfirmation('');
        onClose();
    };

    const handleSendCode = async (e) => {
        e.preventDefault();
        setLoading(true);
        setErrors({});

        try {
            await api.post(route('authentication.forgot-password.send-code'), { email });
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
            await api.post(route('authentication.forgot-password.validate-code'), { email, code });
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
            await api.post(route('authentication.forgot-password.reset'), {
                email,
                code,
                password,
                password_confirmation: passwordConfirmation,
            });

            alert('Senha redefinida com sucesso! Você já pode fazer login.');
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

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Card className="w-full md:w-110 lg:w-150 3xl:w-300 [@media(min-width:2560px)]:w-[60rem] bg-gradient-to-b from-black via-gray-900 to-gray-800 border-1 border-[#1382be9b] shadow-lg text-white">
                <div className="flex justify-between items-center mb-6">
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
                        <h2 className="text-xl font-semibold">
                            Recuperar Senha - Passo {currentStep}/3
                        </h2>
                    </div>
                    <button
                        onClick={resetModal}
                        className="text-gray-400 hover:text-white transition-colors"
                        disabled={loading}
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="flex mb-6">
                    {[1, 2, 3].map((step) => (
                        <div
                            key={step}
                            className={`flex-1 h-2 mx-1 rounded ${
                                step <= currentStep ? 'bg-[#1382be]' : 'bg-gray-600'
                            }`}
                        />
                    ))}
                </div>

                {errors.general && (
                    <p className="text-red-500 text-sm text-center mb-4">
                        {errors.general}
                    </p>
                )}

                {currentStep === 1 && (
                    <form onSubmit={handleSendCode} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-gray-300">
                                Informe seu email para receber o código de recuperação
                            </p>
                        </div>
                        
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
                            {loading ? 'ENVIANDO...' : 'ENVIAR CÓDIGO'}
                        </Button>
                    </form>
                )}

                {currentStep === 2 && (
                    <form onSubmit={handleValidateCode} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-gray-300">
                                Digite o código de 6 dígitos enviado para<br />
                                <span className="text-[#1382be]">{email}</span>
                            </p>
                        </div>
                        
                        <FormField
                            label="CÓDIGO DE RECUPERAÇÃO"
                            iconClassName="text-[#1382be9b]"
                            icon={<KeyRound size={18} />}
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value.replace(/\D/g, '').slice(0, 6))}
                            error={errors.code}
                            disabled={loading}
                            placeholder="123456"
                            maxLength={6}
                        />

                        <Button type="submit" disabled={loading || code.length !== 6} className="w-full">
                            {loading ? 'VALIDANDO...' : 'VALIDAR CÓDIGO'}
                        </Button>
                    </form>
                )}

                {currentStep === 3 && (
                    <form onSubmit={handleResetPassword} className="space-y-4">
                        <div className="text-center mb-4">
                            <p className="text-gray-300">
                                Digite sua nova senha
                            </p>
                        </div>
                        
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
                            {loading ? 'REDEFININDO...' : 'REDEFINIR SENHA'}
                        </Button>
                    </form>
                )}
            </Card>
        </div>
    );
}
