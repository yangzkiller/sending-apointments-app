import api from "@/axios";
import { usePage } from "@inertiajs/react";
import { route } from "ziggy-js";
import InstitutionsList from "@/Pages/Home/Partials/InstitutionsList";

export default function ReceiverHome() {
    const { auth } = usePage().props;

    return (
        <div className="mb-5">
            <h1 className="text-2xl font-semibold text-center mb-10">
                receiver
            </h1>
            <InstitutionsList />
        </div>
    );
}


