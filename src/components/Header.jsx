import React from 'react'
import { ChevronLeft, ChevronRight, Calendar } from 'lucide-react'
import { getMonthName, getWeekNumber } from '../utils/dateUtils'
import './Header.css'

export default function Header({ weeklyPercentage, weekDates, navigateWeek, resetToCurrentWeek, currentWeekStart }) {
  const isCurrentWeek = () => {
    const today = new Date()
    const currentMonday = new Date(today)
    const day = today.getDay()
    const diff = today.getDate() - day + (day === 0 ? -6 : 1)
    currentMonday.setDate(diff)
    currentMonday.setHours(0, 0, 0, 0)
    
    const weekStart = new Date(currentWeekStart)
    weekStart.setHours(0, 0, 0, 0)
    
    return currentMonday.getTime() === weekStart.getTime()
  }

  return (
    <header className="header">
      <div className="header-top">
        <h1 className="logo">GRIND</h1>
        <div className="month-display">
          <Calendar size={16} />
          <span>{getMonthName(currentWeekStart)}</span>
        </div>
      </div>
      
      <div className="week-navigation">
        <button className="nav-btn" onClick={() => navigateWeek(-1)} aria-label="Előző hét">
          <ChevronLeft size={20} />
        </button>
        
        <div className="week-info">
          <span className="week-label">{weekDates[0]?.dayNumber}. - {weekDates[6]?.dayNumber}.</span>
          <span className="week-number">{getWeekNumber(currentWeekStart)}. hét</span>
        </div>
        
        <button className="nav-btn" onClick={() => navigateWeek(1)} aria-label="Következő hét">
          <ChevronRight size={20} />
        </button>
      </div>
      
      <div className="progress-section">
        <div className="progress-bar-container">
          <div className="progress-bar" style={{ width: `${weeklyPercentage}%` }} />
        </div>
        <div className="progress-text">
          <span className="progress-label">Heti teljesítmény</span>
          <span className="progress-value">{weeklyPercentage}%</span>
        </div>
      </div>
      
      {!isCurrentWeek() && (
        <button className="today-btn" onClick={resetToCurrentWeek}>
          Vissza a mai hétre
        </button>
      )}
    </header>
  )
}