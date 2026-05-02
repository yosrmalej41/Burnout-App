import { useEffect } from 'react'
import { motion } from 'framer-motion'
import { matchPersona } from '../utils/personas'
import RiskGauge from '../components/RiskGauge'
import ShapChart from '../components/ShapChart'
import Recommendations from '../components/Recommendations'
import PopulationCompare from '../components/PopulationCompare'
import RiskProfileCard from '../components/RiskProfileCard'
import WhatIfSimulator from '../components/WhatIfSimulator'
import BonusRecommendations from '../components/BonusRecommendations'
import OpenFeedback from '../components/OpenFeedback'
import ProFeatures from '../components/ProFeatures'

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 30 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5, delay },
})

function ComparisonBadge({ gutEstimate, modelPct }) {
  const diff = Math.abs(gutEstimate - modelPct)
  const userLower = gutEstimate < modelPct

  let badge
  if (diff < 15) {
    badge = {
      emoji: '🎯',
      title: 'You Nailed It!',
      subtitle: `Your estimate was ${gutEstimate}% — our model says ${modelPct}%. That's only ${diff}% apart!`,
      message: 'Your self-awareness is impressive. You have a strong sense of your own wellbeing. We have gifted you 3 Pro trials — scroll down to unlock advanced features!',
      bg: 'from-yellow-50 to-amber-50',
      border: 'border-yellow-300',
      textColor: 'text-yellow-800',
      badge: 'bg-yellow-400',
    }
  } else if (diff < 35) {
    badge = {
      emoji: '🤔',
      title: 'Interesting Gap',
      subtitle: `You estimated ${gutEstimate}% — our model says ${modelPct}%. A ${diff}% difference.`,
      message: userLower
        ? 'You may be underestimating your burnout risk. The model picked up on patterns — like remote work challenges and productivity feelings — that often go unnoticed in daily self-assessment.'
        : 'You may be overestimating your burnout. That\'s actually common — stress feels intense in the moment but our model looks at structural factors that moderate long-term risk.',
      bg: 'from-blue-50 to-indigo-50',
      border: 'border-blue-200',
      textColor: 'text-blue-800',
      badge: 'bg-blue-400',
    }
  } else {
    badge = {
      emoji: '😮',
      title: 'Big Surprise!',
      subtitle: `You estimated ${gutEstimate}% — our model says ${modelPct}%. A ${diff}% gap!`,
      message: userLower
        ? 'The model found significant risk factors you may not be fully aware of — particularly around your remote work attitudes and environment. This gap is worth reflecting on. Consider speaking with a professional.'
        : 'You\'re feeling more burned out than your profile suggests. External factors like personal circumstances or recent events may be affecting you beyond what this model captures. Your feelings are valid — please seek support if needed.',
      bg: 'from-red-50 to-rose-50',
      border: 'border-red-200',
      textColor: 'text-red-800',
      badge: 'bg-red-400',
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className={`card bg-gradient-to-br ${badge.bg} border-2 ${badge.border}`}
    >
      <div className="flex items-start gap-4">
        <div className={`w-12 h-12 rounded-full ${badge.badge} flex items-center justify-center text-2xl flex-shrink-0`}>
          {badge.emoji}
        </div>
        <div className="flex-1">
          <h2 className={`text-xl font-bold ${badge.textColor} mb-1`}>{badge.title}</h2>
          <p className={`text-sm font-semibold ${badge.textColor} mb-2 opacity-80`}>{badge.subtitle}</p>
          <p className="text-sm text-gray-600 leading-relaxed">{badge.message}</p>

          {/* Visual comparison bar */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 text-right">Your estimate</span>
              <div className="flex-1 h-3 bg-white/80 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  className="h-full rounded-full bg-gray-400"
                  initial={{ width: 0 }}
                  animate={{ width: `${gutEstimate}%` }}
                  transition={{ duration: 0.8, delay: 0.3 }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600 w-8">{gutEstimate}%</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-xs text-gray-500 w-24 text-right">Model result</span>
              <div className="flex-1 h-3 bg-white/80 rounded-full overflow-hidden border border-gray-200">
                <motion.div
                  className="h-full rounded-full"
                  style={{ background: modelPct < 40 ? '#2ecc71' : modelPct < 65 ? '#f39c12' : '#e74c3c' }}
                  initial={{ width: 0 }}
                  animate={{ width: `${modelPct}%` }}
                  transition={{ duration: 0.8, delay: 0.5 }}
                />
              </div>
              <span className="text-xs font-bold text-gray-600 w-8">{modelPct}%</span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  )
}

function PersonaMatchCard({ formData }) {
  const persona = matchPersona(formData)
  if (!persona) return null

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5 }}
      className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl"
    >
      {/* Header */}
      <div className={`bg-gradient-to-r ${persona.gradient} px-6 py-5 flex items-center gap-4`}>
        <span className="text-5xl">{persona.emoji}</span>
        <div className="flex-1">
          <p className="text-xs font-semibold text-white/70 uppercase tracking-widest mb-0.5">Your worker persona</p>
          <h3 className="text-2xl font-extrabold text-white">{persona.name}</h3>
          <p className="text-sm text-white/80 mt-0.5">{persona.tagline}</p>
        </div>
        <span className="text-xs font-bold px-3 py-1 rounded-full bg-black/25 text-white flex-shrink-0">
          {persona.risk}
        </span>
      </div>

      {/* Body */}
      <div className="bg-[#1e293b] px-6 py-5">
        <p className="text-xs text-gray-400 mb-4">
          Based on your answers, your work profile most closely matches this archetype from our dataset of 20,959 workers.
        </p>
        <div className="flex flex-wrap gap-2 mb-4">
          {persona.traits.map((t, i) => (
            <span key={i} className="text-xs px-3 py-1 rounded-full bg-white/10 text-gray-200 font-medium">
              {t}
            </span>
          ))}
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
          {persona.features.map((f, i) => (
            <div key={i} className="bg-white/5 rounded-xl px-3 py-2 text-center">
              <p className="text-[10px] text-gray-500 mb-0.5">{f.label}</p>
              <p className="text-sm font-bold text-white">{f.value}</p>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  )
}

export default function ResultsPage({ result, formData, preAssessment, onReset }) {
  const isHigh = result.prediction === 1
  const pct = Math.round(result.probability * 100)
  const gutEstimate = preAssessment?.gut_estimate ?? null
  const diff = gutEstimate !== null ? Math.abs(gutEstimate - pct) : null
  const unlockBonus = diff !== null && diff < 15

  // Log context data to backend
  useEffect(() => {
    if (!preAssessment) return
    fetch('/api/log-context', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...preAssessment,
        ...formData,
        model_probability: result.probability,
      }),
    }).catch(() => {})
  }, [])

  return (
    <div className="min-h-screen bg-[#0f172a]">
      {/* Header with Pexels image */}
      <header className="page-header">
        <img
          src="https://images.pexels.com/photos/5439381/pexels-photo-5439381.jpeg?auto=compress&cs=tinysrgb&w=1260&h=400&dpr=1"
          alt=""
          className="page-header-img"
          style={{ filter: isHigh ? 'brightness(0.28) saturate(1.2) hue-rotate(-10deg)' : 'brightness(0.28) saturate(1.1) hue-rotate(80deg)' }}
        />
        {/* Risk color overlay */}
        <div className="absolute inset-0 z-0 opacity-50"
          style={{ background: isHigh ? 'linear-gradient(135deg,#7f1d1d,#991b1b)' : 'linear-gradient(135deg,#064e3b,#065f46)' }} />
        <div className="page-header-content px-4 py-10">
          <div className="max-w-5xl mx-auto flex items-center justify-between flex-wrap gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-white/60 mb-2">Your Results</p>
              <h1 className="text-3xl font-display font-bold text-white">Burnout Risk Report</h1>
              <p className="text-white/70 text-sm mt-1">Based on 20,959 remote workers · Model accuracy 76.2%</p>
            </div>
            <button
              onClick={onReset}
              className="bg-white/15 hover:bg-white/25 border border-white/20 text-white px-5 py-2.5 rounded-xl font-semibold text-sm transition-all backdrop-blur-sm"
            >
              ← Retake Assessment
            </button>
          </div>
        </div>
      </header>

      <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

        {/* Comparison badge — only if pre-assessment was done */}
        {gutEstimate !== null && (
          <motion.div {...fadeUp(0.05)}>
            <ComparisonBadge gutEstimate={gutEstimate} modelPct={pct} />
          </motion.div>
        )}

        {/* Persona match */}
        {formData && (
          <motion.div {...fadeUp(0.1)}>
            <PersonaMatchCard formData={formData} />
          </motion.div>
        )}

        {/* Top row — Gauge + Profile */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div {...fadeUp(0.15)}>
            <RiskGauge probability={result.probability} isHigh={isHigh} />
          </motion.div>
          <motion.div {...fadeUp(0.2)}>
            <RiskProfileCard result={result} />
          </motion.div>
        </div>

        {/* SHAP Chart */}
        <motion.div {...fadeUp(0.3)}>
          <ShapChart shapValues={result.shap_values} />
        </motion.div>

        {/* Recommendations */}
        <motion.div {...fadeUp(0.4)}>
          <Recommendations shapValues={result.shap_values} probability={result.probability} />
        </motion.div>

        {/* Population Compare */}
        <motion.div {...fadeUp(0.5)}>
          <PopulationCompare probability={result.probability} />
        </motion.div>

        {/* What-If Simulator */}
        <motion.div {...fadeUp(0.6)}>
          <WhatIfSimulator initialForm={formData} currentProbability={result.probability} />
        </motion.div>

        {/* Pro Features */}
        <motion.div {...fadeUp(0.7)}>
          <ProFeatures gifted={unlockBonus} />
        </motion.div>

        {/* Open Feedback */}
        <motion.div {...fadeUp(0.8)}>
          <OpenFeedback />
        </motion.div>

      </div>

      <footer className="text-center text-xs text-gray-400 py-8 px-4">
        This tool is for informational purposes only. Results are based on survey data and ML predictions. Consult a professional if you are experiencing burnout.
      </footer>
    </div>
  )
}
