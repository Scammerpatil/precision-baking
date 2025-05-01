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
        match = get_close_matches(ingredient_name, density_map.keys(), n=1, cutoff=0.001)
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

    return None  # unable to convert

def fraction_to_decimal(text):
    unicode_fractions = {"½": "1/2", "¼": "1/4", "¾": "3/4", "⅓": "1/3", "⅔": "2/3"}
    for uni_frac, ascii_frac in unicode_fractions.items():
        text = text.replace(uni_frac, ascii_frac)
    return text

def parse_ingredient(ingredient_text):
    ingredient_text = fraction_to_decimal(ingredient_text)

    # Regex to parse quantity, unit, ingredient
    pattern = r"^(\d+\s\d+/\d+|\d+/\d+|\d+(\.\d+)?)?\s*(cup|cups|teaspoon|teaspoons|tbsp|tablespoon|large|ml|g)?\s*(.+)"

    match = re.match(pattern, ingredient_text.strip())

    if match:
        quantity_str, _, unit, ingredient = match.groups()
        try:
            if quantity_str:
                quantity = float(sum(Fraction(part) for part in quantity_str.split()))
            else:
                quantity = None
        except:
            quantity = None

        return {"quantity": quantity, "unit": unit, "ingredient": ingredient}

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
