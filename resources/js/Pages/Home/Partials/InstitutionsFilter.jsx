import { Search, Filter, Download, ArrowBigRightDash } from "lucide-react";
import FormField from "@/Components/Generals/FormField";

export default function InstitutionsFilter({
    onDownload,
    onSelectAll,
    allSelected
}) {
    return (
        <div className="w-full max-w-6xl mx-auto mt-10 mb-6 px-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-4 flex-wrap">
                    <label className="flex items-center gap-2 text-sm text-gray-300 whitespace-nowrap">
                        <input
                            type="checkbox"
                            className="accent-blue-500 cursor-pointer"
                            checked={allSelected}
                            onChange={(e) => onSelectAll(e.target.checked)}
                        />
                        Selecionar todas
                    </label>

                    <button
                    onClick={onDownload}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-sm rounded-lg text-white transition transform hover:scale-103 cursor-pointer"
                    >
                        <Download size={16} />
                    </button>
                </div>

                <div className="flex items-center gap-3 flex-wrap">
                    <div className="relative w-40 sm:w-48">
                        <Filter className="absolute left-3 top-3.5 w-4 h-4 text-blue-400" />
                        <select
                            className="appearance-none w-full pl-9 pr-8 py-2 text-sm bg-gray-800 border-2 border-[#1382be9b] text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1696da] cursor-pointer"
                        >
                            <option value="">Todos os status</option>
                            <option value="1">Ativas</option>
                            <option value="0">Inativas</option>
                        </select>
                        <span className="absolute right-3 top-2.5 text-blue-400 text-sm">▾</span>
                    </div>

                    <div className="w-56 sm:w-64">
                        <FormField
                            type="text"
                            placeholder="Pesquisar unidade..."
                            icon={<Search size={16} className="text-blue-400" />}
                            inputClassName="bg-gray-800 text-white placeholder-gray-400 text-sm rounded-lg border-2 border-[#1382be9b]"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
