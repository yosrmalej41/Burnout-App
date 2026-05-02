🔥 Burnout Risk Prediction Among Remote Workers
A Machine-Learning Approach with Explainable AI and Interactive Web Deployment
![Python](https://img.shields.io/badge/Python-3.11-blue?logo=python) ![React](https://img.shields.io/badge/React-18.3-61DAFB?logo=react) ![FastAPI](https://img.shields.io/badge/FastAPI-0.110-009688?logo=fastapi) ![Accuracy](https://img.shields.io/badge/Accuracy-76.22%25-brightgreen) ![AUC](https://img.shields.io/badge/AUC-0.84-orange)
---
📌 Overview
Remote work has become a permanent fixture of modern employment, yet its psychological costs remain poorly understood at scale. This project provides a data-driven, personalised burnout risk prediction tool for remote workers — powered by Machine Learning, explainable AI (SHAP), and deployed as a full-stack web application.
> **Dataset:** R-MAP EU Remote Work Survey — 20,959 respondents, 97 features (Prolific, July 2024)  
> **Task:** Binary classification — Burnout Risk (High / Low)  
> **Best Model:** Calibrated Random Forest — **76.22% test accuracy / 0.84 AUC**
---
🖼️ Screenshot
<img width="1173" height="537" alt="image" src="https://github.com/user-attachments/assets/9a121f46-a701-47ba-a389-68ee90516390" />

---
🚀 Features
🎯 Per-user risk gauge — personalised burnout probability score
📊 Interactive SHAP bar chart — understand which factors drive your risk
💡 Evidence-based recommendations — actionable, personalised advice
👥 Population comparison chart — see how you compare to others
🔬 Live What-If Simulator — explore how changes affect your risk score
🏆 Gamified Pro Feature unlocks — engaging UX layer
---
📂 Project Structure
```
burnout-app/
├── backend/
│   ├── main.py               # FastAPI server & prediction endpoint
│   ├── export_scaler.py      # Scaler export utility
│   └── model/                # Trained model & preprocessing artifacts
├── frontend/
│   ├── src/
│   │   ├── pages/            # FormPage, ResultsPage, EDAPage, PreAssessmentPage
│   │   ├── components/       # RiskGauge, ShapChart, Recommendations, WhatIfSimulator...
│   │   └── utils/            # personas.js
│   ├── dist/                 # Production build
│   └── vite.config.js
└── burnoutnotebook.ipynb     # Full ML pipeline notebook
```
---
🧠 Methodology
Data: R-MAP EU Remote Work Outcomes Survey (20,959 respondents, 97 variables)
Target Engineering: Binary burnout label from 3 Likert items (personal impact, career impact, work-life balance)
Preprocessing: Missing-value imputation, IQR-based outlier capping, ordinal/one-hot encoding, feature engineering (interaction & polynomial terms)
Feature Selection: Consensus selection reducing 100 → 15 features
Models: Random Forest vs XGBoost — both trained and compared
Calibration: Isotonic regression for reliable probability estimates
Explainability: SHAP values per individual prediction
---
📈 Results
Model	Accuracy	AUC
Calibrated Random Forest	76.22%	0.84
XGBoost	75.50%	—
Top 3 SHAP predictors:
Remote work challenges
Perceived productivity loss
Preference for remote work
> A 15-feature model performs essentially as well as a 100-feature baseline (76.22% vs theoretical ceiling of 76.4%), confirming that **parsimonious, interpretable models are both feasible and clinically meaningful**.
---
🛠️ Tech Stack
Component	Version
Python	3.11
scikit-learn	1.4.x
XGBoost	2.0.x
SHAP	0.45.x
FastAPI	0.110.x
Uvicorn	0.29.x
Node.js	20.x LTS
React	18.3.x
Vite	8.x
Tailwind CSS	3.4.x
Framer Motion	11.x
Recharts	2.x
ECharts	5.x
---
⚙️ Getting Started
Backend
```bash
cd burnout-app/backend
pip install -r requirements.txt
uvicorn main:app --reload
```
Frontend
```bash
cd burnout-app/frontend
npm install
npm run dev
```
---
📊 Dataset
R-MAP EU Remote Work Outcomes Survey
20,959 remote workers across Europe
Collected via Prolific, July 2024
97 variables: work-style preferences, commuting behaviour, urban amenities access, employment type, demographics, subjective wellbeing
---
👩‍💻 Author
Yosr Malej  
GitHub
