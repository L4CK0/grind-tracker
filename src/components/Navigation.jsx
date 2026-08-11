import React from 'react'
import { LayoutDashboard, Image, Settings } from 'lucide-react'
import './Navigation.css'

export default function Navigation({ currentView, setCurrentView }) {
  const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'settings', icon: Settings, label: 'Settings' },
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
            <Icon size={18} />
            <span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}