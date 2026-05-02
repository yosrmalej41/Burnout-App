import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

const STEPS = ['Personal Info', 'Remote Work Attitudes', 'Work Environment']

const DEFAULT_FORM = {
  age: 30,
  years_experience: 5,
  student: 0,
  full_time: 1,
  challenging: 4,
  less_productive: 3,
  prefer_remote: 4,
  flexibility_location: 5,
  flexibility_schedule: 5,
  commute_minutes: 30,
  work_changes_location: 0,
  healthcare_nearby: 0,
  park_missing: 0,
  leisure_missing: 0,
  car_parking_cowork: 0,
}

function LikertSlider({ label, name, value, onChange }) {
  return (
    <div className="mb-6">
      <label className="block text-sm font-medium text-slate-300 mb-1">{label}</label>
      <div className="flex items-center gap-3">
        <span className="text-xs text-slate-500 w-16 text-center leading-tight">Strongly Disagree</span>
        <div className="flex-1">
          <input
            type="range" min={1} max={7} step={1}
            value={value}
            onChange={e => onChange(name, Number(e.target.value))}
            className="w-full"
            style={{
              background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${((value - 1) / 6) * 100}%, rgba(255,255,255,0.1) ${((value - 1) / 6) * 100}%, rgba(255,255,255,0.1) 100%)`
            }}
          />
          <div className="flex justify-between mt-1">
            {[1,2,3,4,5,6,7].map(n => (
              <span key={n} className={`text-xs ${value === n ? 'text-blue-400 font-bold' : 'text-slate-600'}`}>{n}</span>
            ))}
          </div>
        </div>
        <span className="text-xs text-slate-500 w-16 text-center leading-tight">Strongly Agree</span>
      </div>
      <div className="text-center mt-1">
        <span className="inline-block bg-blue-500/20 text-blue-300 text-xs px-2 py-0.5 rounded-full border border-blue-500/30">{value}</span>
      </div>
    </div>
  )
}

function Toggle({ label, name, value, onChange }) {
  return (
    <div className={`flex items-center justify-between p-4 rounded-xl mb-3 transition-all duration-200 border ${
      value ? 'bg-emerald-500/10 border-emerald-500/30' : 'bg-white/5 border-white/10'
    }`}>
      <span className="text-sm font-medium text-slate-300">{label}</span>
      <button
        type="button"
        onClick={() => onChange(name, value === 1 ? 0 : 1)}
        className={`relative w-14 h-7 rounded-full transition-all duration-300 focus:outline-none flex-shrink-0 ${
          value ? 'bg-emerald-500 shadow-sm shadow-emerald-500/30' : 'bg-white/15'
        }`}
      >
        <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white shadow-md transition-transform duration-300 ${value ? 'translate-x-7' : 'translate-x-0'}`} />
      </button>
    </div>
  )
}

function NumberInput({ label, name, value, min, max, step = 1, onChange, unit }) {
  const isUnderAge = name === 'age' && value < 18
  return (
    <div className="mb-4">
      <label className="block text-sm font-medium text-slate-300 mb-1">
        {label} {unit && <span className="text-slate-500">({unit})</span>}
      </label>
      <input
        type="number" min={min} max={max} step={step}
        value={value}
        onChange={e => onChange(name, Number(e.target.value))}
        className={`w-full border rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 bg-white/5 text-white transition-all ${
          isUnderAge
            ? 'border-red-500/50 focus:ring-red-500/30'
            : 'border-white/10 focus:ring-blue-500/30'
        }`}
      />
      {isUnderAge && (
        <div className="mt-2 flex items-start gap-2 bg-red-500/10 border border-red-500/30 rounded-xl p-3">
          <span className="text-lg">🚫</span>
          <div>
            <p className="text-sm font-semibold text-red-400">We don't encourage child labour!</p>
            <p className="text-xs text-red-400/80 mt-0.5">Please go to school instead. 📚 You must be at least 18 years old.</p>
          </div>
        </div>
      )}
    </div>
  )
}

export default function FormPage({ onResult, defaults }) {
  const [step, setStep] = useState(0)
  const [form, setForm] = useState(defaults ? { ...DEFAULT_FORM, ...defaults } : DEFAULT_FORM)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const update = (name, value) => setForm(f => ({ ...f, [name]: value }))

  const handleSubmit = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await fetch('/api/predict', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.detail || 'Prediction failed')
      }
      const data = await res.json()
      onResult(data, form)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  const isUnderAge = form.age < 18

  const stepVariants = {
    enter: { opacity: 0, x: 40 },
    center: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -40 },
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#0f172a]">
      {/* Header */}
      <header className="bg-[#080f1d] border-b border-white/5 px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-400 mb-2">🔥 Burnout Risk Predictor</p>
          <h1 className="text-3xl font-bold text-white">Your Assessment</h1>
          <p className="text-slate-400 text-sm mt-1">Powered by ML · 20,959 remote workers surveyed · 76.2% accuracy</p>
        </div>
      </header>

      {/* Progress Bar */}
      <div className="bg-[#0f172a] border-b border-white/5 px-4 py-4">
        <div className="max-w-2xl mx-auto">
          <div className="flex justify-between mb-3">
            {STEPS.map((s, i) => (
              <div key={i} className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300 ${
                  i < step ? 'bg-emerald-500 text-white'
                  : i === step ? 'bg-blue-500 text-white'
                  : 'bg-white/10 text-slate-500'
                }`}>
                  {i < step ? '✓' : i + 1}
                </div>
                <span className={`text-xs font-semibold hidden sm:block transition-colors ${
                  i < step ? 'text-emerald-400' : i === step ? 'text-blue-400' : 'text-slate-600'
                }`}>{s}</span>
              </div>
            ))}
          </div>
          <div className="h-1.5 bg-white/10 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full transition-all duration-500"
              style={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-1.5">Step {step + 1} of {STEPS.length}</p>
        </div>
      </div>

      {/* Form Body */}
      <div className="flex-1 px-4 py-8 bg-[#0f172a]">
        <div className="max-w-2xl mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              variants={stepVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3 }}
            >
              {step === 0 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-1">Personal Information</h2>
                  <p className="text-sm text-slate-500 mb-6">Tell us about yourself</p>
                  <NumberInput label="Age" name="age" value={form.age} min={18} max={70} onChange={update} unit="years" />
                  <NumberInput label="Total years of professional experience" name="years_experience" value={form.years_experience} min={0} max={50} step={0.5} onChange={update} unit="years" />
                  <Toggle label="I am currently a student" name="student" value={form.student} onChange={update} />
                  <Toggle label="I am a full-time employee" name="full_time" value={form.full_time} onChange={update} />
                </div>
              )}

              {step === 1 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-1">Remote Work Attitudes</h2>
                  <p className="text-sm text-slate-500 mb-6">Rate each statement on a scale of 1–7</p>
                  <LikertSlider label="Remote work feels more challenging than office work" name="challenging" value={form.challenging} onChange={update} />
                  <LikertSlider label="I feel less productive working remotely" name="less_productive" value={form.less_productive} onChange={update} />
                  <LikertSlider label="I prefer remote work over office work" name="prefer_remote" value={form.prefer_remote} onChange={update} />
                  <LikertSlider label="Flexibility to choose work location is important to me" name="flexibility_location" value={form.flexibility_location} onChange={update} />
                  <LikertSlider label="Adjusting my schedule based on personal needs is important" name="flexibility_schedule" value={form.flexibility_schedule} onChange={update} />
                </div>
              )}

              {step === 2 && (
                <div className="card">
                  <h2 className="text-xl font-bold text-white mb-1">Work Environment</h2>
                  <p className="text-sm text-slate-500 mb-6">Your commute and workplace preferences</p>

                  <div className="mb-6">
                    <label className="block text-sm font-medium text-slate-300 mb-1">
                      Daily commute time <span className="text-slate-500">(one way)</span>
                    </label>
                    <div className="flex items-center gap-3">
                      <input
                        type="range" min={0} max={120} step={5}
                        value={form.commute_minutes}
                        onChange={e => update('commute_minutes', Number(e.target.value))}
                        className="flex-1"
                        style={{
                          background: `linear-gradient(to right, #3b82f6 0%, #3b82f6 ${(form.commute_minutes / 120) * 100}%, rgba(255,255,255,0.1) ${(form.commute_minutes / 120) * 100}%, rgba(255,255,255,0.1) 100%)`
                        }}
                      />
                      <span className="text-sm font-semibold text-blue-400 w-20 text-right">{form.commute_minutes} min</span>
                    </div>
                  </div>

                  <div className="border-t border-white/5 pt-4 mb-4">
                    <p className="text-sm font-semibold text-slate-400 mb-3">Work location</p>
                    <Toggle label="My place of work changes regularly" name="work_changes_location" value={form.work_changes_location} onChange={update} />
                  </div>

                  <div className="border-t border-white/5 pt-4 mb-4">
                    <p className="text-sm font-semibold text-slate-400 mb-3">Nearby amenities (within 15 min walk)</p>
                    <Toggle label="Healthcare facilities nearby and important to me" name="healthcare_nearby" value={form.healthcare_nearby} onChange={update} />
                    <Toggle label="No park/green space nearby — but I wish there was" name="park_missing" value={form.park_missing} onChange={update} />
                    <Toggle label="No leisure activities nearby — but I wish there were" name="leisure_missing" value={form.leisure_missing} onChange={update} />
                  </div>

                  <div className="border-t border-white/5 pt-4">
                    <p className="text-sm font-semibold text-slate-400 mb-3">Coworking preferences</p>
                    <Toggle label="Car parking availability is important at a coworking space" name="car_parking_cowork" value={form.car_parking_cowork} onChange={update} />
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>

          {error && (
            <div className="mt-4 bg-red-500/10 border border-red-500/30 rounded-xl p-4 text-red-400 text-sm">
              ⚠️ {error}
            </div>
          )}

          <div className="flex justify-between mt-6">
            <button
              type="button"
              onClick={() => setStep(s => s - 1)}
              disabled={step === 0}
              className="btn-secondary disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Back
            </button>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={() => setStep(s => s + 1)}
                disabled={step === 0 && isUnderAge}
                className="btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Next →
              </button>
            ) : (
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading}
                className="btn-primary disabled:opacity-60 flex items-center gap-2"
              >
                {loading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                    </svg>
                    Analysing…
                  </>
                ) : '🔮 Predict My Burnout Risk'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
