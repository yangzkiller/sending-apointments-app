export default function Button({ 
    children, 
    onClick, 
    type = 'button', 
    className = '',
    disabled = false
}) {
    return (
        <button
            type={type}
            onClick={onClick}
            className={`w-full bg-[#1383be] text-white px-4 py-2 rounded-lg font-medium transition transform hover:bg-[#0e6da0] hover:scale-103 active:scale-95 cursor-pointer ${className}`}
            disabled={disabled}
        >
            {children}
        </button>
    );
}
