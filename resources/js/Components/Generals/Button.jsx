export default function Button({ 
    children, 
    onClick, 
    type = 'button', 
    className = '',
    disabled = false,
    isLoading = false,
    variant = 'primary' // 'primary' ou 'secondary'
}) {
    const baseStyles = `px-4 py-2 rounded-lg font-medium transition transform active:scale-95 cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`;
    
    const variants = {
        primary: 'bg-[#1383be] text-white hover:bg-[#0e6da0] hover:scale-103 shadow-lg shadow-cyan-500/20',
        secondary: 'bg-slate-700 text-white hover:bg-slate-600'
    };

    return (
        <button
            type={type}
            onClick={onClick}
            className={`${baseStyles} ${variants[variant]} ${className}`}
            disabled={disabled || isLoading}
        >
            {children}
        </button>
    );
}
