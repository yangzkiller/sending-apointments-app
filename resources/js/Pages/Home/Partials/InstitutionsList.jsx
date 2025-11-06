import InstitutionCard from "@/Pages/Home/Partials/Cards/InstitutionCard";

export default function InstitutionsList({
    institutions,
    loading,
    selectedInstitutions,
    selectedSheets,
    onInstitutionToggle,
    onSheetToggle,
}) {
    if (loading)
        return (
            <div className="flex justify-center items-center h-64">
                <p className="text-gray-500 animate-pulse">
                    Carregando instituições...
                </p>
            </div>
        );

    return (
        <div className="px-6 w-full max-w-5xl mx-auto">
            <div className="h-[70vh] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
                {institutions.length === 0 ? (
                    <p className="text-gray-400 text-center mt-10">
                        Nenhuma instituição cadastrada ainda.
                    </p>
                ) : (
                    <div className="flex flex-col gap-4">
                        {institutions.map((inst) => (
                            <InstitutionCard
                                key={inst.id}
                                institution={inst}
                                checked={selectedInstitutions.includes(inst.id)}
                                selectedSheets={selectedSheets[inst.id] || []}
                                onInstitutionToggle={(id, checked) =>
                                    onInstitutionToggle(
                                        id,
                                        checked,
                                        inst.spreadsheets,
                                        institutions.length
                                    )
                                }
                                onSheetToggle={(id, name, checked) =>
                                    onSheetToggle(
                                        id,
                                        name,
                                        checked,
                                        inst.spreadsheets.length,
                                        institutions.length
                                    )
                                }
                            />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
