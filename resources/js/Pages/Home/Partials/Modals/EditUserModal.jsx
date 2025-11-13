import { useState, useEffect, useRef } from "react";
import { User, Mail, Lock, Shield, Building2, Loader2, Save, ChevronDown } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/axios";
import { route } from "ziggy-js";
import Modal from "@/Components/Generals/Modal";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";
import Dropdown from "@/Components/Generals/Dropdown";


export default function EditUserModal({ isOpen, onClose, user, onUserUpdated }) {
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

        if (name === "role" && parseInt(value) !== 0) {
            setFormData((prev) => ({
                ...prev,
                [name]: type === "checkbox" ? checked : value,
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
                role: parseInt(formData.role),
                active: formData.active ? 1 : 0,
                // Only send institution if it is SENDER (role = 0)
                id_institution: parseInt(formData.role) === 0 ? (formData.id_institution || null) : null,
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

    const InstitutionDropdownField = ({ formData, handleChange, institutions }) => {
        const [open, setOpen] = useState(false);
        const dropdownRef = useRef(null);

        const isSender = parseInt(formData.role) === 0;

        useEffect(() => {
            const handleClickOutside = (e) => {
                if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
                    setOpen(false);
                }
            };
            document.addEventListener("mousedown", handleClickOutside);
            return () => document.removeEventListener("mousedown", handleClickOutside);
        }, []);

        const selectedInstitution = institutions.find(
            (inst) => inst.id === formData.id_institution
        );

        return (
            <div className="space-y-1 relative" ref={dropdownRef}>
                <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                    <Building2 className="w-4 h-4 text-cyan-400" />
                    Instituição
                    {!isSender && (
                        <span className="text-xs text-cyan-400">(Apenas para Remetentes)</span>
                    )}
                </label>

                <button
                    type="button"
                    disabled={!isSender}
                    onClick={() => isSender && setOpen((prev) => !prev)}
                    className={`w-full flex justify-between items-center px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white text-sm transition-all ${
                        isSender
                            ? "cursor-pointer hover:border-blue-400/50 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            : "cursor-not-allowed opacity-50"
                    }`}
                >
                    <span>
                        {selectedInstitution?.name || "Nenhuma"}
                    </span>
                    {isSender && <ChevronDown className="w-4 h-4 text-gray-400" />}
                </button>

                <Dropdown
                    open={open}
                    className="w-full bg-slate-700 border border-slate-600 rounded-xl max-h-[140px] overflow-y-auto shadow-lg bottom-full mb-2 top-auto"
                >
                    <div className="flex flex-col">
                        <button
                            className="text-left px-3 py-2 hover:bg-blue-500 text-sm text-white transition-colors"
                            onClick={() => {
                                handleChange({ target: { name: 'id_institution', value: '' } });
                                setOpen(false);
                            }}
                        >
                            Nenhuma
                        </button>
                        {institutions
                            .filter((inst) => inst.active)
                            .map((inst) => (
                                <button
                                    key={inst.id}
                                    className="text-left px-3 py-2 text-sm text-white transition-colors hover:bg-blue-500"
                                    onClick={() => {
                                        handleChange({ target: { name: 'id_institution', value: inst.id } });
                                        setOpen(false);
                                    }}
                                >
                                    {inst.name}
                                </button>
                            ))}
                    </div>
                </Dropdown>

            </div>
        );
    };

    if (!user) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Usuário"
            className="max-w-3xl pt-20 md:pt-0"
            maxHeight="max-h-[calc(100vh-80px)]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name */}
                <FormField
                    label="Nome Completo"
                    icon={<User className="w-4 h-4" />}
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'name' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm hover:border-blue-400/50"
                    placeholder="Digite o nome completo"
                    required
                />

                {/* Email */}
                <FormField
                    label="Email"
                    icon={<Mail className="w-4 h-4" />}
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'email' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm hover:border-blue-400/50"
                    placeholder="usuario@exemplo.com"
                    required
                />

                {/* New Password (Optional) */}
                <FormField
                    label="Nova Senha"
                    icon={<Lock className="w-4 h-4" />}
                    type="password"
                    value={formData.password}
                    onChange={(e) => handleChange({ ...e, target: { ...e.target, name: 'password' } })}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm hover:border-blue-400/50"
                    placeholder="Deixe em branco para não alterar"
                    minLength={8}
                />
                <p className="text-xs text-gray-400 mt-1">(mín. 8 caracteres)</p>


                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                        <label className="flex items-center gap-2 text-sm font-medium text-gray-200">
                            <Shield className="w-4 h-4 text-cyan-400" />
                            Função
                        </label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                            required
                            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-xl text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm appearance-none cursor-pointer hover:border-blue-400/50"
                        >
                            <option value={0}>Remetente</option>
                            <option value={1}>Destinatário</option>
                            <option value={2}>Administrador</option>
                        </select>
                    </div>

                    {/* Institution */}
                    <InstitutionDropdownField 
                        formData={formData} 
                        handleChange={handleChange} 
                        institutions={institutions} 
                    />
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
                        <div className="w-11 h-6 bg-slate-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:start-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
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
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 flex items-center justify-center"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Salvando...
                            </>
                        ) : (
                            <>
                                <Save className="w-5 h-5 mr-2"/>
                                Salvar Alterações
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
