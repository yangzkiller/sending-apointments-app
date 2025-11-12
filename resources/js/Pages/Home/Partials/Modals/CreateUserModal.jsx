import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Building2, Loader2, UserPlus, AlertCircle } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/axios";
import { route } from "ziggy-js";
import Modal from "@/Components/Generals/Modal";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";

export default function CreateUserModal({ isOpen, onClose, onUserCreated }) {
    const [loading, setLoading] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        active: true,
        id_institution: "",
    });

    useEffect(() => {
        if (isOpen) {
            fetchInstitutions();
        }
    }, [isOpen]);

    const fetchInstitutions = async () => {
        try {
            const { data } = await api.get(route("admin.institutions.index"));
            setInstitutions(data.data || []);
        } catch (error) {
            console.error("Erro ao buscar instituições:", error);
            toast.error("Erro ao carregar instituições");
        }
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;

        if (name === "role" && parseInt(value) !== 0) {
            setFormData((prev) => ({
                ...prev,
                [name]:
                    type === "checkbox"
                        ? checked
                        : value,
                    id_institution: "",
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]:
                    type === "checkbox"
                        ? checked
                        : name === "name"
                        ? value.toUpperCase()
                        : value,
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                password: formData.password,
                role: parseInt(formData.role),
                active: formData.active ? 1 : 0,
                id_institution: parseInt(formData.role) === 0 ? (formData.id_institution || null) : null,
            };

            await api.post(route("admin.users.store"), dataToSend);

            toast.success("Usuário criado com sucesso!");
            
            setFormData({
                name: "",
                email: "",
                password: "",
                role: 0,
                active: true,
                id_institution: "",
            });

            onUserCreated();
            onClose();
        } catch (error) {
            console.error("Erro ao criar usuário:", error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).flat().forEach((msg) => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || "Erro ao criar usuário");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            email: "",
            password: "",
            role: 0,
            active: true,
            id_institution: "",
        });
        onClose();
    };

    const getRoleInfo = (roleValue) => {
        const roles = {
            0: { name: "Remetente", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
            1: { name: "Destinatário", color: "bg-blue-600/20 text-blue-200 border-blue-600/30" },
            2: { name: "Administrador", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
        };
        return roles[roleValue] || roles[0];
    };

    const canSelectInstitution = parseInt(formData.role) === 0;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Criar Novo Usuário"
            className="max-w-3xl"
            maxHeight="max-h-[80vh]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Nome Completo"
                    icon={<User className="w-4 h-4" />}
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'name' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm"
                    placeholder="Digite o nome completo"
                    required
                />

                <FormField
                    label="Email"
                    icon={<Mail className="w-4 h-4" />}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'email' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm"
                    placeholder="usuario@exemplo.com"
                    required
                />

                <FormField
                    label="Senha"
                    icon={<Lock className="w-4 h-4" />}
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'password' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm"
                    placeholder="Mínimo 8 caracteres"
                    minLength={8}
                    required
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                            <Shield className="w-4 h-4 text-cyan-400" />
                            Função
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
                        >
                            <option value={0}>Remetente</option>
                            <option value={1}>Destinatário</option>
                            <option value={2}>Administrador</option>
                        </select>
                    </div>

                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                            <Building2 className="w-4 h-4 text-cyan-400" />
                            Instituição
                            {!canSelectInstitution && (
                                <span className="text-xs text-amber-400">(Apenas para Remetentes)</span>
                            )}
                        </label>
                        <select
                            name="id_institution"
                            value={formData.id_institution}
                            onChange={handleChange}
                            disabled={!canSelectInstitution}
                            className={`w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm appearance-none ${
                                canSelectInstitution ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
                            }`}
                        >
                            <option value="">Nenhuma</option>
                            {institutions
                                .filter((inst) => inst.active)
                                .map((inst) => (
                                    <option key={inst.id} value={inst.id}>
                                        {inst.name}
                                    </option>
                                ))}
                        </select>
                    </div>
                </div>

                {!canSelectInstitution && (
                    <div className="flex items-start gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                        <AlertCircle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />
                        <div className="flex-1">
                            <p className="text-sm text-amber-200 font-medium">Restrição de Instituição</p>
                            <p className="text-xs text-amber-300/80 mt-1">
                                Apenas usuários com função "Remetente" podem ser vinculados a uma instituição.
                            </p>
                        </div>
                    </div>
                )}

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={handleClose}
                        disabled={loading}
                        className="flex-1 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 w-full px-6 py-2.5 rounded-xl bg-[#1383be] hover:bg-[#0e6da0] text-white text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Criando...
                            </>
                        ) : (
                            <>
                                Criar Usuário
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
