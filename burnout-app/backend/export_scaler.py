"""
Run this script (or paste into your notebook) to export the scaler.

In your notebook, after the cell that defines `scaler`, add:

    import joblib
    joblib.dump(scaler, 'scaler.pkl')
    print('Scaler saved to scaler.pkl')

Then copy scaler.pkl into: burnout-app/backend/

Alternatively, run this script if you have access to the original training data:

    python export_scaler.py

It will re-fit the scaler on the CSV and save scaler.pkl.
"""

import pandas as pd
from sklearn.preprocessing import StandardScaler
import joblib

CSV = '../../RMAP_Data_Descriptor_Data.csv'

df = pd.read_csv(CSV)
df = df.fillna(df.mean(numeric_only=True))

scaler = StandardScaler()
scaler.fit(df.select_dtypes(include='number'))

joblib.dump(scaler, 'scaler.pkl')
print(f'Saved scaler for {len(scaler.feature_names_in_)} features → scaler.pkl')
