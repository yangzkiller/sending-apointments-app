import { useState, useRef } from "react";
import { FileUp, Loader2 } from "lucide-react";
import Card from "@/Components/Generals/Card";
import Button from "@/Components/Generals/Button";
import { toast } from "react-toastify";

export default function UploadSpreadsheetCard({ onUpload, loading, lastImport }) {
    const [file, setFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        const selectedFile = e.target.files[0];
        setFile(selectedFile);
    };

    const handleClick = () => {
        if (!file) {
            toast.error("Por favor, selecione um arquivo .xlsx antes de enviar.");
        }
        onUpload(file);
        setFile(null);

        if (fileInputRef.current) {
            fileInputRef.current.value = "";
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
                    ref={fileInputRef}
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
                        onClick={handleClick}
                        disabled={loading || !file}
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

                <div className="mt-5 text-center text-gray-500">
                    {lastImport ? (
                        <>
                            <h1>
                                Último envio realizado:{" "}
                                {lastImport.date} às {lastImport.time}
                            </h1>
                            <h1>
                                Responsável pelo envio:{" "}
                                <strong>{lastImport.responsible}</strong>
                            </h1>
                        </>
                    ) : (
                        <h1>Nenhum envio registrado ainda.</h1>
                    )}
                </div>
            </div>
        </Card>
    );
}
