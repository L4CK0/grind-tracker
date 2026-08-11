import React, { useState, useCallback, useEffect } from 'react'
import { Plus, X, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react'
import './Gallery.css'

export default function Gallery() {
  const [images, setImages] = useState([])
  const [selectedIndex, setSelectedIndex] = useState(null)

  useEffect(() => {
    const stored = localStorage.getItem('grind-gallery')
    if (stored) {
      try { setImages(JSON.parse(stored)) } catch {}
    }
  }, [])

  const saveImages = useCallback((newImages) => {
    setImages(newImages)
    try {
      const toSave = newImages.map(img => ({
        id: img.id,
        date: img.date,
        note: img.note,
        data: img.data
      }))
      localStorage.setItem('grind-gallery', JSON.stringify(toSave))
    } catch (e) {
      if (e.name === 'QuotaExceededError') {
        alert('Storage full. Delete some images.')
      }
    }
  }, [])

  const addImage = useCallback((e) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newImg = {
        id: Date.now().toString(),
        date: new Date().toISOString().split('T')[0],
        note: '',
        data: ev.target.result
      }
      saveImages([newImg, ...images])
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }, [images, saveImages])

  const deleteImage = useCallback((id) => {
    saveImages(images.filter(img => img.id !== id))
    if (selectedIndex !== null) setSelectedIndex(null)
  }, [images, saveImages, selectedIndex])

  const updateNote = useCallback((id, note) => {
    saveImages(images.map(img => img.id === id ? { ...img, note } : img))
  }, [images, saveImages])

  const closeViewer = () => setSelectedIndex(null)
  const prevImage = () => setSelectedIndex(prev => prev > 0 ? prev - 1 : images.length - 1)
  const nextImage = () => setSelectedIndex(prev => prev < images.length - 1 ? prev + 1 : 0)

  return (
    <div className="gallery">
      <div className="gallery-header">
        <h2>Gallery</h2>
        <label className="upload-btn">
          <Plus size={16} />
          <input type="file" accept="image/*" onChange={addImage} hidden />
        </label>
      </div>

      {images.length === 0 ? (
        <div className="gallery-empty">No images yet</div>
      ) : (
        <div className="gallery-grid">
          {images.map((img, index) => (
            <div key={img.id} className="gallery-item" onClick={() => setSelectedIndex(index)}>
              <img src={img.data} alt="" loading="lazy" />
            </div>
          ))}
        </div>
      )}

      {selectedIndex !== null && images[selectedIndex] && (
        <div className="viewer-overlay" onClick={closeViewer}>
          <div className="viewer-content" onClick={e => e.stopPropagation()}>
            <button className="viewer-close" onClick={closeViewer}><X size={20} /></button>
            <button className="viewer-nav prev" onClick={prevImage}><ChevronLeft size={24} /></button>
            <img src={images[selectedIndex].data} alt="" className="viewer-image" />
            <button className="viewer-nav next" onClick={nextImage}><ChevronRight size={24} /></button>
            <div className="viewer-info">
              <span className="viewer-date">{images[selectedIndex].date}</span>
              <input
                type="text"
                value={images[selectedIndex].note || ''}
                onChange={(e) => updateNote(images[selectedIndex].id, e.target.value)}
                placeholder="Add note..."
                className="viewer-note"
              />
              <button className="viewer-delete" onClick={() => deleteImage(images[selectedIndex].id)}>
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}