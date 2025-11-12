import { useState, useRef, useEffect } from "react";
import { ChevronDown, LogOut, KeyRound } from "lucide-react";
import Dropdown from "@/Components/Generals/Dropdown";

export default function UserDropdown({ user, onLogout, onChangePassword, mobile = false }) {
    const [open, setOpen] = useState(false);
    const ref = useRef();

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (ref.current && !ref.current.contains(e.target)) setOpen(false);
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    if (mobile) {
        return (
            <div ref={ref} className="relative">
                <button
                    onClick={() => setOpen(!open)}
                    className="flex items-center space-x-2 cursor-pointer"
                >
                    <span className="font-medium">{user?.name || "Usuário"}</span>
                    <ChevronDown
                        size={16}
                        className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                    />
                </button>
                <Dropdown
                    open={open}
                    className="w-48 bg-gray-800 border border-gray-700"
                >
                    <button
                        onClick={onChangePassword}
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-800 transition-colors"
                    >
                        <KeyRound size={16} /> Mudar Senha
                    </button>
                    <button
                        onClick={onLogout}
                        className="flex items-center gap-2 px-2 py-2 rounded-md hover:bg-gray-800 text-red-400 transition-colors"
                    >
                        <LogOut size={16} /> Sair
                    </button>
                </Dropdown>
            </div>
        )
    }

    return (
        <div ref={ref} className="relative">
            <button
                onClick={() => setOpen(!open)}
                className="flex items-center space-x-2 hover:text-[#1383be] transition-colors cursor-pointer"
            >
                <span className="font-medium">{user?.name || "Usuário"}</span>
                <ChevronDown
                    size={16}
                    className={`transition-transform duration-200 ${open ? "rotate-180" : ""}`}
                />
            </button>

            <Dropdown
                open={open}
                className="right-0 w-48 bg-gray-800 border border-gray-700"
            >
                <button
                    onClick={onChangePassword}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm hover:bg-gray-700 transition-colors cursor-pointer"
                >
                    <KeyRound size={16} /> Mudar Senha
                </button>
                <button
                    onClick={onLogout}
                    className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-gray-700 transition-colors cursor-pointer"
                >
                    <LogOut size={16} /> Sair
                </button>
            </Dropdown>
        </div>
    );
}
