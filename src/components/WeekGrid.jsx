import React, { useState } from 'react'
import { Plus, ChevronLeft, ChevronRight, Edit2, Trash2, Check, X } from 'lucide-react'
import { getMonthName } from '../utils/dateUtils'
import './WeekGrid.css'

const WC = ['#8b5cf6', '#60a5fa', '#4fd1c5', '#f472b6', '#2dd4bf']
const MAX = 20

export default function WeekGrid({ tasks, days, completions, toggleCompletion, addTask, deleteTask, updateTaskName, kpi, navigateMonth, currentMonth, today }) {
  const [showAdd, setShowAdd] = useState(false)
  const [newName, setNewName] = useState('')
  const [newEmoji, setNewEmoji] = useState('')
  const [editingTask, setEditingTask] = useState(null)
  const [editValue, setEditValue] = useState('')

  const weekGroups = []
  for (let i = 0; i < days.length; i += 7) weekGroups.push(days.slice(i, Math.min(i + 7, days.length)))

  const handleAdd = (e) => {
    e.preventDefault()
    if (tasks.length >= MAX) { alert('Max 20'); return }
    if (newName.trim()) { addTask(newName.trim(), newEmoji || '📌'); setNewName(''); setNewEmoji(''); setShowAdd(false) }
  }

  const getTaskStats = (taskId) => {
    let done = 0
    days.forEach(day => { if (completions[taskId]?.[day.date]) done++ })
      const pct = days.length > 0 ? Math.round((done / days.length) * 100) : 0
    return { done, total: days.length, pct }
  }

  return (
    <div className="dr">
      {/* TOP HEADER */}
      <div className="th">
        <div className="tbl">
          <h1 className="mtt">{getMonthName(currentMonth)}</h1>
          <span className="subt">· Habit Tracker ·</span>
        </div>
        <div className="kpb">
          <div className="kpi"><span className="klb">HABITS</span><span className="kvl">{kpi.habits}</span></div>
          <div className="kpi"><span className="klb">DONE</span><span className="kvl">{kpi.done}</span></div>
          <div className="kpi kprg">
            <span className="klb">PROGRESS</span>
            <div className="pbw"><div className="pbf" style={{ width: `${kpi.pct}%` }} /></div>
          </div>
          <div className="kpi"><span className="klb">%</span><span className="kvl">{kpi.pct}%</span></div>
        </div>
        <div className="nbt">
          <button onClick={() => navigateMonth(-1)}><ChevronLeft size={16} /></button>
          <button onClick={() => navigateMonth(1)}><ChevronRight size={16} /></button>
        </div>
      </div>

      {/* MAIN TRACKER */}
      <div className="mtr">
        {/* HABIT NAMES + STATS */}
        <div className="hnp">
          <div className="hnh">My Habits</div>
          {tasks.map(task => {
            const stats = getTaskStats(task.id)
            return (
              <div key={task.id} className="hnrw">
                <div className="hnr">
                  {editingTask === task.id ? (
                    <div className="ei"><input value={editValue} onChange={e => setEditValue(e.target.value)} onKeyDown={e => { if (e.key === 'Enter') { updateTaskName(task.id, editValue.trim()); setEditingTask(null) } if (e.key === 'Escape') setEditingTask(null) }} className="eix" autoFocus /><button onClick={() => { updateTaskName(task.id, editValue.trim()); setEditingTask(null) }} className="ix s"><Check size={10} /></button><button onClick={() => setEditingTask(null)} className="ix"><X size={10} /></button></div>
                  ) : (
                    <div className="hnw">
                      <span className="hnt" onDoubleClick={() => { setEditingTask(task.id); setEditValue(task.name) }}>{task.name}</span>
                      <div className="ha"><button onClick={() => { setEditingTask(task.id); setEditValue(task.name) }} className="ixx"><Edit2 size={9} /></button><button onClick={() => { if (window.confirm('Delete?')) deleteTask(task.id) }} className="ixx dg"><Trash2 size={9} /></button></div>
                    </div>
                  )}
                </div>
                <div className="hst">
                  <span className="hstx">Prog: {stats.pct}%</span>
                  <span className="hstx">Done: {stats.done}</span>
                </div>
              </div>
            )
          })}
        </div>

        {/* WEEK GRID */}
        <div className="wgp">
          <div className="wgs">
            <table className="htt">
              <thead>
                <tr>
                  {weekGroups.map((week, wi) => (
                    <th key={wi} colSpan={week.length} className="whc" style={{ backgroundColor: WC[wi] }}>
                      <span className="wht">Week {wi + 1}</span>
                    </th>
                  ))}
                </tr>
                <tr>
                  {days.map((day, di) => {
                    const wi = Math.min(Math.floor(di / 7), 4)
                    return (
                      <th key={day.date} className={`dhc ${day.isToday ? 'tdy' : ''}`} style={{ borderBottomColor: WC[wi] }}>
                        <span className="dhn">{day.dayName}</span>
                        <span className="dhn2">{day.dayNumber}</span>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {tasks.map(task => (
                  <tr key={task.id} className="htr">
                    {days.map((day, di) => {
                      const isChecked = completions[task.id]?.[day.date]
                      const wi = Math.min(Math.floor(di / 7), 4)
                      return (
                        <td key={day.date} className={`ctd ${day.isToday ? 'tdy' : ''}`}>
                          <button className={`cbt ${isChecked ? 'dn' : ''}`}
                            style={isChecked ? { backgroundColor: WC[wi] } : { borderColor: WC[wi] + '80' }}
                            onClick={() => toggleCompletion(task.id, day.date)}>
                            {isChecked && <Check size={8} strokeWidth={3} />}
                          </button>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* ANALYSIS */}
        <div className="anp">
          <div className="anh">Analysis</div>
          {tasks.map(task => {
            const stats = getTaskStats(task.id)
            return (
              <div key={task.id} className="anr">
<span className="ant">{task.emoji || task.name.charAt(0)}</span>
                <div className="anbw"><div className="anbf" style={{ width: `${stats.pct}%` }} /></div>
                <span className="anpc">{stats.pct}%</span>
              </div>
            )
          })}
        </div>
      </div>

      {/* ADD TASK */}
      <div className="ads">
        {showAdd ? (
          <form className="adf" onSubmit={handleAdd}>
            <input value={newEmoji} onChange={e => setNewEmoji(e.target.value)} placeholder="📌" className="aei" maxLength={2} />
            <input value={newName} onChange={e => setNewName(e.target.value)} placeholder="Task name..." className="ani" autoFocus />
            <button type="submit" className="abt" disabled={!newName.trim()}>Add</button>
            <button type="button" className="cbtx" onClick={() => setShowAdd(false)}>Cancel</button>
          </form>
        ) : (
          <button className="atg" onClick={() => { if (tasks.length >= MAX) { alert('Max 20'); return } setShowAdd(true) }}><Plus size={12} /> Add task</button>
        )}
      </div>
    </div>
  )
}