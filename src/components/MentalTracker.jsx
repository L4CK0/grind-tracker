import React, { useState, useCallback } from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate } from '../utils/dateUtils'
import './MentalTracker.css'

export default function MentalTracker() {
  const [entries, setEntries] = useLocalStorage('grind-mental', [])
  const [mood, setMood] = useState(5)
  const [motivation, setMotivation] = useState(5)
  const today = formatDate(new Date())

  const todayEntry = entries.find(e => e.date === today)
  const score = Math.round(((mood + motivation) / 20) * 100)

  const saveEntry = useCallback(() => {
    const existing = entries.find(e => e.date === today)
    if (existing) {
      setEntries(prev => prev.map(e => e.date === today ? { ...e, mood, motivation, score } : e))
    } else {
      setEntries(prev => [{ date: today, mood, motivation, score }, ...prev].slice(0, 365))
    }
  }, [today, mood, motivation, score, entries, setEntries])

  const chartEntries = [...entries].reverse().slice(-30)

  const getMoodColor = (val) => {
    if (val >= 8) return '#45cc9b'
    if (val >= 6) return '#52c9d9'
    if (val >= 4) return '#c7bfb5'
    if (val >= 2) return '#d188cd'
    return '#ef4444'
  }

  const getMotivationColor = (val) => {
    if (val >= 8) return '#7c3aed'
    if (val >= 6) return '#2234d6'
    if (val >= 4) return '#52c9d9'
    if (val >= 2) return '#d188cd'
    return '#ef4444'
  }

  return (
    <div className="mental-tracker">
      <h2 className="section-title">Mental State</h2>

      {/* Today's Input */}
      <div className="mental-card">
        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Mood</span>
            <span className="slider-value" style={{ color: getMoodColor(mood) }}>{mood}/10</span>
          </div>
          <input type="range" min="0" max="10" value={mood} onChange={e => setMood(Number(e.target.value))}
            className="slider mood-slider" style={{ '--slider-color': getMoodColor(mood) }} />
          <div className="slider-ends">
            <span>0</span><span>10</span>
          </div>
        </div>

        <div className="slider-group">
          <div className="slider-header">
            <span className="slider-label">Motivation</span>
            <span className="slider-value" style={{ color: getMotivationColor(motivation) }}>{motivation}/10</span>
          </div>
          <input type="range" min="0" max="10" value={motivation} onChange={e => setMotivation(Number(e.target.value))}
            className="slider motivation-slider" style={{ '--slider-color': getMotivationColor(motivation) }} />
          <div className="slider-ends">
            <span>0</span><span>10</span>
          </div>
        </div>

        <div className="score-display">
          <span className="score-label">Score</span>
          <span className="score-value">{score}%</span>
        </div>

        <button className="save-btn" onClick={saveEntry}>
          {todayEntry ? 'Update' : 'Save'}
        </button>
      </div>

      {/* Chart */}
      {chartEntries.length > 1 && (
        <div className="mental-card">
          <h3 className="chart-title">Trend (30 days)</h3>
          <div className="mini-chart">
            <svg viewBox="0 0 300 100" className="chart-svg" preserveAspectRatio="none">
              {/* Grid lines */}
              <line x1="0" y1="25" x2="300" y2="25" stroke="#362f2f" strokeWidth="0.5" />
              <line x1="0" y1="50" x2="300" y2="50" stroke="#362f2f" strokeWidth="0.5" />
              <line x1="0" y1="75" x2="300" y2="75" stroke="#362f2f" strokeWidth="0.5" />

              {/* Mood line */}
              <polyline
                points={chartEntries.map((e, i) => `${(i / (chartEntries.length - 1)) * 300},${100 - (e.mood / 10) * 100}`).join(' ')}
                fill="none" stroke={getMoodColor(5)} strokeWidth="2" strokeLinecap="round" />

              {/* Motivation line */}
              <polyline
                points={chartEntries.map((e, i) => `${(i / (chartEntries.length - 1)) * 300},${100 - (e.motivation / 10) * 100}`).join(' ')}
                fill="none" stroke={getMotivationColor(5)} strokeWidth="2" strokeLinecap="round" />
            </svg>
            <div className="chart-legend">
              <span style={{ color: getMoodColor(5) }}>● Mood</span>
              <span style={{ color: getMotivationColor(5) }}>● Motivation</span>
            </div>
          </div>
        </div>
      )}

      {/* History */}
      <div className="mental-card">
        <h3 className="chart-title">History</h3>
        <div className="history-list">
          {entries.slice(0, 14).map(entry => (
            <div key={entry.date} className="history-row">
              <span className="history-date">{entry.date.slice(5)}</span>
              <div className="history-bars">
                <div className="history-bar-group">
                  <span className="bar-label-mini">M</span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${entry.mood * 10}%`, backgroundColor: getMoodColor(entry.mood) }} />
                  </div>
                  <span className="bar-val">{entry.mood}</span>
                </div>
                <div className="history-bar-group">
                  <span className="bar-label-mini">V</span>
                  <div className="bar-bg">
                    <div className="bar-fill" style={{ width: `${entry.motivation * 10}%`, backgroundColor: getMotivationColor(entry.motivation) }} />
                  </div>
                  <span className="bar-val">{entry.motivation}</span>
                </div>
              </div>
              <span className="history-score">{entry.score}%</span>
            </div>
          ))}
          {entries.length === 0 && <div className="empty-text">No data yet</div>}
        </div>
      </div>
    </div>
  )
}