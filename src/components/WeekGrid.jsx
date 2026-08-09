import React from 'react'
import TaskRow from './TaskRow'
import AddTaskForm from './AddTaskForm'
import { CheckCircle2 } from 'lucide-react'
import './WeekGrid.css'

export default function WeekGrid({ tasks, weekDates, completions, toggleCompletion, addTask, deleteTask, updateTaskName }) {
  const getDayCompletion = (dateStr) => {
    let total = tasks.length
    let completed = 0
    
    tasks.forEach(task => {
      if (completions[task.id]?.[dateStr]) {
        completed++
      }
    })
    
    return total > 0 ? Math.round((completed / total) * 100) : 0
  }

  return (
    <div className="week-grid-container">
      <div className="table-wrapper">
        <table className="week-table">
          <thead>
            <tr>
              <th className="task-header">Feladat</th>
              {weekDates.map((day) => (
                <th key={day.date} className={`day-header ${day.isToday ? 'today' : ''}`}>
                  <div className="day-name">{day.dayName}</div>
                  <div className="day-number">{day.dayNumber}</div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((task) => (
              <TaskRow
                key={task.id}
                task={task}
                weekDates={weekDates}
                completions={completions[task.id] || {}}
                toggleCompletion={toggleCompletion}
                deleteTask={deleteTask}
                updateTaskName={updateTaskName}
              />
            ))}
          </tbody>
          <tfoot>
            <tr className="completion-row">
              <td className="completion-label">
                <CheckCircle2 size={14} />
                <span>Napi %</span>
              </td>
              {weekDates.map((day) => {
                const percentage = getDayCompletion(day.date)
                return (
                  <td key={day.date} className="completion-cell">
                    <div className="mini-progress">
                      <div className="mini-progress-bar" style={{ width: `${percentage}%` }} />
                    </div>
                    <span className="mini-percentage">{percentage}%</span>
                  </td>
                )
              })}
            </tr>
          </tfoot>
        </table>
      </div>
      
      <AddTaskForm addTask={addTask} />
    </div>
  )
}