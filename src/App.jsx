import React, { useState, useCallback } from 'react'
import WeekGrid from './components/WeekGrid'
import SettingsView from './components/SettingsView'
import Navigation from './components/Navigation'
import MentalTracker from './components/MentalTracker'
import WeightTracker from './components/WeightTracker'
import Gallery from './components/Gallery'
import { useLocalStorage } from './hooks/useLocalStorage'
import { formatDate, getDaysInMonth } from './utils/dateUtils'
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

  const days = getDaysInMonth(currentMonth)
  const today = formatDate(new Date())

  const toggleCompletion = useCallback((taskId, dateStr) => {
    setCompletions(prev => {
      const n = { ...prev }
      if (!n[taskId]) n[taskId] = {}
      n[taskId] = { ...n[taskId] }
      if (n[taskId][dateStr]) delete n[taskId][dateStr]
      else n[taskId][dateStr] = true
      return n
    })
  }, [setCompletions])

  const addTask = useCallback((name, emoji) => {
    setTasks(prev => [...prev, { id: Date.now().toString(), name: emoji ? `${emoji} ${name}` : name, emoji: emoji || '' }])
  }, [setTasks])

  const deleteTask = useCallback((taskId) => {
    setTasks(prev => prev.filter(t => t.id !== taskId))
    setCompletions(prev => { const n = { ...prev }; delete n[taskId]; return n })
  }, [setTasks, setCompletions])

  const updateTaskName = useCallback((taskId, newName) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, name: newName } : t))
  }, [setTasks])

  const navigateMonth = useCallback((direction) => {
    setCurrentMonth(prev => {
      const [y, m] = prev.split('-').map(Number)
      const d = new Date(y, m - 1 + direction, 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
  }, [])

  const calculateKpi = useCallback(() => {
    let done = 0, streak = 0
    days.forEach(day => tasks.forEach(task => { if (completions[task.id]?.[day.date]) done++ }))
    const cd = new Date(today)
    for (let i = 0; i < 365; i++) {
      const ds = formatDate(cd)
      let any = false; tasks.forEach(task => { if (completions[task.id]?.[ds]) any = true })
      if (any && tasks.length > 0) streak++; else break
      cd.setDate(cd.getDate() - 1)
    }
    const possible = tasks.length * days.length
    const pct = possible > 0 ? ((done / possible) * 100).toFixed(1) : '0.0'
    return { done, streak, pct, habits: tasks.length }
  }, [days, tasks, completions, today])

  const kpi = calculateKpi()

  const clearAllData = useCallback(() => {
    if (window.confirm('Delete all?')) { setTasks(DEFAULT_TASKS); setCompletions({}) }
  }, [setTasks, setCompletions])

  const exportData = useCallback(() => {
    const data = { tasks, completions, v: '6.0', exportDate: new Date().toISOString() }
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' })
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = `grind-${today}.json`; a.click()
  }, [tasks, completions, today])

  const importData = useCallback((e) => {
    const file = e.target.files?.[0]; if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      try { const data = JSON.parse(ev.target.result); if (data.tasks) setTasks(data.tasks); if (data.completions) setCompletions(data.completions) } catch { alert('Invalid') }
    }
    reader.readAsText(file)
  }, [setTasks, setCompletions])

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return (
          <>
            <WeekGrid tasks={tasks} days={days} completions={completions} toggleCompletion={toggleCompletion} addTask={addTask} deleteTask={deleteTask} updateTaskName={updateTaskName} kpi={kpi} navigateMonth={navigateMonth} currentMonth={currentMonth} today={today} />
            <MentalTracker days={days} />
          </>
        )
      case 'weight': return <WeightTracker />
      case 'gallery': return <Gallery />
      case 'settings': return <SettingsView clearAllData={clearAllData} exportData={exportData} importData={importData} />
      default: return null
    }
  }

  return (
    <div className="app">
      <main className="main-content">{renderView()}</main>
      <Navigation currentView={currentView} setCurrentView={setCurrentView} />
    </div>
  )
}

export default App