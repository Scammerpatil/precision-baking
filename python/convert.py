import os
import locale
import sys
import re
import spacy
import json
import pandas as pd
from fractions import Fraction
from difflib import get_close_matches

sys.stdout.reconfigure(encoding="utf-8")
os.environ["PYTHONIOENCODING"] = "utf-8"
locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

nlp = spacy.load("en_core_web_sm")

density_df = pd.read_csv("python/density_data.csv")
density_map = {row["food"].lower(): row["density"] for _, row in density_df.iterrows()}

unit_to_ml = {
    "cup": 240,
    "cups": 240,
    "tbsp": 15,
    "tsp": 5,
    "tablespoon": 15,
    "teaspoon": 5,
    "teaspoons": 5,
    "ml": 1,
    "g": None, 
    "large": 50,
}

def get_density(ingredient_name):
    """Find closest matching food name from DB and return density"""
    ingredient_name = ingredient_name.lower()
    match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=1)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.8)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.5)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.3)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.1)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.05)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.01)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.0001)
    if not match:
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.00001)
    if not match:
        match = 0
    if match:
        return density_map[match[0]]
    return None

def convert_to_grams(quantity, unit, ingredient_name):
    if quantity is None:
        return None

    unit = unit.lower() if unit else ""
    density = get_density(ingredient_name)

    if unit == "g":
        return round(quantity, 2)

    ml_factor = unit_to_ml.get(unit)
    if ml_factor is not None and density is not None:
        grams = quantity * ml_factor * density
        return round(grams, 2)
    elif ml_factor is not None:  # In case no density is found
        print(f"Warning: No density found for {ingredient_name}. Using volume-based conversion.")
        grams = quantity * ml_factor  # Fall back to volume * ml_factor if density isn't available
        return round(grams, 2)

    return None  # Unable to convert

def fraction_to_decimal(text):
    unicode_fractions = {"½": "1/2", "¼": "1/4", "¾": "3/4", "⅓": "1/3", "⅔": "2/3" , "⅛": "1/8", "⅜": "3/8", "⅝": "5/8", "⅞": "7/8"}
    for uni_frac, ascii_frac in unicode_fractions.items():
        text = text.replace(uni_frac, ascii_frac)
    return text

def parse_ingredient(ingredient_text, default_quantity_if_unit_only=None):
    """
    Parse an ingredient line.
    - If a quantity exists but unit was not immediately adjacent, search for unit anywhere.
    - If no quantity but a unit exists, capture the unit (and optionally set a default quantity).
    - default_quantity_if_unit_only: if set to numeric (e.g., 1), use that when only unit is present.
    """
    ingredient_text = fraction_to_decimal(ingredient_text).strip()

    # Patterns: match ranges, quantities (including fractions), and units
    range_pattern = r"(\d+\s*[-–]\s*\d+)\s*(cup|cups|tbsp|tablespoon|tablespoons|tbsp?s?|teaspoon|teaspoons|tsp|large|ml|g)?"
    quantity_pattern = r"(\d+\s\d+/\d+|\d+/\d+|\d+(\.\d+)?)\s*(cup|cups|tbsp|tablespoon|tablespoons|tbsp?s?|teaspoon|teaspoons|tsp|large|ml|g)?"
    unit_search_pattern = r"\b(cup|cups|tbsp|tablespoon|tablespoons|tbsp?s?|teaspoon|teaspoons|tsp|large|ml|g)\b"

    # Normalize by removing parentheses and extra symbols
    text = re.sub(r"[\(\)\:,]", "", ingredient_text)

    # Try range first
    match_range = re.search(range_pattern, text, flags=re.IGNORECASE)
    if match_range:
        quantity_range = match_range.group(1)
        unit = match_range.group(2)
        start, end = re.split(r"[-–]", quantity_range)
        try:
            average_quantity = (float(start.strip()) + float(end.strip())) / 2
        except Exception:
            average_quantity = None
        ingredient = re.sub(range_pattern, "", text, flags=re.IGNORECASE).strip()
        # If unit not right after range, look elsewhere
        if not unit:
            munit = re.search(unit_search_pattern, text, flags=re.IGNORECASE)
            if munit:
                unit = munit.group(1)
        return {"quantity": average_quantity, "unit": unit.lower() if unit else None, "ingredient": ingredient}

    # Try single quantity
    match = re.search(quantity_pattern, text, flags=re.IGNORECASE)
    if match:
        quantity_str = match.group(1)
        unit = match.group(3)
        try:
            quantity = float(sum(Fraction(part) for part in quantity_str.split()))
        except Exception:
            quantity = None
        ingredient = re.sub(quantity_pattern, "", text, flags=re.IGNORECASE).strip()

        # If there was no unit immediately after the quantity, search the whole line for a unit
        if not unit:
            munit = re.search(unit_search_pattern, text, flags=re.IGNORECASE)
            if munit:
                unit = munit.group(1)

        return {"quantity": quantity, "unit": unit.lower() if unit else None, "ingredient": ingredient}

    # If no quantity found, try to find a unit anywhere (e.g., lines like "Mustard seeds rai – tsp")
    munit = re.search(unit_search_pattern, text, flags=re.IGNORECASE)
    if munit:
        unit = munit.group(1).lower()
        # Optionally set a default quantity when unit-only is present:
        quantity = default_quantity_if_unit_only
        return {"quantity": quantity, "unit": unit, "ingredient": re.sub(unit_search_pattern, "", text, flags=re.IGNORECASE).strip()}

    # Fallback: no quantity or unit found
    return {"quantity": None, "unit": None, "ingredient": ingredient_text}


if __name__ == "__main__":

    recipeFilePath = "python/recipe.txt"
    with open(recipeFilePath, "r", encoding="utf-8") as file:
        recipe = file.readlines()
    parsed_ingredients = []
    for line in recipe:
        line = line.strip()
        if not line:
            continue
        if any(line.startswith(kw) for kw in ["Instructions", "Directions", "Preparation", "Prep", "Cooking", "Cook", "Serving", "Serves"]):
            continue

        parsed = parse_ingredient(line)
        doc = nlp(parsed["ingredient"])
        parsed["parsed_ingredient"] = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
        name_for_density = " ".join(parsed["parsed_ingredient"]).strip()
        parsed["name_for_density"] = name_for_density
        parsed["unit"] = parsed["unit"].lower() if parsed["unit"] else None
        parsed["grams"] = convert_to_grams(parsed["quantity"], parsed["unit"], name_for_density)
        parsed_ingredients.append(parsed)

    print(json.dumps(parsed_ingredients, ensure_ascii=False, indent=2))
