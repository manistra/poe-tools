import React, { Fragment, useRef, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { Listbox, Transition } from "@headlessui/react";
import { ChevronUpDownIcon, CheckIcon } from "@heroicons/react/20/solid";
import { clsx } from "clsx";

export interface DropdownOption {
  id: string | number;
  label: string;
  value: string | number | boolean | object;
  img?: string;
  disabled?: boolean;
}

export interface DropdownProps {
  options: DropdownOption[];
  value?: DropdownOption | null;
  onChange: (option: DropdownOption) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  buttonClassName?: string;
  optionClassName?: string;
  imgClassName?: string;
  showCheckIcon?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select an option",
  disabled = false,
  className = "",
  buttonClassName = "",
  optionClassName = "",
  imgClassName = "",
  showCheckIcon = true,
}) => {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [dropdownPosition, setDropdownPosition] = useState({
    top: 0,
    left: 0,
    width: 0,
  });
  const [isOpen, setIsOpen] = useState(false);

  const updatePosition = () => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY,
        left: rect.left + window.scrollX,
        width: rect.width,
      });
    }
  };

  useEffect(() => {
    if (isOpen) {
      updatePosition();
      const handleScroll = () => updatePosition();
      const handleResize = () => updatePosition();

      window.addEventListener("scroll", handleScroll, true);
      window.addEventListener("resize", handleResize);

      return () => {
        window.removeEventListener("scroll", handleScroll, true);
        window.removeEventListener("resize", handleResize);
      };
    }
    // Add explicit return for when isOpen is false
    return undefined;
  }, [isOpen]);

  return (
    <div className={clsx("relative", className)}>
      <Listbox value={value} onChange={onChange} disabled={disabled}>
        {({ open }) => {
          // Update isOpen state when Headless UI's open state changes
          if (open !== isOpen) {
            setIsOpen(open);
          }

          return (
            <div className="relative">
              <Listbox.Button
                ref={buttonRef}
                className={clsx(
                  "relative w-full cursor-default rounded bg-gray-900 border border-gray-700 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-gray-600 focus-visible:ring-2 focus-visible:ring-gray-600 focus-visible:ring-opacity-75 sm:text-sm text-gray-300",
                  disabled && "opacity-50 cursor-not-allowed",
                  buttonClassName
                )}
              >
                <span className="block truncate">
                  {value ? (
                    <div className="flex items-center gap-2">
                      {value.img && (
                        <img
                          src={value.img}
                          alt={value.label}
                          className={clsx(
                            "w-5 h-5 flex-shrink-0",
                            imgClassName
                          )}
                        />
                      )}
                      <span>{value.label}</span>
                    </div>
                  ) : (
                    <span className="text-gray-400">{placeholder}</span>
                  )}
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <ChevronUpDownIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              {open &&
                createPortal(
                  <Transition
                    as={Fragment}
                    show={open}
                    leave="transition ease-in duration-100"
                    leaveFrom="opacity-100"
                    leaveTo="opacity-0"
                  >
                    <Listbox.Options
                      static
                      className="absolute z-50 max-h-60 w-full overflow-auto rounded bg-gray-950 border border-gray-900 py-1 text-base shadow-lg ring-1 ring-gray-700 ring-opacity-50 focus:outline-none sm:text-sm"
                      style={{
                        top: dropdownPosition.top,
                        left: dropdownPosition.left,
                        width: dropdownPosition.width,
                      }}
                    >
                      {options.map((option) => (
                        <Listbox.Option
                          key={option.id}
                          value={option}
                          disabled={option.disabled}
                          className={({ active, disabled }) =>
                            clsx(
                              "relative cursor-default select-none py-2 px-2",
                              active && !disabled
                                ? "bg-gray-700 text-gray-200"
                                : "text-gray-300",
                              disabled && "opacity-50 cursor-not-allowed",
                              optionClassName
                            )
                          }
                        >
                          {({ selected }) => (
                            <>
                              <div className="flex items-center gap-2">
                                {option.img && (
                                  <img
                                    src={option.img}
                                    alt={option.label}
                                    className={clsx(
                                      "w-6 h-6 flex-shrink-0",
                                      imgClassName
                                    )}
                                  />
                                )}
                                <span
                                  className={clsx(
                                    "block truncate",
                                    selected ? "font-medium" : "font-normal"
                                  )}
                                >
                                  {option.label}
                                </span>
                              </div>
                              {selected && showCheckIcon && (
                                <span className="absolute inset-y-0 right-3 flex items-center pl-3 text-orange-400">
                                  <CheckIcon
                                    className="h-5 w-5"
                                    aria-hidden="true"
                                  />
                                </span>
                              )}
                            </>
                          )}
                        </Listbox.Option>
                      ))}
                    </Listbox.Options>
                  </Transition>,
                  document.body
                )}
            </div>
          );
        }}
      </Listbox>
    </div>
  );
};

export default Dropdown;
