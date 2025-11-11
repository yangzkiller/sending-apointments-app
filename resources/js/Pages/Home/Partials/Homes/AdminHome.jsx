import { useState } from "react";
import {
    Users,
    Building2,
    UserPlus,
    Plus
} from "lucide-react";
import UserListModal from "@/Pages/Home/Partials/Modals/UserListModal";
import InstitutionListModal from "@/Pages/Home/Partials/Modals/InstitutionListModal";
import CreateInstitutionModal from "@/Pages/Home/Partials/Modals/CreateInstitutionModal";
import CreateUserModal from "@/Pages/Home/Partials/Modals/CreateUserModal";

export default function AdminHome() {
    const [isUserModalOpen, setIsUserModalOpen] = useState(false);
    const [isInstitutionModalOpen, setIsInstitutionModalOpen] = useState(false);
    const [isCreateInstitutionModalOpen, setIsCreateInstitutionModalOpen] = useState(false);
    const [isCreateUserModalOpen, setIsCreateUserModalOpen] = useState(false);

    const adminCards = [
        {
            id: 1,
            title: "Gerenciar Usuários",
            description: "Visualize e gerencie todos os usuários do sistema",
            icon: Users,
            color: "from-relative p-6 bg-gradient-to-r from-blue-900 via-gray-850 to-light-black text-white rounded-t-2xl border-b border-blue-800",
            hoverColor: "hover:from-blue-500 hover:to-blue-900",
            stats: "Ver todos",
            action: () => setIsUserModalOpen(true),
        },
        {
            id: 2,
            title: "Gerenciar Instituições",
            description: "Visualize e gerencie todas as instituições cadastradas",
            icon: Building2,
            color: "from-relative p-6 bg-gradient-to-r from-blue-900 via-gray-850 to-light-black text-white rounded-t-2xl border-b border-blue-800",
            hoverColor: "hover:from-blue-500 hover:to-blue-900",
            stats: "Ver todas",
            action: () => setIsInstitutionModalOpen(true),
        },
        {
            id: 3,
            title: "Criar Usuário",
            description: "Adicione novos usuários ao sistema",
            icon: UserPlus,
            color: "from-blue-700 to-indigo-800",
            hoverColor: "hover:from-blue-600 hover:to-indigo-700",
            stats: "Adicionar",
            action: () => setIsCreateUserModalOpen(true),
            disabled: false,
        },
        {
            id: 4,
            title: "Criar Instituição",
            description: "Cadastre novas instituições no sistema",
            icon: Plus,
            color: "from-relative p-6 bg-gradient-to-r from-blue-900 via-gray-850 to-light-black text-white rounded-t-2xl border-b border-blue-800",
            hoverColor: "hover:from-cyan-600 hover:to-blue-700",
            stats: "Adicionar",
            action: () => setIsCreateInstitutionModalOpen(true),
            disabled: false,
        },
    ];

    return (
        <div className="mb-5 space-y-8">
            {/* Main Action Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {adminCards.map((card) => {
                    const Icon = card.icon;
                    return (
                        <button
                            key={card.id}
                            onClick={card.action}
                            disabled={card.disabled}
                            className={`
                                relative overflow-hidden rounded-2xl shadow-xl
                                transform transition-all duration-300 hover:scale-105 hover:shadow-2xl
                                ${card.disabled ? 'opacity-60 cursor-not-allowed' : 'cursor-pointer'}
                                group border border-slate-700
                            `}
                        >
                            {/* Gradient Background */}
                            <div className={`
                                absolute inset-0 bg-gradient-to-br ${card.color}
                                ${!card.disabled && card.hoverColor}
                                transition-all duration-300
                            `} />

                            <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/5 rounded-full blur-2xl" />
                            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-cyan-400/10 rounded-full blur-2xl" />

                            <div className="relative p-8 text-white">
                                <div className="flex items-start justify-between mb-4">
                                    <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm group-hover:bg-white/20 transition-all border border-white/20">
                                        <Icon className="w-8 h-8" />
                                    </div>
                                    <span className="text-sm font-semibold bg-white/20 px-3 py-1 rounded-full backdrop-blur-sm border border-white/30">
                                        {card.stats}
                                    </span>
                                </div>

                                <h3 className="text-2xl font-bold mb-2">
                                    {card.title}
                                </h3>

                                <p className="text-white/80 text-sm leading-relaxed">
                                    {card.description}
                                </p>

                                {card.disabled && (
                                    <div className="mt-4 flex items-center gap-2 text-sm font-medium text-white/60">
                                        <div className="w-2 h-2 bg-white/40 rounded-full animate-pulse" />
                                        <span>Funcionalidade em desenvolvimento</span>
                                    </div>
                                )}
                            </div>
                        </button>
                    );
                })}
            </div>

            {/* Modals */}
            <UserListModal
                isOpen={isUserModalOpen}
                onClose={() => setIsUserModalOpen(false)}
            />

            <InstitutionListModal
                isOpen={isInstitutionModalOpen}
                onClose={() => setIsInstitutionModalOpen(false)}
            />

            <CreateInstitutionModal
                isOpen={isCreateInstitutionModalOpen}
                onClose={() => setIsCreateInstitutionModalOpen(false)}
                onInstitutionCreated={() => {
                    // Optionally refresh the institution list if it's open
                    setIsCreateInstitutionModalOpen(false);
                }}
            />

            <CreateUserModal
                isOpen={isCreateUserModalOpen}
                onClose={() => setIsCreateUserModalOpen(false)}
                onUserCreated={() => {
                    // Optionally refresh the user list if it's open
                    setIsCreateUserModalOpen(false);
                }}
            />
        </div>
    );
}
