import React from 'react'
import { Trash2, Download, Upload } from 'lucide-react'
import './SettingsView.css'

export default function SettingsView({ clearAllData, exportData, importData }) {
  return (
    <div className="settings-root">
      <div className="section-top-row">
        <div className="section-title-block">
          <h2 className="section-heading">Settings</h2>
          <span className="section-subtitle">· Data & Backup ·</span>
        </div>
      </div>

      <div className="settings-panel">
        <button className="setting-row" onClick={exportData}>
          <Download size={14} />
          <div className="setting-text">
            <span className="setting-name">Export Data</span>
            <span className="setting-desc">Download all tasks and completions as JSON</span>
          </div>
        </button>

        <label className="setting-row">
          <Upload size={14} />
          <div className="setting-text">
            <span className="setting-name">Import Data</span>
            <span className="setting-desc">Restore from a backup file</span>
          </div>
          <input type="file" accept=".json" onChange={importData} hidden />
        </label>

        <button className="setting-row danger" onClick={clearAllData}>
          <Trash2 size={14} />
          <div className="setting-text">
            <span className="setting-name">Clear All Data</span>
            <span className="setting-desc">Reset tasks, completions, and all history</span>
          </div>
        </button>
      </div>

      <div className="version-tag">GRIND v4.0</div>
    </div>
  )
}