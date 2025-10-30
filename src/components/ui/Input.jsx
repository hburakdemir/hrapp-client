import React from "react";

const Input = ({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
}) => {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && <label className="text-sm text-gray-700">{label}</label>}
      <input
        name={name} 
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-lg p-2 text-gray-800 outline-none focus:ring-none  transition bg-white"
      />
    </div>
  );
};

export default Input;
