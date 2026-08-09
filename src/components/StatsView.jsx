import React from 'react'
import { TrendingUp, Target, Zap, Award, CheckCircle2, Calendar } from 'lucide-react'
import './StatsView.css'

export default function StatsView({ stats, tasks, completions }) {
  const monthlyPercentage = stats.monthlyTotal > 0 
    ? Math.round((stats.monthlyCompleted / stats.monthlyTotal) * 100) 
    : 0

  const getMostCompletedTask = () => {
    let maxCompletions = 0
    let maxTask = null

    tasks.forEach(task => {
      const count = Object.keys(completions[task.id] || {}).length
      if (count > maxCompletions) {
        maxCompletions = count
        maxTask = task
      }
    })

    return maxTask
  }

  const mostCompletedTask = getMostCompletedTask()
  const today = new Date()
  const todayStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
  
  const todayCompletions = tasks.filter(task => completions[task.id]?.[todayStr]).length
  const todayPercentage = tasks.length > 0 ? Math.round((todayCompletions / tasks.length) * 100) : 0

  return (
    <div className="stats-view">
      <h2 className="stats-title">Statisztikák</h2>
      
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <CheckCircle2 size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{todayPercentage}%</span>
            <span className="stat-label">Mai teljesítés</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <Calendar size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{monthlyPercentage}%</span>
            <span className="stat-label">Havi teljesítés</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper yellow">
            <Zap size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.currentStreak}</span>
            <span className="stat-label">Aktuális streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper purple">
            <Award size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.longestStreak}</span>
            <span className="stat-label">Leghosszabb streak</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper green">
            <Target size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{stats.totalCompletions}</span>
            <span className="stat-label">Összes teljesítés</span>
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-icon-wrapper blue">
            <TrendingUp size={24} />
          </div>
          <div className="stat-content">
            <span className="stat-value">{mostCompletedTask?.name || '-'}</span>
            <span className="stat-label">Legtöbbet végzett</span>
          </div>
        </div>
      </div>

      <div className="daily-breakdown">
        <h3>Napi bontás (aktuális hét)</h3>
        <div className="breakdown-list">
          {Object.entries(stats.dailyCompletions).map(([date, data]) => {
            const dateObj = new Date(date)
            const dayNames = ['Vasárnap', 'Hétfő', 'Kedd', 'Szerda', 'Csütörtök', 'Péntek', 'Szombat']
            return (
              <div key={date} className="breakdown-item">
                <div className="breakdown-header">
                  <span className="breakdown-day">{dayNames[dateObj.getDay()]}</span>
                  <span className="breakdown-percentage">{data.percentage}%</span>
                </div>
                <div className="breakdown-bar-container">
                  <div className="breakdown-bar" style={{ width: `${data.percentage}%` }} />
                </div>
                <span className="breakdown-detail">
                  {data.completed}/{data.total} feladat
                </span>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}