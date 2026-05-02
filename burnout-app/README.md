# Burnout Risk Predictor

A full-stack ML web app — FastAPI backend + React frontend.

---

### 3. Start the backend

```bash
cd burnout-app/backend
pip install fastapi uvicorn scikit-learn joblib pandas numpy shap
uvicorn main:app --reload
```

Backend runs at **http://localhost:8000**

---

### 4. Start the frontend

```bash
cd burnout-app/frontend
npm install
npm run dev
```

Frontend runs at **http://localhost:5173**

---



## File Structure

```
burnout-app/
├── backend/
│   ├── main.py
│   ├── export_scaler.py
│   ├── burnout_model.pkl      ← copy from root
│   ├── selected_features.pkl  ← copy from root
│   └── scaler.pkl             ← export from notebook
└── frontend/
    ├── src/
    │   ├── App.jsx
    │   ├── components/
    │   │   ├── RiskGauge.jsx
    │   │   ├── ShapChart.jsx
    │   │   ├── Recommendations.jsx
    │   │   ├── PopulationCompare.jsx
    │   │   ├── RiskProfileCard.jsx
    │   │   └── WhatIfSimulator.jsx
    │   └── pages/
    │       ├── FormPage.jsx
    │       └── ResultsPage.jsx
    └── package.json
```
