import { useState, useEffect } from "react";
import InstitutionsFilter from "@/Pages/Home/Partials/InstitutionsFilter";
import InstitutionsList from "@/Pages/Home/Partials/InstitutionsList";
import api from "@/axios";
import { route } from "ziggy-js";
import { toast } from "react-toastify";

export default function ReceiverHome() {
    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedSheets, setSelectedSheets] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState("");

    useEffect(() => {
        fetchInstitutions();
    }, []);

    const fetchInstitutions = async () => {
        try {
            const response = await api.get(route("institution.all"));
            setInstitutions(response.data.data);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleSelectSheet = (sheetId, checked) => {
        setSelectedSheets(prev =>
            checked ? [...prev, sheetId] : prev.filter(id => id !== sheetId)
        );
    };

    const handleSelectInstitution = (institution, checked) => {
        const sheetIds = institution.spreadsheets.map(s => s.id);

        setSelectedSheets(prev => {
            if (checked) {
                const news = sheetIds.filter(id => !prev.includes(id));
                return [...prev, ...news];
            } else {
                return prev.filter(id => !sheetIds.includes(id));
            }
        });
    };

    const handleSelectAll = (checked) => {
        if (checked) {
            const allSheetIds = institutions
                .filter((inst) => inst.spreadsheets.length > 0)
                .flatMap((inst) => inst.spreadsheets.map((s) => s.id));

            setSelectedSheets(allSheetIds);
        } else {
            setSelectedSheets([]);
        }
    };

    const handleDownload = async () => {
        if (selectedSheets.length === 0) {
            toast.warning("Selecione pelo menos uma planilha!");
            return;
        }

        try {
            const response = await api.post(
                route("spreadsheet.downloadCsv"),
                { sheets: selectedSheets },
                { responseType: "blob" }
            );

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "AGENDAMENTOS.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);

            toast.success("Download concluído!");
            await fetchInstitutions();
            setSelectedSheets([]);
        } catch (error) {
            console.error(error);
            toast.error("Erro ao gerar o CSV.");
        }
    };

    const handleConfirm = async (institutionId, status) => {
        try {
            const response = await api.patch(
                route("institution.updateStatus", institutionId),
                { status }
            );

            if (response.data?.message) {
                toast.success(response.data.message);
            }

            await fetchInstitutions();
        } catch (error) {
            console.error(error);
            toast.error(
                error.response?.data?.message ||
                    "Erro ao atualizar status da instituição."
            );
        }
    };

    const filteredInstitutions = institutions.filter((inst) => {
        const matchesName = inst.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter ? String(inst.status) === statusFilter : true;
        return matchesName && matchesStatus;
    });

    return (
        <div>
            <InstitutionsFilter
                onDownload={handleDownload}
                onSelectAll={handleSelectAll}
                allSelected={
                    selectedSheets.length > 0 &&
                    selectedSheets.length ===
                        institutions.flatMap((inst) => inst.spreadsheets).length
                }
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                statusFilter={statusFilter}
                setStatusFilter={setStatusFilter}
            />

            <InstitutionsList
                institutions={filteredInstitutions}
                loading={loading}
                onSelectSheet={handleSelectSheet}
                onSelectInstitution={handleSelectInstitution}
                selectedSheets={selectedSheets}
                onConfirm={handleConfirm}
            />
        </div>
    );
}
