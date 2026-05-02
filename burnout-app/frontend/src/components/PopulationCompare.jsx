import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, ResponsiveContainer } from 'recharts'

function generateDistribution() {
  const points = [], mean = 0.45, std = 0.22
  for (let x = 0; x <= 100; x += 2) {
    const xNorm = x / 100
    const y = (1 / (std * Math.sqrt(2 * Math.PI))) * Math.exp(-0.5 * ((xNorm - mean) / std) ** 2)
    points.push({ x, y: parseFloat(y.toFixed(4)) })
  }
  return points
}

const distData = generateDistribution()

function getPercentile(pct) {
  const mean = 45, std = 22
  const z = (pct - mean) / (std * Math.SQRT2)
  const erf = (x) => {
    const t = 1 / (1 + 0.3275911 * Math.abs(x))
    const poly = t * (0.254829592 + t * (-0.284496736 + t * (1.421413741 + t * (-1.453152027 + t * 1.061405429))))
    return 1 - poly * Math.exp(-x * x)
  }
  const percentile = 0.5 * (1 + (x => x >= 0 ? erf(x) : -erf(-x))(z))
  return Math.round(percentile * 100)
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-[#1e293b] border border-white/10 shadow-lg rounded-lg p-2 text-xs">
      <p className="text-slate-300">Risk level: <strong className="text-white">{payload[0].payload.x}%</strong></p>
      <p className="text-slate-300">Density: <strong className="text-white">{payload[0].value.toFixed(3)}</strong></p>
    </div>
  )
}

export default function PopulationCompare({ probability }) {
  const pct = Math.round(probability * 100)
  const percentile = getPercentile(pct)
  const isHigh = pct >= 50

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-1">How Do You Compare?</h2>
      <p className="text-sm text-slate-400 mb-2">Your position among 20,959 remote workers surveyed</p>

      <div className="flex items-center gap-3 mb-6 p-4 rounded-xl"
           style={{ background: isHigh ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
                    border: `1px solid ${isHigh ? 'rgba(231,76,60,0.25)' : 'rgba(46,204,113,0.25)'}` }}>
        <span className="text-2xl">{isHigh ? '📊' : '🛡️'}</span>
        <p className="text-sm font-medium" style={{ color: isHigh ? '#e74c3c' : '#2ecc71' }}>
          You are at higher risk than <strong>{percentile}%</strong> of people in our dataset.
          {isHigh ? ' Consider the recommendations above to reduce your risk.' : ' You are doing well — keep up your healthy habits!'}
        </p>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={distData} margin={{ left: 0, right: 16, top: 8, bottom: 4 }}>
          <defs>
            <linearGradient id="populationGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor="#94a3b8" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#94a3b8" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="userGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%"  stopColor={isHigh ? '#e74c3c' : '#2ecc71'} stopOpacity={0.4} />
              <stop offset="95%" stopColor={isHigh ? '#e74c3c' : '#2ecc71'} stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1e293b" />
          <XAxis dataKey="x" tickFormatter={v => `${v}%`} tick={{ fontSize: 10, fill: '#64748b' }}
            label={{ value: 'Burnout Risk Level', position: 'insideBottom', offset: -2, fontSize: 11, fill: '#64748b' }} />
          <YAxis hide />
          <Tooltip content={<CustomTooltip />} />
          <Area type="monotone" dataKey="y" stroke="#475569" strokeWidth={2} fill="url(#populationGrad)" />
          <ReferenceLine x={pct} stroke={isHigh ? '#e74c3c' : '#2ecc71'} strokeWidth={3} strokeDasharray="6 3"
            label={{ value: `You: ${pct}%`, position: 'top', fontSize: 12, fill: isHigh ? '#e74c3c' : '#2ecc71', fontWeight: 'bold' }} />
        </AreaChart>
      </ResponsiveContainer>

      <div className="grid grid-cols-3 gap-3 mt-5 text-center">
        {[
          { label: 'Low Risk',      range: '0–39%',   color: '#2ecc71' },
          { label: 'Moderate Risk', range: '40–59%',  color: '#f39c12' },
          { label: 'High Risk',     range: '60–100%', color: '#e74c3c' },
        ].map(z => (
          <div key={z.label} className="p-3 rounded-xl" style={{ background: z.color + '15', borderLeft: `3px solid ${z.color}` }}>
            <div className="text-xs font-semibold" style={{ color: z.color }}>{z.label}</div>
            <div className="text-xs text-slate-400">{z.range}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
