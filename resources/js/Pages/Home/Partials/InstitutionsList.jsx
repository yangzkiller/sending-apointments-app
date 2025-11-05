import { useEffect, useState } from "react";
import api from "@/axios";
import { route } from "ziggy-js";
import { Building2, Calendar } from "lucide-react";
import { toast } from "react-toastify";

export default function InstitutionsList() {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await api.get(route("institutions.all"));
                setInstitutions(response.data.data);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar instituições.");
            } finally {
                setLoading(false);
            }
        };

        fetchInstitutions();
    }, []);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 animate-pulse">
                    Carregando instituições...
                </p>
            </div>
        );
    }

    return (
        <div className="mt-20 px-6 w-full max-w-6xl mx-auto">
            <h1 className="text-3xl font-semibold mb-8 text-gray-800">
                Instituições do Sistema
            </h1>

            {institutions.length === 0 ? (
                <p className="text-gray-500 text-center">
                    Nenhuma instituição cadastrada ainda.
                </p>
            ) : (
                <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {institutions.map((inst) => (
                        <div
                            key={inst.id}
                            className="bg-white border border-gray-100 shadow-sm rounded-2xl p-6 hover:shadow-md transition-shadow duration-300"
                        >
                            <div className="flex items-center gap-3 mb-4">
                                <div className="bg-blue-50 text-blue-600 p-2 rounded-lg">
                                    <Building2 className="w-6 h-6" />
                                </div>
                                <h2 className="font-semibold text-lg text-gray-800 truncate">
                                    {inst.name}
                                </h2>
                            </div>

                            <div className="text-sm text-gray-600">
                                <p className="flex items-center gap-2">
                                    <Calendar className="w-4 h-4 text-gray-400" />
                                    Criada em:{" "}
                                    {new Date(inst.created_at).toLocaleDateString("pt-BR")}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
