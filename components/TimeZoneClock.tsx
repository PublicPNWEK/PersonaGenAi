import React, { useEffect, useState } from 'react';
import { TimeZoneInfo, formatTime, formatDate, fetchTimeForZone } from '../services/worldTimeService';

interface TimeZoneClockProps {
  timezone: string;
  is24Hour: boolean;
  onRemove: () => void;
}

export const TimeZoneClock: React.FC<TimeZoneClockProps> = ({ timezone, is24Hour, onRemove }) => {
  const [timeData, setTimeData] = useState<TimeZoneInfo | null>(null);
  const [currentTime, setCurrentTime] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch initial time data
  useEffect(() => {
    const loadTimeData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await fetchTimeForZone(timezone);
        setTimeData(data);
        setCurrentTime(formatTime(data.datetime, is24Hour));
        setLoading(false);
      } catch (err) {
        setError('Failed to load time data');
        setLoading(false);
      }
    };

    loadTimeData();
  }, [timezone]);

  // Update time display every second
  useEffect(() => {
    if (!timeData) return;

    const interval = setInterval(() => {
      // Calculate elapsed time since last API fetch
      const now = new Date();
      const lastFetch = new Date(timeData.datetime);
      const elapsed = now.getTime() - lastFetch.getTime();
      const updatedTime = new Date(lastFetch.getTime() + elapsed);
      setCurrentTime(formatTime(updatedTime.toISOString(), is24Hour));
    }, 1000);

    return () => clearInterval(interval);
  }, [timeData, is24Hour]);

  // Refetch data every 5 minutes to stay accurate
  useEffect(() => {
    if (!timeData) return;

    const refetchInterval = setInterval(async () => {
      try {
        const data = await fetchTimeForZone(timezone);
        setTimeData(data);
      } catch (err) {
        console.error('Failed to refetch time data:', err);
      }
    }, 5 * 60 * 1000); // 5 minutes

    return () => clearInterval(refetchInterval);
  }, [timezone, timeData]);

  if (loading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 animate-pulse">
        <div className="h-8 bg-slate-700 rounded w-3/4 mb-4"></div>
        <div className="h-12 bg-slate-700 rounded w-1/2"></div>
      </div>
    );
  }

  if (error || !timeData) {
    return (
      <div className="bg-red-900/20 backdrop-blur-sm rounded-xl p-6 border border-red-700/50">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-xl font-semibold text-red-400">{timezone.replace(/_/g, ' ')}</h3>
          <button
            onClick={onRemove}
            className="text-red-400 hover:text-red-300 transition-colors"
            aria-label="Remove time zone"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <p className="text-red-300">{error || 'Failed to load'}</p>
      </div>
    );
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-xl p-6 border border-slate-700/50 hover:border-sky-500/50 transition-all duration-300 shadow-lg hover:shadow-sky-500/10">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-xl font-semibold text-sky-400 mb-1">
            {timezone.replace(/_/g, ' ')}
          </h3>
          <p className="text-sm text-slate-400">{timeData.utc_offset}</p>
        </div>
        <button
          onClick={onRemove}
          className="text-slate-400 hover:text-red-400 transition-colors"
          aria-label="Remove time zone"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="mb-2">
        <div className="text-5xl font-bold text-white font-mono">
          {currentTime}
        </div>
      </div>
      
      <div className="text-sm text-slate-300">
        {formatDate(timeData.datetime)}
      </div>
    </div>
  );
};
