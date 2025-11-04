import { FileSpreadsheet } from "lucide-react";
import Card from "@/Components/Generals/Card";
import Button from "@/Components/Generals/Button";

export default function DownloadTemplateCard({ onDownload }) {
    return (
        <Card className="bg-gray-800 text-white border border-gray-700 hover:shadow-xl transition-all">
            <div className="mb-2">
                <div className="flex items-center gap-2 mb-2">
                    <FileSpreadsheet size={22} className="text-[#13a3f1]" />
                    <h2 className="text-xl font-semibold">Baixar modelo da planilha</h2>
                </div>

                <p className="text-gray-300 text-sm leading-relaxed mb-2">
                    Baixe o modelo de planilha <strong>(.xlsx)</strong> e siga as instruções abaixo:
                </p>

                <ul className="list-disc list-inside text-gray-400 text-sm space-y-1 mb-6">
                    <li>
                        Não altere o <strong>cabeçalho (header)</strong> da planilha.
                    </li>
                    <li>
                        Não mude o <strong>tipo de arquivo</strong> — mantenha a extensão{" "}
                        <strong>.xlsx</strong>.
                    </li>
                    <li>
                        Preencha apenas as <strong>linhas abaixo do cabeçalho</strong> com as informações.
                    </li>
                    <li>
                        Mantenha o <strong>formato original</strong> para garantir uma importação correta.
                    </li>
                </ul>

                <Button
                    onClick={onDownload}
                    className="flex items-center justify-center gap-2 w-auto px-5 py-2 shadow-md hover:shadow-lg"
                >
                    <FileSpreadsheet size={18} />
                    Baixar modelo (.xlsx)
                </Button>
            </div>
        </Card>
    );
}
