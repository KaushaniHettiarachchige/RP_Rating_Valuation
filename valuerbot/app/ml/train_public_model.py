import pandas as pd
from xgboost import XGBRegressor
import joblib

data = pd.read_csv("data/public_dataset.csv")

X = data[[
    "land_size",
    "access",
    "supermarkets",
    "schools",
    "nearest_hospital",
    "nearest_town_distance",
    "nearest_expressway",
    "nearest_mainroad",
    "universities_count",
    "nearest_airport",
    "nearest_harbor"
]]

y = data["value"]

model = XGBRegressor(
    n_estimators=120,
    max_depth=5,
    learning_rate=0.1,
    random_state=42
)

model.fit(X, y)

joblib.dump(model, "models/public_model.pkl")

print("Public model trained successfully")