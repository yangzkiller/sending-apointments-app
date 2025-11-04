import { usePage } from "@inertiajs/react";
import DownloadTemplateCard from "@/Pages/Home/Partials/DownloadTemplateCard";
import UploadSpreadsheetCard from "@/Pages/Home/Partials/UploadSpreadsheetCard";

export default function SenderHome() {
    const { auth } = usePage().props;
    const institution = auth?.user?.institution || "default";

    const handleDownload = () => {
        const date = new Date().toISOString().split("T")[0];
        const safeInstitution = institution.replace(/\s+/g, "_");
        const fileName = `default-${safeInstitution}-${date}.xlsx`;
        
        const link = document.createElement('a');
        link.href = '/storage/templates/default.xlsx';
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleUpload = (file) => {
        console.log("Arquivo recebido para upload:", file);
    };

    return (
        <div className="mb-5">
            <h1 className="text-2xl font-semibold text-center mb-8">
                {institution}
            </h1>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <DownloadTemplateCard onDownload={handleDownload} />
                <UploadSpreadsheetCard onUpload={handleUpload} />
            </div>
        </div>
    );
}
