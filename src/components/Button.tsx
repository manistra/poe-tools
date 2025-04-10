import React from "react";
import clsx from "clsx";

interface ButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  disabled?: boolean;
  className?: string;
  variant?: "default" | "danger" | "success" | "outline";
  size?: "small" | "medium" | "large";
  fullWidth?: boolean;
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  type = "button",
  disabled = false,
  className = "",
  variant = "default",
  size = "medium",
  fullWidth = false,
}) => {
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={clsx(
        // Base styles
        "rounded-sm font-medium transition-colors focus:outline-none text-nowrap",

        // Size variants
        {
          "px-2 py-1 text-xs": size === "small",
          "px-4 py-2 text-sm": size === "medium",
          "px-6 py-3 text-base": size === "large",
        },

        // Color variants
        {
          "bg-gradient-to-r from-orange-950 to-orange-800 border border-gray-700 hover:to-orange-600 transition-colors duration-200 text-white":
            variant === "default",
          "border-red-900 border bg-red-950 hover:bg-red-800 text-white":
            variant === "danger",
          "border-green-900 border bg-green-950 hover:bg-green-700 text-white":
            variant === "success",
          "border border-gray-500 bg-transparent hover:text-gray-200 hover:border-gray-200 text-gray-500":
            variant === "outline",
        },

        // Width
        {
          "w-full": fullWidth,
        },

        // Disabled state
        {
          "opacity-50 cursor-not-allowed": disabled,
        },

        // Custom classes
        className
      )}
    >
      {children}
    </button>
  );
};

export default Button;
