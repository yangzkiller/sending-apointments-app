import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function FormField({
    label,
    icon,
    type = 'text',
    value,
    onChange,
    error,
    inputClassName = '',
    labelClassName = '',
    iconClassName = '',
}) {
    const [showPassword, setShowPassword] = useState(false);
    const isPassword = type === 'password';

    return (
        <div className="relative w-full">
            <label className={`block font-medium mb-1 ${labelClassName}`}>
                {label}
            </label>

            <div className="relative w-full">
                {icon && (
                    <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${iconClassName}`}>
                        {icon}
                    </span>
                )}

                <input
                    type={isPassword && showPassword ? 'text' : type}
                    value={value}
                    onChange={onChange}
                    className={`w-full ${
                        icon ? 'pl-10' : 'pl-3'
                    } ${isPassword ? 'pr-10' : 'pr-3'} border border-[#1382be9b] bg-gray-800 rounded px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-[#1696da] ${inputClassName}`}
                />

                {isPassword && (
                    <span
                        className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 cursor-pointer"
                        onClick={() => setShowPassword(!showPassword)}
                    >
                        {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </span>
                )}
            </div>

            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
    );
}
