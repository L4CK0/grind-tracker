import React from 'react'
import { LayoutDashboard, BarChart3, Settings } from 'lucide-react'
import './Navigation.css'

export default function Navigation({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'stats', icon: BarChart3, label: 'Statisztikák' },
    { id: 'settings', icon: Settings, label: 'Beállítások' },
  ]

  return (
    <nav className="bottom-nav">
      {navItems.map((item) => {
        const Icon = item.icon
        const isActive = currentView === item.id
        
        return (
          <button
            key={item.id}
            className={`nav-item ${isActive ? 'active' : ''}`}
            onClick={() => setCurrentView(item.id)}
          >
            <Icon size={22} />
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}