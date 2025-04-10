import React, { useState, useRef, useEffect } from "react";
import PoeLiveSearch from "./poe-accuracy-weapon-search/PoeLiveSearch";

const WeaponAccuracySeach = () => {
  const [selectedOption, setSelectedOption] = useState<
    "left" | "both" | "right"
  >("left");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <div className="flex flex-col gap-4 w-full">
      {/* Floating dropdown button */}
      <div className="fixed top-4 right-4 z-10" ref={dropdownRef}>
        <button
          className="px-2 py-1 rounded bg-blue-900 hover:bg-blue-700 text-xs"
          onClick={toggleDropdown}
        >
          View Options
        </button>

        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded shadow-lg">
            <button
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                selectedOption === "left" ? "bg-blue-900" : ""
              }`}
              onClick={() => {
                setSelectedOption("left");
                setIsDropdownOpen(false);
              }}
            >
              Accuracy Live Search Only
            </button>
            <button
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                selectedOption === "both" ? "bg-blue-900" : ""
              }`}
              onClick={() => {
                setSelectedOption("both");
                setIsDropdownOpen(false);
              }}
            >
              Both Panels
            </button>
            <button
              className={`w-full text-left px-4 py-2 hover:bg-gray-700 ${
                selectedOption === "right" ? "bg-blue-900" : ""
              }`}
              onClick={() => {
                setSelectedOption("right");
                setIsDropdownOpen(false);
              }}
            >
              Manual Search Only
            </button>
          </div>
        )}
      </div>

      <div className="flex flex-row w-full gap-4 mt-16">
        <div
          style={{
            width:
              selectedOption === "left"
                ? "100%"
                : selectedOption === "both"
                ? "50%"
                : "0%",
          }}
        >
          <PoeLiveSearch />
        </div>

        <div
          style={{
            width:
              selectedOption === "right"
                ? "100%"
                : selectedOption === "both"
                ? "50%"
                : "0%",
          }}
        >
          <div className="bg-slate-800 h-full w-full"></div>
        </div>
      </div>
    </div>
  );
};

export default WeaponAccuracySeach;
