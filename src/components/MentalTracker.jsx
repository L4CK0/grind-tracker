import React from 'react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import './MentalTracker.css'

const WC = ['#8b5cf6', '#60a5fa', '#4fd1c5', '#f472b6', '#2dd4bf']

export default function MentalTracker({ days }) {
  const [entries, setEntries] = useLocalStorage('grind-mental', [])

  const getEntry = (date) => entries.find(e => e.date === date) || { mood: '', motivation: '' }

  const updateCell = (date, field, value) => {
    const v = value === '' ? '' : Math.max(0, Math.min(10, parseInt(value) || 0))
    setEntries(prev => {
      const existing = prev.find(e => e.date === date)
      if (existing) {
        const updated = { ...existing, [field]: v, score: ((field === 'mood' ? v : existing.mood) + (field === 'motivation' ? v : existing.motivation)) * 5 }
        return prev.map(e => e.date === date ? updated : e)
      }
      if (v === '') return prev
      const newEntry = { date, mood: '', motivation: '', score: 0 }
      newEntry[field] = v
      newEntry.score = (newEntry.mood + newEntry.motivation) * 5
      return [newEntry, ...prev]
    })
  }

  const chartEntries = [...entries].reverse().slice(-30).filter(e => e.mood !== '' && e.motivation !== '')

  const weekGroups = []
  for (let i = 0; i < days.length; i += 7) weekGroups.push(days.slice(i, Math.min(i + 7, days.length)))

  return (
    <div className="dr">
      <div className="th">
        <div className="tbl"><h2 className="mtt">Mental State</h2><span className="subt">· Mindset ·</span></div>
      </div>

      <div className="mtr">
        <div className="hnp">
          <div className="hnh">Metrics</div>
          <div className="hnr"><span className="hnt" style={{ color: '#60d5d1' }}>Mood</span></div>
          <div className="hnr"><span className="hnt" style={{ color: '#7ea6e8' }}>Motivation</span></div>
          <div className="hnr"><span className="hnt">Score</span></div>
        </div>
        <div className="wgp">
          <div className="wgs">
            <table className="htt">
              <thead>
                <tr>
                  {weekGroups.map((week, wi) => (
                    <th key={wi} colSpan={week.length} className="whc" style={{ backgroundColor: WC[wi] }}>
                      <span className="wht">Week {wi + 1}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map((day, di) => {
                    const wi = Math.min(Math.floor(di / 7), 4)
                    return (
                      <th key={day.date} className={`dhc ${day.isToday ? 'tdy' : ''}`} style={{ borderBottomColor: WC[wi] }}>
                        <span className="dhn">{day.dayName}</span>
                        <span className="dhn2">{day.dayNumber}</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {['Mood', 'Motivation', 'Score'].map(metric => (
                  <tr key={metric} className="htr">
                    {days.map((day, di) => {
                      const entry = getEntry(day.date)
                      const wi = Math.min(Math.floor(di / 7), 4)
                      if (metric === 'Score') {
                        const s = entry.mood !== '' && entry.motivation !== '' ? (entry.mood + entry.motivation) * 5 : ''
                        return (
                          <td key={day.date} className="ctd">
                            <span style={{ fontSize: '8px', color: s !== '' ? WC[wi] : '#3a4058', fontWeight: 700 }}>{s !== '' ? s + '%' : ''}</span>
                          </td>
                        )
                      }
                      const val = metric === 'Mood' ? entry.mood : entry.motivation
                      return (
                        <td key={day.date} className="ctd">
                          <input type="number" min="0" max="10" value={val}
                            onChange={e => updateCell(day.date, metric.toLowerCase(), e.target.value)}
                            className="mci" style={{ color: val !== '' ? (metric === 'Mood' ? '#60d5d1' : '#7ea6e8') : '#3a4058' }} placeholder="" />
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        <div className="anp">
          <div className="anh">Analysis</div>
          {weekGroups.map((week, wi) => {
            const we = week.map(day => getEntry(day.date)).filter(e => e.mood !== '' && e.motivation !== '')
            const avg = we.length > 0 ? Math.round(we.reduce((sum, e) => sum + ((e.mood + e.motivation) * 5), 0) / we.length) : 0
            return (
              <div key={wi} className="anr">
                <span className="ant">Week {wi + 1}</span>
                <div className="anbw"><div className="anbf" style={{ width: `${avg}%`, background: WC[wi] }} /></div>
                <span className="anpc">{avg}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {chartEntries.length > 1 && (
        <div className="chp">
          <div className="chy"><span>10</span><span>5</span><span>0</span></div>
          <div className="cha">
            <svg viewBox="0 0 600 100" className="chsv" preserveAspectRatio="none">
              <polyline points={chartEntries.map((e, i) => `${(i / (chartEntries.length - 1)) * 600},${100 - (e.mood / 10) * 100}`).join(' ')}
                fill="none" stroke="#60d5d1" strokeWidth="1" strokeLinecap="round" />
              {chartEntries.map((e, i) => <circle key={`m-${i}`} cx={(i / (chartEntries.length - 1)) * 600} cy={100 - (e.mood / 10) * 100} r="1.5" fill="#60d5d1" />)}
              <polyline points={chartEntries.map((e, i) => `${(i / (chartEntries.length - 1)) * 600},${100 - (e.motivation / 10) * 100}`).join(' ')}
                fill="none" stroke="#7ea6e8" strokeWidth="1" strokeLinecap="round" />
              {chartEntries.map((e, i) => <circle key={`v-${i}`} cx={(i / (chartEntries.length - 1)) * 600} cy={100 - (e.motivation / 10) * 100} r="1.5" fill="#7ea6e8" />)}
            </svg>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', marginTop: 4 }}>
              <span style={{ color: '#60d5d1', fontSize: '9px', fontWeight: 600 }}>● Mood</span>
              <span style={{ color: '#7ea6e8', fontSize: '9px', fontWeight: 600 }}>● Motivation</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}