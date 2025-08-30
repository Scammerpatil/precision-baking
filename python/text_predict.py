import sys
import numpy as np
import pandas as pd
import os
import spacy
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from dotenv import load_dotenv
import matplotlib.pyplot as plt
import pickle
import json
import os
import locale  
import sys
import requests
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

load_dotenv()

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')

def fetch_youtube_video_link(query):
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query + " recipe",
        "type": "video",
        "maxResults": 1,
        "key": YOUTUBE_API_KEY
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        items = response.json().get("items", [])
        if items:
            video_id = items[0]["id"]["videoId"]
            return f"https://www.youtube.com/watch?v={video_id}"
    return ""

nlp = spacy.load("en_core_web_sm")

def extract_ingredients(text):
    doc = nlp(text)
    ingredients = [token.text.lower() for token in doc if token.pos_ in ["NOUN", "PROPN"]]
    return ", ".join(ingredients)

def show_image(image_path):
    img = plt.imread(image_path)
    plt.imshow(img)
    plt.axis("off")
    plt.show()

def recommend_recipes(user_input, df, vectorizer, ingredient_vectors, top_n=5):
    extracted_ingredients = extract_ingredients(user_input)
    input_vector = vectorizer.transform([extracted_ingredients])
    similarities = cosine_similarity(input_vector, ingredient_vectors).flatten()
    top_indices = similarities.argsort()[-top_n:][::-1]
    
    recommended = df.iloc[top_indices]
    result = []
    for i, row in recommended.iterrows():
        recipe = {
            "title": row["Title"],
            "ingredients": row["Ingredients"],
            "instructions": row["Instructions"],
            "youtubeLinks": fetch_youtube_video_link(row["Title"]),
        }
        result.append(recipe)
    return result

if __name__ == "__main__":
    if len(sys.argv) > 1:
        user_input = sys.argv[1]
   
    df = pd.read_csv('python/dataset.csv')
    
    ingredient_col = 'Cleaned_Ingredients' if 'Cleaned_Ingredients' in df.columns else 'Ingredients'
    df[ingredient_col] = df[ingredient_col].fillna("") 
    with open("python/models/vectorizer.pkl", "rb") as f:
        vectorizer = pickle.load(f)
    
    with open("python/models/ingredient_vectors.pkl", "rb") as f:
        ingredient_vectors = pickle.load(f)

    result = recommend_recipes(user_input, df, vectorizer, ingredient_vectors)
    with open("python/models/recipe_recommendations.json", "w", encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=4)
    print(json.dumps(result, indent=4,ensure_ascii=False))