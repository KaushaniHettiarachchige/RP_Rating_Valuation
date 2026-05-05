const Button = ({ children, onClick, disabled, loading, variant = "primary", type = "button", className = "" }) => {
  const variants = {
    primary: "bg-gradient-to-r from-green-700 to-green-900 hover:from-green-800 hover:to-green-950 text-white",
    danger: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
    secondary: "bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 text-white",
    council: "bg-gradient-to-r from-lime-600 to-green-700 hover:from-lime-700 hover:to-green-800 text-white"
  };

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`
        px-6 py-3 rounded-lg font-semibold text-sm
        transition-all duration-200 
        shadow-md hover:shadow-lg 
        transform hover:-translate-y-0.5 hover:scale-105 active:translate-y-0
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        ${variants[variant]}
        ${className}
      `}
    >
      {loading ? (
        <span className="flex items-center justify-center gap-2">
          <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span>⏳ Securing on Blockchain (~30s)...</span>
        </span>
      ) : children}
    </button>
  );
};

export default Button;
