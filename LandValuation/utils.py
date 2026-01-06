import pandas as pd


aop_table = pd.read_csv("data/aop_scores.csv")
lop_table = pd.read_csv("data/lop_scores.csv")


def get_aop_score(distance):
    row = aop_table[
        (aop_table["distance_min"] <= distance) &
        (aop_table["distance_max"] >= distance)
    ]
    return int(row["score"].values[0])

def get_lop_score(zone):
    row = lop_table[lop_table["zone_type"] == zone.lower()]
    return int(row["score"].values[0])
