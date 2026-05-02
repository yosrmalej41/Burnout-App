import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const PRIOR_METHODS = [
  'Maslach Burnout Inventory (MBI)',
  'WHO-5 Wellbeing Index',
  'Burnout Assessment Tool (BAT)',
  'Copenhagen Burnout Inventory',
  'Online burnout app / quiz',
  'Doctor / psychologist assessment',
  'Other',
]

export default function PreAssessmentPage({ onComplete }) {
  const [hasPrior, setHasPrior] = useState(null)
  const [priorScore, setPriorScore] = useState(50)
  const [priorSource, setPriorSource] = useState('')
  const [gutEstimate, setGutEstimate] = useState(50)
  const [consent, setConsent] = useState(false)
  const [error, setError] = useState(null)

  const canProceed = consent && (
    hasPrior === false ||
    (hasPrior === true && priorSource.trim().length > 0)
  )

  const handleNext = () => {
    if (!consent) { setError('Please give your consent to continue.'); return }
    setError(null)
    onComplete({
      has_prior_score: hasPrior === true,
      prior_score: hasPrior ? priorScore : null,
      prior_source: hasPrior ? priorSource : null,
      gut_estimate: gutEstimate,
    })
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#080f1d] border-b border-white/5 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">🔥 Burnout Risk Predictor</p>
          <h1 className="text-3xl font-bold text-white">Before we begin</h1>
          <p className="text-slate-400 text-sm mt-1">A few quick questions to personalise your results</p>
        </div>
      </header>

      {/* Progress */}
      <div className="bg-[#0f172a] border-b border-white/5 px-4 py-3">
        <div className="max-w-2xl mx-auto">
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full w-[10%] transition-all duration-500" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Pre-assessment · Step 0 of 4</p>
        </div>
      </div>

      <div className="flex-1 px-4 py-8">
        <div className="max-w-2xl mx-auto space-y-6">

          {/* Consent */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="card border-l-4 border-blue-500"
          >
            <h2 className="text-base font-semibold text-white mb-3">🔒 Data & Privacy</h2>
            <p className="text-sm text-slate-400 mb-4 leading-relaxed">
              Your answers are anonymous. We may use your responses to improve future versions of this model for research purposes only. No personal identifying information is collected.
            </p>
            <label className="flex items-start gap-3 cursor-pointer">
              <div
                onClick={() => setConsent(c => !c)}
                className={`w-5 h-5 rounded flex-shrink-0 mt-0.5 border-2 flex items-center justify-center transition-all ${consent ? 'bg-blue-500 border-blue-500' : 'border-white/30'}`}
              >
                {consent && <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
              </div>
              <span className="text-sm text-slate-300">
                I agree my <strong className="text-white">anonymous</strong> responses may be used to improve future burnout prediction models.
              </span>
            </label>
          </motion.div>

          {/* Prior score question */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
            className="card"
          >
            <h2 className="text-base font-semibold text-white mb-1">Have you checked your burnout score elsewhere?</h2>
            <p className="text-sm text-slate-500 mb-4">e.g. a clinical tool, app, or professional assessment</p>

            <div className="flex gap-3 mb-5">
              {[{ label: 'Yes', val: true }, { label: 'No', val: false }].map(opt => (
                <button
                  key={opt.label}
                  type="button"
                  onClick={() => setHasPrior(opt.val)}
                  className={`flex-1 py-3 rounded-xl font-semibold text-sm border-2 transition-all ${
                    hasPrior === opt.val
                      ? 'bg-blue-500 text-white border-blue-500'
                      : 'bg-white/5 text-slate-300 border-white/10 hover:border-blue-400'
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              {hasPrior === true && (
                <motion.div
                  key="yes"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="space-y-4 overflow-hidden"
                >
                  <div>
                    <label className="flex text-sm font-medium text-slate-300 mb-1 justify-between">
                      <span>What score did you get?</span>
                      <span className="text-blue-400 font-bold">{priorScore}%</span>
                    </label>
                    <input
                      type="range" min={0} max={100} step={1}
                      value={priorScore}
                      onChange={e => setPriorScore(Number(e.target.value))}
                      className="w-full"
                      style={{ background: `linear-gradient(to right,#3b82f6 0%,#3b82f6 ${priorScore}%,rgba(255,255,255,0.1) ${priorScore}%,rgba(255,255,255,0.1) 100%)` }}
                    />
                    <div className="flex justify-between text-xs text-slate-500 mt-1">
                      <span>0% — No burnout</span><span>100% — Severe burnout</span>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      How did you measure it? <span className="text-red-400">*</span>
                    </label>
                    <p className="text-xs text-slate-500 mb-2">This helps us assess the credibility of your score for research purposes.</p>
                    <select
                      value={priorSource}
                      onChange={e => setPriorSource(e.target.value)}
                      className="w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 bg-white/5 text-slate-200"
                    >
                      <option value="" className="bg-[#1e293b]">Select a method...</option>
                      {PRIOR_METHODS.map(m => <option key={m} value={m} className="bg-[#1e293b]">{m}</option>)}
                    </select>
                    {priorSource === 'Other' && (
                      <input
                        type="text"
                        placeholder="Please specify..."
                        className="mt-2 w-full border border-white/10 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/40 bg-white/5 text-white placeholder-slate-500"
                        onChange={e => setPriorSource(e.target.value)}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {hasPrior === false && (
                <motion.div
                  key="no"
                  initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}
                  className="overflow-hidden"
                >
                  <div className="bg-blue-500/10 border border-blue-500/30 rounded-xl p-4 flex gap-3">
                    <span className="text-2xl">💙</span>
                    <div>
                      <p className="text-sm font-semibold text-blue-300">You should regularly check in on your mental health.</p>
                      <p className="text-xs text-blue-400/80 mt-1">
                        Tools like the <strong>Maslach Burnout Inventory</strong> or <strong>WHO-5</strong> are free, validated, and take under 5 minutes.
                      </p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Gut estimate */}
          <AnimatePresence>
            {hasPrior !== null && (
              <motion.div
                initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
                className="card"
              >
                <h2 className="text-base font-semibold text-white mb-1">How burned out do you feel right now?</h2>
                <p className="text-sm text-slate-500 mb-5">Your gut feeling — before seeing our model's prediction.</p>

                <div className="flex items-center gap-4 mb-2">
                  <span className="text-2xl">😌</span>
                  <input
                    type="range" min={0} max={100} step={1}
                    value={gutEstimate}
                    onChange={e => setGutEstimate(Number(e.target.value))}
                    className="flex-1"
                    style={{ background: `linear-gradient(to right,#2ecc71 0%,#f39c12 50%,#e74c3c 100%)` }}
                  />
                  <span className="text-2xl">😤</span>
                </div>

                <div className="text-center mt-2">
                  <span className="text-3xl font-extrabold" style={{ color: gutEstimate < 40 ? '#2ecc71' : gutEstimate < 65 ? '#f39c12' : '#e74c3c' }}>
                    {gutEstimate}%
                  </span>
                  <p className="text-xs text-slate-500 mt-1">
                    {gutEstimate < 30 ? 'You feel pretty good!' : gutEstimate < 50 ? 'Mild signs of stress' : gutEstimate < 70 ? 'Moderate burnout feelings' : 'You feel significantly burned out'}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {error && (
            <div className="bg-red-500/10 border border-red-500/30 rounded-xl p-3 text-sm text-red-400">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-end">
            <button
              type="button"
              onClick={handleNext}
              disabled={!canProceed || hasPrior === null}
              className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
            >
              Continue to Assessment →
            </button>
          </div>

        </div>
      </div>
    </div>
  )
}
