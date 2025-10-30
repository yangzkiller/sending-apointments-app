import LogoImg from '@/Assets/Logo/asas_color.png';

export default function Logo({ className = "" }) {
    return (
        <div className={`flex flex-col items-center  ${className}`}>
            <img
                src={LogoImg}
                alt="Logo"
                className="h-auto w-full"
            />
        </div>
    );
}
