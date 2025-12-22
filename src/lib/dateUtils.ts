export function parseDate(dateString: string | undefined | null): Date {
  if (!dateString) return new Date(0)
  
  // Try standard parsing
  let date = new Date(dateString)
  
  // If invalid, try parsing DD/MM/YYYY or DD-MM-YYYY
  if (isNaN(date.getTime())) {
    const parts = dateString.split(/[/,-]/)
    if (parts.length === 3) {
      const day = parseInt(parts[0], 10)
      const month = parseInt(parts[1], 10) - 1
      let year = parseInt(parts[2], 10)
      
      // Handle YY
      if (year < 100) {
        year += 2000
      }
      
      date = new Date(year, month, day)
    }
  }
  
  return date
}

export function formatDate(date: Date): string {
  if (isNaN(date.getTime())) return 'Invalid Date'
  
  return date.toLocaleDateString('en-GB', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}

export function formatDateShort(date: Date): string {
  if (isNaN(date.getTime())) return 'Invalid Date'
  
  return date.toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  })
}
