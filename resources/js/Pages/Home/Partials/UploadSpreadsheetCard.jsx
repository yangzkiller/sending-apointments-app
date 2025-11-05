import Card from "@/Components/Generals/Card";
import Button from "@/Components/Generals/Button";
import { FileUp, Loader2 } from "lucide-react";
import { useState } from "react";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import api from "@/axios";

export default function UploadSpreadsheetCard({ onUpload }) {
    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleUpload = async () => {
        if (!file) {
            toast.warning("Selecione um arquivo antes de enviar.");
            return;
        }

        try {
            setLoading(true);

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];

            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            const response = await api.post(route('spreadsheet.import'), {
                rows: json,
                file_name: file.name,
            });

            const { valid_rows, total_received } = response.data;

            toast.success(
                `Importação concluída! ${valid_rows} de ${total_received} linhas foram inseridas com sucesso.`
            );

            setFile(null);
            onUpload?.(file);
        } catch (err) {
            if (err.response && err.response.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Erro ao processar a planilha.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <Card className="bg-gray-800 text-white border border-[#1382be9b] hover:shadow-xl transition-all">
            <div className="mb-4">
                <div className="flex items-center gap-2 mb-2">
                    <FileUp size={22} className="text-[#13a3f1]" />
                    <h2 className="text-xl font-semibold">Enviar planilha</h2>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-4">
                    Faça o upload da planilha preenchida com os dados dos colaboradores.
                </p>

                <input
                    type="file"
                    accept=".xlsx"
                    onChange={handleFileChange}
                    className="w-full text-sm text-gray-300 border border-gray-600 rounded-lg cursor-pointer bg-gray-900
                               file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0
                               file:text-sm file:font-semibold file:bg-[#1383be] file:text-white
                               hover:file:bg-[#0f6fa3]"
                />

                {file && (
                    <p className="mt-2 text-xs text-gray-400 text-center">
                        📄 <strong>{file.name}</strong> selecionado
                    </p>
                )}

                <div className="flex justify-center mt-6">
                    <Button
                        onClick={handleUpload}
                        disabled={loading}
                        className="w-auto flex items-center justify-center gap-2 px-8"
                    >
                        {loading ? (
                            <>
                                <Loader2 className="w-5 h-5 animate-spin" />
                                Enviando...
                            </>
                        ) : (
                            <>
                                <FileUp size={18} />
                                Enviar planilha
                            </>
                        )}
                    </Button>
                </div>
            </div>
        </Card>
    );
}
