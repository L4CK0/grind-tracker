export function formatDate(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function getCurrentWeekMonday() {
  const now = new Date()
  const day = now.getDay()
  const diff = now.getDate() - day + (day === 0 ? -6 : 1)
  const monday = new Date(now.setDate(diff))
  return formatDate(monday)
}

export function getWeekDates(mondayStr) {
  const monday = new Date(mondayStr)
  const dates = []
  const dayNames = ['H', 'K', 'Sze', 'Cs', 'P', 'Szo', 'V']
  
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push({
      date: formatDate(date),
      dayName: dayNames[i],
      dayNumber: date.getDate(),
      isToday: formatDate(new Date()) === formatDate(date)
    })
  }
  
  return dates
}

export function getMonthName(dateStr) {
  const [year, month] = dateStr.split('-')
  const date = new Date(parseInt(year), parseInt(month) - 1)
  const monthNames = [
    'Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December'
  ]
  return `${monthNames[date.getMonth()]} ${date.getFullYear()}`
}

export function getWeekNumber(dateStr) {
  const date = new Date(dateStr)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}