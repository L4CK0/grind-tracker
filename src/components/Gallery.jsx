import React, { useState, useCallback } from 'react'
import { Plus, X, ChevronLeft, ChevronRight, Trash2, Edit2, Check } from 'lucide-react'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { formatDate } from '../utils/dateUtils'
import './Gallery.css'

export default function Gallery() {
  const [images, setImages] = useLocalStorage('grind-gallery', [])
  const [selectedIndex, setSelectedIndex] = useState(null)
  const [editingId, setEditingId] = useState(null)
  const [editNote, setEditNote] = useState('')

  const addImages = useCallback((e) => {
    const files = Array.from(e.target.files)
    files.forEach(file => {
      const reader = new FileReader()
      reader.onload = (ev) => {
        const newImg = {
          id: Date.now().toString() + Math.random().toString(36).slice(2),
          date: formatDate(new Date()),
          note: '',
          data: ev.target.result
        }
        setImages(prev => [newImg, ...prev])
      }
      reader.readAsDataURL(file)
    })
    e.target.value = ''
  }, [setImages])

  const deleteImage = useCallback((id) => {
    setImages(prev => prev.filter(img => img.id !== id))
    if (selectedIndex !== null) setSelectedIndex(null)
  }, [setImages, selectedIndex])

  const startEdit = (img) => {
    setEditingId(img.id)
    setEditNote(img.note || '')
  }

  const saveEdit = (id) => {
    setImages(prev => prev.map(img => img.id === id ? { ...img, note: editNote.trim() } : img))
    setEditingId(null)
  }

  const closeViewer = () => setSelectedIndex(null)
  const prevImage = () => setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
  const nextImage = () => setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)

  // Group by date
  const grouped = images.reduce((acc, img) => {
    if (!acc[img.date]) acc[img.date] = []
    acc[img.date].push(img)
    return acc
  }, {})

  const sortedDates = Object.keys(grouped).sort().reverse()

  return (
    <div className="gallery-root">
      {/* Header */}
      <div className="gallery-top-row">
        <div className="section-title-block">
          <h2 className="section-heading">Gallery</h2>
          <span className="section-subtitle">· Progress Photos ·</span>
        </div>
        <label className="upload-btn-sm">
          <Plus size={12} /> Add Images
          <input type="file" accept="image/*" multiple onChange={addImages} hidden />
        </label>
      </div>

      {/* Grouped Grid */}
      {sortedDates.length === 0 ? (
        <div className="empty-msg">No images yet. Upload your first photo.</div>
      ) : (
        <div className="gallery-list">
          {sortedDates.map(date => (
            <div key={date} className="date-group">
              <div className="date-divider">
                <span className="date-divider-line" />
                <span className="date-divider-text">{date}</span>
                <span className="date-divider-line" />
              </div>
              <div className="gallery-grid">
                {grouped[date].map((img, idx) => {
                  const globalIndex = images.findIndex(i => i.id === img.id)
                  return (
                    <div key={img.id} className="gallery-item" onClick={() => setSelectedIndex(globalIndex)}>
                      <img src={img.data} alt="" loading="lazy" />
                      <div className="gallery-item-overlay">
                        <button className="gallery-item-btn" onClick={(e) => { e.stopPropagation(); startEdit(img) }}>
                          <Edit2 size={10} />
                        </button>
                        <button className="gallery-item-btn danger" onClick={(e) => { e.stopPropagation(); deleteImage(img.id) }}>
                          <Trash2 size={10} />
                        </button>
                      </div>
                      {img.note && <div className="gallery-item-note">{img.note}</div>}
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Viewer */}
      {selectedIndex !== null && images[selectedIndex] && (
        <div className="viewer-overlay" onClick={closeViewer}>
          <div className="viewer-container" onClick={e => e.stopPropagation()}>
            <button className="viewer-close-btn" onClick={closeViewer}><X size={20} /></button>
            <button className="viewer-nav-btn prev" onClick={prevImage}><ChevronLeft size={20} /></button>
            <div className="viewer-image-wrap">
              <img src={images[selectedIndex].data} alt="" className="viewer-image" />
            </div>
            <button className="viewer-nav-btn next" onClick={nextImage}><ChevronRight size={20} /></button>
            <div className="viewer-bottom-bar">
              <span className="viewer-date">{images[selectedIndex].date}</span>
              {editingId === images[selectedIndex].id ? (
                <div className="viewer-edit-row">
                  <input value={editNote} onChange={e => setEditNote(e.target.value)}
                    onKeyDown={e => { if (e.key === 'Enter') saveEdit(images[selectedIndex].id) }}
                    placeholder="Add note..." className="viewer-note-input" autoFocus />
                  <button onClick={() => saveEdit(images[selectedIndex].id)} className="icon-xs save"><Check size={12} /></button>
                  <button onClick={() => setEditingId(null)} className="icon-xs"><X size={12} /></button>
                </div>
              ) : (
                <span className="viewer-note-text" onClick={() => startEdit(images[selectedIndex])}>
                  {images[selectedIndex].note || 'Add note...'}
                </span>
              )}
              <button className="viewer-delete-btn" onClick={() => deleteImage(images[selectedIndex].id)}>
                <Trash2 size={14} />
              </button>
              <span className="viewer-counter">{selectedIndex + 1} / {images.length}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}