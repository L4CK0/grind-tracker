import React, { useState, useCallback } from 'react'
import WeekGrid from './components/WeekGrid'
import SettingsView from './components/SettingsView'
import Navigation from './components/Navigation'
import MentalTracker from './components/MentalTracker'
import WeightTracker from './components/WeightTracker'
import Gallery from './components/Gallery'
import { useLocalStorage } from './hooks/useLocalStorage'
import { formatDate, getWeeksInMonth } from './utils/dateUtils'
import './App.css'

const DEFAULT_TASKS = [
  { id: '1', name: '📈 Trading', emoji: '📈' },
  { id: '2', name: '💻 Business', emoji: '💻' },
  { id: '3', name: '🏋️ Edzés', emoji: '🏋️' },
  { id: '4', name: '📚 Tanulás', emoji: '📚' },
]

function App() {
  const [tasks, setTasks] = useLocalStorage('grind-tasks', DEFAULT_TASKS)
  const [completions, setCompletions] = useLocalStorage('grind-completions', {})
  const [currentView, setCurrentView] = useState('dashboard')
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const weeks = getWeeksInMonth(currentMonth)
  const today = formatDate(new Date())

  const toggleCompletion = useCallback((taskId, dateStr) => {
    setCompletions(prev => {
      const newCompletions = { ...prev }
      if (!newCompletions[taskId]) newCompletions[taskId] = {}
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
    setTasks(prev => [...prev, { id: Date.now().toString(), name: emoji ? `${emoji} ${name}` : name, emoji: emoji || '' }])
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

  const navigateMonth = useCallback((direction) => {
    setCurrentMonth(prev => {
      const [year, month] = prev.split('-').map(Number)
      const date = new Date(year, month - 1 + direction, 1)
      return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    })
  }, [])

  const calculateKpi = useCallback(() => {
    let totalCompleted = 0
    let currentStreak = 0

    weeks.forEach(week => {
      week.dates.forEach(date => {
        tasks.forEach(task => {
          if (completions[task.id]?.[date.date]) totalCompleted++
        })
      })
    })

    const checkDate = new Date(today)
    for (let i = 0; i < 365; i++) {
      const dateStr = formatDate(checkDate)
      let anyCompleted = false
      tasks.forEach(task => {
        if (completions[task.id]?.[dateStr]) anyCompleted = true
      })
      if (anyCompleted && tasks.length > 0) {
        currentStreak++
      } else {
        break
      }
      checkDate.setDate(checkDate.getDate() - 1)
    }

    return { totalCompleted, currentStreak }
  }, [weeks, tasks, completions, today])

  const kpi = calculateKpi()

  const clearAllData = useCallback(() => {
    if (window.confirm('Biztosan törlöd az összes adatot?')) {
      setTasks(DEFAULT_TASKS)
      setCompletions({})
    }
  }, [setTasks, setCompletions])

  const exportData = useCallback(() => {
    const data = { tasks, completions, exportDate: new Date().toISOString(), version: '3.0' }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `grind-${today}.json`
    a.click()
  }, [tasks, completions, today])

  const importData = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try {
        const data = JSON.parse(ev.target.result)
        if (data.tasks) setTasks(data.tasks)
        if (data.completions) setCompletions(data.completions)
      } catch { alert('Hibás fájl!') }
    }
    reader.readAsText(file)
  }, [setTasks, setCompletions])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <WeekGrid
              tasks={tasks}
              weeks={weeks}
              completions={completions}
              toggleCompletion={toggleCompletion}
              addTask={addTask}
              deleteTask={deleteTask}
              updateTaskName={updateTaskName}
              kpi={kpi}
              navigateMonth={navigateMonth}
              currentMonth={currentMonth}
              today={today}
            />
            <MentalTracker />
            <WeightTracker />
          </>
        )
      case 'gallery':
        return <Gallery />
      case 'settings':
        return (
          <SettingsView
            clearAllData={clearAllData}
            exportData={exportData}
            importData={importData}
          />
        )
      default:
        return null
    }
  }

  return (
    <div className="app">
      <main className="main-content">
        {renderView()}
      </main>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  )
}

export default App