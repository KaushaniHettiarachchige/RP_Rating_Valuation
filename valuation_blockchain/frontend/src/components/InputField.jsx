const InputField = ({ label, required, helper, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-semibold text-slate-700 mb-2">
        {label} {required && <span className="text-rose-600">*</span>}
      </label>
    )}
    <input
      {...props}
      className={`
        w-full px-4 py-3 text-base 
        border-2 border-slate-300 rounded-lg
        bg-white text-slate-900
        placeholder:text-slate-400
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 focus:border-blue-600
        transition-all duration-200
        ${props.className || ''}
      `}
    />
    {helper && <p className="text-xs text-slate-500 mt-1.5">{helper}</p>}
  </div>
);

export default InputField;
