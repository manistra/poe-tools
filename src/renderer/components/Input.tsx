import clsx from "clsx";
import React from "react";

interface InputProps {
  id?: string;
  name?: string;
  value: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  type?: "text" | "password" | "email" | "number";
  className?: string;
  disabled?: boolean;
  required?: boolean;
  label?: string;
  error?: string;
  min?: number;
}

const Input: React.FC<InputProps> = ({
  id,
  name,
  value,
  onChange,
  placeholder = "",
  type = "text",
  className = "",
  disabled = false,
  required = false,
  label,
  error,
  min,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col w-full">
      {label && (
        <label
          htmlFor={id}
          className="mb-1 text-[12px] font-medium text-gray-500"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        id={id}
        name={name}
        min={min}
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        disabled={disabled}
        required={required}
        className={clsx(
          "px-3 py-[6px]",
          "backdrop-blur-xl",
          "bg-gray-900",
          "outline-none",
          "border border-gray-800",
          "rounded-sm",
          "placeholder-gray-500",
          "focus:border-gray-700",
          "disabled:opacity-50",
          "disabled:cursor-not-allowed",
          error && "border-red-500 focus:ring-red-500",
          className
        )}
      />
      {error && <p className="mt-1 text-sm text-red-500">{error}</p>}
    </div>
  );
};

export default Input;
