import { usePage, router } from '@inertiajs/react';
import api from '@/axios';
import { route } from 'ziggy-js';
import { useState } from 'react';

export default function Home() {
    const { auth } = usePage().props;
    const [loading, setLoading] = useState(false);

    if (!auth.user) {
        return <p>Loading user...</p>;
    }

    const handleLogout = async () => {
        setLoading(true);
        try {
            await api.post(route('authentication.logout'));

            router.visit(route('authentication.index'));
        } catch (err) {
            console.error('Logout failed:', err);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-4">Welcome, {auth.user.name}!</h1>

            {auth.user.role === 'admin' && <p>Admin area</p>}
            {auth.user.role === 'sender' && <p>Sender area</p>}
            {auth.user.role === 'receiver' && <p>Receiver area</p>}

            <button
                onClick={handleLogout}
                disabled={loading}
                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 mt-4"
            >
                {loading ? 'Logging out...' : 'Logout'}
            </button>
        </div>
    );
}
