import React, { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Check, X } from 'lucide-react'
import { getMonthName } from '../utils/dateUtils'
import './WeekGrid.css'

const WEEK_COLORS = ['var(--week-1)', 'var(--week-2)', 'var(--week-3)', 'var(--week-4)', 'var(--week-5)']
const MAX_TASKS = 20

export default function WeekGrid({ tasks, weeks, completions, toggleCompletion, addTask, deleteTask, updateTaskName, kpi, navigateMonth, currentMonth, today }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [editValue, setEditValue] = useState('')

  const handleAdd = (e) => {
    e.preventDefault()
    if (tasks.length >= MAX_TASKS) {
      alert(`Maximum ${MAX_TASKS} tasks reached`)
      return
    }
    if (newName.trim()) {
      addTask(newName.trim(), newEmoji || '📌')
      setNewName('')
      setNewEmoji('')
      setShowAdd(false)
    }
  }

  const startEdit = (task) => {
    setEditingTask(task.id)
    setEditValue(task.name)
  }

  const saveEdit = () => {
    if (editValue.trim() && editingTask) {
      updateTaskName(editingTask, editValue.trim())
    }
    setEditingTask(null)
  }

  return (
    <div className="dashboard">
      {/* KPI Bar */}
      <div className="kpi-bar">
        <div className="kpi-item">
          <span className="kpi-label">Habits</span>
          <span className="kpi-value">{tasks.length}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Completed</span>
          <span className="kpi-value">{kpi.totalCompleted}</span>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Progress</span>
          <div className="progress-ring-container">
            <svg viewBox="0 0 36 36" className="progress-ring">
              <circle cx="18" cy="18" r="14" fill="none" stroke="#362f2f" strokeWidth="3" />
              <circle cx="18" cy="18" r="14" fill="none" stroke="var(--progress-ring)" strokeWidth="3"
                strokeDasharray={`${kpi.totalCompleted > 0 ? Math.min((kpi.totalCompleted / (tasks.length * weeks.length * 7)) * 100, 100) : 0}, 100`}
                strokeLinecap="round" transform="rotate(-90 18 18)" />
              <text x="18" y="20" textAnchor="middle" fill="#c7bfb5" fontSize="9" fontWeight="700">
                {Math.round(kpi.totalCompleted > 0 ? (kpi.totalCompleted / (tasks.length * weeks.reduce((sum, w) => sum + w.dates.filter(d => d.isCurrentMonth).length, 0))) * 100 : 0)}%
              </text>
            </svg>
          </div>
        </div>
        <div className="kpi-item">
          <span className="kpi-label">Streak</span>
          <span className="kpi-value">{kpi.currentStreak}</span>
        </div>
      </div>

      {/* Month Header */}
      <div className="month-header">
        <button className="month-nav" onClick={() => navigateMonth(-1)}><ChevronLeft size={18} /></button>
        <h2 className="month-title">{getMonthName(currentMonth)}</h2>
        <button className="month-nav" onClick={() => navigateMonth(1)}><ChevronRight size={18} /></button>
      </div>

      {/* Task Grid */}
      <div className="grid-container">
        <div className="grid-scroll">
          <table className="grid-table">
            <thead>
              <tr>
                <th className="task-col">Tasks</th>
                {weeks.map((week, wi) => (
                  <th key={wi} colSpan={7} className="week-header" style={{ backgroundColor: WEEK_COLORS[wi] + '22', borderColor: WEEK_COLORS[wi] + '44' }}>
                    Week {week.weekNum}
                  </th>
                ))}
              </tr>
              <tr>
                <th className="task-col"></th>
                {weeks.map((week, wi) =>
                  week.dates.map((day, di) => (
                    <th key={`${wi}-${di}`} className={`day-cell ${day.isToday ? 'today' : ''} ${!day.isCurrentMonth ? 'other-month' : ''}`}
                      style={{ borderColor: WEEK_COLORS[wi] + '33' }}>
                      <span className="day-name">{day.dayName}</span>
                      <span className="day-num">{day.dayNumber}</span>
                    </th>
                  ))
                )}
              </tr>
            </thead>
            <tbody>
              {tasks.map(task => (
                <tr key={task.id} className="task-row">
                  <td className="task-name-col">
                    {editingTask === task.id ? (
                      <div className="edit-inline">
                        <input value={editValue} onChange={e => setEditValue(e.target.value)}
                          onKeyDown={e => { if (e.key === 'Enter') saveEdit(); if (e.key === 'Escape') setEditingTask(null) }}
                          className="edit-input-sm" autoFocus />
                        <button onClick={saveEdit} className="icon-btn save"><Check size={12} /></button>
                        <button onClick={() => setEditingTask(null)} className="icon-btn"><X size={12} /></button>
                      </div>
                    ) : (
                      <div className="task-name-wrapper">
                        <span className="task-name" onDoubleClick={() => startEdit(task)}>{task.name}</span>
                        <div className="task-actions">
                          <button onClick={() => startEdit(task)} className="icon-btn-sm"><Edit2 size={10} /></button>
                          <button onClick={() => { if (window.confirm('Delete?')) deleteTask(task.id) }} className="icon-btn-sm danger"><Trash2 size={10} /></button>
                        </div>
                      </div>
                    )}
                  </td>
                  {weeks.map((week, wi) =>
                    week.dates.map((day, di) => {
                      const isChecked = completions[task.id]?.[day.date]
                      return (
                        <td key={`${wi}-${di}`} className={`check-cell ${day.isToday ? 'today' : ''} ${!day.isCurrentMonth ? 'other-month' : ''}`}
                          style={{ borderColor: WEEK_COLORS[wi] + '22' }}>
                          <button
                            className={`cell-btn ${isChecked ? 'done' : ''}`}
                            style={isChecked ? { backgroundColor: WEEK_COLORS[wi] } : { borderColor: WEEK_COLORS[wi] + '44' }}
                            onClick={() => toggleCompletion(task.id, day.date)}
                          />
                        </td>
                      )
                    })
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Task */}
      <div className="add-section">
        {showAdd ? (
          <form className="add-form" onSubmit={handleAdd}>
            <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="📌" className="emoji-input" maxLength={2} />
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Task name..." className="name-input" autoFocus />
            <button type="submit" className="add-btn" disabled={!newName.trim()}>Add</button>
            <button type="button" className="cancel-btn" onClick={() => setShowAdd(false)}>Cancel</button>
          </form>
        ) : (
          <button className="add-task-btn" onClick={() => {
            if (tasks.length >= MAX_TASKS) {
              alert(`Maximum ${MAX_TASKS} tasks reached`)
              return
            }
            setShowAdd(true)
          }}>
            <Plus size={14} /> Add task
          </button>
        )}
      </div>
    </div>
  )
}