import { useRef } from 'react'

function getColor(pct) {
  if (pct < 40) return '#2ecc71'
  if (pct < 60) return '#f39c12'
  return '#e74c3c'
}
function getLabel(pct) {
  if (pct < 30) return 'Very Low'
  if (pct < 50) return 'Low'
  if (pct < 65) return 'Moderate'
  if (pct < 80) return 'High'
  return 'Very High'
}

export default function RiskProfileCard({ result }) {
  const cardRef = useRef(null)
  const pct = Math.round(result.probability * 100)
  const color = getColor(pct)
  const label = getLabel(pct)
  const riskFactors = result.shap_values.filter(d => d.shap_value > 0).slice(0, 3)
  const protectors  = result.shap_values.filter(d => d.shap_value < 0).slice(0, 3)

  const handleDownload = async () => {
    try {
      const { default: jsPDF }       = await import('jspdf')
      const { default: html2canvas } = await import('html2canvas')
      const canvas  = await html2canvas(cardRef.current, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      const pdf = new jsPDF({ orientation: 'portrait', unit: 'px', format: [canvas.width / 2, canvas.height / 2] })
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width / 2, canvas.height / 2)
      pdf.save('burnout-risk-profile.pdf')
    } catch (e) { console.error('PDF export failed:', e) }
  }

  return (
    <div className="card flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Risk Profile Card</h2>
        <button onClick={handleDownload}
          className="flex items-center gap-1.5 text-xs bg-white/10 border border-white/10 text-white px-3 py-1.5 rounded-lg hover:bg-white/20 transition-all">
          <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download PDF
        </button>
      </div>

      <div ref={cardRef} className="flex-1 bg-[#1e293b] rounded-xl p-4 border border-white/10">
        <div className="flex items-center gap-3 mb-5 p-3 rounded-xl" style={{ background: color + '15' }}>
          <div className="w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg" style={{ background: color }}>
            {pct}%
          </div>
          <div>
            <div className="font-bold text-lg" style={{ color }}>{label} Risk</div>
            <div className="text-xs text-slate-400">{result.risk_label} · Model accuracy 76.2%</div>
          </div>
        </div>

        <div className="mb-4">
          <p className="text-xs font-semibold text-red-400 uppercase tracking-wide mb-2">⬆️ Top Risk Factors</p>
          {riskFactors.length === 0
            ? <p className="text-xs text-slate-500 italic">No major risk factors detected</p>
            : riskFactors.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{f.label}</span>
              </div>
            ))}
        </div>

        <div>
          <p className="text-xs font-semibold text-green-400 uppercase tracking-wide mb-2">⬇️ Protective Factors</p>
          {protectors.length === 0
            ? <p className="text-xs text-slate-500 italic">No strong protective factors detected</p>
            : protectors.map((f, i) => (
              <div key={i} className="flex items-center gap-2 mb-1.5">
                <div className="w-1.5 h-1.5 rounded-full bg-green-400 flex-shrink-0" />
                <span className="text-xs text-slate-300">{f.label}</span>
              </div>
            ))}
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 text-xs text-slate-500">
          Burnout Risk Predictor · Based on 20,959 survey respondents · 2024
        </div>
      </div>
    </div>
  )
}
