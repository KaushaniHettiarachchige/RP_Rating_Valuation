const DataCard = ({ label, value, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white border-green-200",
    primary: "bg-gradient-to-br from-green-50 to-emerald-50 border-green-200",
    success: "bg-gradient-to-br from-emerald-50 to-green-50 border-emerald-200",
    warning: "bg-gradient-to-br from-lime-50 to-lime-50 border-lime-300"
  };

  return (
    <div className={`p-5 rounded-lg border-2 shadow-sm transition-all hover:shadow-md ${variants[variant]} ${className}`}>
      <p className="text-xs font-semibold text-green-600 mb-2 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-green-900">{value}</p>
    </div>
  );
};

export default DataCard;
