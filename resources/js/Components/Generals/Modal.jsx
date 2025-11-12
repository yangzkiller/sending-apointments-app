import { X } from "lucide-react";
import { useEffect } from "react";
import FadeContent from "@/Components/ReactBits/Animations/FadeContent";

export default function Modal({
  isOpen,
  onClose,
  title,
  children,
  showClose = true,
  className = "",
  maxHeight = "max-h-[85vh]",
}) {
    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = 'unset';
        }
        return () => {
            document.body.style.overflow = 'unset';
        };
    }, [isOpen]);

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-[100000] flex items-center justify-center p-2 bg-black-500 backdrop-blur-sm" onClick={onClose}>
            <div
                className={`relative z-[100001] w-full mx-4 ${maxHeight} overflow-y-auto ${className}`}
                onClick={(e) => e.stopPropagation()}
            >
                <FadeContent blur duration={400} easing="ease-out" initialOpacity={0}>
                    <div className="relative bg-gradient-to-b from-black via-gray-900 to-gray-800 border border-[#1382be9b] rounded-xl shadow-lg text-white p-6">

                        {(title || showClose) && (
                        <div className="flex justify-between items-center mb-6">
                            {title && <h2 className="text-xl font-semibold">{title}</h2>}
                            {showClose && (
                            <button
                                onClick={onClose}
                                className="text-gray-400 hover:text-white transition-colors cursor-pointer"
                            >
                                <X size={20} />
                            </button>
                            )}
                        </div>
                        )}

                        {children}
                    </div>
                </FadeContent>
            </div>
        </div>
    );
}
