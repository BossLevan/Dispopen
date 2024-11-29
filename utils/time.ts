export function formatCountdown(seconds: string | number): string {
    const totalSeconds = Number(seconds);
    
    // If less than 1 hour, show minutes
    if (totalSeconds < 3600) {
      const minutes = Math.ceil(totalSeconds / 60);
      return `${minutes}m`;
    }
    
    // If less than 24 hours, show hours
    if (totalSeconds < 86400) {
      const hours = Math.ceil(totalSeconds / 3600);
      return `${hours}h`;
    }
    
    // If more than 24 hours, show days
    const days = Math.ceil(totalSeconds / 86400);
    return `${days}d`;
  }
  
  // Usage examples:
  // formatCountdown("86400") → "1d"
  // formatCountdown("3600") → "1h"
  // formatCountdown("1800") → "30m"