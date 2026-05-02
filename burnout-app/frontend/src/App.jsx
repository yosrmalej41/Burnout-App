import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import EDAPage from './pages/EDAPage'
import PreAssessmentPage from './pages/PreAssessmentPage'
import FormPage from './pages/FormPage'
import ResultsPage from './pages/ResultsPage'

export default function App() {
  const [stage, setStage] = useState('eda')       // 'eda' | 'pre' | 'form' | 'results'
  const [preAssessment, setPreAssessment] = useState(null)
  const [result, setResult] = useState(null)
  const [formData, setFormData] = useState(null)
  const [personaDefaults, setPersonaDefaults] = useState(null)

  const handlePersonaSelect = (values) => {
    setPersonaDefaults(values)
    setStage('form')
  }

  const handlePreComplete = (data) => {
    setPreAssessment(data)
    setStage('form')
  }

  const handleResult = (data, inputs) => {
    setResult(data)
    setFormData(inputs)
    setStage('results')
  }

  const handleReset = () => {
    setStage('eda')
    setPreAssessment(null)
    setResult(null)
    setFormData(null)
    setPersonaDefaults(null)
  }

  return (
    <div className="min-h-screen bg-[#0f172a]">
      <AnimatePresence mode="wait">
        {stage === 'eda' && (
          <motion.div key="eda"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}
          >
            <EDAPage
              onContinue={() => setStage('pre')}
              onPersonaSelect={handlePersonaSelect}
            />
          </motion.div>
        )}

        {stage === 'pre' && (
          <motion.div key="pre"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
          >
            <PreAssessmentPage onComplete={handlePreComplete} />
          </motion.div>
        )}

        {stage === 'form' && (
          <motion.div key="form"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
          >
            <FormPage onResult={handleResult} defaults={personaDefaults} />
          </motion.div>
        )}

        {stage === 'results' && (
          <motion.div key="results"
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.35 }}
          >
            <ResultsPage
              result={result}
              formData={formData}
              preAssessment={preAssessment}
              onReset={handleReset}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
