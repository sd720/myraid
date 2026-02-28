export const Input = ({ label, type = 'text', value, onChange, placeholder, required = false, ...props }) => {
    return (
        <div className="mb-4">
            {label && <label className="block text-gray-700 text-sm font-bold mb-2">{label}</label>}
            <input
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
                required={required}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:ring-2 focus:ring-indigo-500 transition duration-200"
                {...props}
            />
        </div>
    );
};

export const Button = ({ children, type = 'button', variant = 'primary', className = '', ...props }) => {
    const variants = {
        primary: 'bg-indigo-600 hover:bg-indigo-700 text-white',
        secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800',
        danger: 'bg-red-500 hover:bg-red-600 text-white',
    };

    return (
        <button
            type={type}
            className={`font-semibold py-2 px-4 rounded focus:outline-none focus:ring-2 focus:ring-offset-2 transition duration-200 ${variants[variant]} ${className}`}
            {...props}
        >
            {children}
        </button>
    );
};
