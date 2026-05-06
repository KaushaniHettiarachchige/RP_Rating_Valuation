import pandas as pd
import joblib
from sklearn.model_selection import train_test_split
from sklearn.metrics import mean_squared_error, r2_score

# ✅ Feature column names (NOT values)
FEATURE_COLUMNS = [
    "Distance from fort",
    "count_schools",
    "count_uni",
    "min_dist_uni",
    "min_dist_nearest_express",
    "min_dist_nearest_railway",
    "min_dist_nearest_bank",
    "count_banks_within_2km",
    "count_medical_centers",
    "min_dist_nearest_Supermarket",
    "count_Supermarkets_within2km",
    "min_dist_nearest_Fuel_station",
    "count_Fuel_Stations_within2km",
    "min_dist_school",
    "min_dist_medical_center"
]

# ✅ Load dataset FIRST
data = pd.read_csv("data/land_prices_of_colombo.csv")

# ✅ Clean target column
data["Price per Perch"] = (
    data["Price per Perch"]
    .astype(str)
    .str.replace(",", "", regex=False)
    .astype(float)
)

# ✅ Prepare X and y
X = data[FEATURE_COLUMNS]
y = data["Price per Perch"]

# ✅ Split
X_train, X_test, y_train, y_test = train_test_split(
    X, y, test_size=0.2, random_state=42
)

# ✅ Load trained model
model = joblib.load("models/valuation_model.pkl")

# ✅ Predict
y_pred = model.predict(X_test)

# ✅ Metrics
mse = mean_squared_error(y_test, y_pred)
rmse = mse ** 0.5
r2 = r2_score(y_test, y_pred)

print("\n================ MODEL EVALUATION ================\n")
print(f"MSE  : {mse:.4f}")
print(f"RMSE : {rmse:.4f}")
print(f"R²   : {r2:.4f}")
print("\n==================================================\n")