import { useState } from "react";
import { Building2, Loader2, Plus } from "lucide-react";
import { toast } from "react-toastify";
import api from "@/axios";
import { route } from "ziggy-js";
import Modal from "@/Components/Generals/Modal";
import FormField from "@/Components/Generals/FormField";
import Button from "@/Components/Generals/Button";

export default function CreateInstitutionModal({ isOpen, onClose, onInstitutionCreated }) {
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        active: true,
    });

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

            await api.post(route("admin.institutions.store"), dataToSend);

            toast.success("Instituição criada com sucesso!");

            setFormData({
                name: "",
                active: true,
            });

            onInstitutionCreated();
            onClose();
        } catch (error) {
            console.error("Erro ao criar instituição:", error);

            if (error.response?.data?.errors) {
                const errors = error.response.data.errors;
                Object.values(errors).flat().forEach((msg) => toast.error(msg));
            } else {
                toast.error(error.response?.data?.message || "Erro ao criar instituição");
            }
        } finally {
            setLoading(false);
        }
    };

    const handleClose = () => {
        setFormData({
            name: "",
            active: true,
        });
        onClose();
    };

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title="Criar Nova Instituição"
            className="max-w-2xl"
            maxHeight="max-h-[80vh]"
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

                <div className="p-4 bg-gradient-to-r from-cyan-900/30 to-blue-900/30 rounded-xl border border-cyan-500/30">
                    <div className="flex items-start gap-3">
                        <div className="p-2 bg-cyan-500/20 rounded-lg">
                            <Building2 className="w-5 h-5 text-cyan-400" />
                        </div>
                        <div className="flex-1">
                            <h4 className="text-sm font-semibold text-cyan-200 mb-1">Sobre Instituições</h4>
                            <p className="text-xs text-gray-400 leading-relaxed">
                                As instituições são usadas para organizar e agrupar usuários no sistema.
                                Cada usuário pode estar vinculado a uma instituição.
                            </p>
                        </div>
                    </div>
                </div>

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
                                Criar Instituição
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </Modal>
    );
}
