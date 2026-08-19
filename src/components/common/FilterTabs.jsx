import React from 'react';
import { motion } from 'framer-motion';

export default function FilterTabs({
  tabs = [],
  activeTab,
  onChange,
  className = ""
}) {
  return (
    <div className={`flex items-center gap-1.5 overflow-x-auto no-scrollbar py-1 -my-1 ${className}`}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id || activeTab === tab.value;
        const tabId = tab.id || tab.value;

        return (
          <button
            key={tabId}
            onClick={() => onChange(tabId)}
            className={`relative px-3.5 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all duration-150 flex items-center gap-1.5 select-none ${
              isActive
                ? 'text-white bg-brand-600 shadow-sm'
                : 'text-slate-600 bg-white hover:bg-slate-100 border border-slate-200/80'
            }`}
          >
            <span>{tab.label}</span>
            {tab.count !== undefined && (
              <span
                className={`text-[10px] px-1.5 py-0.5 rounded-full font-bold ${
                  isActive
                    ? 'bg-white/20 text-white'
                    : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
