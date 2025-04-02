import os
import locale  
import sys
import re
import spacy

sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale = locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

nlp = spacy.load("en_core_web_sm")


def fraction_to_decimal(fraction):
    """Convert fraction characters to decimals"""
    fraction_map = {"½": "0.5", "¼": "0.25", "¾": "0.75", "⅓": "0.33", "⅔": "0.67"}
    return fraction_map.get(fraction, fraction)


def parse_ingredient(ingredient_text):
    """Extracts quantity, unit, and ingredient from input string"""
    ingredient_text = re.sub(r"[½¼¾⅓⅔]", lambda m: fraction_to_decimal(m.group()), ingredient_text)

    # Regex pattern to capture quantity, unit, and ingredient
    pattern = r"^(\d+(\.\d+)?|\d+\s\d+/\d+)?\s*(cup|cups|teaspoon|teaspoons|tbsp|tablespoon|large|ml|g)?\s*(.+)"
    match = re.match(pattern, ingredient_text.strip())

    if match:
        quantity, _, unit, ingredient = match.groups()
        quantity = eval(quantity) if quantity else None
        return {"quantity": quantity, "unit": unit, "ingredient": ingredient}

    return {"quantity": None, "unit": None, "ingredient": ingredient_text}


if __name__ == "__main__":
    recipe = sys.argv[1].split("\n")

    parsed_ingredients = []
    for line in recipe:
        line = line.strip()
        if line:
            parsed = parse_ingredient(line)
            doc = nlp(parsed["ingredient"])
            parsed["parsed_ingredient"] = [token.text for token in doc if token.pos_ in ["NOUN", "PROPN"]]
            parsed_ingredients.append(parsed)

    for ing in parsed_ingredients:
        print(ing)
