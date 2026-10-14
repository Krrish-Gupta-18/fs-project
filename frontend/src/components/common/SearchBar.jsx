import React from 'react';
import { Search, X } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  placeholder = 'Search conversations...',
  onClear,
  className = '',
}) {
  return (
    <div className={`relative flex items-center w-full ${className}`}>
      <div className="absolute left-3.5 text-slate-400 pointer-events-none">
        <Search className="w-4 h-4" />
      </div>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full bg-dark-900/80 border border-slate-800 focus:border-brand-500/60 text-slate-200 text-sm rounded-xl pl-10 pr-9 py-2 placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/20 transition-all duration-200"
      />
      {value && (
        <button
          type="button"
          onClick={onClear || (() => onChange(''))}
          className="absolute right-3 text-slate-400 hover:text-slate-200 transition-colors p-1"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
