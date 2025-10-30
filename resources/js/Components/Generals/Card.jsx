export default function Card({ children, className = "" }) {
    return (
        <div className={`w-full p-6 rounded-xl shadow-lg${className}`}>
            {children}
        </div>
    );
}
