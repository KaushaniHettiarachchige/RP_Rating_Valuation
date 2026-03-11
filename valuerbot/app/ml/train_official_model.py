import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

data = pd.read_csv("data/official_dataset.csv")
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

model = LinearRegression()

model.fit(X,y)

joblib.dump(model,"models/official_model.pkl")

print("Official model trained")