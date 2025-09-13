import React, { useState } from "react";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

interface CollapsibleItemProps {
  // we could add icons in the future
  className?: string;
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
  specialTitle?: string;
  wrapperClassName?: string;
}

const CollapsibleItem: React.FC<CollapsibleItemProps> = ({
  defaultOpen = false,
  title,
  children,
  className,
  specialTitle,
  wrapperClassName,
}) => {
  const [isCollapsed, setIsCollapsed] = useState(!defaultOpen);
  const handleCollapsible = () => {
    setIsCollapsed(!isCollapsed);
  };
  return (
    <div className={`border-b border-gray-600 ${wrapperClassName}`}>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between"
        onClick={handleCollapsible}
      >
        <span>{title}</span>

        {!!specialTitle && isCollapsed && (
          <span className="text-gray-400 text-xs">{specialTitle}</span>
        )}

        <ChevronDownIcon
          className={`transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
          width="12"
          height="8"
        />
      </button>
      {!isCollapsed && (
        <div
          className={`overflow-x-auto border-t border-gray-600 py-2 ${className}`}
        >
          {children}
        </div>
      )}
    </div>
  );
};

export default CollapsibleItem;
