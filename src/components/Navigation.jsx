import React from 'react'
import { LayoutDashboard, Weight, Image, Settings } from 'lucide-react'
import './Navigation.css'

export default function Navigation({ currentView, setCurrentView }) {
  const items = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'weight', icon: Weight, label: 'Body' },
    { id: 'gallery', icon: Image, label: 'Gallery' },
    { id: 'settings', icon: Settings, label: 'Settings' },
  ]
  return (
    <nav className="bottom-nav">
      {items.map(item => {
        const Icon = item.icon
        return (
          <button key={item.id} className={`nav-item ${currentView === item.id ? 'active' : ''}`} onClick={() => setCurrentView(item.id)}>
            <Icon size={18} /><span className="nav-label">{item.label}</span>
          </button>
        )
      })}
    </nav>
  )
}