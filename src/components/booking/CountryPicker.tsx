import React, { useState, useRef, useEffect, useMemo } from 'react';
import { ChevronDown, Check } from 'lucide-react';
import { CountryCode, COUNTRY_CODES } from './types.ts';

interface CountryPickerProps {
  selectedCountry: CountryCode;
  onSelectCountry: (country: CountryCode) => void;
  phoneNational: string;
  onChangePhoneNational: (value: string) => void;
}

export const CountryPicker: React.FC<CountryPickerProps> = ({
  selectedCountry,
  onSelectCountry,
  phoneNational,
  onChangePhoneNational,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const containerRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutside);
    return () => document.removeEventListener('mousedown', handleOutside);
  }, []);

  const filteredCountries = useMemo(() => {
    if (!search.trim()) return COUNTRY_CODES;
    const q = search.toLowerCase();
    return COUNTRY_CODES.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.dial.includes(q) ||
        c.code.toLowerCase().includes(q)
    );
  }, [search]);

  return (
    <div className="relative flex items-center" ref={containerRef}>
      {/* Country Code Trigger Button */}
      <button
        type="button"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-10 sm:h-11 px-2.5 sm:px-3 rounded-l-[4px] bg-white/[0.08] border-y border-l border-white/20 text-white text-xs font-mono flex items-center gap-1.5 hover:bg-white/[0.12] transition-colors cursor-pointer select-none shrink-0"
        aria-label="Select country code"
      >
        <span className="text-sm sm:text-base leading-none">{selectedCountry.flag}</span>
        <span className="font-medium">{selectedCountry.dial}</span>
        <ChevronDown className="w-3 h-3 text-white/40" />
      </button>

      {/* Phone Number Input */}
      <input
        type="tel"
        required
        value={phoneNational}
        onChange={(e) => onChangePhoneNational(e.target.value)}
        placeholder="(555) 000-0000"
        className="flex-1 h-10 sm:h-11 px-3 sm:px-4 rounded-r-[4px] bg-white/[0.06] border border-white/20 text-white placeholder-white/40 text-xs sm:text-sm shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.22)] focus:outline-none focus:border-white/45 focus:bg-white/[0.10] focus:ring-1 focus:ring-white/30 transition-all duration-200"
      />

      {/* Country Picker Dropdown Panel */}
      {isOpen && (
        <div className="absolute top-full left-0 mt-1.5 w-72 max-h-60 overflow-y-auto rounded-xl bg-[#141418] border border-white/15 shadow-2xl z-50 p-2 scrollbar-thin scrollbar-thumb-white/20 animate-in fade-in zoom-in-95 duration-150">
          {/* Search Input */}
          <div className="sticky top-0 bg-[#141418] pb-1.5 z-10">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search country or code..."
              className="w-full h-8 px-2.5 rounded bg-white/[0.07] border border-white/10 text-white text-xs placeholder-white/40 focus:outline-none focus:border-white/30"
              autoFocus
            />
          </div>

          {/* Country Options List */}
          <div className="space-y-0.5 mt-1">
            {filteredCountries.map((c) => {
              const isSelected = selectedCountry.code === c.code;
              return (
                <button
                  key={c.code}
                  type="button"
                  onClick={() => {
                    onSelectCountry(c);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors cursor-pointer text-left ${
                    isSelected ? 'bg-white/15 text-white font-medium' : 'text-white/70 hover:bg-white/5 hover:text-white'
                  }`}
                >
                  <span className="flex items-center gap-2 truncate">
                    <span className="text-base">{c.flag}</span>
                    <span className="truncate">{c.name}</span>
                  </span>
                  <div className="flex items-center gap-1.5 shrink-0 ml-2">
                    <span className="font-mono text-white/50">{c.dial}</span>
                    {isSelected && <Check className="w-3.5 h-3.5 text-white" />}
                  </div>
                </button>
              );
            })}

            {filteredCountries.length === 0 && (
              <div className="py-4 text-center text-xs text-white/40">No countries found</div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
