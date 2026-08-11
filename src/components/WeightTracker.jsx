import React, { useState, useCallback } from 'react'
import { Plus, Trash2, Edit2, Check, X } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate } from '../utils/dateUtils'
import './WeightTracker.css'

export default function WeightTracker() {
  const [entries, setEntries] = useLocalStorage('grind-weight', [])
  const [newWeight, setNewWeight] = useState('')
  const [newNote, setNewNote] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [editWeight, setEditWeight] = useState('')
  const [editNote, setEditNote] = useState('')
  const [timeRange, setTimeRange] = useState('ALL')

  const addEntry = useCallback((e) => {
    e.preventDefault()
    if (!newWeight.trim()) return
    const entry = {
      id: Date.now().toString(),
      date: formatDate(new Date()),
      weight: parseFloat(newWeight.replace(',', '.')),
      note: newNote.trim()
    }
    setEntries(prev => [entry, ...prev])
    setNewWeight('')
    setNewNote('')
  }, [newWeight, newNote, setEntries])

  const deleteEntry = useCallback((id) => {
    setEntries(prev => prev.filter(e => e.id !== id))
  }, [setEntries])

  const startEdit = (entry) => {
    setEditingId(entry.id)
    setEditWeight(entry.weight.toString())
    setEditNote(entry.note || '')
  }

  const saveEdit = (id) => {
    setEntries(prev => prev.map(e =>
      e.id === id ? { ...e, weight: parseFloat(editWeight.replace(',', '.')), note: editNote.trim() } : e
    ))
    setEditingId(null)
  }

  const filteredEntries = () => {
    const now = new Date()
    switch (timeRange) {
      case '7D': const d7 = new Date(now); d7.setDate(d7.getDate() - 7); return entries.filter(e => new Date(e.date) >= d7)
      case '30D': const d30 = new Date(now); d30.setDate(d30.getDate() - 30); return entries.filter(e => new Date(e.date) >= d30)
      case '90D': const d90 = new Date(now); d90.setDate(d90.getDate() - 90); return entries.filter(e => new Date(e.date) >= d90)
      default: return entries
    }
  }

  const displayEntries = filteredEntries()
  const sorted = [...displayEntries].reverse()
  const stats = {
    current: displayEntries.length > 0 ? displayEntries[0].weight : '-',
    min: displayEntries.length > 0 ? Math.min(...displayEntries.map(e => e.weight)) : '-',
    max: displayEntries.length > 0 ? Math.max(...displayEntries.map(e => e.weight)) : '-',
    change: displayEntries.length > 1 ? (displayEntries[0].weight - displayEntries[displayEntries.length - 1].weight).toFixed(1) : '0.0'
  }

  // Chart data
  const chartWidth = 300
  const chartHeight = 80
  const weights = sorted.map(e => e.weight)
  const minW = Math.min(...weights)
  const maxW = Math.max(...weights)
  const range = maxW - minW || 1

  return (
    <div className="weight-section">
      <h2 className="section-title">Body</h2>

      {/* Stats */}
      <div className="weight-stats-row">
        <div className="w-stat">
          <span className="w-stat-label">Current</span>
          <span className="w-stat-val">{stats.current} kg</span>
        </div>
        <div className="w-stat">
          <span className="w-stat-label">Change</span>
          <span className={`w-stat-val ${parseFloat(stats.change) < 0 ? 'down' : parseFloat(stats.change) > 0 ? 'up' : ''}`}>
            {stats.change} kg
          </span>
        </div>
        <div className="w-stat">
          <span className="w-stat-label">Min</span>
          <span className="w-stat-val">{stats.min} kg</span>
        </div>
        <div className="w-stat">
          <span className="w-stat-label">Max</span>
          <span className="w-stat-val">{stats.max} kg</span>
        </div>
      </div>

      {/* Time Range */}
      <div className="time-range-row">
        {['7D', '30D', '90D', 'ALL'].map(r => (
          <button key={r} className={`range-btn ${timeRange === r ? 'active' : ''}`} onClick={() => setTimeRange(r)}>
            {r}
          </button>
        ))}
      </div>

      {/* Mini Chart */}
      {sorted.length > 1 && (
        <div className="weight-chart-mini">
          <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="weight-chart-svg" preserveAspectRatio="none">
            <polyline
              points={sorted.map((e, i) => `${(i / (sorted.length - 1)) * chartWidth},${chartHeight - 10 - ((e.weight - minW) / range) * (chartHeight - 20)}`).join(' ')}
              fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" />
            {sorted.map((e, i) => {
              const x = (i / (sorted.length - 1)) * chartWidth
              const y = chartHeight - 10 - ((e.weight - minW) / range) * (chartHeight - 20)
              return (i === 0 || i === sorted.length - 1) ? <circle key={i} cx={x} cy={y} r="2" fill="#7c3aed" /> : null
            })}
          </svg>
          <div className="chart-range-labels">
            <span>{maxW} kg</span>
            <span>{minW} kg</span>
          </div>
        </div>
      )}

      {/* Add Form */}
      <form className="weight-form" onSubmit={addEntry}>
        <input type="text" value={newWeight} onChange={e => setNewWeight(e.target.value)}
          placeholder="Weight (kg)" className="weight-input" inputMode="decimal" />
        <input type="text" value={newNote} onChange={e => setNewNote(e.target.value)}
          placeholder="Note" className="note-input" />
        <button type="submit" className="add-btn" disabled={!newWeight.trim()}>
          <Plus size={14} />
        </button>
      </form>

      {/* List */}
      <div className="weight-list">
        {displayEntries.map(entry => (
          <div key={entry.id} className="weight-row">
            {editingId === entry.id ? (
              <div className="edit-row">
                <input type="text" value={editWeight} onChange={e => setEditWeight(e.target.value)} className="edit-input-sm" />
                <input type="text" value={editNote} onChange={e => setEditNote(e.target.value)} className="edit-input-sm" />
                <button onClick={() => saveEdit(entry.id)} className="icon-btn save"><Check size={14} /></button>
                <button onClick={() => setEditingId(null)} className="icon-btn"><X size={14} /></button>
              </div>
            ) : (
              <>
                <span className="entry-date">{entry.date.slice(5)}</span>
                <span className="entry-weight">{entry.weight} kg</span>
                {entry.note && <span className="entry-note">{entry.note}</span>}
                <div className="entry-actions">
                  <button onClick={() => startEdit(entry)} className="icon-btn"><Edit2 size={12} /></button>
                  <button onClick={() => deleteEntry(entry.id)} className="icon-btn danger"><Trash2 size={12} /></button>
                </div>
              </>
            )}
          </div>
        ))}
        {displayEntries.length === 0 && <div className="empty-text">No data yet</div>}
      </div>
    </div>
  )
}