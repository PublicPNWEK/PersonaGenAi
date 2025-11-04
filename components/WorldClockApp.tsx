import React, { useState, useEffect } from 'react';
import { TimeZoneSelector } from './TimeZoneSelector';
import { TimeZoneClock } from './TimeZoneClock';
import { fetchTimeZones, TimeZone } from '../services/worldTimeService';

export const WorldClockApp: React.FC = () => {
  const [availableZones, setAvailableZones] = useState<TimeZone[]>([]);
  const [selectedZones, setSelectedZones] = useState<string[]>([
    'America/New_York',
    'Europe/London',
    'Asia/Tokyo'
  ]);
  const [is24Hour, setIs24Hour] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch available time zones on mount
  useEffect(() => {
    const loadTimeZones = async () => {
      try {
        setLoading(true);
        const zones = await fetchTimeZones();
        setAvailableZones(zones);
        setLoading(false);
      } catch (err) {
        setError('Failed to load time zones. Please try again later.');
        setLoading(false);
      }
    };

    loadTimeZones();
  }, []);

  const handleAddZone = (timezone: string) => {
    if (!selectedZones.includes(timezone)) {
      setSelectedZones([...selectedZones, timezone]);
    }
  };

  const handleRemoveZone = (timezone: string) => {
    setSelectedZones(selectedZones.filter(z => z !== timezone));
  };

  const handleToggleFormat = () => {
    setIs24Hour(!is24Hour);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 text-white font-sans">
      {/* Decorative Background */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-sky-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-purple-500/20 rounded-full filter blur-3xl opacity-30 animate-pulse animation-delay-2000"></div>

      <div className="relative z-10 container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl font-bold mb-3 bg-gradient-to-r from-sky-400 to-purple-400 bg-clip-text text-transparent">
            World Clock
          </h1>
          <p className="text-slate-400 text-lg">
            Track time across multiple time zones in real-time
          </p>
        </header>

        {/* Controls Section */}
        <div className="mb-8 bg-slate-800/30 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50">
          <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
            <div className="flex-grow w-full md:w-auto">
              <label className="block text-sm font-medium text-slate-300 mb-2">
                Add Time Zone
              </label>
              <TimeZoneSelector
                availableZones={availableZones}
                selectedZones={selectedZones}
                onAddZone={handleAddZone}
                loading={loading}
              />
            </div>

            <div className="flex items-center gap-4">
              <label className="flex items-center gap-3 cursor-pointer group">
                <span className="text-sm font-medium text-slate-300">
                  Time Format:
                </span>
                <div className="relative">
                  <input
                    type="checkbox"
                    checked={is24Hour}
                    onChange={handleToggleFormat}
                    className="sr-only peer"
                  />
                  <div className="w-14 h-7 bg-slate-700 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-sky-500/50 rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-0.5 after:left-[2px] after:bg-white after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-sky-500"></div>
                </div>
                <span className="text-sm font-medium text-slate-300 min-w-[60px]">
                  {is24Hour ? '24-hour' : '12-hour'}
                </span>
              </label>
            </div>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-8 bg-red-900/20 backdrop-blur-sm rounded-xl p-4 border border-red-700/50">
            <p className="text-red-300">{error}</p>
          </div>
        )}

        {/* Loading State */}
        {loading && selectedZones.length === 0 && (
          <div className="text-center py-16">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-slate-700 border-t-sky-500"></div>
            <p className="mt-4 text-slate-400">Loading time zones...</p>
          </div>
        )}

        {/* Time Zone Clocks Grid */}
        {selectedZones.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {selectedZones.map((timezone) => (
              <TimeZoneClock
                key={timezone}
                timezone={timezone}
                is24Hour={is24Hour}
                onRemove={() => handleRemoveZone(timezone)}
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {selectedZones.length === 0 && !loading && (
          <div className="text-center py-16">
            <svg
              className="mx-auto h-24 w-24 text-slate-600 mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={1.5}
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <h3 className="text-xl font-semibold text-slate-400 mb-2">
              No time zones selected
            </h3>
            <p className="text-slate-500">
              Add a time zone using the search box above to get started
            </p>
          </div>
        )}

        {/* Footer */}
        <footer className="mt-12 text-center text-slate-500 text-sm">
          <p>
            Powered by{' '}
            <a
              href="http://worldtimeapi.org/"
              target="_blank"
              rel="noopener noreferrer"
              className="text-sky-400 hover:text-sky-300 transition-colors"
            >
              WorldTimeAPI
            </a>
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 0.3; }
          50% { opacity: 0.5; }
        }
        .animate-pulse {
          animation: pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};
