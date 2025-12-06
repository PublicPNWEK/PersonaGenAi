/**
 * Service to interact with WorldTimeAPI with browser-based fallback
 * API Documentation: http://worldtimeapi.org/
 */

export interface TimeZoneInfo {
  timezone: string;
  datetime: string;
  utc_datetime: string;
  utc_offset: string;
  day_of_week: number;
  day_of_year: number;
  week_number: number;
}

export interface TimeZone {
  value: string;
  label: string;
}

const API_BASE_URL = 'https://worldtimeapi.org/api';

// Comprehensive list of common time zones as fallback
const FALLBACK_TIMEZONES: string[] = [
  'Africa/Cairo', 'Africa/Johannesburg', 'Africa/Lagos', 'Africa/Nairobi',
  'America/Anchorage', 'America/Argentina/Buenos_Aires', 'America/Bogota',
  'America/Chicago', 'America/Denver', 'America/Los_Angeles', 'America/Mexico_City',
  'America/New_York', 'America/Phoenix', 'America/Santiago', 'America/Sao_Paulo',
  'America/Toronto', 'America/Vancouver',
  'Asia/Bangkok', 'Asia/Colombo', 'Asia/Dubai', 'Asia/Hong_Kong', 'Asia/Jakarta',
  'Asia/Jerusalem', 'Asia/Karachi', 'Asia/Kolkata', 'Asia/Kuwait', 'Asia/Manila',
  'Asia/Riyadh', 'Asia/Seoul', 'Asia/Shanghai', 'Asia/Singapore', 'Asia/Taipei',
  'Asia/Tehran', 'Asia/Tokyo',
  'Australia/Melbourne', 'Australia/Perth', 'Australia/Sydney',
  'Europe/Amsterdam', 'Europe/Athens', 'Europe/Berlin', 'Europe/Brussels',
  'Europe/Budapest', 'Europe/Copenhagen', 'Europe/Dublin', 'Europe/Helsinki',
  'Europe/Istanbul', 'Europe/Lisbon', 'Europe/London', 'Europe/Madrid',
  'Europe/Moscow', 'Europe/Oslo', 'Europe/Paris', 'Europe/Prague', 'Europe/Rome',
  'Europe/Stockholm', 'Europe/Vienna', 'Europe/Warsaw', 'Europe/Zurich',
  'Pacific/Auckland', 'Pacific/Fiji', 'Pacific/Honolulu',
  'UTC'
];

/**
 * Fetch list of all available time zones with fallback
 */
export async function fetchTimeZones(): Promise<TimeZone[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/timezone`);
    if (!response.ok) {
      throw new Error(`Failed to fetch time zones: ${response.statusText}`);
    }
    const zones: string[] = await response.json();
    return zones.map(zone => ({
      value: zone,
      label: zone.replace(/_/g, ' ')
    }));
  } catch (error) {
    console.warn('WorldTimeAPI not available, using fallback timezone list:', error);
    // Return fallback list
    return FALLBACK_TIMEZONES.map(zone => ({
      value: zone,
      label: zone.replace(/_/g, ' ')
    }));
  }
}

/**
 * Get time info using browser's Intl API (fallback)
 */
function getBrowserTimeForZone(timezone: string): TimeZoneInfo {
  const now = new Date();
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: timezone,
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
    hour12: false,
    timeZoneName: 'longOffset'
  });

  const parts = formatter.formatToParts(now);
  const partsObj: Record<string, string> = {};
  parts.forEach(part => {
    partsObj[part.type] = part.value;
  });

  // Construct ISO-like datetime
  const datetime = `${partsObj.year}-${partsObj.month}-${partsObj.day}T${partsObj.hour}:${partsObj.minute}:${partsObj.second}`;
  const utcOffset = partsObj.timeZoneName || '+00:00';

  // Create a date in the target timezone
  const tzDate = new Date(now.toLocaleString('en-US', { timeZone: timezone }));
  
  return {
    timezone,
    datetime: tzDate.toISOString(),
    utc_datetime: now.toISOString(),
    utc_offset: utcOffset,
    day_of_week: tzDate.getDay(),
    day_of_year: Math.floor((tzDate.getTime() - new Date(tzDate.getFullYear(), 0, 0).getTime()) / 86400000),
    week_number: Math.ceil((tzDate.getTime() - new Date(tzDate.getFullYear(), 0, 1).getTime()) / (7 * 86400000))
  };
}

/**
 * Fetch current time for a specific time zone with browser fallback
 */
export async function fetchTimeForZone(timezone: string): Promise<TimeZoneInfo> {
  try {
    const response = await fetch(`${API_BASE_URL}/timezone/${timezone}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch time for ${timezone}: ${response.statusText}`);
    }
    return await response.json();
  } catch (error) {
    console.warn(`WorldTimeAPI not available for ${timezone}, using browser time:`, error);
    // Use browser-based fallback
    return getBrowserTimeForZone(timezone);
  }
}

/**
 * Parse ISO datetime string to display format
 */
export function formatTime(datetime: string, is24Hour: boolean): string {
  const date = new Date(datetime);
  
  if (is24Hour) {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false
    });
  } else {
    return date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });
  }
}

/**
 * Format date from datetime string
 */
export function formatDate(datetime: string): string {
  const date = new Date(datetime);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}
