import clsx from "clsx";
import React from "react";

interface CheckboxProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  className?: string;
  disabled?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  checked,
  onChange,
  label,
  className = "",
  disabled = false,
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex flex-col ">
      <label className="mb-1 text-[12px] font-medium text-gray-500">
        {label}
      </label>
      <input
        disabled={disabled}
        type="checkbox"
        className={clsx("w-6 h-6 cursor-pointer", className)}
        checked={checked}
        onChange={handleChange}
      />
    </div>
  );
};

export default Checkbox;
