import React from 'react'
import { Trash2, Download, Upload } from 'lucide-react'
import './SettingsView.css'

export default function SettingsView({ clearAllData, exportData, importData }) {
  return (
    <div className="settings-view">
      <h2 className="settings-title">Settings</h2>
      
      <div className="settings-group">
        <button className="setting-row" onClick={exportData}>
          <Download size={16} />
          <span>Export data</span>
        </button>
        <label className="setting-row">
          <Upload size={16} />
          <span>Import data</span>
          <input type="file" accept=".json" onChange={importData} hidden />
        </label>
        <button className="setting-row danger" onClick={clearAllData}>
          <Trash2 size={16} />
          <span>Clear all data</span>
        </button>
      </div>
      
      <div className="version">GRIND v2.0</div>
    </div>
  )
}