import { useState, useEffect } from "react";
import { Building2, Loader2, Save } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/axios";
import { route } from "ziggy-js";
import Modal from "@/Components/Generals/Modal";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";

export default function EditInstitutionModal({ isOpen, onClose, institution, onInstitutionUpdated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        active: true,
    });

    useEffect(() => {
        if (isOpen && institution) {
            setFormData({
                name: institution.name || "",
                active: institution.active === 1,
            });
        }
    }, [isOpen, institution]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value.toUpperCase(),
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const dataToSend = {
                name: formData.name,
                active: formData.active ? 1 : 0,
            };

            await api.put(route("admin.institutions.update", institution.id), dataToSend);

            toast.success("Instituição atualizada com sucesso!");
            onInstitutionUpdated();
            onClose();
        } catch (error) {
            console.error("Erro ao atualizar instituição:", error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).flat().forEach((msg) => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || "Erro ao atualizar instituição");
            }
        } finally {
            setLoading(false);
        }
    };

    if (!institution) return null;

    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title="Editar Instituição"
            className="max-w-2xl"
            maxHeight="max-h-[85vh]"
        >
            <form onSubmit={handleSubmit} className="space-y-4">
                <FormField
                    label="Nome da Instituição"
                    icon={<Building2 className="w-4 h-4" />}
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData((prev) => ({
                        ...prev,
                        name: e.target.value.toUpperCase()
                    }))}
                    labelClassName="text-gray-200 text-sm font-medium"
                    iconClassName="text-cyan-400"
                    inputClassName="bg-slate-800/50 border-slate-600/50 rounded-xl text-sm"
                    placeholder="Digite o nome da instituição"
                    required
                />

                <div className="flex items-center justify-between p-4 bg-slate-800/30 rounded-xl border border-slate-600/30">
                    <div>
                        <label className="text-sm font-medium text-gray-200 cursor-pointer">
                            Status da Instituição
                        </label>
                        <p className="text-xs text-gray-400 mt-1">
                            {formData.active ? "Instituição ativa e disponível" : "Instituição desativada"}
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
                <div className="p-4 bg-gradient-to-r from-slate-800/50 to-slate-700/50 rounded-xl border border-slate-600/30">
                    <p className="text-xs text-gray-400 mb-2">Informações:</p>
                    <div className="space-y-1 text-sm">
                        <div className="flex justify-between">
                            <span className="text-gray-300">ID:</span>
                            <span className="text-cyan-400 font-semibold">#{institution.id}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Usuários vinculados:</span>
                            <span className="text-cyan-400 font-semibold">{institution.users_count}</span>
                        </div>
                        <div className="flex justify-between">
                            <span className="text-gray-300">Cadastrado em:</span>
                            <span className="text-cyan-400 font-semibold">{institution.created_at}</span>
                        </div>
                    </div>
                </div>

                <div className="flex flex-col sm:flex-row gap-3 pt-2">
                    <button
                        type="button"
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 px-6 py-2.5 bg-slate-700 hover:bg-slate-600 text-white rounded-xl transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed text-sm cursor-pointer"
                    >
                        Cancelar
                    </button>
                    <Button
                        type="submit"
                        disabled={loading}
                        className="flex-1 w-full px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 shadow-lg shadow-cyan-500/20 text-sm"
                        variant="primary"
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
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
