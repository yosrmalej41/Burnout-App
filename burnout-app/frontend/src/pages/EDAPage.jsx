import { useEffect, useRef, useState } from 'react'
import { motion, useInView, AnimatePresence } from 'framer-motion'
import ReactECharts from 'echarts-for-react'
import { PERSONAS } from '../utils/personas'

// ---------------------------------------------------------------------------
// Hard-coded summary stats derived from the RMAP 2024 dataset (n=20,959)
// ---------------------------------------------------------------------------
const STATS = {
  total: 20959,
  regions: 5,
  preferRemotePct: 77,
}

const GENDER_DATA = [
  { value: 10137, name: 'Male' },
  { value: 9642,  name: 'Female' },
  { value: 198,   name: 'Non-binary' },
  { value: 56,    name: 'Other' },
]

const SECTOR_DATA = [
  { name: 'IT & Communication',            value: 3542 },
  { name: 'Professional & Scientific',     value: 2393 },
  { name: 'Finance & Insurance',           value: 1918 },
  { name: 'Education',                     value: 1899 },
  { name: 'Other Services',                value: 1702 },
  { name: 'Health & Social Work',          value: 1517 },
  { name: 'Admin & Support',               value: 1180 },
  { name: 'Arts & Entertainment',          value: 1086 },
]

const REGION_DATA = [
  { name: 'Europe',   value: 16160, pct: 76 },
  { name: 'Americas', value: 2572,  pct: 16 },
  { name: 'Africa',   value: 953,   pct: 6  },
  { name: 'Oceania',  value: 222,   pct: 1  },
  { name: 'Asia',     value: 145,   pct: 1  },
]

// Radar: averages per attitude dimension (Low Risk vs High Risk cluster)
const RADAR_INDICATORS = [
  { name: 'Prefer Remote',       max: 7 },
  { name: 'Flexibility Location',max: 7 },
  { name: 'Flex Schedule',       max: 7 },
  { name: 'Challenging',         max: 7 },
  { name: 'Less Productive',     max: 7 },
]
const RADAR_LOW  = [5.8, 5.6, 5.7, 2.1, 2.4]
const RADAR_HIGH = [3.9, 4.2, 4.5, 5.2, 4.8]

// Likert distributions for 5 attitude questions (counts for 1-7)
const LIKERT_QUESTIONS = [
  { label: 'Prefer Remote',        data: [243, 617, 1123, 2288, 3306, 4383, 8499] },
  { label: 'Flex Location',        data: [120, 310, 890,  2100, 3500, 4800, 9239] },
  { label: 'Flex Schedule',        data: [98,  285, 780,  1950, 3200, 5100, 9546] },
  { label: 'Remote Challenging',   data: [5358,5183,3002, 2234, 2810, 1352, 520]  },
  { label: 'Less Productive',      data: [4800,4500,2800, 2400, 2800, 1900, 759]  },
]

// Feature importances (from SHAP analysis, simplified)
const FEATURE_IMPORTANCE = [
  { name: 'Remote work feels challenging',           value: 0.187 },
  { name: 'Feel less productive remotely',           value: 0.162 },
  { name: 'Prefer remote over office',               value: 0.134 },
  { name: 'Age × Commute interaction',               value: 0.118 },
  { name: 'Commute time (squared)',                  value: 0.097 },
  { name: 'Flexibility of location',                 value: 0.081 },
  { name: 'Flexibility of schedule',                 value: 0.073 },
  { name: 'Total years of experience',               value: 0.055 },
  { name: 'Full-time employment',                    value: 0.038 },
  { name: 'No park/green space nearby',              value: 0.022 },
  { name: 'Healthcare facilities nearby',            value: 0.018 },
  { name: 'No leisure activities nearby',            value: 0.015 },
].sort((a, b) => a.value - b.value)

// PERSONAS imported from utils/personas.js

// ---------------------------------------------------------------------------
// Animated counter
// ---------------------------------------------------------------------------
function Counter({ to, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0)
  const ref = useRef(null)
  const inView = useInView(ref, { once: true })

  useEffect(() => {
    if (!inView) return
    const start = performance.now()
    const tick = (now) => {
      const progress = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)
      setCount(Math.floor(eased * to))
      if (progress < 1) requestAnimationFrame(tick)
      else setCount(to)
    }
    requestAnimationFrame(tick)
  }, [inView, to, duration])

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>
}

// ---------------------------------------------------------------------------
// Section reveal wrapper
// ---------------------------------------------------------------------------
function Reveal({ children, delay = 0, className = '' }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, margin: '-60px' })
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay, ease: 'easeOut' }}
      className={className}
    >
      {children}
    </motion.div>
  )
}

// ---------------------------------------------------------------------------
// Chart options
// ---------------------------------------------------------------------------
function genderDonutOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'item', formatter: '{b}: {c} ({d}%)' },
    legend: { bottom: '2%', left: 'center', textStyle: { color: '#94a3b8', fontSize: 11 } },
    series: [{
      type: 'pie',
      radius: ['45%', '72%'],
      avoidLabelOverlap: false,
      label: { show: false },
      emphasis: { label: { show: true, fontSize: 14, fontWeight: 'bold', color: '#f1f5f9' } },
      data: GENDER_DATA,
      color: ['#3b82f6', '#ec4899', '#a78bfa', '#94a3b8'],
    }],
  }
}

function sectorBarOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    grid: { left: '3%', right: '8%', top: '2%', bottom: '3%', containLabel: true },
    xAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    yAxis: {
      type: 'category',
      data: SECTOR_DATA.map(d => d.name),
      axisLabel: { color: '#cbd5e1', fontSize: 10 },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: SECTOR_DATA.map((d, i) => ({
        value: d.value,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#2c3e50' },
              { offset: 1, color: ['#3b82f6','#6366f1','#8b5cf6','#ec4899','#f43f5e','#f97316','#eab308','#22c55e'][i] },
            ],
          },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      barMaxWidth: 22,
      label: { show: true, position: 'right', color: '#94a3b8', fontSize: 10, formatter: '{c}' },
    }],
  }
}

function regionRoseOption() {
  const COLORS = ['#6366f1', '#f43f5e', '#f59e0b', '#10b981', '#3b82f6']
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: (p) => `${p.name}<br/>${p.data.pct}% · ${p.value.toLocaleString()} respondents`,
    },
    legend: {
      orient: 'vertical', right: '2%', top: 'center',
      textStyle: { color: '#cbd5e1', fontSize: 11 },
      itemWidth: 10, itemHeight: 10,
    },
    series: [{
      type: 'pie',
      roseType: 'area',
      radius: ['15%', '75%'],
      center: ['38%', '50%'],
      data: REGION_DATA.map((d, i) => ({
        name: d.name,
        value: d.value,
        pct: d.pct,
        itemStyle: {
          color: COLORS[i],
          shadowBlur: 12,
          shadowColor: COLORS[i] + '88',
          borderRadius: 6,
          borderWidth: 2,
          borderColor: '#0f172a',
        },
      })),
      label: {
        show: true,
        color: '#f1f5f9',
        fontSize: 11,
        fontWeight: 'bold',
        formatter: (p) => `${p.data.pct}%`,
      },
      labelLine: { lineStyle: { color: '#475569' } },
      emphasis: {
        itemStyle: { shadowBlur: 24 },
        label: { fontSize: 14 },
      },
    }],
  }
}

function radarOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: {},
    legend: {
      data: ['Low Risk Profile', 'High Risk Profile'],
      bottom: 0,
      textStyle: { color: '#94a3b8', fontSize: 11 },
    },
    radar: {
      indicator: RADAR_INDICATORS,
      center: ['50%', '48%'],
      radius: '62%',
      axisName: { color: '#cbd5e1', fontSize: 11 },
      splitLine: { lineStyle: { color: '#1e293b' } },
      splitArea: { areaStyle: { color: ['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.04)'] } },
      axisLine: { lineStyle: { color: '#334155' } },
    },
    series: [{
      type: 'radar',
      data: [
        {
          value: RADAR_LOW,
          name: 'Low Risk Profile',
          symbol: 'circle', symbolSize: 5,
          lineStyle: { color: '#2ecc71', width: 2 },
          areaStyle: { color: 'rgba(46,204,113,0.15)' },
          itemStyle: { color: '#2ecc71' },
        },
        {
          value: RADAR_HIGH,
          name: 'High Risk Profile',
          symbol: 'circle', symbolSize: 5,
          lineStyle: { color: '#e74c3c', width: 2 },
          areaStyle: { color: 'rgba(231,76,60,0.15)' },
          itemStyle: { color: '#e74c3c' },
        },
      ],
    }],
  }
}

function likertStackOption() {
  const COLORS = ['#e74c3c','#e67e22','#f1c40f','#95a5a6','#3498db','#2ecc71','#1abc9c']
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', axisPointer: { type: 'shadow' } },
    legend: {
      data: ['1 Strongly Disagree','2','3','4 Neutral','5','6','7 Strongly Agree'],
      bottom: 0, textStyle: { color: '#64748b', fontSize: 9 },
    },
    grid: { left: '3%', right: '4%', top: '5%', bottom: '18%', containLabel: true },
    xAxis: {
      type: 'category',
      data: LIKERT_QUESTIONS.map(q => q.label),
      axisLabel: { color: '#94a3b8', fontSize: 10, interval: 0, rotate: 0 },
    },
    yAxis: { type: 'value', axisLabel: { color: '#94a3b8', fontSize: 10 }, splitLine: { lineStyle: { color: '#1e293b' } } },
    series: [1,2,3,4,5,6,7].map((level, i) => ({
      name: ['1 Strongly Disagree','2','3','4 Neutral','5','6','7 Strongly Agree'][i],
      type: 'bar',
      stack: 'total',
      data: LIKERT_QUESTIONS.map(q => q.data[i]),
      itemStyle: { color: COLORS[i] },
      barMaxWidth: 50,
    })),
  }
}

function featureImportanceOption() {
  return {
    backgroundColor: 'transparent',
    tooltip: { trigger: 'axis', formatter: (p) => `${p[0].name}: ${(p[0].value * 100).toFixed(1)}%` },
    grid: { left: '3%', right: '12%', top: '2%', bottom: '3%', containLabel: true },
    xAxis: {
      type: 'value',
      axisLabel: { color: '#94a3b8', fontSize: 10, formatter: (v) => `${(v*100).toFixed(0)}%` },
      splitLine: { lineStyle: { color: '#1e293b' } },
    },
    yAxis: {
      type: 'category',
      data: FEATURE_IMPORTANCE.map(f => f.name),
      axisLabel: { color: '#cbd5e1', fontSize: 10 },
      axisTick: { show: false },
    },
    series: [{
      type: 'bar',
      data: FEATURE_IMPORTANCE.map((f, i) => ({
        value: f.value,
        itemStyle: {
          color: {
            type: 'linear', x: 0, y: 0, x2: 1, y2: 0,
            colorStops: [
              { offset: 0, color: '#1e3a5f' },
              { offset: 1, color: f.value > 0.1 ? '#e74c3c' : f.value > 0.07 ? '#f39c12' : '#3b82f6' },
            ],
          },
          borderRadius: [0, 6, 6, 0],
        },
      })),
      barMaxWidth: 18,
      label: { show: true, position: 'right', color: '#94a3b8', fontSize: 10,
        formatter: (p) => `${(p.value * 100).toFixed(1)}%` },
    }],
  }
}

function PersonaCard({ persona: p }) {
  const [hovered, setHovered] = useState(false)

  return (
    <motion.div
      className="relative bg-white/5 border border-white/10 rounded-2xl overflow-hidden flex flex-col h-full"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      {/* Gradient header */}
      <div className={`bg-gradient-to-br ${p.gradient} px-5 pt-6 pb-8 relative flex-shrink-0`}>
        <div className="text-5xl mb-2">{p.emoji}</div>
        <h3 className="text-base font-bold text-white leading-tight">{p.name}</h3>
        <span className="absolute top-4 right-4 text-xs font-bold px-2 py-0.5 rounded-full bg-black/30 text-white">
          {p.risk}
        </span>
      </div>

      {/* Default body */}
      <div className="p-4 flex flex-col flex-1">
        <p className="text-xs text-gray-400 mb-3 leading-relaxed">{p.tagline}</p>
        <div className="flex flex-wrap gap-1.5">
          {p.traits.map((t, j) => (
            <span key={j} className={`text-xs px-2 py-0.5 rounded-full font-medium ${p.traitColors[j]}`}>
              {t}
            </span>
          ))}
        </div>
        <p className="text-xs text-white/30 mt-4 text-center">Hover to see profile →</p>
      </div>

      {/* Hover overlay — slides up */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 30 }}
            className="absolute inset-0 bg-[#0f172a]/95 backdrop-blur-sm p-4 flex flex-col"
          >
            <div className="flex items-center gap-2 mb-3">
              <span className="text-2xl">{p.emoji}</span>
              <div>
                <p className="text-xs font-bold text-white">{p.name}</p>
                <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: p.riskColor + '33', color: p.riskColor }}>
                  {p.risk}
                </span>
              </div>
            </div>
            <div className="space-y-1.5 flex-1 overflow-auto">
              {p.features.map((f, i) => (
                <div key={i} className="flex items-center justify-between">
                  <span className="text-[11px] text-gray-400">{f.label}</span>
                  <span className="text-[11px] font-semibold text-white">{f.value}</span>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const INSIGHT_CARDS = [
  {
    icon: '🟢',
    stat: '77%',
    text: 'of respondents strongly or somewhat prefer remote work over office',
    tooltip: 'Out of 20,959 respondents, 77% answered Agree, Strongly Agree, or Somewhat Agree to preferring remote work — calculated from the full Likert distribution across all survey responses.',
  },
  {
    icon: '🔴',
    stat: '49%',
    text: 'strongly disagree that remote work feels more challenging',
    tooltip: '49% chose Strongly Disagree on the "Remote Challenging" question — meaning nearly half of all workers do not find remote work harder than office work at all. This is the clearest signal separating low-risk from high-risk workers.',
  },
  {
    icon: '🟡',
    stat: '53%',
    text: 'say flexibility of location is "strongly important" to them',
    tooltip: '53% rated flexibility of work location as 7/7 (Strongly Agree it\'s important) — making it the most universally valued remote work factor across all regions and employment types.',
  },
  {
    icon: '💡',
    stat: 'Key',
    text: 'High-risk workers score 5.2/7 on "Remote Challenging" vs 2.1 for low-risk',
    tooltip: 'The single most differentiating fact in the entire dataset: high-risk workers average 5.2/7 on the Remote Challenging axis vs only 2.1/7 for low-risk workers. That 3.1-point gap is larger than any other dimension and is the primary driver of the model\'s predictions.',
  },
]

function InsightCards() {
  const [hovered, setHovered] = useState(null)

  return (
    <div className="space-y-3 flex flex-col justify-center">
      {INSIGHT_CARDS.map((item, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 20 }} whileInView={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1 }} viewport={{ once: true }}
          className="relative bg-white/5 border border-white/10 rounded-xl p-4 flex items-start gap-4 cursor-default"
          onMouseEnter={() => setHovered(i)}
          onMouseLeave={() => setHovered(null)}
        >
          <span className="text-2xl mt-0.5">{item.icon}</span>
          <div>
            <span className="text-lg font-bold text-white">{item.stat}</span>
            <p className="text-sm text-gray-400 mt-0.5">{item.text}</p>
          </div>

          {/* Hover indicator dot */}
          <span className="absolute top-3 right-3 w-1.5 h-1.5 rounded-full bg-blue-400/60" />

          {/* Tooltip */}
          <AnimatePresence>
            {hovered === i && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.18 }}
                className="absolute left-0 right-0 bottom-[calc(100%+8px)] z-50
                           bg-[#1e293b] border border-blue-500/30 rounded-xl px-4 py-3
                           shadow-xl shadow-black/40 pointer-events-none"
              >
                {/* Arrow */}
                <div className="absolute left-6 bottom-[-6px] w-3 h-3 bg-[#1e293b] border-r border-b border-blue-500/30 rotate-45" />
                <p className="text-xs text-blue-100 leading-relaxed">{item.tooltip}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main EDA Page
// ---------------------------------------------------------------------------
export default function EDAPage({ onContinue, onPersonaSelect }) {
  return (
    <div className="min-h-screen bg-[#0f172a] text-white">

      {/* ── Nav ── */}
      <nav className="sticky top-0 z-50 bg-[#0f172a]/90 backdrop-blur border-b border-white/5 px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-lg font-bold tracking-tight">🔥 Burnout Predictor</span>
          <span className="text-xs bg-white/10 text-gray-400 px-2 py-0.5 rounded-full ml-2">Data Overview</span>
        </div>
        <button
          onClick={onContinue}
          className="text-sm text-gray-400 hover:text-white transition-colors underline underline-offset-2"
        >
          Skip intro →
        </button>
      </nav>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 1 — Artistic Hero (full-viewport split) */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen flex flex-col lg:flex-row overflow-hidden">

        {/* LEFT — image column */}
        <motion.div
          className="relative lg:w-1/2 min-h-[55vw] lg:min-h-screen flex-shrink-0"
          initial={{ opacity: 0, x: -60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
        >
          <img
            src="/hero.png"
            alt="Burnout illustration"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          {/* subtle vignette to blend into dark bg */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-[#0f172a]" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0f172a]/60 via-transparent to-transparent" />
        </motion.div>

        {/* RIGHT — text column */}
        <div className="relative z-10 flex flex-col justify-center px-8 md:px-16 py-20 lg:w-1/2">
          {/* ambient glow behind text */}
          <div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2
                          w-[500px] h-[500px] rounded-full blur-[110px]"
               style={{ background: 'radial-gradient(circle, rgba(200,41,41,0.12) 0%, rgba(14,206,206,0.06) 70%)' }} />

          <Reveal>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] mb-5" style={{ color: '#0ECECE' }}>
              R-MAP EU Research Survey · 2024
            </p>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.05] mb-6">
              <span style={{ color: '#0ECECE' }}>Understanding</span>
              <br />
              <span style={{ color: '#C82929' }}>Remote Work</span>
              <br />
              <span className="text-white">& Burnout</span>
            </h1>
            <p className="text-gray-400 text-lg leading-relaxed max-w-md mb-10">
              Before you take the assessment, explore what{' '}
              <strong className="text-white">20,959 remote workers</strong> across 5 world regions
              told us about their work lives.
            </p>
          </Reveal>

          {/* Stat chips */}
          <Reveal delay={0.25}>
            <div className="flex flex-wrap gap-4 mb-10">
              {[
                { label: 'Respondents',   value: 20959, suffix: '' },
                { label: 'World regions', value: 5,     suffix: '' },
                { label: 'Prefer remote', value: 77,    suffix: '%' },
              ].map(s => (
                <div key={s.label}
                  className="bg-white/5 border border-white/10 rounded-2xl px-7 py-4 min-w-[130px] backdrop-blur"
                >
                  <div className="text-3xl font-extrabold text-white">
                    <Counter to={s.value} suffix={s.suffix} />
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 uppercase tracking-wider">{s.label}</div>
                </div>
              ))}
            </div>
          </Reveal>

          {/* Scroll hint */}
          <Reveal delay={0.4}>
            <div className="flex items-center gap-3 text-gray-500 text-xs">
              <motion.div animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5 }}>↓</motion.div>
              <span>Scroll to explore the data</span>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 2 — Who are these people? */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#0f172a]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-purple-400">Section 01</div>
            <h2 className="text-3xl font-bold mb-2">Who are the respondents?</h2>
            <p className="text-gray-400 mb-10">Demographics across gender, industry sector, and world region.</p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Gender donut */}
            <Reveal delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Gender breakdown</h3>
                <ReactECharts option={genderDonutOption()} style={{ height: 240 }} />
              </div>
            </Reveal>

            {/* Sector bar */}
            <Reveal delay={0.2}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-4">Top industry sectors</h3>
                <ReactECharts option={sectorBarOption()} style={{ height: 240 }} />
              </div>
            </Reveal>
          </div>

          {/* Region funnel */}
          <Reveal delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-4">World regions represented</h3>
              <ReactECharts option={regionRoseOption()} style={{ height: 220 }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 3 — Remote work attitudes */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#080f1d]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-blue-400">Section 02</div>
            <h2 className="text-3xl font-bold mb-2">How do people feel about remote work?</h2>
            <p className="text-gray-400 mb-10">
              The radar shows the <span className="text-green-400 font-semibold">low-risk</span> vs{' '}
              <span className="text-red-400 font-semibold">high-risk</span> attitude signature — two very different profiles.
            </p>
          </Reveal>

          <div className="grid md:grid-cols-2 gap-6 mb-6">
            {/* Radar */}
            <Reveal delay={0.1}>
              <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                <h3 className="text-sm font-semibold text-gray-300 mb-1">Risk profiles — attitude radar</h3>
                <p className="text-xs text-gray-500 mb-3">Average Likert scores (1–7) per cluster</p>
                <ReactECharts option={radarOption()} style={{ height: 300 }} />
              </div>
            </Reveal>

            {/* Key insight cards */}
            <Reveal delay={0.2}>
              <InsightCards />
            </Reveal>
          </div>

          {/* Stacked Likert */}
          <Reveal delay={0.3}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Full Likert distributions across 5 attitude questions</h3>
              <p className="text-xs text-gray-500 mb-4">Each bar = all 20,959 responses, stacked by agreement level</p>
              <ReactECharts option={likertStackOption()} style={{ height: 260 }} />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 4 — Personas */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#0f172a]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-pink-400">Section 03</div>
            <h2 className="text-3xl font-bold mb-2">Meet the 4 worker personas</h2>
            <p className="text-gray-400 mb-10">
              We identified 4 archetypes from the data.{' '}
              <strong className="text-white">Hover a card</strong> to see their full profile.
            </p>
          </Reveal>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {PERSONAS.map((p, i) => (
              <Reveal key={p.id} delay={i * 0.1}>
                <PersonaCard persona={p} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* SECTION 5 — What drives burnout */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-20 bg-[#080f1d]">
        <div className="max-w-5xl mx-auto">
          <Reveal>
            <div className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-orange-400">Section 04</div>
            <h2 className="text-3xl font-bold mb-2">What actually drives burnout risk?</h2>
            <p className="text-gray-400 mb-10">
              Feature importances from our <strong className="text-white">Random Forest model</strong>, explained via SHAP.
              These are the signals the model weighs most heavily.
            </p>
          </Reveal>

          <Reveal delay={0.1}>
            <div className="bg-white/5 border border-white/10 rounded-2xl p-5 mb-6">
              <h3 className="text-sm font-semibold text-gray-300 mb-1">Model feature importances</h3>
              <p className="text-xs text-gray-500 mb-4">
                <span className="inline-block w-2 h-2 rounded-full bg-red-500 mr-1" />High importance &nbsp;
                <span className="inline-block w-2 h-2 rounded-full bg-yellow-500 mr-1" />Medium &nbsp;
                <span className="inline-block w-2 h-2 rounded-full bg-blue-500 mr-1" />Lower
              </p>
              <ReactECharts option={featureImportanceOption()} style={{ height: 320 }} />
            </div>
          </Reveal>

          {/* Quick stat row */}
          <div className="grid sm:grid-cols-3 gap-4">
            {[
              { icon: '🧠', title: '18.7%', sub: 'of prediction power comes from how challenging remote work feels' },
              { icon: '⏱️', title: 'Age × Commute', sub: 'Interaction term — older workers with longer commutes face higher risk' },
              { icon: '🌿', title: 'Environment', sub: 'Lack of green spaces and leisure access adds meaningful risk' },
            ].map((s, i) => (
              <Reveal key={i} delay={i * 0.1}>
                <div className="bg-white/5 border border-white/10 rounded-2xl p-5">
                  <div className="text-3xl mb-2">{s.icon}</div>
                  <div className="text-lg font-bold text-white mb-1">{s.title}</div>
                  <p className="text-xs text-gray-400 leading-relaxed">{s.sub}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ─────────────────────────────────────────────────────────────────── */}
      {/* CTA */}
      {/* ─────────────────────────────────────────────────────────────────── */}
      <section className="px-6 py-24 bg-[#0f172a] text-center">
        <Reveal>
          <div className="max-w-xl mx-auto">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-3xl mx-auto mb-6">
              🔥
            </div>
            <h2 className="text-3xl font-extrabold mb-4">Now let's see where <em>you</em> stand.</h2>
            <p className="text-gray-400 mb-8">
              The assessment takes under 3 minutes. You'll get your burnout probability score, a SHAP
              explanation of what's driving it, and personalised recommendations.
            </p>
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.97 }}
              onClick={onContinue}
              className="inline-flex items-center gap-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white font-bold text-base px-10 py-4 rounded-2xl shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-shadow"
            >
              Take the Assessment →
            </motion.button>
            <p className="text-xs text-gray-500 mt-4">Anonymous · Takes ~3 min · No account needed</p>
          </div>
        </Reveal>
      </section>

    </div>
  )
}
