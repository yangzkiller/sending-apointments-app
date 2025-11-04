import { motion, AnimatePresence } from "framer-motion";

export default function Dropdown({ open, children, className = "" }) {
    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    transition={{ duration: 0.15 }}
                    className={`absolute mt-2 rounded-lg shadow-lg overflow-hidden z-50 ${className}`}
                >
                    {children}
                </motion.div>
            )}
        </AnimatePresence>
    );
}
