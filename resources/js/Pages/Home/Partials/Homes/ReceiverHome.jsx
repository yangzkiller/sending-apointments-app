import { useState, useEffect } from "react";
import { usePage } from "@inertiajs/react";
import InstitutionsFilter from "@/Pages/Home/Partials/InstitutionsFilter";
import InstitutionsList from "@/Pages/Home/Partials/InstitutionsList";
import api from "@/axios";
import { route } from "ziggy-js";
import { toast } from "react-toastify";

export default function ReceiverHome() {
    const { auth } = usePage().props;

    const [institutions, setInstitutions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectAll, setSelectAll] = useState(false);
    const [selectedInstitutions, setSelectedInstitutions] = useState([]);
    const [selectedSheets, setSelectedSheets] = useState({});

    useEffect(() => {
        const fetchInstitutions = async () => {
            try {
                const response = await api.get(route("institutions.all"));
                const fakeInstitutions = response.data.data.map((inst) => ({
                    ...inst,
                    spreadsheets: [
                        { name: "Planilha Janeiro.xlsx", status: "Concluída" },
                        { name: "Planilha Fevereiro.xlsx", status: "Pendente" },
                        { name: "Planilha Março.xlsx", status: "Em análise" },
                    ],
                }));
                setInstitutions(fakeInstitutions);
            } catch (error) {
                console.error(error);
                toast.error("Erro ao carregar instituições.");
            } finally {
                setLoading(false);
            }
        };
        fetchInstitutions();
    }, []);

    const handleSelectAll = (checked, institutionsList) => {
        setSelectAll(checked);
        if (checked) {
            setSelectedInstitutions(institutionsList.map((i) => i.id));
            const allSheets = {};
            institutionsList.forEach((inst) => {
                allSheets[inst.id] = inst.spreadsheets.map((s) => s.name);
            });
            setSelectedSheets(allSheets);
        } else {
            setSelectedInstitutions([]);
            setSelectedSheets({});
        }
    };

    const handleInstitutionToggle = (instId, checked, spreadsheets, totalInst) => {
        let updatedInstitutions = [];
        let updatedSheets = { ...selectedSheets };

        if (checked) {
            updatedInstitutions = [...selectedInstitutions, instId];
            updatedSheets[instId] = spreadsheets.map((s) => s.name);
        } else {
            updatedInstitutions = selectedInstitutions.filter((id) => id !== instId);
            delete updatedSheets[instId];
        }

        setSelectedInstitutions(updatedInstitutions);
        setSelectedSheets(updatedSheets);
        setSelectAll(updatedInstitutions.length === totalInst);
    };

    const handleSheetToggle = (instId, sheetName, checked, totalSheets, totalInst) => {
        setSelectedSheets((prev) => {
            const current = prev[instId] || [];
            const updated = checked
                ? [...current, sheetName]
                : current.filter((s) => s !== sheetName);

            const newSheets = { ...prev, [instId]: updated };

            if (updated.length === totalSheets) {
                if (!selectedInstitutions.includes(instId)) {
                    setSelectedInstitutions((prevInst) => [...prevInst, instId]);
                }
            } else {
                setSelectedInstitutions((prevInst) =>
                    prevInst.filter((id) => id !== instId)
                );
            }

            setSelectAll(
                Object.keys(newSheets).length === totalInst &&
                    Object.values(newSheets).every(
                        (arr) => arr.length === totalSheets
                    )
            );

            return newSheets;
        });
    };

    const handleDownloadSelected = () => toast.info("Baixando planilhas selecionadas...");
    const handleDownloadByInstitution = () => toast.info("Baixando planilhas por unidade...");
    const handleDownloadAll = () => toast.info("Baixando todas as planilhas...");

    return (
        <div>
            <InstitutionsFilter
                selectAll={selectAll}
                institutions={institutions}
                onSelectAll={handleSelectAll}
                onDownloadAll={handleDownloadAll}
            />

            <InstitutionsList
                institutions={institutions}
                loading={loading}
                selectedInstitutions={selectedInstitutions}
                selectedSheets={selectedSheets}
                onInstitutionToggle={handleInstitutionToggle}
                onSheetToggle={handleSheetToggle}
            />
        </div>
    );
}
