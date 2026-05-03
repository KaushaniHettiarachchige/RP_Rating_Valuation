const SelectField = ({ label, required, helper, children, ...props }) => (
  <div>
    {label && (
      <label className="block text-sm font-semibold text-green-700 mb-2">
        {label} {required && <span className="text-green-600">*</span>}
      </label>
    )}
    <select
      {...props}
      className={`
        w-full px-4 py-3 text-base 
        border-2 border-green-300 rounded-lg
        bg-white text-green-900
        focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-600 focus:border-green-600
        transition-all duration-200
        ${props.className || ''}
      `}
    >
      {children}
    </select>
    {helper && <p className="text-xs text-green-500 mt-1.5">{helper}</p>}
  </div>
);

export default SelectField;
