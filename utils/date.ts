export function formatUnixTimestamp(timestamp: string | number): string {
    // Convert string to number if needed and multiply by 1000 for milliseconds
    const date = new Date(Number(timestamp) * 1000);
    
    return date.toLocaleDateString('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  }
  
  // Usage example:
  // const formattedDate = formatUnixTimestamp("1732637930");
  // Returns: "21 November 2024"