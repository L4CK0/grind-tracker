import React from 'react'
import { Sun, Moon, Trash2, Download, Upload, Smartphone } from 'lucide-react'
import './SettingsView.css'

export default function SettingsView({ theme, toggleTheme, clearAllData, exportData, importData }) {
  return (
    <div className="settings-view">
      <h2 className="settings-title">Beállítások</h2>
      
      <div className="settings-section">
        <h3 className="section-title">Megjelenés</h3>
        <div className="setting-card">
          <div className="setting-info">
            <div className="setting-icon">
              {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
            </div>
            <div>
              <div className="setting-name">Téma</div>
              <div className="setting-description">
                {theme === 'dark' ? 'Sötét mód' : 'Világos mód'}
              </div>
            </div>
          </div>
          <button className="theme-toggle" onClick={toggleTheme}>
            <div className={`toggle-track ${theme === 'dark' ? 'active' : ''}`}>
              <div className="toggle-thumb" />
            </div>
          </button>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Adatok kezelése</h3>
        
        <div className="setting-card clickable" onClick={exportData}>
          <div className="setting-info">
            <div className="setting-icon blue">
              <Download size={20} />
            </div>
            <div>
              <div className="setting-name">Adatok exportálása</div>
              <div className="setting-description">JSON fájl letöltése</div>
            </div>
          </div>
        </div>

        <label className="setting-card clickable">
          <div className="setting-info">
            <div className="setting-icon green">
              <Upload size={20} />
            </div>
            <div>
              <div className="setting-name">Adatok importálása</div>
              <div className="setting-description">JSON fájl betöltése</div>
            </div>
          </div>
          <input
            type="file"
            accept=".json"
            onChange={importData}
            style={{ display: 'none' }}
          />
        </label>

        <div className="setting-card clickable danger" onClick={clearAllData}>
          <div className="setting-info">
            <div className="setting-icon red">
              <Trash2 size={20} />
            </div>
            <div>
              <div className="setting-name">Összes adat törlése</div>
              <div className="setting-description">Minden feladat és előzmény törlése</div>
            </div>
          </div>
        </div>
      </div>

      <div className="settings-section">
        <h3 className="section-title">Alkalmazás</h3>
        <div className="setting-card">
          <div className="setting-info">
            <div className="setting-icon">
              <Smartphone size={20} />
            </div>
            <div>
              <div className="setting-name">PWA telepítése</div>
              <div className="setting-description">
                Böngésző menüjéből telepítheted kezdőképernyőre
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="version-info">
        GRIND Tracker v1.0
      </div>
    </div>
  )
}