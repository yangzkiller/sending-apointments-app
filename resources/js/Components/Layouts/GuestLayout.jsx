import DarkVeil from '@/Components/ReactBits/Backgrounds/DarkVeil';

export default function GuestLayout({ children }) {
  return <LayoutContent>{children}</LayoutContent>;
}

function LayoutContent({ children }) {
    return (
        <div className="relative min-h-screen flex flex-col items-center justify-center">
            <div className="absolute inset-0">
                <DarkVeil />
            </div>

            <main className="relative z-10 flex items-center justify-center w-full flex-1 px-4">
                {children}
            </main>

            <footer className='relative z-10 mb-4 text-gray-400 text-sm text-center'>
                © {new Date().getFullYear()} Grupo ASAS. Todos os direitos reservados.
            </footer>
        </div>
    );
}
