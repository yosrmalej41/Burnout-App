import { useState } from 'react'
import { motion } from 'framer-motion'

export default function OpenFeedback() {
  const [text, setText] = useState('')
  const [status, setStatus] = useState(null) // null | 'sending' | 'done' | 'error'

  const handleSubmit = async () => {
    if (!text.trim()) return
    setStatus('sending')
    try {
      const res = await fetch('/api/log-feedback', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ feedback_text: text.trim() }),
      })
      if (!res.ok) throw new Error()
      setStatus('done')
    } catch {
      setStatus('error')
    }
  }

  return (
    <div className="card border-l-4 border-[#2c3e50]">
      <h2 className="text-lg font-semibold text-white mb-1">
        💬 Is There Something We Didn't Ask?
      </h2>
      <p className="text-sm text-slate-400 mb-4 leading-relaxed">
        Think there's a factor causing your burnout that our model didn't capture?
        Tell us — your input helps shape future research and better features.
      </p>

      {status === 'done' ? (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 border border-green-200 rounded-xl p-4 flex items-center gap-3"
        >
          <span className="text-2xl">🙏</span>
          <div>
            <p className="text-sm font-semibold text-green-800">Thank you for your feedback!</p>
            <p className="text-xs text-green-600 mt-0.5">Your response has been recorded anonymously for future research.</p>
          </div>
        </motion.div>
      ) : (
        <>
          <textarea
            value={text}
            onChange={e => setText(e.target.value)}
            placeholder="e.g. My manager's communication style, constant context-switching, lack of career growth opportunities, caring for a family member..."
            rows={4}
            className="w-full border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-white/20 resize-none bg-white/5 leading-relaxed"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-slate-500">Anonymous · Not used in prediction · Research only</p>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={!text.trim() || status === 'sending'}
              className="btn-primary text-sm py-2 px-5 disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {status === 'sending' ? (
                <>
                  <svg className="animate-spin h-3.5 w-3.5" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Sending…
                </>
              ) : 'Submit Feedback'}
            </button>
          </div>
          {status === 'error' && (
            <p className="text-xs text-red-500 mt-2">⚠️ Could not send. Please try again.</p>
          )}
        </>
      )}
    </div>
  )
}
