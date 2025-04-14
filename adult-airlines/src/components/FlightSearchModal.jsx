// FlightSearchModal.jsx
import React, { useEffect } from "react";

function FlightSearchModal({ isOpen, onClose, children }) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl relative overflow-hidden">
        
        {/* Sticky Top (Title + Close) */}
        <div className="sticky top-0 bg-white flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">Available Flights</h2>
          <button
            className="text-gray-500 hover:text-gray-800"
            onClick={onClose}
          >
            &times;
          </button>
        </div>
  
        {/* Scrollable content */}
        <div className="max-h-[70vh] overflow-y-auto p-4">
          {children}
        </div>
  
      </div>
    </div>
  );
}

export default FlightSearchModal;
