import { Building2, FileSpreadsheet, ArrowBigRightDash, ArrowBigLeftDash, Clock, User, } from "lucide-react";
import Card from "@/Components/Generals/Card";
import Modal from "@/Components/Generals/Modal";
import { useState } from "react";

export default function InstitutionCard({
    institution,
    onSelectSheet,
    onSelectInstitution,
    selectedSheets,
    onConfirm,
}) {
    const [nextStatus, setNextStatus] = useState(null);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const allSheetsSelected =
        institution.spreadsheets.length > 0 &&
        institution.spreadsheets.every((sheet) =>
            selectedSheets.includes(sheet.id)
        );

    const institutionStatus = institution.status;
    const sentSheetsCount = institution.spreadsheets.filter(
        (sheet) => sheet.status === 1
    ).length;

    const handleConfirmStatusChange = async () => {
        setIsLoading(true);
        try {
            await onConfirm?.(institution.id, nextStatus);
            setIsModalOpen(false);
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 text-white border-2 border-[#1382be9b] hover:shadow-lg transition-all p-4 sm:p-6 rounded-2xl">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
                <div className="flex flex-wrap items-center gap-3">
                    <input
                        type="checkbox"
                        checked={allSheetsSelected}
                        onChange={(e) =>
                            onSelectInstitution(institution, e.target.checked)
                        }
                        className="w-5 h-5 accent-blue-500 cursor-pointer"
                    />
                    <div className="bg-blue-500/20 p-2 rounded-lg">
                        <Building2 className="w-5 h-5 text-blue-400" />
                    </div>
                    <h2 className="text-base sm:text-lg font-semibold">
                        {institution.name}
                    </h2>
                </div>

                <div className="flex flex-wrap items-center gap-3 sm:ml-auto">
                    <span
                        className={`px-4 py-1 text-xs sm:text-sm font-medium rounded-lg
                            ${
                                institutionStatus === 0
                                    ? "bg-green-600/30 text-green-300"
                                    : institutionStatus === 1
                                    ? "bg-yellow-600/30 text-yellow-300"
                                    : institutionStatus === 2
                                    ? "bg-purple-600/30 text-purple-300"
                                    : institutionStatus === 3
                                    ? "bg-blue-600/30 text-blue-300"
                                    : "bg-red-600/30 text-red-300"
                            }`}
                    >
                        {institutionStatus === 0
                            ? "FINALIZADA"
                            : institutionStatus === 1
                            ? `PLANILHAS ENVIADAS (${sentSheetsCount})`
                            : institutionStatus === 2
                            ? "DOWNLOADS EFETUADOS"
                            : institutionStatus === 3
                            ? "PROCESSANDO"
                            : "NENHUMA PLANILHA ENVIADA"}
                    </span>

                    <div className="flex gap-2">
                        {institutionStatus === 2 && (
                            <button
                                onClick={() => {
                                    setNextStatus(3);
                                    setIsModalOpen(true);
                                }}
                                className="p-2 sm:px-3 sm:py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg transition text-white cursor-pointer"
                            >
                                <ArrowBigRightDash size={18} />
                            </button>
                        )}

                        {institutionStatus === 3 && (
                            <>
                                <button
                                    onClick={() => {
                                        setNextStatus(2);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 sm:px-3 sm:py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg transition text-white cursor-pointer"
                                >
                                    <ArrowBigLeftDash size={18} />
                                </button>
                                <button
                                    onClick={() => {
                                        setNextStatus(0);
                                        setIsModalOpen(true);
                                    }}
                                    className="p-2 sm:px-3 sm:py-1 bg-blue-600 hover:bg-blue-700 text-sm rounded-lg transition text-white cursor-pointer"
                                >
                                    <ArrowBigRightDash size={18} />
                                </button>
                            </>
                        )}
                    </div>
                </div>
            </div>

            <div className="border-t border-[#1382be9b] my-3"></div>

            <div className="flex flex-col gap-3">
                {institution.spreadsheets.map((sheet) => (
                    <div
                        key={sheet.id}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 bg-gray-900 rounded-lg p-3 border border-gray-700 hover:bg-gray-850 transition"
                    >
                        <div className="flex flex-wrap items-center gap-2 text-sm text-gray-200">
                            <input
                                type="checkbox"
                                checked={selectedSheets.includes(sheet.id)}
                                onChange={(e) =>
                                    onSelectSheet(sheet.id, e.target.checked)
                                }
                                className="w-4 h-4 accent-blue-500 cursor-pointer"
                            />
                            <FileSpreadsheet className="w-4 h-4 text-blue-400" />
                            <span className="font-medium">{sheet.name}</span>
                            <span className="text-xs text-gray-400 ml-1">
                                ({sheet.rows ?? 0} linhas)
                            </span>
                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-400 ml-2">
                                <User size={12} className="text-gray-500" />
                                {sheet.user_name ?? "Desconhecido"}
                            </div>
                            <div className="flex flex-wrap items-center gap-1 text-xs text-gray-400 ml-2">
                                <Clock size={12} className="text-gray-500" />
                                {sheet.created_at
                                    ? new Date(sheet.created_at).toLocaleString(
                                          "pt-BR",
                                          {
                                              day: "2-digit",
                                              month: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                          }
                                      )
                                    : "—"}
                            </div>
                        </div>

                        <span
                            className={`self-start sm:self-center px-3 py-1 text-xs font-medium rounded-lg
                                ${
                                    sheet.status === 1
                                        ? "bg-yellow-600/30 text-yellow-300"
                                        : sheet.status === 2
                                        ? "bg-purple-600/30 text-purple-300"
                                        : "bg-gray-600/30 text-gray-300"
                                }`}
                        >
                            {sheet.status === 1
                                ? "PLANILHA ENVIADA"
                                : sheet.status === 2
                                ? "DOWNLOAD EFETUADO"
                                : "FINALIZADA"}
                        </span>
                    </div>
                ))}
            </div>

            <Modal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                title="Confirmar"
            >
                <div className="text-center">
                    <p className="mb-6">
                        Tem certeza que deseja <strong>prosseguir</strong>?
                    </p>

                    <div className="flex justify-center gap-4 flex-wrap">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-white transition cursor-pointer"
                            disabled={isLoading}
                        >
                            Cancelar
                        </button>
                        <button
                            onClick={handleConfirmStatusChange}
                            disabled={isLoading}
                            className={`px-4 py-2 rounded-lg text-white transition cursor-pointer ${
                                isLoading
                                    ? "bg-blue-800 cursor-not-allowed"
                                    : "bg-blue-600 hover:bg-blue-700"
                            }`}
                        >
                            {isLoading ? "Confirmando..." : "Confirmar"}
                        </button>
                    </div>
                </div>
            </Modal>
        </Card>
    );
}
