import { Building2, FileSpreadsheet, ArrowBigRightDash } from "lucide-react";
import Card from "@/Components/Generals/Card";

export default function InstitutionCard({
    institution,
    checked,
    selectedSheets,
    onInstitutionToggle,
    onSheetToggle,
}) {
    return (
        <Card className="bg-gray-800 text-white border-2 border-[#1382be9b] hover:shadow-lg transition-all">
            <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                    <input
                        type="checkbox"
                        checked={checked}
                        onChange={(e) =>
                            onInstitutionToggle(institution.id, e.target.checked)
                        }
                        className="w-4 h-4 accent-blue-500 cursor-pointer"
                    />
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-lg font-semibold">{institution.name}</h2>
                </div>

                <div className="flex items-center gap-3 ml-auto">
                    <span
                        className={`px-6 py-1 text-xs font-medium rounded-lg ${
                            institution.active
                                ? "bg-green-600/30 text-green-300"
                                : "bg-red-600/30 text-red-300"
                        }`}
                    >
                        {institution.active ? "Ativa" : "Inativa"}
                    </span>

                    <button
                        className="flex items-center gap-2 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg transition text-white cursor-pointer"
                    >
                        <ArrowBigRightDash size={16} />
                    </button>
                </div>
            </div>

            <div className="border-t border-[#1382be9b] my-3"></div>

            <div className="flex flex-col gap-3">
                {institution.spreadsheets.map((sheet, i) => (
                    <div
                        key={i}
                        className="flex items-center justify-between bg-gray-900 rounded-lg p-3 border border-gray-700 hover:bg-gray-850 transition"
                    >
                        <div className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={selectedSheets.includes(sheet.name)}
                                onChange={(e) =>
                                    onSheetToggle(
                                        institution.id,
                                        sheet.name,
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 accent-blue-500 cursor-pointer"
                            />
                            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                            <span className="text-sm text-gray-200">
                                {sheet.name}
                            </span>
                        </div>

                        <span
                            className={`px-3 py-1 text-xs font-medium rounded-lg ${
                                sheet.status === "Concluída"
                                    ? "bg-green-600/30 text-green-300"
                                    : sheet.status === "Pendente"
                                    ? "bg-yellow-600/30 text-yellow-300"
                                    : "bg-gray-600/30 text-gray-300"
                            }`}
                        >
                            {sheet.status}
                        </span>
                    </div>
                ))}
            </div>
        </Card>
    );
}
