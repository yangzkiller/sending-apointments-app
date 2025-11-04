import DownloadTemplateCard from "@/Pages/Home/Partials/DownloadTemplateCard";
import UploadSpreadsheetCard from "@/Pages/Home/Partials/UploadSpreadsheetCard";

export default function SenderHome() {
    const handleDownload = () => {
        console.log("Baixar modelo de planilha (.xlsx)");
    };

    const handleUpload = (file) => {
        console.log("Arquivo recebido para upload:", file);
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-5">
            <DownloadTemplateCard onDownload={handleDownload} />
            <UploadSpreadsheetCard onUpload={handleUpload} />
        </div>
    );
}
