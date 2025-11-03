import { usePage } from '@inertiajs/react';

export default function Home() {
    const { auth } = usePage().props;

    if (!auth.user) {
        return <p>Loading user...</p>;
    }

    return (
        <div className="p-6">
            <h1>Welcome, {auth.user.name}!</h1>

            {auth.user.role === 'admin' && <p>Admin area</p>}
            {auth.user.role === 'sender' && <p>Sender area</p>}
            {auth.user.role === 'receiver' && <p>Receiver area</p>}
        </div>
    );
}
