import { useState, useEffect } from "react";
import { User, Mail, Lock, Shield, Building2, Eye, EyeOff, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/axios";
import { route } from "ziggy-js";
import Modal from "@/Components/Generals/Modal";

export default function EditUserModal({ isOpen, onClose, user, onUserUpdated }) {
    const [loading, setLoading] = useState(false);
    const [institutions, setInstitutions] = useState([]);
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
        role: 0,
        active: true,
        id_institution: "",
    });

    useEffect(() => {
        if (isOpen && user) {
            setFormData({
                name: user.name || "",
                email: user.email || "",
                password: "",
                role: user.role || 0,
                active: user.active === 1,
                id_institution: user.institution?.id || "",
            });
            fetchInstitutions();
        }
    }, [isOpen, user]);

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
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                name: formData.name,
                email: formData.email,
                role: parseInt(formData.role),
                active: formData.active ? 1 : 0,
                id_institution: formData.id_institution || null,
            };

            if (formData.password && formData.password.trim() !== "") {
                dataToSend.password = formData.password;
            }

            await api.put(route("admin.users.update", user.id), dataToSend);
            
            toast.success("Usuário atualizado com sucesso!");
            onUserUpdated();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar usuário:", error);
            
            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).flat().forEach((msg) => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || "Erro ao atualizar usuário");
            }
        } finally {
            setLoading(false);
        }
    };

    const getRoleInfo = (roleValue) => {
        const roles = {
            0: { name: "Remetente", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
            1: { name: "Destinatário", color: "bg-blue-600/20 text-blue-200 border-blue-600/30" },
            2: { name: "Administrador", color: "bg-cyan-500/20 text-cyan-300 border-cyan-500/30" },
        };
        return roles[roleValue] || roles[0];
    };

    if (!user) return null;

    return (
        <Modal 
            isOpen={isOpen} 
            onClose={onClose} 
            title="Editar Usuário" 
            className="max-w-3xl"
            maxHeight="max-h-[80vh]"
        >
            <form onSubmit={handleSubmit} className="space-y-1">
                {/* Nome */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                        <User className="w-4 h-4 text-cyan-400" />
                        Nome Completo
                    </label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                        placeholder="Digite o nome completo"
                    />
                </div>

                {/* Email */}
                <div className="space-y-1">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                        <Mail className="w-4 h-4 text-cyan-400" />
                        Email
                    </label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                        placeholder="usuario@exemplo.com"
                    />
                </div>

                {/* New Password (Optional) */}
                <div className="space-y-2">
                    <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                        <Lock className="w-4 h-4 text-cyan-400" />
                        Nova Senha
                        <span className="text-xs text-gray-400 font-normal">(deixe em branco para não alterar)</span>
                    </label>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 pr-12 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white placeholder-slate-400 focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm"
                            placeholder="Mínimo 8 caracteres"
                            minLength={8}
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 hover:bg-slate-700/50 rounded-lg transition-colors"
                        >
                            {showPassword ? (
                                <EyeOff className="w-4 h-4 text-gray-400" />
                            ) : (
                                <Eye className="w-4 h-4 text-gray-400" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Role and Institution - Responsive Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {/* Role */}
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

                    {/* Institution */}
                    <div className="space-y-2">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                            <Building2 className="w-4 h-4 text-cyan-400" />
                            Instituição
                        </label>
                        <select
                            name="id_institution"
                            value={formData.id_institution}
                            onChange={handleChange}
                            className="w-full px-4 py-2.5 bg-slate-800/50 border border-slate-600/50 rounded-xl text-white focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer"
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

                {/* Status Active */}
                <div className="flex items-center justify-between p-3 bg-slate-800/30 rounded-xl border border-slate-600/30">
                    <div>
                        <label className="text-sm font-medium text-gray-200 cursor-pointer">
                            Status do Usuário
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            {formData.active ? "Usuário pode fazer login" : "Usuário bloqueado"}
                        </p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                        <input
                            type="checkbox"
                            name="active"
                            checked={formData.active}
                            onChange={handleChange}
                            className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-cyan-800 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-600"></div>
                    </label>
                </div>

                {/* Role Preview */}
                <div className="p-3 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
                    <p className="text-xs text-gray-400 mb-2">Preview da Função:</p>
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-sm font-medium ${getRoleInfo(parseInt(formData.role)).color}`}>
                        <Shield className="w-3.5 h-3.5" />
                        {getRoleInfo(parseInt(formData.role)).name}
                    </span>
                </div>

                {/* Buttons */}
                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm"
                    >
                        Cancelar
                    </button>
                    <button
                        type="submit"
                        disabled={loading}
                        className="flex-1 px-6 py-2.5 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white rounded-xl transition-all font-medium shadow-lg shadow-cyan-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5" />
                                Salvar Alterações
                            </>
                        )}
                    </button>
                </div>

                <p className="text-xs text-center text-gray-400">
                    Todas as alterações serão registradas no log do sistema
                </p>
            </form>
        </Modal>
    );
}
