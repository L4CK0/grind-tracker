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

export function getMonthName(monthStr) {
  const [year, month] = monthStr.split('-').map(Number)
  const names = ['Január', 'Február', 'Március', 'Április', 'Május', 'Június',
    'Július', 'Augusztus', 'Szeptember', 'Október', 'November', 'December']
  return `${names[month - 1]} ${year}`
}

export function getWeekNumber(dateStr) {
  const date = new Date(dateStr)
  const startOfYear = new Date(date.getFullYear(), 0, 1)
  const days = Math.floor((date - startOfYear) / (24 * 60 * 60 * 1000))
  return Math.ceil((days + startOfYear.getDay() + 1) / 7)
}

export function getWeeksInMonth(monthStr) {
  const [year, month] = monthStr.split('-').map(Number)
  const date = new Date(year, month - 1, 1)
  const weeks = []
  let currentWeek = []
  
  while (date.getMonth() === month - 1 || currentWeek.length > 0) {
    currentWeek.push({
      date: formatDate(date),
      dayName: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'][date.getDay()],
      dayNumber: date.getDate(),
      isToday: formatDate(new Date()) === formatDate(date),
      isCurrentMonth: date.getMonth() === month - 1
    })
    
    if (date.getDay() === 6 || (date.getMonth() !== month - 1 && currentWeek.length >= 7)) {
      while (currentWeek.length < 7) {
        const nextDate = new Date(date)
        nextDate.setDate(nextDate.getDate() + (7 - currentWeek.length))
        currentWeek.push({
          date: formatDate(nextDate),
          dayName: ['V', 'H', 'K', 'Sze', 'Cs', 'P', 'Szo'][nextDate.getDay()],
          dayNumber: nextDate.getDate(),
          isToday: formatDate(new Date()) === formatDate(nextDate),
          isCurrentMonth: false
        })
      }
      weeks.push({
        weekNum: weeks.length + 1,
        dates: [...currentWeek]
      })
      currentWeek = []
      if (date.getMonth() !== month - 1) break
    }
    
    date.setDate(date.getDate() + 1)
  }
  
  return weeks
}