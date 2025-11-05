import { useEffect, useState } from "react";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import * as XLSX from "xlsx";
import { toast } from "react-toastify";
import api from "@/axios";
import DownloadTemplateCard from "@/Pages/Home/Partials/DownloadTemplateCard";
import UploadSpreadsheetCard from "@/Pages/Home/Partials/UploadSpreadsheetCard";

export default function SenderHome() {
    const { auth } = usePage().props;
    const institution = auth?.user?.institution || "default";

    const [loading, setLoading] = useState(false);
    const [lastImport, setLastImport] = useState(null);

    useEffect(() => {
        fetchLastImport();
    }, []);

    const fetchLastImport = async () => {
        try {
            const { data } = await api.get(route("spreadsheet.last"));
            if (data.data) setLastImport(data.data);
        } catch {
            console.warn("Erro ao buscar último envio.");
        }
    };

    const handleDownload = () => {
        const date = new Date().toISOString().split("T")[0];
        const safeInstitution = institution.replace(/\s+/g, "_");
        const fileName = `default-${safeInstitution}-${date}.xlsx`;

        const link = document.createElement("a");
        link.href = "/storage/templates/default.xlsx";
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = async (file) => {
        try {
            setLoading(true);

            const data = await file.arrayBuffer();
            const workbook = XLSX.read(data, { type: "array" });
            const sheetName = workbook.SheetNames[0];
            const sheet = workbook.Sheets[sheetName];
            const json = XLSX.utils.sheet_to_json(sheet, { defval: "" });

            const response = await api.post(route("spreadsheet.import"), {
                rows: json,
                file_name: file.name,
            });

            const { valid_rows, total_received } = response.data;

            toast.success(
                `Importação concluída! ${valid_rows} de ${total_received} linhas foram inseridas com sucesso.`
            );

            await fetchLastImport();
        } catch (err) {
            if (err.response?.data?.message) {
                toast.error(err.response.data.message);
            } else {
                toast.error("Erro ao processar a planilha.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="mb-5">
            <h1 className="text-2xl font-semibold text-center mb-10">
                {institution}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DownloadTemplateCard onDownload={handleDownload} />
                <UploadSpreadsheetCard
                    onUpload={handleUpload}
                    loading={loading}
                    lastImport={lastImport}
                />
            </div>
        </div>
    );
}
