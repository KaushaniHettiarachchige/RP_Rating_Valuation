import pandas as pd
from xgboost import XGBRegressor
import joblib

data = pd.read_csv("data/public_dataset.csv")

X = data[["land_size","access","supermarkets","schools"]]
y = data["value"]

model = XGBRegressor()

model.fit(X,y)

joblib.dump(model,"models/public_model.pkl")

print("Public model trained")