import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ReferenceLine, Cell, ResponsiveContainer } from 'recharts'

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const d = payload[0].payload
  const isRisk = d.shap_value > 0
  return (
    <div className="bg-[#1e293b] border border-white/10 shadow-lg rounded-xl p-3 text-xs max-w-xs">
      <p className="font-semibold text-white mb-1">{d.label}</p>
      <p style={{ color: isRisk ? '#e74c3c' : '#2ecc71' }}>
        {isRisk ? '↑ Increases' : '↓ Decreases'} risk by {Math.abs(d.shap_value).toFixed(3)}
      </p>
    </div>
  )
}

export default function ShapChart({ shapValues }) {
  const top5 = shapValues.slice(0, 5)
  const data = top5.map(d => ({
    ...d,
    displayLabel: d.label.length > 40 ? d.label.slice(0, 38) + '…' : d.label,
    absVal: Math.abs(d.shap_value),
  })).sort((a, b) => a.shap_value - b.shap_value)

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-1">What Is Driving Your Burnout Risk?</h2>
      <p className="text-sm text-slate-400 mb-6">
        <span className="inline-block w-3 h-3 rounded-sm bg-[#e74c3c] mr-1" />Red = increases risk &nbsp;
        <span className="inline-block w-3 h-3 rounded-sm bg-[#2ecc71] mr-1" />Green = protects you
      </p>

      <ResponsiveContainer width="100%" height={280}>
        <BarChart data={data} layout="vertical" margin={{ left: 8, right: 40, top: 4, bottom: 4 }}>
          <CartesianGrid strokeDasharray="3 3" horizontal={false} stroke="#1e293b" />
          <XAxis type="number" tickFormatter={v => v.toFixed(2)} tick={{ fontSize: 11, fill: '#64748b' }} domain={['auto', 'auto']} />
          <YAxis type="category" dataKey="displayLabel" width={200} tick={{ fontSize: 11, fill: '#94a3b8' }} />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine x={0} stroke="#334155" strokeWidth={2} />
          <Bar dataKey="shap_value" radius={[0, 6, 6, 0]} maxBarSize={28}>
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.shap_value > 0 ? '#e74c3c' : '#2ecc71'} fillOpacity={0.85} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>

      <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
        {shapValues.slice(0, 5).map((d, i) => (
          <div key={i} className="flex items-start gap-2 p-3 rounded-xl"
               style={{ background: d.shap_value > 0 ? 'rgba(231,76,60,0.1)' : 'rgba(46,204,113,0.1)',
                        border: `1px solid ${d.shap_value > 0 ? 'rgba(231,76,60,0.25)' : 'rgba(46,204,113,0.25)'}` }}>
            <span className="text-base mt-0.5">{d.shap_value > 0 ? '⬆️' : '⬇️'}</span>
            <div>
              <p className="text-xs font-semibold" style={{ color: d.shap_value > 0 ? '#e74c3c' : '#2ecc71' }}>{d.label}</p>
              <p className="text-xs text-slate-400">{d.shap_value > 0 ? 'Raises' : 'Lowers'} risk by {Math.abs(d.shap_value).toFixed(3)}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
