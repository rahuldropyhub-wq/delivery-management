import React, { useState, useRef, useEffect } from 'react';
import { Calendar, ChevronDown, Check } from 'lucide-react';

export default function DateFilter({
  selected = "thisWeek",
  onChange,
  options = [
    { id: "today", label: "Today" },
    { id: "thisWeek", label: "This Week" },
    { id: "thisMonth", label: "This Month" },
    { id: "custom", label: "Custom Range" }
  ],
  className = ""
}) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  const activeOption = options.find((o) => o.id === selected) || options[1];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className={`relative inline-block ${className}`} ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
      >
        <Calendar className="w-3.5 h-3.5 text-brand-600" />
        <span>{activeOption.label}</span>
        <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-1.5 w-44 bg-white rounded-xl shadow-dropdown border border-slate-100 py-1.5 z-40 animate-in fade-in zoom-in-95 duration-100">
          {options.map((option) => (
            <button
              key={option.id}
              onClick={() => {
                onChange(option.id);
                setIsOpen(false);
              }}
              className="w-full text-left px-3.5 py-2 text-xs font-medium flex items-center justify-between text-slate-700 hover:bg-slate-50 transition-colors"
            >
              <span className={option.id === selected ? "font-bold text-brand-600" : ""}>
                {option.label}
              </span>
              {option.id === selected && (
                <Check className="w-3.5 h-3.5 text-brand-600 stroke-[2.5]" />
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
