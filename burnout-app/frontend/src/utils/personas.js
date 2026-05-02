export const PERSONAS = [
  {
    id: 'couch-ceo',
    emoji: '🧘',
    image: '/persona-couch-ceo.jpg',
    name: 'The Couch CEO',
    tagline: 'Thrives working from home, values freedom above all.',
    risk: 'Low Risk',
    riskColor: '#2ecc71',
    riskBg: 'bg-emerald-50',
    riskBorder: 'border-emerald-300',
    traits: ['Handles meetings from the couch', 'Zero commute', 'WFH legend'],
    traitColors: ['bg-blue-100 text-blue-700', 'bg-purple-100 text-purple-700', 'bg-green-100 text-green-700'],
    gradient: 'from-emerald-500 to-teal-600',
    features: [
      { label: 'Prefers remote',       value: '7 / 7' },
      { label: 'Finds it challenging', value: '2 / 7' },
      { label: 'Feels less productive',value: '2 / 7' },
      { label: 'Flex location',        value: '7 / 7' },
      { label: 'Flex schedule',        value: '6 / 7' },
      { label: 'Age',                  value: '29 yrs' },
      { label: 'Experience',           value: '4 yrs' },
      { label: 'Commute',              value: '5 min' },
      { label: 'Full-time',            value: 'Yes' },
      { label: 'Student',              value: 'No' },
    ],
    formValues: {
      age: 29, years_experience: 4, student: 0, full_time: 1,
      challenging: 2, less_productive: 2, prefer_remote: 7,
      flexibility_location: 7, flexibility_schedule: 6,
      commute_minutes: 5, work_changes_location: 0,
      healthcare_nearby: 1, park_missing: 0, leisure_missing: 0, car_parking_cowork: 0,
    },
  },
  {
    id: 'exhausted-expert',
    emoji: '🔥',
    image: '/persona-exhausted-expert.jpg',
    name: 'The Exhausted Expert',
    tagline: 'Senior professional, high pressure, struggling remotely.',
    risk: 'High Risk',
    riskColor: '#e74c3c',
    riskBg: 'bg-red-50',
    riskBorder: 'border-red-300',
    traits: ['Running on caffeine', 'Calendar fully booked', 'Please no more Zoom'],
    traitColors: ['bg-orange-100 text-orange-700', 'bg-red-100 text-red-700', 'bg-yellow-100 text-yellow-700'],
    gradient: 'from-red-500 to-orange-600',
    features: [
      { label: 'Prefers remote',       value: '2 / 7' },
      { label: 'Finds it challenging', value: '6 / 7' },
      { label: 'Feels less productive',value: '6 / 7' },
      { label: 'Flex location',        value: '3 / 7' },
      { label: 'Flex schedule',        value: '3 / 7' },
      { label: 'Age',                  value: '42 yrs' },
      { label: 'Experience',           value: '12 yrs' },
      { label: 'Commute',              value: '60 min' },
      { label: 'Full-time',            value: 'Yes' },
      { label: 'Student',              value: 'No' },
    ],
    formValues: {
      age: 42, years_experience: 12, student: 0, full_time: 1,
      challenging: 6, less_productive: 6, prefer_remote: 2,
      flexibility_location: 3, flexibility_schedule: 3,
      commute_minutes: 60, work_changes_location: 0,
      healthcare_nearby: 0, park_missing: 1, leisure_missing: 1, car_parking_cowork: 1,
    },
  },
  {
    id: 'cafe-hopper',
    emoji: '🎒',
    image: '/persona-cafe-hopper.jpg',
    name: 'The Café Hopper',
    tagline: 'Chasing good connection and cheap coffee.',
    risk: 'Medium Risk',
    riskColor: '#f39c12',
    riskBg: 'bg-amber-50',
    riskBorder: 'border-amber-300',
    traits: ['Work changes', 'Young & flexible', 'Student'],
    traitColors: ['bg-sky-100 text-sky-700', 'bg-violet-100 text-violet-700', 'bg-amber-100 text-amber-700'],
    gradient: 'from-amber-400 to-orange-500',
    features: [
      { label: 'Prefers remote',       value: '6 / 7' },
      { label: 'Finds it challenging', value: '3 / 7' },
      { label: 'Feels less productive',value: '3 / 7' },
      { label: 'Flex location',        value: '7 / 7' },
      { label: 'Flex schedule',        value: '7 / 7' },
      { label: 'Age',                  value: '26 yrs' },
      { label: 'Experience',           value: '2 yrs' },
      { label: 'Commute',              value: '0 min' },
      { label: 'Full-time',            value: 'No' },
      { label: 'Student',              value: 'Yes' },
    ],
    formValues: {
      age: 26, years_experience: 2, student: 1, full_time: 0,
      challenging: 3, less_productive: 3, prefer_remote: 6,
      flexibility_location: 7, flexibility_schedule: 7,
      commute_minutes: 0, work_changes_location: 1,
      healthcare_nearby: 0, park_missing: 1, leisure_missing: 0, car_parking_cowork: 0,
    },
  },
  {
    id: 'nine-to-five',
    emoji: '🏢',
    image: '/persona-nine-to-five.jpg',
    name: 'The 9-to-5 Defender',
    tagline: 'Clocks out at exactly 17:00, no exceptions.',
    risk: 'Medium Risk',
    riskColor: '#f39c12',
    riskBg: 'bg-amber-50',
    riskBorder: 'border-amber-300',
    traits: ['Prefers office', 'No green space', 'Moderate exp'],
    traitColors: ['bg-indigo-100 text-indigo-700', 'bg-rose-100 text-rose-700', 'bg-teal-100 text-teal-700'],
    gradient: 'from-slate-500 to-indigo-600',
    features: [
      { label: 'Prefers remote',       value: '2 / 7' },
      { label: 'Finds it challenging', value: '5 / 7' },
      { label: 'Feels less productive',value: '4 / 7' },
      { label: 'Flex location',        value: '4 / 7' },
      { label: 'Flex schedule',        value: '4 / 7' },
      { label: 'Age',                  value: '35 yrs' },
      { label: 'Experience',           value: '8 yrs' },
      { label: 'Commute',              value: '40 min' },
      { label: 'Full-time',            value: 'Yes' },
      { label: 'Student',              value: 'No' },
    ],
    formValues: {
      age: 35, years_experience: 8, student: 0, full_time: 1,
      challenging: 5, less_productive: 4, prefer_remote: 2,
      flexibility_location: 4, flexibility_schedule: 4,
      commute_minutes: 40, work_changes_location: 0,
      healthcare_nearby: 1, park_missing: 1, leisure_missing: 1, car_parking_cowork: 0,
    },
  },
]

// Normalized Euclidean distance across key features
export function matchPersona(formData) {
  const norm = (val, min, max) => (val - min) / (max - min)

  const toVec = (f) => [
    norm(f.challenging,         1, 7),
    norm(f.less_productive,     1, 7),
    norm(f.prefer_remote,       1, 7),
    norm(f.flexibility_location,1, 7),
    norm(f.flexibility_schedule,1, 7),
    norm(f.commute_minutes,     0, 120),
    norm(f.age,                 18, 65),
    f.work_changes_location,
    f.student,
    f.full_time,
  ]

  const userVec = toVec(formData)

  let bestMatch = null
  let bestDist = Infinity

  for (const persona of PERSONAS) {
    const pVec = toVec(persona.formValues)
    const dist = Math.sqrt(userVec.reduce((sum, v, i) => sum + (v - pVec[i]) ** 2, 0))
    if (dist < bestDist) {
      bestDist = dist
      bestMatch = persona
    }
  }

  return bestMatch
}
