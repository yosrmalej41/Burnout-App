import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRO_FEATURES = [
  {
    id: 'shap_full', icon: '🧠', title: 'Full SHAP Report', color: '#6366f1',
    description: 'See all 15 factors explained in depth — what pushed your score up, what pulled it down, and by exactly how much.',
    mockContent: (
      <div className="space-y-2 mt-4">
        {['Remote work challenges','Productivity feelings','Commute impact','Preferred work mode','Schedule flexibility','Work location changes','Employment type','Healthcare access','Years of experience','Park access','Leisure access','Age x Commute','Student status','Commute squared','Coworking preferences'].map((f, i) => (
          <div key={i} className="flex items-center gap-2">
            <div className="w-24 text-xs text-slate-400 text-right truncate">{f}</div>
            <div className="flex-1 h-3 bg-white/10 rounded-full overflow-hidden">
              <div className="h-full rounded-full" style={{ width: `${Math.random() * 80 + 10}%`, background: i % 2 === 0 ? '#e74c3c' : '#2ecc71', opacity: 0.7 }} />
            </div>
          </div>
        ))}
      </div>
    ),
  },
  {
    id: 'trajectory', icon: '📈', title: 'Burnout Trajectory', color: '#f39c12',
    description: 'Based on your profile, predict where your burnout risk is heading over the next 6 months if nothing changes.',
    mockContent: (
      <div className="mt-4">
        <div className="flex items-end gap-1 h-24">
          {[40,45,52,58,65,71,78].map((v, i) => (
            <div key={i} className="flex-1 flex flex-col items-center gap-1">
              <div className="w-full rounded-t" style={{ height: `${v}%`, background: v < 50 ? '#2ecc71' : v < 65 ? '#f39c12' : '#e74c3c', opacity: 0.75 }} />
              <span className="text-xs text-slate-400">{['Now','+1m','+2m','+3m','+4m','+5m','+6m'][i]}</span>
            </div>
          ))}
        </div>
        <p className="text-xs text-red-400 mt-3 font-medium">⚠️ Without intervention, risk may reach 78% in 6 months.</p>
      </div>
    ),
  },
  {
    id: 'team_pdf', icon: '📋', title: 'Team PDF Export', color: '#2ecc71',
    description: 'Generate a professional report to share anonymously with your manager or HR team.',
    mockContent: (
      <div className="mt-4 bg-white/5 rounded-xl border border-white/10 p-4">
        <div className="flex items-center gap-2 mb-3">
          <div className="w-8 h-8 bg-[#2c3e50] rounded flex items-center justify-center text-white text-xs font-bold">BR</div>
          <div>
            <div className="text-xs font-bold text-white">Burnout Risk Report</div>
            <div className="text-xs text-slate-400">Anonymous · Confidential</div>
          </div>
        </div>
        <div className="space-y-1">
          {['Overall Risk Score','Top 3 Risk Factors','Recommended Actions','Population Comparison'].map((l, i) => (
            <div key={i} className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-500" />
              <span className="text-xs text-slate-400">{l}</span>
            </div>
          ))}
        </div>
        <button className="mt-3 w-full bg-[#2c3e50] text-white text-xs py-2 rounded-lg font-medium">Download PDF Report</button>
      </div>
    ),
  },
  {
    id: 'face_analysis', icon: '🤳', title: 'Face Stress Analysis', color: '#8b5cf6',
    description: 'Upload a photo and our AI analyses your facial expressions, eye fatigue, and micro-expressions.',
    mockContent: (
      <div className="mt-4 space-y-3">
        <div className="border-2 border-dashed rounded-xl p-4 text-center" style={{ borderColor: 'rgba(139,92,246,0.4)', background: 'rgba(139,92,246,0.08)' }}>
          <div className="text-3xl mb-2">📷</div>
          <p className="text-xs font-medium" style={{ color: '#a78bfa' }}>Drop your photo here</p>
          <p className="text-xs text-slate-400 mt-1">or click to upload · JPG / PNG · Max 5MB</p>
        </div>
        <div className="grid grid-cols-3 gap-2">
          {['Eye fatigue','Jaw tension','Micro-stress'].map((label, i) => (
            <div key={i} className="rounded-lg p-2 text-center" style={{ background: 'rgba(139,92,246,0.1)' }}>
              <div className="text-lg mb-1">{['👁️','😤','😰'][i]}</div>
              <div className="text-xs font-medium" style={{ color: '#a78bfa' }}>{label}</div>
              <div className="text-xs text-slate-400">Analysing…</div>
            </div>
          ))}
        </div>
        <p className="text-xs text-slate-400 text-center">🔒 Photos are never stored · Processed locally</p>
      </div>
    ),
  },
]

function ProCard({ feature, trials, onUse }) {
  const [unlocked, setUnlocked] = useState(false)
  const [showModal, setShowModal] = useState(false)

  const handleClick = () => {
    if (unlocked) return
    if (trials <= 0) { setShowModal(true); return }
    onUse(); setUnlocked(true)
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="relative rounded-2xl overflow-hidden border-2"
        style={{ borderColor: unlocked ? feature.color : 'rgba(255,255,255,0.1)' }}>
        <div className={`p-5 transition-all duration-500 ${unlocked ? '' : 'blur-sm select-none pointer-events-none'}`}>
          <div className="text-2xl mb-2">{feature.icon}</div>
          <h3 className="font-bold text-white mb-1">{feature.title}</h3>
          <p className="text-xs text-slate-400 leading-relaxed">{feature.description}</p>
          {feature.mockContent}
        </div>

        {!unlocked && (
          <div className="absolute inset-0 flex flex-col items-center justify-center backdrop-blur-sm" style={{ background: 'rgba(15,23,42,0.85)' }}>
            <div className="w-14 h-14 rounded-full flex items-center justify-center text-2xl mb-3 shadow-lg" style={{ background: feature.color }}>🔒</div>
            <div className="text-sm font-bold text-white mb-1">{feature.title}</div>
            <div className="text-xs font-semibold px-3 py-1 rounded-full text-white mb-4" style={{ background: feature.color }}>PRO</div>
            <button onClick={handleClick}
              className="text-sm font-semibold px-5 py-2.5 rounded-xl text-white shadow-md transition-transform active:scale-95"
              style={{ background: feature.color }}>
              {trials > 0 ? `Use 1 Pro Trial (${trials} left)` : 'No trials left'}
            </button>
          </div>
        )}

        {unlocked && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
            className="absolute top-3 right-3 text-xs font-bold px-2 py-1 rounded-full text-white"
            style={{ background: feature.color }}>
            ✓ Unlocked
          </motion.div>
        )}
      </motion.div>

      <AnimatePresence>
        {showModal && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 px-4"
            onClick={() => setShowModal(false)}>
            <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
              className="bg-[#1e293b] border border-white/10 rounded-2xl p-6 max-w-sm w-full shadow-2xl"
              onClick={e => e.stopPropagation()}>
              <div className="text-4xl text-center mb-3">😢</div>
              <h3 className="text-lg font-bold text-center text-white mb-2">Your Pro Trials Are Used Up</h3>
              <p className="text-sm text-slate-400 text-center mb-5">You've used all 3 free trials. Upgrade to Pro to unlock unlimited access to all advanced features.</p>
              <button className="w-full btn-primary text-sm py-3" onClick={() => setShowModal(false)}>Got it</button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

export default function ProFeatures({ gifted }) {
  const STORAGE_KEY = 'burnout_pro_trials'
  const [trials, setTrials] = useState(() => {
    if (gifted) return 3
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored !== null ? parseInt(stored) : 0
  })
  const [justGifted, setJustGifted] = useState(gifted)

  useEffect(() => {
    if (!gifted) return
    setTrials(3); localStorage.setItem(STORAGE_KEY, '3'); setJustGifted(true)
  }, [gifted])

  const useOneTrial = () => {
    const next = Math.max(0, trials - 1)
    setTrials(next); localStorage.setItem(STORAGE_KEY, String(next))
  }

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-2 flex-wrap gap-3">
        <div>
          <h2 className="text-lg font-semibold text-white">Pro Features</h2>
          <p className="text-sm text-slate-400">Advanced insights to go deeper into your burnout profile</p>
        </div>
        <div className="flex items-center gap-2 bg-white/10 border border-white/10 px-4 py-2 rounded-xl">
          <span className="text-lg">⭐</span>
          <div>
            <div className="text-xs text-slate-400">Pro Trials</div>
            <div className="text-lg font-extrabold text-white leading-none">{trials} left</div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {justGifted && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
            className="mb-5 overflow-hidden">
            <div className="bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl p-4 flex items-center gap-4">
              <span className="text-3xl">🎁</span>
              <div>
                <p className="font-bold text-white text-sm">You've been gifted 3 Pro Trials!</p>
                <p className="text-yellow-100 text-xs mt-0.5">Your self-awareness matched our model — here's your reward. Click any locked feature below to use a trial.</p>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {trials === 0 && !gifted && (
        <div className="mb-5 bg-white/5 border border-white/10 rounded-xl p-4 text-sm text-slate-400 text-center">
          🔒 Match your gut estimate with our model (within 15%) to unlock <strong className="text-white">3 free Pro trials</strong>!
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {PRO_FEATURES.map(f => <ProCard key={f.id} feature={f} trials={trials} onUse={useOneTrial} />)}
      </div>
    </div>
  )
}
