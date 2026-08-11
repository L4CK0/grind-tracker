import React, { useState } from 'react'
import { Plus } from 'lucide-react'
import './AddTaskForm.css'

const EMOJIS = ['📈', '💻', '🏋️', '📚', '🎯', '🧘', '🎨', '🎵', '💡', '✍️', '🏃', '🍎', '💤', '🧠', '💰', '📱']

export default function AddTaskForm({ addTask }) {
  const [isOpen, setIsOpen] = useState(false)
  const [taskName, setTaskName] = useState('')
  const [selectedEmoji, setSelectedEmoji] = useState('🎯')

  const handleSubmit = (e) => {
    e.preventDefault()
    if (taskName.trim()) {
      addTask(taskName.trim(), selectedEmoji)
      setTaskName('')
      setSelectedEmoji('🎯')
      setIsOpen(false)
    }
  }

  return (
    <div className="add-task-section">
      {isOpen ? (
        <form className="add-task-form" onSubmit={handleSubmit}>
          <div className="emoji-selector">
            {EMOJIS.map(emoji => (
              <button
                key={emoji}
                type="button"
                className={`emoji-btn ${selectedEmoji === emoji ? 'selected' : ''}`}
                onClick={() => setSelectedEmoji(emoji)}
              >
                {emoji}
              </button>
            ))}
          </div>
          <div className="input-row">
            <span className="selected-emoji-display">{selectedEmoji}</span>
            <input
              type="text"
              value={taskName}
              onChange={(e) => setTaskName(e.target.value)}
              placeholder="Task name..."
              className="task-input"
              autoFocus
            />
            <button type="submit" className="submit-btn" disabled={!taskName.trim()}>Add</button>
            <button type="button" className="cancel-btn" onClick={() => setIsOpen(false)}>Cancel</button>
          </div>
        </form>
      ) : (
        <button className="add-task-btn" onClick={() => setIsOpen(true)}>
          <Plus size={14} />
          <span>Add task</span>
        </button>
      )}
    </div>
  )
}