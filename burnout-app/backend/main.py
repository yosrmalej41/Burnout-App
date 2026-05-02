import os
import csv
import warnings
from datetime import datetime
warnings.filterwarnings("ignore")

import joblib
import numpy as np
import pandas as pd
import shap
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional

app = FastAPI(title="Burnout Risk Predictor API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------------------------------------------------------------------------
# Load artefacts
# ---------------------------------------------------------------------------
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

model = joblib.load(os.path.join(BASE_DIR, "burnout_model.pkl"))
selected_features: list[str] = joblib.load(os.path.join(BASE_DIR, "selected_features.pkl"))

scaler = None
if os.path.exists(os.path.join(BASE_DIR, "scaler.pkl")):
    scaler = joblib.load(os.path.join(BASE_DIR, "scaler.pkl"))
    print("OK: Scaler loaded.")
else:
    print("WARNING: scaler.pkl not found — predictions will be inaccurate.")

# Column names used for feature engineering (age x commute)
fe_cols = None
if os.path.exists(os.path.join(BASE_DIR, "fe_cols.pkl")):
    fe_cols = joblib.load(os.path.join(BASE_DIR, "fe_cols.pkl"))
    print(f"OK: fe_cols loaded.")
else:
    print("WARNING: fe_cols.pkl not found.")

FEATURE_LABELS: dict[str, str] = {
    "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...": "Remote work feels more challenging than office work",
    "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....": "I feel less productive working remotely",
    "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.prefer.remote.work.over.in.office.work..": "I prefer remote work over office work",
    "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..": "Flexibility to choose work location is important",
    "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.adjust.my.work.schedule.based.on.personal.circumstances..": "Adjusting schedule for personal needs is important",
    "Remote.Office.Work_My place of work changes regularly": "My place of work changes regularly",
    "Employment.Status_Full-Time": "I am a full-time employee",
    "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Healthcare.facilities._Yes, and it is important": "Healthcare facilities nearby (important)",
    "Please.share.the.following...Total.years.of.professional.working.life..count.part.time.work.as.a.fraction..e.g...0.5.for.half.time.work...": "Total years of professional experience",
    "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important": "No park/green space nearby but want one",
    "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important": "No leisure activities nearby but want them",
    "Age_x_Commute": "Age x Commute interaction",
    "Student.Status_Yes": "I am currently a student",
    "Commute_squared": "Commute time (squared)",
    "What.do.you.prefer.when.working.at.a.third.place.or.a.coworking.space...Availability.of.car.parking.._Yes": "Car parking important at coworking space",
}


class PredictRequest(BaseModel):
    # Likert 1–7
    challenging: float
    less_productive: float
    prefer_remote: float
    flexibility_location: float
    flexibility_schedule: float
    # Binary 0/1
    work_changes_location: int
    full_time: int
    healthcare_nearby: int
    park_missing: int
    leisure_missing: int
    car_parking_cowork: int
    student: int
    # Numeric
    years_experience: float
    # Hidden inputs to compute interaction features
    age: float
    commute_minutes: float


def scale_column(col_name: str, value: float) -> float:
    """Scale a single raw value using the saved scaler parameters."""
    feature_names = list(scaler.feature_names_in_)
    idx = feature_names.index(col_name)
    return (value - scaler.mean_[idx]) / scaler.scale_[idx]


def build_input_df(req: PredictRequest) -> pd.DataFrame:
    if scaler is None or fe_cols is None:
        # Fallback: raw values (inaccurate but won't crash)
        print("WARNING: Running without scaler/fe_cols — results will be inaccurate.")
        scaled: dict[str, float] = {
            "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...": req.challenging,
            "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....": req.less_productive,
            "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.prefer.remote.work.over.in.office.work..": req.prefer_remote,
            "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..": req.flexibility_location,
            "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.adjust.my.work.schedule.based.on.personal.circumstances..": req.flexibility_schedule,
            "Remote.Office.Work_My place of work changes regularly": float(req.work_changes_location),
            "Employment.Status_Full-Time": float(req.full_time),
            "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Healthcare.facilities._Yes, and it is important": float(req.healthcare_nearby),
            "Please.share.the.following...Total.years.of.professional.working.life..count.part.time.work.as.a.fraction..e.g...0.5.for.half.time.work...": req.years_experience,
            "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important": float(req.park_missing),
            "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important": float(req.leisure_missing),
            "Age_x_Commute": req.age * req.commute_minutes,
            "Student.Status_Yes": float(req.student),
            "Commute_squared": req.commute_minutes ** 2,
            "What.do.you.prefer.when.working.at.a.third.place.or.a.coworking.space...Availability.of.car.parking.._Yes": float(req.car_parking_cowork),
        }
        return pd.DataFrame([scaled])[selected_features]

    # ------------------------------------------------------------------
    # Proper scaling: mirror exactly what the notebook did during training
    # 1. Scale each direct feature using the scaler
    # 2. Scale age and commute using their original column names
    # 3. Compute interaction features from the SCALED age and commute
    # ------------------------------------------------------------------
    age_col     = fe_cols["age_col"]
    commute_col = fe_cols["commute_col"]

    scaled: dict[str, float] = {
        "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...":
            scale_column("Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.find.remote.work.more.challenging.than.in.office.work..e.g..isolation..more.distractions..time.zone.differences...", req.challenging),
        "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....":
            scale_column("Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.feel.less.productive.while.working.remotely..more.distractions..no.focus..bad.time.management.etc....", req.less_productive),
        "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.prefer.remote.work.over.in.office.work..":
            scale_column("Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......I.prefer.remote.work.over.in.office.work..", req.prefer_remote),
        "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..":
            scale_column("Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.have.the.flexibility.to.choose.my.work.location..", req.flexibility_location),
        "Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.adjust.my.work.schedule.based.on.personal.circumstances..":
            scale_column("Please.rate.the.following.statements.regarding.remote.work.on.a.scale.from..1..strongly.disagree.to..7..strongly.agree.......It.is.important.for.me.to.adjust.my.work.schedule.based.on.personal.circumstances..", req.flexibility_schedule),
        "Remote.Office.Work_My place of work changes regularly":
            scale_column("Remote.Office.Work_My place of work changes regularly", float(req.work_changes_location)),
        "Employment.Status_Full-Time":
            scale_column("Employment.Status_Full-Time", float(req.full_time)),
        "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Healthcare.facilities._Yes, and it is important":
            scale_column("When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Healthcare.facilities._Yes, and it is important", float(req.healthcare_nearby)),
        "Please.share.the.following...Total.years.of.professional.working.life..count.part.time.work.as.a.fraction..e.g...0.5.for.half.time.work...":
            scale_column("Please.share.the.following...Total.years.of.professional.working.life..count.part.time.work.as.a.fraction..e.g...0.5.for.half.time.work...", req.years_experience),
        "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important":
            scale_column("When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Park..Green.spaces._No, but it would be important", float(req.park_missing)),
        "When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important":
            scale_column("When.working.remotely..do.you.currently.have.access.to.the.following.amenities.within.a.15.minute.walk..If.so..please.indicate.whether.they.are.important.to.you....Leisure.activities..e.g...cinemas..theatres..shopping.._No, but it would be important", float(req.leisure_missing)),
        # Interaction features computed from RAW values — NOT in scaler (added after scaling in notebook)
        "Age_x_Commute": req.age * req.commute_minutes,
        "Student.Status_Yes":
            scale_column("Student.Status_Yes", float(req.student)),
        "Commute_squared": req.commute_minutes ** 2,
        "What.do.you.prefer.when.working.at.a.third.place.or.a.coworking.space...Availability.of.car.parking.._Yes":
            scale_column("What.do.you.prefer.when.working.at.a.third.place.or.a.coworking.space...Availability.of.car.parking.._Yes", float(req.car_parking_cowork)),
    }

    return pd.DataFrame([scaled])[selected_features]


@app.get("/health")
def health():
    return {
        "status": "ok",
        "model": "RandomForest",
        "features": len(selected_features),
        "scaler_loaded": scaler is not None,
    }


@app.post("/predict")
def predict(req: PredictRequest):
    try:
        df = build_input_df(req)

        prediction = int(model.predict(df)[0])
        probability = float(model.predict_proba(df)[0][1])

        # SHAP — use the model directly (RandomForestClassifier)
        # If model is CalibratedClassifierCV, extract the fitted RF from the first fold
        if hasattr(model, 'calibrated_classifiers_'):
            base_model = model.calibrated_classifiers_[0].estimator
        else:
            base_model = model

        explainer = shap.TreeExplainer(base_model)
        shap_vals = explainer.shap_values(df)

        # Handle different SHAP output formats across versions
        sv = np.array(shap_vals)
        if sv.ndim == 3:
            # New format: (n_samples, n_features, n_classes) -> take class 1
            sv = sv[0, :, 1]
        elif isinstance(shap_vals, list):
            # Old format: list [class0_array, class1_array]
            sv = np.array(shap_vals[1])[0]
        else:
            sv = sv[0]

        shap_items = [
            {
                "feature": feat,
                "label": FEATURE_LABELS.get(feat, feat),
                "shap_value": float(sv[i]),
                "raw_value": float(df.iloc[0, i]),
            }
            for i, feat in enumerate(selected_features)
        ]
        shap_items.sort(key=lambda x: abs(x["shap_value"]), reverse=True)

        return {
            "prediction": prediction,
            "probability": probability,
            "risk_label": "High Risk" if prediction == 1 else "Low Risk",
            "shap_values": shap_items,
        }

    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


# ---------------------------------------------------------------------------
# CSV helpers
# ---------------------------------------------------------------------------
DATANEW_PATH       = os.path.join(BASE_DIR, "datanew.csv")
MISSING_PATH       = os.path.join(BASE_DIR, "missing_factors.csv")

def append_csv(filepath: str, row: dict):
    file_exists = os.path.exists(filepath)
    with open(filepath, "a", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=row.keys())
        if not file_exists:
            writer.writeheader()
        writer.writerow(row)


class ContextLogRequest(BaseModel):
    # Pre-assessment fields
    has_prior_score: bool
    prior_score: Optional[float] = None
    prior_source: Optional[str] = None
    gut_estimate: float
    # 15 model features (raw, as entered by user)
    challenging: float
    less_productive: float
    prefer_remote: float
    flexibility_location: float
    flexibility_schedule: float
    work_changes_location: int
    full_time: int
    healthcare_nearby: int
    park_missing: int
    leisure_missing: int
    car_parking_cowork: int
    student: int
    years_experience: float
    age: float
    commute_minutes: float
    # Model output
    model_probability: float


class FeedbackRequest(BaseModel):
    feedback_text: str


@app.post("/log-context")
def log_context(req: ContextLogRequest):
    try:
        row = {
            "timestamp": datetime.utcnow().isoformat(),
            "has_prior_score": req.has_prior_score,
            "prior_score": req.prior_score,
            "prior_source": req.prior_source,
            "gut_estimate": req.gut_estimate,
            "model_probability_pct": round(req.model_probability * 100, 2),
            "difference_pct": round(abs(req.gut_estimate - req.model_probability * 100), 2),
            # raw feature values
            "age": req.age,
            "commute_minutes": req.commute_minutes,
            "years_experience": req.years_experience,
            "challenging": req.challenging,
            "less_productive": req.less_productive,
            "prefer_remote": req.prefer_remote,
            "flexibility_location": req.flexibility_location,
            "flexibility_schedule": req.flexibility_schedule,
            "work_changes_location": req.work_changes_location,
            "full_time": req.full_time,
            "healthcare_nearby": req.healthcare_nearby,
            "park_missing": req.park_missing,
            "leisure_missing": req.leisure_missing,
            "car_parking_cowork": req.car_parking_cowork,
            "student": req.student,
        }
        append_csv(DATANEW_PATH, row)
        return {"status": "logged"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))


@app.post("/log-feedback")
def log_feedback(req: FeedbackRequest):
    try:
        row = {
            "timestamp": datetime.utcnow().isoformat(),
            "feedback": req.feedback_text,
        }
        append_csv(MISSING_PATH, row)
        return {"status": "logged"}
    except Exception as exc:
        raise HTTPException(status_code=500, detail=str(exc))
