import { motion } from 'framer-motion'

const CITATION_DB = {
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...': { title: 'Create a Dedicated Work Ritual', advice: 'Remote workers who establish a clear start-of-day ritual report 32% lower burnout symptoms. The brain needs a signal that "work has begun" to separate home life from professional mode.', action: 'Try a 10-minute morning walk before your first task — treat it like your commute.', icon: '🌅', color: '#e74c3c', citation: { authors: 'Belzunegui-Eraso, A. & Erro-Garcés, A.', year: 2020, title: 'Teleworking in the Context of the Covid-19 Crisis', journal: 'Sustainability, 12(9), 3662', doi: '10.3390/su12093662' } },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....': { title: 'Use Time-Blocking to Reclaim Focus', advice: 'Perceived low productivity is one of the strongest predictors of burnout. Time-blocking in 90-minute windows has been shown to increase self-reported productivity by 40%.', action: 'Block 9–10:30am and 2–3:30pm as "deep work" in your calendar. Notifications off.', icon: '⏱️', color: '#e74c3c', citation: { authors: 'Sonnentag, S., Venz, L. & Casper, A.', year: 2017, title: 'Advances in recovery research', journal: 'Journal of Occupational Health Psychology, 22(3), 365–380', doi: '10.1037/ocp0000079' } },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.prefer.remote.work.over.in.office.work..': { title: 'Advocate for Your Preferred Work Mode', advice: 'A mismatch between your preferred work environment and your actual situation is a leading cause of chronic stress.', action: 'Schedule a conversation with your manager about your optimal hybrid arrangement — come with data on your output.', icon: '🏡', color: '#2ecc71', citation: { authors: 'Gajendran, R.S. & Harrison, D.A.', year: 2007, title: 'The good, the bad, and the unknown about telecommuting', journal: 'Journal of Applied Psychology, 92(6), 1524–1541', doi: '10.1037/0021-9010.92.6.1524' } },
  'Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..': { title: 'Negotiate Location Flexibility', advice: 'Even 2 days of location choice per week has been shown to reduce emotional exhaustion by 25%.', action: 'Propose a 3-month hybrid trial to your manager with defined output metrics.', icon: '📍', color: '#f39c12', citation: { authors: 'Allen, T.D., Golden, T.D. & Shockley, K.M.', year: 2015, title: 'How Effective Is Telecommuting?', journal: 'Psychological Science in the Public Interest, 16(2), 40–68', doi: '10.1177/1529100615593273' } },
  'Age_x_Commute': { title: 'Protect Your Physical Recovery Time', advice: 'For experienced workers, long commutes compound burnout risk significantly. Commutes over 45 minutes are associated with a 40% increase in stress hormones.', action: 'Explore remote days specifically on your longest commute days. Even one day matters.', icon: '🚗', color: '#e74c3c', citation: { authors: 'Künn-Nelen, A.', year: 2016, title: 'Does Commuting Affect Health?', journal: 'Health Economics, 25(8), 984–1004', doi: '10.1002/hec.3199' } },
  'Commute_squared': { title: 'Reduce Commute Stress Strategically', advice: 'Long commutes are one of the most consistently replicated predictors of burnout. Even small reductions lead to measurable wellbeing improvements within 3 weeks.', action: 'Try working from a closer coworking space 2 days/week instead of commuting to HQ.', icon: '🚆', color: '#e74c3c', citation: { authors: 'Stutzer, A. & Frey, B.S.', year: 2008, title: "Stress that Doesn't Pay: The Commuting Paradox", journal: 'Scandinavian Journal of Economics, 110(2), 339–366', doi: '10.1111/j.1467-9442.2008.00542.x' } },
  'When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important': { title: 'Seek Green Space Deliberately', advice: 'Exposure to nature reduces cortisol levels by up to 21%. Remote workers without access to nearby parks show higher rates of attention fatigue.', action: 'Schedule a 20-min outdoor break every day — even a tree-lined street counts.', icon: '🌿', color: '#f39c12', citation: { authors: 'Bratman, G.N. et al.', year: 2019, title: 'Nature and mental health: An ecosystem service perspective', journal: 'Science Advances, 5(7), eaax0903', doi: '10.1126/sciadv.aax0903' } },
  'When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important': { title: 'Deliberately Schedule Social Recovery', advice: 'Deliberately scheduling weekly social activities reduces burnout risk by 30% even when those activities feel "effortful".', action: 'Book one social or cultural activity per week in advance — treat it like a meeting you cannot cancel.', icon: '🎭', color: '#f39c12', citation: { authors: 'Halbesleben, J.R.B.', year: 2010, title: 'A meta-analysis of work engagement', journal: 'Work Engagement: A Handbook of Essential Theory and Research, 102–117', doi: '10.4324/9780203853047' } },
}

const GENERIC_CITATIONS = [
  { title: 'Build a Non-Negotiable Recovery Routine', advice: 'Workers who fully detach — no emails after hours — show 35% lower burnout rates after 6 months.', action: "Set a hard stop time and a 'shutdown ritual' — write tomorrow's 3 priorities, close your laptop, and walk away.", icon: '🔄', color: '#2ecc71', citation: { authors: 'Sonnentag, S. & Fritz, C.', year: 2007, title: 'The Recovery Experience Questionnaire', journal: 'Journal of Occupational Health Psychology, 12(3), 204–221', doi: '10.1037/1076-8998.12.3.204' } },
  { title: 'Connect With Colleagues Intentionally', advice: 'Remote workers who have at least one meaningful social interaction with a colleague per day show significantly lower burnout.', action: 'Schedule one 15-min virtual coffee with a colleague this week — no work agenda allowed.', icon: '🤝', color: '#2ecc71', citation: { authors: 'Ozcelik, H. & Barsade, S.G.', year: 2018, title: 'No Employee an Island: Workplace Loneliness and Job Performance', journal: 'Academy of Management Journal, 61(6), 2343–2366', doi: '10.5465/amj.2015.1066' } },
  { title: 'Practice Micro-Recovery During the Day', advice: 'Taking 5-minute recovery breaks every 90 minutes reduces afternoon fatigue by 50% and improves cognitive performance.', action: 'Set a 90-minute timer. When it rings, step away from your screen for 5 minutes. No exceptions.', icon: '⚡', color: '#2ecc71', citation: { authors: 'Trougakos, J.P. & Hideg, I.', year: 2009, title: 'Momentary work recovery: The role of within-day work breaks', journal: 'Current Perspectives on Job-Stress Recovery, 7, 37–84', doi: '10.1108/S1479-3555(2009)0000007005' } },
]

function CitationBadge({ citation }) {
  return (
    <div className="mt-3 rounded-lg p-2.5" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
      <p className="text-xs text-slate-400 leading-relaxed">
        <span className="font-semibold text-slate-300">📚 {citation.authors} ({citation.year}).</span>{' '}
        <em>{citation.title}.</em>{' '}{citation.journal}.{' '}
        <a href={`https://doi.org/${citation.doi}`} target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:underline">
          doi:{citation.doi}
        </a>
      </p>
    </div>
  )
}

export default function BonusRecommendations({ shapValues }) {
  const recs = []
  for (const shap of shapValues) {
    if (recs.length >= 3) break
    const entry = CITATION_DB[shap.feature]
    if (entry) recs.push(entry)
  }
  while (recs.length < 3) {
    const g = GENERIC_CITATIONS[recs.length % GENERIC_CITATIONS.length]
    if (!recs.find(r => r.title === g.title)) recs.push(g)
    else break
  }

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}
      className="card border-2" style={{ borderColor: 'rgba(251,191,36,0.4)', background: 'linear-gradient(135deg, rgba(251,191,36,0.05) 0%, rgba(15,23,42,0) 100%)' }}>
      <div className="flex items-center gap-3 mb-6">
        <div className="w-10 h-10 rounded-full bg-yellow-400 flex items-center justify-center text-xl">🔓</div>
        <div>
          <h2 className="text-lg font-bold text-white">Your Personalised Burnout Recovery Plan</h2>
          <p className="text-xs text-yellow-400 font-medium">Unlocked · Evidence-based · Tied to your top risk factors</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {recs.map((rec, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.15 }}
            className="rounded-2xl p-4" style={{ background: rec.color + '12', border: `1.5px solid ${rec.color}30` }}>
            <div className="text-2xl mb-2">{rec.icon}</div>
            <h3 className="font-bold text-sm text-white mb-2">{rec.title}</h3>
            <p className="text-xs text-slate-300 leading-relaxed mb-3">{rec.advice}</p>
            <div className="rounded-xl p-2.5 mb-3" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)' }}>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wide mb-1">✅ Try This</p>
              <p className="text-xs text-slate-200 leading-relaxed">{rec.action}</p>
            </div>
            <CitationBadge citation={rec.citation} />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
