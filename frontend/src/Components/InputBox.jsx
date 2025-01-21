export function InputBox({ label, placeholder, name, value, onChange }) {
  return (
    <div>
      <div className="text-sm font-medium text-left py-2">
        {label}
      </div>
      <input
        name={name} // Add the name attribute
        value={value} // Add the value attribute for controlled input
        onChange={onChange} // Add the onChange handler
        placeholder={placeholder}
        className="w-full px-2 py-1 border rounded border-slate-200"
      />
    </div>
  );
}
