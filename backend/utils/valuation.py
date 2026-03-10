from dataclasses import dataclass

# These are NOT "official" rates for your council — user must enter/select council %.
# We keep realistic categories and allow configuration.
DEFAULT_RATE_PCT = {
    "residential": 6.0,      # example default; user can change
    "commercial": 30.0       # example default; user can change
}

# Your AI feature adjustments (novelty): model influences AV slightly based on detected internal features
SAT_ADJUST = {
    "buildings": 1.15,       # developed land → higher AV proxy
    "bare_lands": 0.85,      # vacant land → lower AV proxy
    "vegetations": 0.95
}

ST_ADJUST = {
    "building_front": 1.10,
    "boundary_wall_gates": 1.05,
    "vegetation": 0.95
}

@dataclass
class ValuationResult:
    annual_value: float
    annual_rates: float
    quarterly_rates: float
    explanation: str

@dataclass
class Equation2Result:
    y2_value: float       # This is the Unit Rate (Y2)
    base_rate: float
    factors: dict
    explanation: str
    building_value: float # This is Y2 * FAB

def compute_annual_value(monthly_rent=None, annual_value=None):
    if annual_value is not None and annual_value > 0:
        return float(annual_value)
    if monthly_rent is not None and monthly_rent > 0:
        return float(monthly_rent) * 12.0
    raise ValueError("Provide monthly_rent or annual_value")

def calculate_rates_payable(
    *,
    monthly_rent=None,
    annual_value=None,
    property_use="residential",
    council_rate_pct=None,
    land_area_m2=None,
    sat_class=None,
    st_class=None,
    confidence=None
) -> ValuationResult:
    base_av = compute_annual_value(monthly_rent, annual_value)

    # Choose council rate % (configurable)
    if council_rate_pct is None:
        council_rate_pct = DEFAULT_RATE_PCT.get(property_use, 6.0)

    # Apply AI adjustment (optional novelty)
    adj = 1.0
    notes = []
    if sat_class:
        sat_factor = SAT_ADJUST.get(sat_class, 1.0)
        adj *= sat_factor
        notes.append(f"Satellite feature '{sat_class}' adjustment ×{sat_factor:.2f}")

    if st_class:
        st_factor = ST_ADJUST.get(st_class, 1.0)
        adj *= st_factor
        notes.append(f"Street feature '{st_class}' adjustment ×{st_factor:.2f}")

    # If confidence is low, we reduce adjustment impact (human-in-loop safety)
    if confidence is not None and confidence < 0.60:
        adj = 1.0 + (adj - 1.0) * 0.5
        notes.append("Low confidence: adjustment reduced by 50%")

    adjusted_av = base_av * adj

    annual_rates = adjusted_av * (float(council_rate_pct) / 100.0)
    quarterly = annual_rates / 4.0

    explanation = (
        f"Annual Value (AV) computed as {'annual value input' if annual_value else 'monthly rent × 12'} = {base_av:,.2f} LKR. "
        f"Council rate = {council_rate_pct:.2f}% ({property_use}). "
        f"Adjusted AV = {adjusted_av:,.2f} LKR. "
        f"Annual Rates Payable = AV × rate% = {annual_rates:,.2f} LKR. "
        f"Quarterly Rates = {quarterly:,.2f} LKR. "
        + (" Adjustments: " + "; ".join(notes) if notes else "")
    )

    return ValuationResult(adjusted_av, annual_rates, quarterly, explanation)

# Equation2Result is defined below at the end of the file.

# def calculate_y2_equation_2(
#     fab: float,        # Floor Area of Building
#     noc: str,          # Nature of Construction
#     aop: str,          # Accessibility of Property
#     lop: str,          # Location of Property
#     cob: str,          # Condition of Building
#     conb: str,         # Convenience of Building
#     aob: int,          # Age of Building
#     base_rate: float = 1200.0
# ) -> Equation2Result:
#     """
#     Calculates Y2 using Equation (2): Y2 = FAB * Base_Rate * [Π Factors]
#     Based on prototype rules and classification mappings.
#     """
    
#     # Factor Maps based on prototype logic and common valuation principles
#     NOC_FACTORS = {"buildings": 1.2, "bare_lands": 1.0, "vegetations": 0.7}
#     AOP_FACTORS = {"Excellent": 1.2, "Good": 1.1, "Average": 1.0, "Poor": 0.8}
#     LOP_FACTORS = {"Urban Commercial": 1.5, "Urban Residential": 1.2, "Suburban": 1.0, "Rural": 0.8}
#     COB_FACTORS = {"New": 1.2, "Good": 1.1, "Fair": 1.0, "Dilapidated": 0.7}
#     CONB_FACTORS = {"High": 1.2, "Average": 1.0, "Low": 0.8}
    
#     # Age factor logic
#     aob_factor = 1.0
#     try:
#         aob_int = int(aob)
#         if aob_int < 5: aob_factor = 1.1
#         elif aob_int > 20: aob_factor = 0.9
#     except (ValueError, TypeError):
#         aob_factor = 1.0
    
#     # Extract factors with defaults
#     f_noc = NOC_FACTORS.get(str(noc).lower(), 1.0)
#     f_aop = AOP_FACTORS.get(aop, 1.0)
    
#     # Simple keyword match for LOP
#     f_lop = 1.0
#     for key, val in LOP_FACTORS.items():
#         if key.lower() in str(lop).lower():
#             f_lop = val
#             break
            
#     f_cob = COB_FACTORS.get(cob, 1.0)
#     f_conb = CONB_FACTORS.get(conb, 1.0)
    
#     # Final Y2 calculation (Unit Rate)
#     # Formula: Y2 = Base Rate * (Product of all factors)
#     factors_product = f_noc * f_aop * f_lop * f_cob * f_conb * aob_factor
#     y2_rate = base_rate * factors_product
    
#     # Building Value Contribution = Y2 * FAB
#     building_value = y2_rate * fab
    
#     factors_dict = {
#         "NOC": f_noc,
#         "AOP": f_aop,
#         "LOP": f_lop,
#         "COB": f_cob,
#         "CONB": f_conb,
#         "AOB": round(aob_factor, 2)
#     }
    
#     explanation = (
#         f"Step 7: Unit Rate (Y2) = {base_rate} × {factors_product:.3f} = Rs. {y2_rate:,.2f} per sq.ft. "
#         f"Building Value = Y2 ({y2_rate:,.2f}) × FAB ({fab}) = Rs. {building_value:,.2f}."
#     )
    
#     return Equation2Result(
#         y2_value=y2_rate, 
#         base_rate=base_rate, 
#         factors=factors_dict, 
#         explanation=explanation,
#         building_value=building_value
#     )

def calculate_y2_equation_2(fab, noc, aop, lop, cob, conb, aob, tof, dob, tob):
    """
    Calculates Y2: The estimated value per square foot of the building.
    Uses Regression Coefficients based on the Homagama research sample.
    """
    # 1. Base Rate (b0) - Standard DRC for Residential in Homagama (Example: 5000 LKR/sqft)
    base_rate = 5000.00 
    
    # 2. Coefficients (b1 - b10) - These represent the 'weight' of each factor
    # In a real regression, these come from your statistical analysis (SPSS/Excel)
    weights = {
        "aop": {"Excellent": 500, "Good": 300, "Average": 100, "Poor": -200},
        "cob": {"Excellent": 1000, "Good": 500, "Fair": 0, "Dilapidated": -1500},
        "noc": {"Brick & Cement": 400, "Timber": 100, "Metal Frame": 200},
        "conb": {"High": 300, "Average": 100, "Low": -100},
        "tof": {"Tiled": 400, "Marble": 800, "Cement": 0}
    }

    # 3. Calculation Logic
    y2 = base_rate
    y2 += weights["aop"].get(aop, 0)
    y2 += weights["cob"].get(cob, 0)
    y2 += weights["noc"].get(noc, 0)
    y2 += weights["conb"].get(conb, 0)
    y2 += weights["tof"].get(tof, 0)

    # 4. Age Depreciation (AOB)
    # Standard 1.5% depreciation per year
    depreciation = (y2 * 0.015) * aob
    y2_final = y2 - depreciation

    # 5. Total Building Value (Step 8 Logic)
    building_value = y2_final * fab

    return {
        "y2_value": round(y2_final, 2),
        "building_value": round(building_value, 2),
        "base_rate": base_rate,
        "depreciation_applied": round(depreciation, 2),
        "explanation": f"Calculated based on {noc} construction in {cob} condition with {aob} years of age."
    }