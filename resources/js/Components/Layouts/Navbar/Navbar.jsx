import { useState } from "react";
import { Menu, X, Home } from "lucide-react";
import { Link } from "@inertiajs/react";
import { route } from "ziggy-js";
import Logo from "@/Components/Generals/Logo";
import UserDropdown from "@/Components/Layouts/Navbar/Partials/UserDropdown";

export default function Navbar({ user, onLogout, onChangePassword }) {
    const [mobileOpen, setMobileOpen] = useState(false);

    const isActive = (routeName) => route().current(routeName);

    return (
        <nav className="w-full bg-gradient-to-r from-black via-gray-900 to-gray-800 border-b-2 border-[#1382be9b] text-white shadow-md fixed top-0 left-0 z-50 py-2">
            <div className="max-w-7xl xl:max-w-full mx-auto px-4 sm:px-6 lg:px-8 xl:px-20">
                <div className="flex justify-between items-center h-16">
                    <div className="flex items-center">
                        <Logo className="w-28 md:w-36 cursor-pointer" />
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                    <Link
                        href={route("home")}
                        className={`flex items-center gap-2 text-sm font-medium transition-all duration-200 transform ${
                            isActive("home")
                                ? "text-[#13a3f1] scale-110"
                                : "text-gray-300 hover:text-white hover:scale-105"
                        }`}
                    >
                        <Home className="w-4 h-4" /> {/* 👈 ícone do lado esquerdo */}
                        HOME
                    </Link>
                    </div>

                    <div className="hidden md:flex items-center space-x-6">
                        <UserDropdown
                            user={user}
                            onLogout={onLogout}
                            onChangePassword={onChangePassword}
                        />
                    </div>

                    <div className="md:hidden flex items-center">
                        <button
                            onClick={() => setMobileOpen(!mobileOpen)}
                            className="p-2 rounded-md hover:bg-gray-800 transition"
                        >
                            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
                        </button>
                    </div>
                </div>
            </div>

            {mobileOpen && (
                <div className="md:hidden border-t border-gray-700 bg-gray-900">
                    <div className="px-4 py-3 space-y-3">
                        <Link
                            href={route("home")}
                            className={`block text-sm font-medium px-2 py-2 rounded-md ${
                                isActive("home")
                                    ? "text-[#13a3f1] bg-gray-800"
                                    : "text-gray-300 hover:text-white hover:bg-gray-800"
                            }`}
                        >
                            Home
                        </Link>

                        <UserDropdown
                            user={user}
                            onLogout={onLogout}
                            onChangePassword={onChangePassword}
                            mobile
                        />
                    </div>
                </div>
            )}
        </nav>
    );
}
