import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

function getColor(pct) {
  if (pct < 40) return '#2ecc71'
  if (pct < 60) return '#f39c12'
  return '#e74c3c'
}

function MiniGauge({ pct, color }) {
  return (
    <div className="flex items-center gap-3">
      <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
        <motion.div className="h-full rounded-full" style={{ background: color }}
          animate={{ width: `${pct}%` }} transition={{ duration: 0.5, ease: 'easeOut' }} />
      </div>
      <span className="text-lg font-bold w-12 text-right" style={{ color }}>{pct}%</span>
    </div>
  )
}

export default function WhatIfSimulator({ initialForm, currentProbability }) {
  const [form, setForm]     = useState({ ...initialForm })
  const [simPct, setSimPct] = useState(Math.round(currentProbability * 100))
  const [loading, setLoading] = useState(false)
  const [error, setError]   = useState(null)
  const debounceRef = useRef(null)
  const basePct = Math.round(currentProbability * 100)
  const diff    = simPct - basePct

  const runPrediction = async (newForm) => {
    setLoading(true); setError(null)
    try {
      const res = await fetch('/api/predict', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newForm) })
      if (!res.ok) { const err = await res.json().catch(() => ({ detail: `HTTP ${res.status}` })); throw new Error(err.detail || `HTTP ${res.status}`) }
      const data = await res.json()
      setSimPct(Math.round(data.probability * 100))
    } catch (e) { setError(e.message) } finally { setLoading(false) }
  }

  const update = (name, value) => {
    const updated = { ...form, [name]: value }
    setForm(updated)
    clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => runPrediction(updated), 700)
  }

  const color = getColor(simPct)
  const sliderBg = (val, min, max) =>
    `linear-gradient(to right,#0ECECE 0%,#0ECECE ${((val - min) / (max - min)) * 100}%,rgba(255,255,255,0.1) ${((val - min) / (max - min)) * 100}%,rgba(255,255,255,0.1) 100%)`

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-1">
        <h2 className="text-lg font-semibold text-white">What-If Simulator</h2>
        <span className="text-xs text-slate-400 bg-white/10 px-2 py-1 rounded-lg">Live re-calculation</span>
      </div>
      <p className="text-sm text-slate-400 mb-6">Adjust key factors and see how your risk changes in real-time</p>

      {error && (
        <div className="mb-4 bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-xs text-red-400">
          ⚠️ API error: {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-6">
          <div className="rounded-xl p-3 text-xs" style={{ background: 'rgba(251,191,36,0.1)', border: '1px solid rgba(251,191,36,0.25)', color: '#fbbf24' }}>
            💡 These 3 features have the highest impact on your risk score based on the model's learned patterns.
          </div>

          {[
            { key: 'challenging',    label: 'Remote work feels challenging',      lo: 'Not at all',     hi: 'Very challenging',   note: '⬆️ Most impactful — up to ±35% change', noteColor: '#e74c3c' },
            { key: 'less_productive',label: 'I feel less productive working remotely', lo: 'Very productive', hi: 'Very unproductive', note: '⬆️ Up to ±27% change', noteColor: '#e74c3c' },
            { key: 'prefer_remote',  label: 'I prefer remote over office work',   lo: 'Hate remote',    hi: 'Love remote',        note: '⬇️ Higher = lower risk — up to ±26% change', noteColor: '#2ecc71' },
          ].map(({ key, label, lo, hi, note, noteColor }) => (
            <div key={key}>
              <label className="text-sm font-medium text-slate-300 flex justify-between mb-1">
                <span>{label}</span>
                <span className="font-semibold" style={{ color: '#0ECECE' }}>{form[key]}/7</span>
              </label>
              <div className="flex justify-between text-xs text-slate-500 mb-1"><span>{lo}</span><span>{hi}</span></div>
              <input type="range" min={1} max={7} step={1} value={form[key]}
                onChange={e => update(key, Number(e.target.value))} className="w-full"
                style={{ background: sliderBg(form[key], 1, 7) }} />
              <p className="text-xs mt-1" style={{ color: noteColor }}>{note}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col justify-center">
          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-center">
            <div className="text-xs text-slate-400 uppercase tracking-wide mb-3">
              {loading ? 'Recalculating…' : 'Simulated Risk'}
            </div>
            <div className="relative inline-flex items-center justify-center mb-4">
              <svg width="120" height="120" viewBox="0 0 120 120">
                <circle cx="60" cy="60" r="50" fill="none" stroke="#1e293b" strokeWidth="10" />
                <motion.circle cx="60" cy="60" r="50" fill="none" stroke={loading ? '#334155' : color}
                  strokeWidth="10" strokeLinecap="round" strokeDasharray={`${2 * Math.PI * 50}`}
                  animate={{ strokeDashoffset: 2 * Math.PI * 50 * (1 - simPct / 100) }}
                  transition={{ duration: 0.5 }}
                  style={{ transformOrigin: '60px 60px', transform: 'rotate(-90deg)' }} />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-2xl font-extrabold" style={{ color: loading ? '#475569' : color }}>
                  {loading ? '…' : `${simPct}%`}
                </span>
              </div>
            </div>

            <AnimatePresence mode="wait">
              {diff !== 0 && !loading && (
                <motion.div key={diff} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="text-sm font-semibold mb-2" style={{ color: diff > 0 ? '#e74c3c' : '#2ecc71' }}>
                  {diff > 0 ? `↑ +${diff}% vs your baseline` : `↓ ${diff}% vs your baseline`}
                </motion.div>
              )}
            </AnimatePresence>

            {diff < -5 && !loading && (
              <div className="text-xs rounded-lg p-2 mt-2" style={{ color: '#2ecc71', background: 'rgba(46,204,113,0.1)', border: '1px solid rgba(46,204,113,0.25)' }}>
                💡 These changes reduce your risk from <strong>{basePct}%</strong> to <strong>{simPct}%</strong>
              </div>
            )}
            {diff > 5 && !loading && (
              <div className="text-xs rounded-lg p-2 mt-2" style={{ color: '#e74c3c', background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.25)' }}>
                ⚠️ These changes raise your risk from <strong>{basePct}%</strong> to <strong>{simPct}%</strong>
              </div>
            )}

            <div className="mt-4 space-y-1">
              <MiniGauge pct={basePct} color="#475569" />
              <div className="text-xs text-slate-500 text-left mb-2">Your baseline</div>
              <MiniGauge pct={simPct} color={loading ? '#334155' : color} />
              <div className="text-xs text-slate-500 text-left">Simulated</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
