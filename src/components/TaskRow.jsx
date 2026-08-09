import React, { useState } from 'react'
import { Trash2, Check, Edit2, X } from 'lucide-react'
import './TaskRow.css'

export default function TaskRow({ task, weekDates, completions, toggleCompletion, deleteTask, updateTaskName }) {
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(task.name)
  const [isHovered, setIsHovered] = useState(false)

  const handleSaveEdit = () => {
    if (editValue.trim()) {
      updateTaskName(task.id, editValue.trim())
    }
    setIsEditing(false)
  }

  const handleCancelEdit = () => {
    setEditValue(task.name)
    setIsEditing(false)
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      handleSaveEdit()
    } else if (e.key === 'Escape') {
      handleCancelEdit()
    }
  }

  return (
    <tr className="task-row" onMouseEnter={() => setIsHovered(true)} onMouseLeave={() => setIsHovered(false)}>
      <td className="task-name-cell">
        {isEditing ? (
          <div className="edit-input-wrapper">
            <input
              type="text"
              value={editValue}
              onChange={(e) => setEditValue(e.target.value)}
              onKeyDown={handleKeyDown}
              className="edit-input"
              autoFocus
            />
            <button className="edit-action-btn save" onClick={handleSaveEdit}>
              <Check size={14} />
            </button>
            <button className="edit-action-btn cancel" onClick={handleCancelEdit}>
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="task-name-wrapper">
            <span className="task-name" onDoubleClick={() => setIsEditing(true)}>
              {task.name}
            </span>
            <div className={`task-actions ${isHovered ? 'visible' : ''}`}>
              <button className="action-btn edit-btn" onClick={() => setIsEditing(true)} title="Szerkesztés">
                <Edit2 size={13} />
              </button>
              <button className="action-btn delete-btn" onClick={() => {
                if (window.confirm(`Biztosan törlöd a(z) "${task.name}" feladatot?`)) {
                  deleteTask(task.id)
                }
              }} title="Törlés">
                <Trash2 size={13} />
              </button>
            </div>
          </div>
        )}
      </td>
      {weekDates.map((day) => {
        const isCompleted = completions[day.date]
        return (
          <td key={day.date} className={`checkbox-cell ${day.isToday ? 'today' : ''}`}>
            <button
              className={`checkbox-btn ${isCompleted ? 'checked' : ''}`}
              onClick={() => toggleCompletion(task.id, day.date)}
              aria-label={`${task.name} - ${day.dayName}`}
            >
              {isCompleted && <Check size={18} className="check-icon" />}
            </button>
          </td>
        )
      })}
    </tr>
  )
}