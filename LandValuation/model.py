import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib
import os


data = pd.read_csv("data/pre_value_dataset.csv")

X = data[["AOP", "LOP", "EOL", "DTMR"]]
y = data["VALUE"]


model = LinearRegression()
model.fit(X, y)

os.makedirs("models", exist_ok=True)
joblib.dump(model, "models/regression_model.pkl")
