import { motion } from 'framer-motion'

const FEATURE_ADVICE = {
  'Commute_squared': { positive: { title: 'Reduce Your Commute', body: 'Your commute time is a significant factor. Consider negotiating more remote days or exploring a closer office. Even reducing commute by 30 min can meaningfully lower burnout risk.', icon: '🚗', color: '#e74c3c' } },
  'Age_x_Commute': { positive: { title: 'Balance Age & Commute', body: 'The interaction between your age and commute contributes to risk. Prioritise recovery routines and explore hybrid arrangements to reduce physical strain from commuting.', icon: '⚖️', color: '#e74c3c' } },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....': {
    positive: { title: 'Tackle Remote Productivity', body: 'Feeling unproductive remotely is strongly linked to burnout. Try time-blocking, a dedicated workspace, and the Pomodoro technique.', icon: '⏱️', color: '#e74c3c' },
    negative: { title: 'Strong Remote Productivity', body: 'Your remote productivity is a protective factor. Keep your current routines and share what works with colleagues who struggle.', icon: '💪', color: '#2ecc71' },
  },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..': {
    positive: { title: 'Advocate for Location Flexibility', body: 'Location flexibility is important to you but may not be fully met. Talk to your manager about a hybrid model.', icon: '📍', color: '#f39c12' },
    negative: { title: 'Flexibility Keeps You Grounded', body: 'Your satisfaction with location flexibility is protecting you from burnout. Advocate to keep it.', icon: '🏡', color: '#2ecc71' },
  },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.adjust.my.work.schedule.based.on.personal.circumstances..': {
    positive: { title: 'Push for Schedule Flexibility', body: 'Schedule flexibility matters to you. Have a direct conversation with your manager about asynchronous work options.', icon: '🕐', color: '#f39c12' },
  },
  'When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important': {
    positive: { title: 'Seek Out Green Spaces', body: 'Lacking nearby green space is affecting your wellbeing. Consider weekend nature trips or adding plants to your workspace.', icon: '🌿', color: '#f39c12' },
  },
  'When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important': {
    positive: { title: 'Reconnect with Leisure', body: 'Missing leisure activities contributes to your risk. Schedule weekly social or cultural activities deliberately.', icon: '🎭', color: '#f39c12' },
  },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...': {
    positive: { title: 'Address Remote Work Challenges', body: 'Finding remote work challenging is a key risk signal. Identify your top 3 pain points and tackle them with tools and boundaries.', icon: '🛠️', color: '#e74c3c' },
  },
}

const GENERIC_ADVICE = [
  { title: 'Build Recovery Rituals', body: 'Schedule non-negotiable daily recovery: a morning walk, a proper lunch break, and a clear end-of-day routine.', icon: '🔄', color: '#2ecc71' },
  { title: 'Connect with Colleagues', body: 'Remote work isolation is a major burnout driver. Schedule virtual coffee chats or join a coworking space once a week.', icon: '🤝', color: '#2ecc71' },
  { title: 'Protect Your Energy', body: 'Match your most demanding work to your peak hours. Protect time blocks for deep focus.', icon: '⚡', color: '#2ecc71' },
]

export default function Recommendations({ shapValues, probability }) {
  const recs = []
  for (const shap of shapValues) {
    if (recs.length >= 3) break
    const advice = FEATURE_ADVICE[shap.feature]
    if (!advice) continue
    if (shap.shap_value > 0 && advice.positive) recs.push(advice.positive)
    if (shap.shap_value < 0 && advice.negative) recs.push(advice.negative)
  }
  while (recs.length < 3) recs.push(GENERIC_ADVICE[recs.length % GENERIC_ADVICE.length])

  return (
    <div className="card">
      <h2 className="text-lg font-semibold text-white mb-1">Personalised Recommendations</h2>
      <p className="text-sm text-slate-400 mb-6">Targeted actions based on your top risk factors</p>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recs.map((r, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}
            className="rounded-xl p-4 border" style={{ borderColor: r.color + '40', background: r.color + '12' }}>
            <div className="text-2xl mb-2">{r.icon}</div>
            <h3 className="font-semibold text-sm text-white mb-1">{r.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed">{r.body}</p>
          </motion.div>
        ))}
      </div>
    </div>
  )
}
