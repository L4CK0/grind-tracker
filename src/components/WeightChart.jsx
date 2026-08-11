import React from 'react'
import './WeightChart.css'

export default function WeightChart({ entries }) {
  if (entries.length < 2) {
    return <div className="chart-empty">Add at least 2 entries to see chart</div>
  }

  const sorted = [...entries].reverse()
  const weights = sorted.map(e => e.weight)
  const min = Math.min(...weights)
  const max = Math.max(...weights)
  const range = max - min || 1
  const height = 160
  const width = 100
  const padding = 10

  const points = sorted.map((e, i) => {
    const x = padding + (i / (sorted.length - 1)) * (width - 2 * padding)
    const y = padding + ((max - e.weight) / range) * (height - 2 * padding)
    return `${x},${y}`
  }).join(' ')

  const areaPoints = `0,${height} ${points} ${width},${height}`

  return (
    <div className="weight-chart-container">
      <svg viewBox={`0 0 ${width} ${height}`} className="weight-chart" preserveAspectRatio="none">
        <polygon points={areaPoints} fill="rgba(167, 139, 250, 0.06)" />
        <polyline points={points} fill="none" stroke="#a78bfa" strokeWidth="0.8" strokeLinecap="round" strokeLinejoin="round" />
        {sorted.map((e, i) => {
          const x = padding + (i / (sorted.length - 1)) * (width - 2 * padding)
          const y = padding + ((max - e.weight) / range) * (height - 2 * padding)
          return i === 0 || i === sorted.length - 1 ? (
            <circle key={e.id} cx={x} cy={y} r="1.2" fill="#a78bfa" />
          ) : null
        })}
      </svg>
      <div className="chart-labels">
        <span>{sorted[0]?.weight} kg</span>
        <span>{sorted[sorted.length - 1]?.weight} kg</span>
      </div>
    </div>
  )
}