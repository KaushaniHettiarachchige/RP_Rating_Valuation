import pandas as pd
from sklearn.linear_model import LinearRegression
import joblib

data = pd.read_csv("data/official_dataset.csv")

X = data[["land_size","access","supermarkets","schools"]]
y = data["value"]

model = LinearRegression()

model.fit(X,y)

joblib.dump(model,"models/official_model.pkl")

print("Official model trained")