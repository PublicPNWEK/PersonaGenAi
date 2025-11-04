import React, { useState, useEffect, useRef } from 'react';
import { TimeZone } from '../services/worldTimeService';

interface TimeZoneSelectorProps {
  availableZones: TimeZone[];
  selectedZones: string[];
  onAddZone: (timezone: string) => void;
  loading: boolean;
}

export const TimeZoneSelector: React.FC<TimeZoneSelectorProps> = ({
  availableZones,
  selectedZones,
  onAddZone,
  loading
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Filter zones based on search term and exclude already selected
  const filteredZones = availableZones.filter(zone =>
    !selectedZones.includes(zone.value) &&
    zone.label.toLowerCase().includes(searchTerm.toLowerCase())
  ).slice(0, 10); // Limit to 10 results for performance

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Reset highlighted index when filtered zones change
  useEffect(() => {
    setHighlightedIndex(0);
  }, [searchTerm]);

  const handleSelect = (timezone: string) => {
    onAddZone(timezone);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) {
      if (e.key === 'Enter' || e.key === 'ArrowDown') {
        setIsOpen(true);
        e.preventDefault();
      }
      return;
    }

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < filteredZones.length - 1 ? prev + 1 : prev
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => prev > 0 ? prev - 1 : 0);
        break;
      case 'Enter':
        e.preventDefault();
        if (filteredZones[highlightedIndex]) {
          handleSelect(filteredZones[highlightedIndex].value);
        }
        break;
      case 'Escape':
        setIsOpen(false);
        break;
    }
  };

  return (
    <div className="relative w-full" ref={dropdownRef}>
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setIsOpen(true);
          }}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder="Search and add time zone..."
          disabled={loading}
          className="w-full px-4 py-3 bg-slate-800/50 border border-slate-700 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:border-sky-500 focus:ring-2 focus:ring-sky-500/20 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
          aria-label="Search time zones"
          aria-expanded={isOpen}
          aria-autocomplete="list"
          role="combobox"
        />
        <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
      </div>

      {isOpen && filteredZones.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl max-h-64 overflow-y-auto">
          <ul role="listbox" className="py-2">
            {filteredZones.map((zone, index) => (
              <li
                key={zone.value}
                role="option"
                aria-selected={index === highlightedIndex}
                className={`px-4 py-2 cursor-pointer transition-colors ${
                  index === highlightedIndex
                    ? 'bg-sky-500/20 text-sky-300'
                    : 'text-slate-300 hover:bg-slate-700/50'
                }`}
                onClick={() => handleSelect(zone.value)}
                onMouseEnter={() => setHighlightedIndex(index)}
              >
                {zone.label}
              </li>
            ))}
          </ul>
        </div>
      )}

      {isOpen && searchTerm && filteredZones.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-slate-800 border border-slate-700 rounded-lg shadow-2xl p-4">
          <p className="text-slate-400 text-center">No time zones found</p>
        </div>
      )}
    </div>
  );
};
