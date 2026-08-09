import React, { useState, useCallback, useEffect } from 'react'
import Header from './components/Header'
import WeekGrid from './components/WeekGrid'
import StatsView from './components/StatsView'
import SettingsView from './components/SettingsView'
import Navigation from './components/Navigation'
import { useLocalStorage } from './hooks/useLocalStorage'
import { getWeekDates, getCurrentWeekMonday, formatDate } from './utils/dateUtils'
import './App.css'

const DEFAULT_TASKS = [
  { id: '1', name: '📈 Trading', emoji: '📈' },
  { id: '2', name: '💻 Business', emoji: '💻' },
  { id: '3', name: '🏋️ Edzés', emoji: '🏋️' },
  { id: '4', name: '📚 Tanulás', emoji: '📚' },
]

function App() {
  const [theme, setTheme] = useLocalStorage('grind-theme', 'dark')
  const [tasks, setTasks] = useLocalStorage('grind-tasks', DEFAULT_TASKS)
  const [completions, setCompletions] = useLocalStorage('grind-completions', {})
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentWeekStart, setCurrentWeekStart] = useState(() => getCurrentWeekMonday())

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(prev => prev === 'dark' ? 'light' : 'dark')
  }, [setTheme])

  const weekDates = getWeekDates(currentWeekStart)

  const toggleCompletion = useCallback((taskId, dateStr) => {
    setCompletions(prev => {
      const newCompletions = { ...prev }
      if (!newCompletions[taskId]) {
        newCompletions[taskId] = {}
      }
      newCompletions[taskId] = { ...newCompletions[taskId] }
      
      if (newCompletions[taskId][dateStr]) {
        delete newCompletions[taskId][dateStr]
      } else {
        newCompletions[taskId][dateStr] = true
      }
      
      return newCompletions
    })
  }, [setCompletions])

  const addTask = useCallback((name, emoji) => {
    setTasks(prev => [
      ...prev,
      { id: Date.now().toString(), name: `${emoji} ${name}`, emoji }
    ])
  }, [setTasks])

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    setCompletions(prev => {
      const newCompletions = { ...prev }
      delete newCompletions[taskId]
      return newCompletions
    })
  }, [setTasks, setCompletions])

  const updateTaskName = useCallback((taskId, newName) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, name: newName } : t))
  }, [setTasks])

  const navigateWeek = useCallback((direction) => {
    setCurrentWeekStart(prev => {
      const date = new Date(prev)
      date.setDate(date.getDate() + (direction * 7))
      return formatDate(date)
    })
  }, [])

  const resetToCurrentWeek = useCallback(() => {
    setCurrentWeekStart(getCurrentWeekMonday())
  }, [])

  const clearAllData = useCallback(() => {
    if (window.confirm('Biztosan törölni szeretnéd az összes adatot?')) {
      setTasks(DEFAULT_TASKS)
      setCompletions({})
      setCurrentWeekStart(getCurrentWeekMonday())
    }
  }, [setTasks, setCompletions])

  const exportData = useCallback(() => {
    const data = {
      tasks,
      completions,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `grind-backup-${formatDate(new Date())}.json`
    a.click()
    URL.revokeObjectURL(url)
  }, [tasks, completions])

  const importData = useCallback((event) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result)
        if (data.tasks && data.completions) {
          if (window.confirm('Biztosan importálod az adatokat? A jelenlegi adatok felülíródnak!')) {
            setTasks(data.tasks)
            setCompletions(data.completions)
            alert('Adatok sikeresen importálva!')
          }
        } else {
          alert('Érvénytelen fájlformátum!')
        }
      } catch (error) {
        alert('Hiba az importálás során!')
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }, [setTasks, setCompletions])

  const calculateStats = useCallback(() => {
    const stats = {
      dailyCompletions: {},
      weeklyTotal: 0,
      weeklyCompleted: 0,
      totalCompletions: 0,
      currentStreak: 0,
      longestStreak: 0,
      monthlyTotal: 0,
      monthlyCompleted: 0
    }

    const today = new Date()
    const currentMonth = today.getMonth()
    const currentYear = today.getFullYear()
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate()

    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(currentYear, currentMonth, i)
      const dateStr = formatDate(date)
      let dayCompleted = 0

      tasks.forEach(task => {
        if (completions[task.id]?.[dateStr]) {
          dayCompleted++
        }
      })

      stats.monthlyTotal += tasks.length
      stats.monthlyCompleted += dayCompleted
    }

    weekDates.forEach(date => {
      const dateStr = date.date
      let dayCompleted = 0

      tasks.forEach(task => {
        if (completions[task.id]?.[dateStr]) {
          dayCompleted++
        }
      })

      stats.dailyCompletions[dateStr] = {
        total: tasks.length,
        completed: dayCompleted,
        percentage: tasks.length > 0 ? Math.round((dayCompleted / tasks.length) * 100) : 0
      }

      stats.weeklyTotal += tasks.length
      stats.weeklyCompleted += dayCompleted
    })

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    const checkDate = new Date(today)

    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate)
      let allCompleted = tasks.length > 0

      tasks.forEach(task => {
        if (!completions[task.id]?.[dateStr]) {
          allCompleted = false
        }
      })

      if (allCompleted && tasks.length > 0) {
        tempStreak++
        if (i === 0) currentStreak = tempStreak
        longestStreak = Math.max(longestStreak, tempStreak)
      } else {
        if (i === 0) currentStreak = tempStreak
        tempStreak = 0
      }

      checkDate.setDate(checkDate.getDate() - 1)
    }

    stats.currentStreak = currentStreak
    stats.longestStreak = longestStreak
    stats.totalCompletions = Object.values(completions).reduce((total, taskCompletions) => {
      return total + Object.keys(taskCompletions).length
    }, 0)

    return stats
  }, [weekDates, tasks, completions])

  const stats = calculateStats()
  const weeklyPercentage = stats.weeklyTotal > 0
    ? Math.round((stats.weeklyCompleted / stats.weeklyTotal) * 100)
    : 0

  const renderView = () => {
    switch (currentView) {
      case 'stats':
        return <StatsView stats={stats} tasks={tasks} completions={completions} />
      case 'settings':
        return (
          <SettingsView
            theme={theme}
            toggleTheme={toggleTheme}
            clearAllData={clearAllData}
            exportData={exportData}
            importData={importData}
          />
        )
      default:
        return (
          <WeekGrid
            tasks={tasks}
            weekDates={weekDates}
            completions={completions}
            toggleCompletion={toggleCompletion}
            addTask={addTask}
            deleteTask={deleteTask}
            updateTaskName={updateTaskName}
          />
        )
    }
  }

  return (
    <div className="app">
      <Header
        weeklyPercentage={weeklyPercentage}
        weekDates={weekDates}
        navigateWeek={navigateWeek}
        resetToCurrentWeek={resetToCurrentWeek}
        currentWeekStart={currentWeekStart}
      />
      <main className="main-content">
        {renderView()}
      </main>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  )
}

export default App