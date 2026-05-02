import { motion } from 'framer-motion'
import { useEffect, useState } from 'react'

function getColor(pct) {
  if (pct < 40) return '#2ecc71'
  if (pct < 60) return '#f39c12'
  return '#e74c3c'
}

function getLabel(pct) {
  if (pct < 30) return 'Very Low Risk'
  if (pct < 50) return 'Low Risk'
  if (pct < 65) return 'Moderate Risk'
  if (pct < 80) return 'High Risk'
  return 'Very High Risk'
}

export default function RiskGauge({ probability, isHigh }) {
  const pct = Math.round(probability * 100)
  const color = getColor(pct)
  const label = getLabel(pct)

  const size = 220
  const cx = size / 2
  const cy = size / 2 + 20
  const r = 80
  const startAngle = -210
  const totalSweep = 240

  function polarToXY(angleDeg, radius) {
    const rad = (angleDeg * Math.PI) / 180
    return { x: cx + radius * Math.cos(rad), y: cy + radius * Math.sin(rad) }
  }

  function describeArc(startDeg, endDeg) {
    const s = polarToXY(startDeg, r)
    const e = polarToXY(endDeg, r)
    const largeArc = endDeg - startDeg > 180 ? 1 : 0
    return `M ${s.x} ${s.y} A ${r} ${r} 0 ${largeArc} 1 ${e.x} ${e.y}`
  }

  const [animPct, setAnimPct] = useState(0)
  useEffect(() => {
    const t = setTimeout(() => setAnimPct(pct), 100)
    return () => clearTimeout(t)
  }, [pct])

  const fillAngle = startAngle + (animPct / 100) * totalSweep
  const needleAngle = startAngle + (pct / 100) * totalSweep
  const needleEnd = polarToXY(needleAngle, r - 10)
  const needleBase1 = polarToXY(needleAngle + 90, 6)
  const needleBase2 = polarToXY(needleAngle - 90, 6)

  return (
    <div className="card flex flex-col items-center">
      <h2 className="text-lg font-semibold text-white mb-4">Overall Burnout Risk</h2>

      <svg width={size} height={size * 0.75} viewBox={`0 0 ${size} ${size * 0.75}`}>
        <path d={describeArc(startAngle, startAngle + totalSweep)} fill="none" stroke="#1e293b" strokeWidth={18} strokeLinecap="round" />
        <defs>
          <linearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#2ecc71" />
            <stop offset="50%" stopColor="#f39c12" />
            <stop offset="100%" stopColor="#e74c3c" />
          </linearGradient>
        </defs>
        <motion.path d={describeArc(startAngle, fillAngle)} fill="none" stroke={color} strokeWidth={18} strokeLinecap="round"
          initial={{ pathLength: 0 }} animate={{ pathLength: 1 }} transition={{ duration: 1.2, ease: 'easeOut' }} />
        <motion.polygon points={`${needleBase1.x},${needleBase1.y} ${needleBase2.x},${needleBase2.y} ${needleEnd.x},${needleEnd.y}`}
          fill={color} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }} />
        <circle cx={cx} cy={cy} r={8} fill={color} />
        <circle cx={cx} cy={cy} r={4} fill="white" />
        <text x={polarToXY(startAngle, r + 18).x} y={polarToXY(startAngle, r + 18).y} textAnchor="middle" fontSize="10" fill="#64748b">0%</text>
        <text x={polarToXY(startAngle + totalSweep, r + 18).x} y={polarToXY(startAngle + totalSweep, r + 18).y} textAnchor="middle" fontSize="10" fill="#64748b">100%</text>
        <text x={cx} y={polarToXY(startAngle + totalSweep / 2, r + 22).y} textAnchor="middle" fontSize="9" fill="#64748b">50%</text>
      </svg>

      <motion.div className="text-center mt-2" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.6, duration: 0.4 }}>
        <div className="text-5xl font-extrabold" style={{ color }}>{pct}%</div>
        <div className="text-base font-semibold mt-1" style={{ color }}>{label}</div>
        <div className="text-sm text-slate-400 mt-2 max-w-xs text-center">
          You have a <strong className="text-white">{pct}% chance</strong> of High Burnout Risk based on your profile.
        </div>
      </motion.div>
    </div>
  )
}
