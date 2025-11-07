import { useEffect, useState } from "react";
import { X, Users, Search, Mail, Building2, Shield, UserCheck, UserX, Loader2, Edit } from "lucide-react";
import { route } from "ziggy-js";
import { toast } from "react-toastify";
import api from "@/axios";
import EditUserModal from "./EditUserModal";

export default function UserListModal({ isOpen, onClose }) {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [editingUser, setEditingUser] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);

    useEffect(() => {
        if (isOpen) {
            fetchUsers();
        }
    }, [isOpen]);

    const fetchUsers = async () => {
        setLoading(true);
        try {
            const { data } = await api.get(route("admin.users.index"));
            setUsers(data.data);
        } catch (error) {
            console.error("Erro ao buscar usuários:", error);
            toast.error("Erro ao carregar usuários");
        } finally {
            setLoading(false);
        }
    };

    const getRoleName = (role) => {
        const roles = {
            0: { name: "Remetente", color: "bg-blue-500/20 text-blue-300 border border-blue-500/30" },
            1: { name: "Destinatário", color: "bg-blue-600/20 text-blue-200 border border-blue-600/30" },
            2: { name: "Administrador", color: "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30" },
        };
        return roles[role] || { name: "Desconhecido", color: "bg-slate-500/20 text-slate-300 border border-slate-500/30" };
    };

    const handleEditUser = (user) => {
        setEditingUser(user);
        setIsEditModalOpen(true);
    };

    const handleCloseEditModal = () => {
        setIsEditModalOpen(false);
        setEditingUser(null);
    };

    const handleUserUpdated = () => {
        fetchUsers(); // Reload users list
    };

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (user.institution?.name || "").toLowerCase().includes(searchTerm.toLowerCase())
    );

    const activeUsers = filteredUsers.filter(u => u.active === 1).length;
    const inactiveUsers = filteredUsers.filter(u => u.active === 0).length;
    const adminCount = filteredUsers.filter(u => u.role === 2).length;

    if (!isOpen) return null;

    return (
        <div 
            className="fixed inset-0 flex items-end sm:items-center justify-center p-0 sm:p-4 animate-fadeIn bg-black/0 backdrop-blur-sm"
            onClick={onClose}
            style={{ pointerEvents: 'auto' }}
        >
            <div 
                className="relative bg-slate-900 rounded-2xl sm:rounded-3xl shadow-2xl w-full max-w-2xl max-h-[75vh] sm:max-h-[90vh] flex flex-col animate-slideUp border border-cyan-500/20 mt-0 sm:mt-20"
                onClick={(e) => e.stopPropagation()}
                style={{ pointerEvents: 'auto' }}
            >
                {/* Header */}
                <div className="relative p-3 sm:p-1 bg-gradient-to-r from-blue-900 via-gray-850 to-light-black text-white rounded-t-2xl border-b border-blue-800">
                    <button
                        onClick={onClose}
                        className="absolute top-2 right-2 sm:top-3 sm:right-3 p-1.5 hover:bg-blue-800/50 rounded-lg transition-colors"
                    >
                        <X className="w-4 h-4 text-blue-200" />
                    </button>
                    
                    <div className="flex items-center gap-2 sm:gap-3 mb-2 sm:mb-3">
                        <div className="p-1.5 sm:p-2 bg-blue-600/20 rounded-lg sm:rounded-xl backdrop-blur-sm border border-blue-500/30">
                            <Users className="w-4 h-4 sm:w-5 sm:h-5 text-blue-300" />
                        </div>
                        <div>
                            <h2 className="text-lg sm:text-xl font-bold text-white">Gerenciar Usuários</h2>
                            <p className="text-blue-200 text-xs">
                                Total de {filteredUsers.length} usuário(s)
                            </p>
                        </div>
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-3 gap-1.5 sm:gap-2">
                        <div className="bg-blue-900/30 backdrop-blur-sm rounded-lg p-1.5 sm:p-1 border border-blue-700/30">
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 text-blue-200">
                                <UserCheck className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span>Ativos</span>
                            </div>
                            <p className="text-base sm:text-xl font-bold text-white">{activeUsers}</p>
                        </div>
                        <div className="bg-gray-800/50 backdrop-blur-sm rounded-lg p-1.5 sm:p-1 border border-gray-500/30">
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 text-gray-300">
                                <UserX className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span>Inativos</span>
                            </div>
                            <p className="text-base sm:text-xl font-bold text-white">{inactiveUsers}</p>
                        </div>
                        <div className="bg-cyan-900/30 backdrop-blur-sm rounded-lg p-1.5 sm:p-1 border border-cyan-700/30">
                            <div className="flex items-center gap-1 text-[10px] sm:text-xs font-medium mb-0.5 sm:mb-1 text-cyan-200">
                                <Shield className="w-2.5 h-2.5 sm:w-3 sm:h-3" />
                                <span>Admins</span>
                            </div>
                            <p className="text-base sm:text-xl font-bold text-white">{adminCount}</p>
                        </div>
                    </div>
                </div>

                {/* Search Bar */}
                <div className="p-2 sm:p-1 border-b border-gray-700 bg-gray-800">
                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Buscar por nome, email..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-8 sm:pl-9 pr-3 py-2 text-xs sm:text-sm bg-slate-700 border border-slate-600 text-white placeholder-slate-400 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* User List */}
                <div className="flex-1 overflow-y-auto p-3 sm:p-5 bg-gray-900">
                    {loading ? (
                        <div className="flex items-center justify-center py-12">
                            <Loader2 className="w-6 h-6 sm:w-8 sm:h-8 text-blue-500 animate-spin" />
                        </div>
                    ) : filteredUsers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="w-12 h-12 sm:w-16 sm:h-16 text-gray-600 mx-auto mb-3 sm:mb-4" />
                            <p className="text-gray-400 text-base sm:text-lg">Nenhum usuário encontrado</p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-3">
                            {filteredUsers.map((user) => {
                                const roleInfo = getRoleName(user.role);
                                return (
                                    <div
                                        key={user.id}
                                        className="bg-gray-800 border border-gray-700 rounded-lg sm:rounded-xl p-2.5 sm:p-3 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300 hover:border-blue-600/50 group"
                                    >
                                        <div className="flex items-start justify-between mb-2 sm:mb-3">
                                            <div className="flex items-center gap-2 sm:gap-3 min-w-0 flex-1">
                                                <div className="w-9 h-9 sm:w-10 sm:h-10 bg-gradient-to-br from-blue-600 to-blue-800 rounded-full flex items-center justify-center text-white font-bold text-sm sm:text-base shadow-md group-hover:from-blue-500 group-hover:to-blue-700 transition-all flex-shrink-0">
                                                    {user.name.charAt(0).toUpperCase()}
                                                </div>
                                                <div className="min-w-0 flex-1">
                                                    <h3 className="font-semibold text-white flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm truncate">
                                                        <span className="truncate">{user.name}</span>
                                                        {user.active === 1 ? (
                                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-green-400 rounded-full shadow-lg shadow-green-400/50 flex-shrink-0" title="Ativo" />
                                                        ) : (
                                                            <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-red-400 rounded-full shadow-lg shadow-red-400/50 flex-shrink-0" title="Inativo" />
                                                        )}
                                                    </h3>
                                                    <span className={`text-[10px] sm:text-xs px-1.5 sm:px-2 py-0.5 rounded-full ${roleInfo.color} font-medium inline-block mt-0.5`}>
                                                        {roleInfo.name}
                                                    </span>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleEditUser(user)}
                                                className="p-1.5 sm:p-2 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-500/30 hover:border-blue-400/50 rounded-lg transition-all duration-200 group/btn flex-shrink-0"
                                                title="UserEdit"
                                            >
                                                <Edit className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-300 group-hover/btn:text-blue-200 transition-colors" />
                                            </button>
                                        </div>
                                        
                                        <div className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
                                            <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                                <Mail className="w-3 h-3 sm:w-4 sm:h-4 text-teal-400 flex-shrink-0" />
                                                <span className="truncate">{user.email}</span>
                                            </div>
                                            
                                            {user.institution && (
                                                <div className="flex items-center gap-1.5 sm:gap-2 text-gray-300">
                                                    <Building2 className="w-3 h-3 sm:w-4 sm:h-4 text-cyan-400 flex-shrink-0" />
                                                    <span className="truncate">{user.institution.name}</span>
                                                </div>
                                            )}
                                            
                                            <div className="text-[10px] sm:text-xs text-gray-500 mt-1 sm:mt-2">
                                                Cadastrado em {user.created_at}
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-2 sm:p-1 border-t border-gray-700 bg-gray-800 rounded-b-2xl">
                    <button
                        onClick={onClose}
                        className="w-full py-2.5 sm:py-1 bg-gradient-to-r from-blue-700 to-blue-900 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 transition-all font-medium text-sm sm:text-base shadow-lg border border-blue-600/30 hover:border-blue-500/50"
                    >
                        Fechar
                    </button>
                </div>
            </div>

            {/* Edit User Modal */}
            <EditUserModal
                isOpen={isEditModalOpen}
                onClose={handleCloseEditModal}
                user={editingUser}
                onUserUpdated={handleUserUpdated}
            />
        </div>
    );
}