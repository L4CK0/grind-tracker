import React, { useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate, getDaysInMonth } from '../utils/dateUtils'
import './WeightTracker.css'

const BAR_COLOR = '#7c3aed'

export default function WeightTracker() {
  const [entries, setEntries] = useLocalStorage('grind-weight', [])
  const [newWeight, setNewWeight] = useState('')
  const [newNote, setNewNote] = useState('')
  const [currentMonth, setCurrentMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const today = formatDate(new Date())
  const days = getDaysInMonth(currentMonth)
  const barMax = 100

  const addEntry = useCallback((e) => {
    e.preventDefault()
    if (!newWeight.trim()) return
    setEntries(prev => [{ id: Date.now().toString(), date: today, weight: parseFloat(newWeight.replace(',', '.')), note: newNote.trim() }, ...prev])
    setNewWeight(''); setNewNote('')
  }, [newWeight, newNote, today, setEntries])

  const deleteEntry = (id) => setEntries(prev => prev.filter(e => e.id !== id))

  const sorted = [...entries].sort((a, b) => a.date.localeCompare(b.date))

  const stats = {
    current: entries.length > 0 ? entries[0].weight.toFixed(1) : '-',
    start: sorted.length > 0 ? sorted[0].weight.toFixed(1) : '-',
    min: entries.length > 0 ? Math.min(...entries.map(e => e.weight)).toFixed(1) : '-',
    max: entries.length > 0 ? Math.max(...entries.map(e => e.weight)).toFixed(1) : '-',
    change: sorted.length > 1 ? (sorted[sorted.length - 1].weight - sorted[0].weight).toFixed(1) : '0.0'
  }

  // Group entries by date for the chart
  const chartData = days.map(day => {
    const entry = entries.find(e => e.date === day.date)
    return entry ? entry.weight : null
  })

  const navigateMonth = (dir) => {
    setCurrentMonth(prev => {
      const [y, m] = prev.split('-').map(Number)
      const d = new Date(y, m - 1 + dir, 1)
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`
    })
  }

  return (
    <div className="ws">
      <div className="th">
        <div className="tbl"><h2 className="mtt">Body</h2><span className="subt">· Weight Tracker ·</span></div>
        <div className="kpb small">
          <div className="kpi"><span className="klb">Current</span><span className="kvl">{stats.current} kg</span></div>
          <div className="kpi"><span className="klb">Change</span><span className={`kvl ${parseFloat(stats.change) < 0 ? 'd' : parseFloat(stats.change) > 0 ? 'u' : ''}`}>{stats.change} kg</span></div>
          <div className="kpi"><span className="klb">Min</span><span className="kvl">{stats.min} kg</span></div>
          <div className="kpi"><span className="klb">Max</span><span className="kvl">{stats.max} kg</span></div>
        </div>
        <div className="nbt">
          <button onClick={() => navigateMonth(-1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M15 18l-6-6 6-6"/></svg></button>
          <button onClick={() => navigateMonth(1)}><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 18l6-6-6-6"/></svg></button>
        </div>
      </div>

      <div className="wmc">
        <form className="wfi" onSubmit={addEntry}>
          <input type="number" inputMode="decimal" value={newWeight} onChange={e => setNewWeight(e.target.value)}
            placeholder="Weight (kg)" className="wix2" min="0" max="100" step="0.1" />
          <input value={newNote} onChange={e => setNewNote(e.target.value)} placeholder="Note" className="wnx2" />
          <button type="submit" className="abt" disabled={!newWeight.trim()}>Add</button>
        </form>

        <div className="wbc">
          <div className="wba">
            <div className="wby">
              <span>100</span>
              <span>80</span>
              <span>60</span>
              <span>40</span>
              <span>20</span>
              <span>0</span>
            </div>
            <div className="wbg">
              <div className="wgl2" style={{ bottom: '100%' }} />
              <div className="wgl2" style={{ bottom: '80%' }} />
              <div className="wgl2" style={{ bottom: '60%' }} />
              <div className="wgl2" style={{ bottom: '40%' }} />
              <div className="wgl2" style={{ bottom: '20%' }} />
              <div className="wgl2" style={{ bottom: '0%' }} />
              <div className="wbb">
                {chartData.map((weight, i) => (
                  <div key={i} className="wbr2">
                    {weight !== null && (
                      <div className="wbf2" style={{
                        height: `${(weight / barMax) * 100}%`,
                        backgroundColor: BAR_COLOR
                      }}>
                        <span className="wbv2">{weight}</span>
                      </div>
                    )}
                    <span className="wbl2">{days[i].dayNumber}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="wls2">
          {entries.slice(0, 14).map(entry => (
            <div key={entry.id} className="wlr2">
              <span className="wdt">{entry.date}</span>
              <span className="wwt">{entry.weight} kg</span>
              {entry.note && <span className="wnt">{entry.note}</span>}
              <button onClick={() => deleteEntry(entry.id)} className="ixx dg" style={{ marginLeft: 'auto' }}>
                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18M8 6V4a2 2 0 012-2h4a2 2 0 012 2v2M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6"/></svg>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}