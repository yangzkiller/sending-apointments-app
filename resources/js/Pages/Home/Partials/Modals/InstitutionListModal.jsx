import { useEffect, useState } from "react";
import { Building2, Search, Users, CheckCircle, XCircle, Loader2, ArrowUpDown, CalendarIcon, Edit, Hash } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import api from "@/axios";
import Modal from "@/Components/Generals/Modal";
import EditInstitutionModal from "./EditInstitutionModal";

export default function InstitutionListModal({ isOpen, onClose }) {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [sortBy, setSortBy] = useState("id");
    const [editingInstitution, setEditingInstitution] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchInstitutions();
        } else {
            setSearchTerm("");
            setSortBy("id");
        }
    }, [isOpen]);

    const fetchInstitutions = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(route("admin.institutions.index"));
            setInstitutions(data.data);
        } catch (error) {
            console.error("Erro ao buscar instituições:", error);
            toast.error("Erro ao carregar instituições");
        } finally {
            setLoading(false);
        }
    };

    const filteredInstitutions = institutions.filter((inst) =>
        String(inst?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedInstitutions = [...filteredInstitutions].sort((a, b) => {
        if (sortBy === "id") {
            return (a?.id || 0) - (b?.id || 0);
        } else if (sortBy === "name") {
            return String(a?.name || "").localeCompare(String(b?.name || ""));
        } else if (sortBy === "created_at") {
            return (b?.created_at_timestamp || 0) - (a?.created_at_timestamp || 0);
        }
        return 0;
    });

    const activeInstitutions = sortedInstitutions.filter(i => i?.active === 1).length;
    const inactiveInstitutions = sortedInstitutions.filter(i => i?.active === 0).length;
    const totalUsers = sortedInstitutions.reduce((sum, inst) => sum + (inst?.users_count || 0), 0);

    const handleEditInstitution = (institution) => {
        setEditingInstitution(institution);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingInstitution(null);
    };

    const handleInstitutionUpdated = () => {
        fetchInstitutions();
    };

    return (
        <>
            <Modal 
                key={`modal-${isOpen}`}
                isOpen={isOpen} 
                onClose={onClose} 
                title="Gerenciar Instituições"
                className="max-w-3xl"
                maxHeight="max-h-[75vh]"
            >
                {/* Header Info */}
                <div className="mb-4">
                    <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-cyan-500/20 rounded-xl backdrop-blur-sm border border-cyan-400/30">
                            <Building2 className="w-5 h-5 text-cyan-300" />
                        </div>
                        <div>
                            <p className="text-cyan-200 text-sm">
                                Total de {filteredInstitutions.length} instituições
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-2 sm:gap-3">
                        <div className="bg-cyan-500/15 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-cyan-500/25">
                            <div className="flex items-center gap-1 text-xs font-semibold mb-1 text-cyan-200">
                                <CheckCircle className="w-3 h-3" />
                                <span className="">Ativas</span>
                            </div>
                            <p className="text-lg sm:text-xl font-bold text-white">{activeInstitutions}</p>
                        </div>
                        <div className="bg-blue-500/15 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-blue-500/25">
                            <div className="flex items-center gap-1 text-xs font-semibold mb-1 text-blue-200">
                                <XCircle className="w-3 h-3" />
                                <span className="">Inativas</span>
                            </div>
                            <p className="text-lg sm:text-xl font-bold text-white">{inactiveInstitutions}</p>
                        </div>
                        <div className="bg-indigo-500/15 backdrop-blur-sm rounded-lg p-2 sm:p-3 border border-indigo-500/25">
                            <div className="flex items-center gap-1 text-xs font-semibold mb-1 text-indigo-200">
                                <Users className="w-3 h-3" />
                                <span className="">Usuários</span>
                            </div>
                            <p className="text-lg sm:text-xl font-bold text-white">{totalUsers}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-1 sm:p-2 border-b border-slate-700 bg-slate-800">
                    <div className="flex flex-col sm:flex-row gap-2">
                        <div className="relative flex-1">
                            <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                            <input
                                type="text"
                                placeholder="Buscar instituição..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full pl-8 pr-2 sm:pr-3 py-1.5 sm:py-1 text-xs sm:text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all hover:border-blue-400/50"
                            />
                        </div>
                        
                        <div className="relative">
                            <ArrowUpDown className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3 h-3 sm:w-4 sm:h-4 text-slate-400" />
                            <select
                                value={sortBy}
                                onChange={(e) => setSortBy(e.target.value)}
                                className="w-full sm:w-auto pl-8 pr-2 sm:pr-3 py-1.5 sm:py-1 text-xs sm:text-sm bg-slate-700 border border-slate-600 text-white rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none cursor-pointer hover:border-blue-400/50"
                            >
                                <option value="id">Por ID</option>
                                <option value="name">Por Nome</option>
                                <option value="created_at">Por Data</option>
                            </select>
                        </div>
                    </div>
                </div>

                {/* Institution List */}
                <div className="p-4 bg-gradient-to-br from-slate-900 to-blue-900/10">
                    {loading ? (
                        <div className="flex items-center justify-center py-16">
                            <div className="text-center">
                                <Loader2 className="w-12 h-12 text-cyan-500 animate-spin mx-auto mb-4" />
                                <p className="text-cyan-200 font-medium">Carregando instituições...</p>
                            </div>
                        </div>
                    ) : filteredInstitutions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="w-20 h-20 bg-cyan-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-cyan-500/20">
                                <Building2 className="w-10 h-10 text-cyan-400" />
                            </div>
                            <p className="text-cyan-200 text-lg font-medium">Nenhuma instituição encontrada</p>
                            <p className="text-cyan-200/60 text-sm mt-1">Tente ajustar os termos da busca</p>
                        </div>
                    ) : (
                        <div className="space-y-2 sm:space-y-3">
                            {sortedInstitutions.map((institution) => (
                                <div key={institution.id} className="group bg-slate-800/30 backdrop-blur-sm border border-cyan-500/8 rounded-xl p-2 sm:p-4 hover:shadow-xl hover:shadow-cyan-400/10 transition-all duration-300">
                                    <div className="flex items-start gap-2 sm:gap-3">
                                        {/* main icon */}
                                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-lg flex items-center justify-center flex-shrink-0 shadow-md group-hover:from-cyan-400 group-hover:to-blue-500 transition-all duration-200">
                                            <Building2 className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-2 mb-2">
                                                <h3 className="font-bold text-sm sm:text-lg text-white break-words line-clamp-2 sm:truncate group-hover:text-cyan-100 transition-colors">
                                                    {institution.name}
                                                </h3>
                                                {institution.active === 1 ? (
                                                    <span className="inline-flex items-center gap-1 bg-green-500/20 text-green-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-green-500/25 flex-shrink-0">
                                                        <CheckCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        <span className="">Ativa</span>
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center gap-1 bg-red-500/20 text-red-300 text-xs font-semibold px-2 py-0.5 rounded-full border border-red-500/25 flex-shrink-0">
                                                        <XCircle className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                                        <span className="">Inativa</span>
                                                    </span>
                                                )}
                                            </div>

                                            {/* Info Cards */}
                                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 sm:gap-2 mt-2 sm:mt-3">
                                                {/* ID */}
                                                <div className="flex flex-col items-center justify-center bg-emerald-500/10 border border-emerald-500/20 rounded-lg py-1.5 sm:py-2.5 px-1">
                                                    <Hash className="w-3 h-3 sm:w-4 sm:h-4 text-emerald-300 mb-0.5 sm:mb-1" />
                                                    <div className="font-bold text-white text-[10px] sm:text-[12px] text-center">ID #{institution.id}</div>
                                                </div>

                                                {/* Users */}
                                                <div className="flex flex-col items-center justify-center bg-blue-500/10 border border-blue-500/20 rounded-lg py-1.5 sm:py-2.5 px-1">
                                                    <Users className="w-3 h-3 sm:w-4 sm:h-4 text-blue-300 mb-0.5 sm:mb-1" />
                                                    <div className="font-bold text-white text-[10px] sm:text-[12px] text-center">Usuários {institution.users_count}</div>
                                                </div>

                                                {/* Edit button */} 
                                                <button 
                                                    onClick={() => handleEditInstitution(institution)}
                                                    className="flex flex-col items-center justify-center bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-500/30 rounded-lg py-1.5 sm:py-2.5 px-1 text-cyan-200 hover:text-cyan-100 transition-colors active:scale-95 cursor-pointer"
                                                >
                                                    <Edit className="w-3 h-3 sm:w-4 sm:h-4 mb-0.5 sm:mb-1" />
                                                    <div className="font-bold text-white text-[10px] sm:text-[12px]">Editar</div>
                                                </button>

                                                {/* Cadastro */}
                                                <div className="flex flex-col items-center justify-center bg-cyan-500/10 border border-cyan-500/20 rounded-lg py-1.5 sm:py-2.5 px-1">
                                                    <CalendarIcon className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-300 mb-0.5 sm:mb-1" />
                                                    <div className="text-[8px] sm:text-[10px] text-cyan-200 font-medium text-center">Cadastro</div>
                                                    <div className="font-semibold text-white text-[8px] sm:text-[10px] mt-0.5 text-center">{institution.created_at_full}</div>
                                                </div>

                                                
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
        </Modal>

        {/* Edit Institution Modal */}
        <EditInstitutionModal
            isOpen={isEditModalOpen}
            onClose={handleCloseEditModal}
            institution={editingInstitution}
            onInstitutionUpdated={handleInstitutionUpdated}
        />
        </>
    );
}