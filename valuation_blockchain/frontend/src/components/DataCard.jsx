const DataCard = ({ label, value, variant = "default", className = "" }) => {
  const variants = {
    default: "bg-white border-slate-200",
    primary: "bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200",
    success: "bg-gradient-to-br from-emerald-50 to-teal-50 border-emerald-200",
    warning: "bg-gradient-to-br from-amber-50 to-yellow-50 border-amber-300"
  };

  return (
    <div className={`p-5 rounded-lg border-2 shadow-sm transition-all hover:shadow-md ${variants[variant]} ${className}`}>
      <p className="text-xs font-semibold text-slate-600 mb-2 uppercase tracking-wide">{label}</p>
      <p className="text-2xl font-bold text-slate-900">{value}</p>
    </div>
  );
};

export default DataCard;
