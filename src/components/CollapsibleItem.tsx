import React, { useState } from "react";

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

        <svg
          className={`transition-transform duration-200 ${
            isCollapsed ? "rotate-180" : ""
          }`}
          width="12"
          height="8"
          viewBox="0 0 12 8"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M1.40002 7.03842L0.346191 5.98462L6.00002 0.330795L11.6538 5.98462L10.6 7.03842L6.00002 2.43842L1.40002 7.03842Z"
            fill="currentColor"
          />
        </svg>
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
