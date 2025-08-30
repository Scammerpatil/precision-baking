from tensorflow.keras.preprocessing import image
from tensorflow.keras.models import load_model
import google.generativeai as genai
from dotenv import load_dotenv
import numpy as np
import os
import locale  
import json
import requests
import sys
sys.stdout.reconfigure(encoding='utf-8')
os.environ["PYTHONIOENCODING"] = "utf-8"
myLocale=locale.setlocale(category=locale.LC_ALL, locale="en_GB.UTF-8")

IMAGE_PATH = 'python/upload/dish.jpg'
MODEL_PATH = "python/models/model_image.keras"

food_list = ['apple_pie', 'baby_back_ribs', 'baklava', 'beef_carpaccio', 'beef_tartare', 'beet_salad', 'beignets', 'bibimbap', 'bread_pudding', 'breakfast_burrito', 'bruschetta', 'caesar_salad', 'cannoli', 'caprese_salad', 'carrot_cake', 'ceviche', 'cheese_plate', 'cheesecake', 'chicken_curry', 'chicken_quesadilla', 'chicken_wings', 'chocolate_cake', 'chocolate_mousse', 'churros', 'clam_chowder', 'club_sandwich', 'crab_cakes', 'creme_brulee', 'croque_madame', 'cup_cakes', 'deviled_eggs', 'donuts', 'dumplings', 'edamame', 'eggs_benedict', 'escargots', 'falafel', 'filet_mignon', 'fish_and_chips', 'foie_gras', 'french_fries', 'french_onion_soup', 'french_toast', 'fried_calamari', 'fried_rice', 'frozen_yogurt', 'garlic_bread', 'gnocchi', 'greek_salad', 'grilled_cheese_sandwich', 'grilled_salmon', 'guacamole', 'gyoza', 'hamburger', 'hot_and_sour_soup', 'hot_dog', 'huevos_rancheros', 'hummus', 'ice_cream', 'lasagna', 'lobster_bisque', 'lobster_roll_sandwich', 'macaroni_and_cheese', 'macarons', 'miso_soup', 'mussels', 'nachos', 'omelette', 'onion_rings', 'oysters', 'pad_thai', 'paella', 'pancakes', 'panna_cotta', 'peking_duck', 'pho', 'pizza', 'pork_chop', 'poutine', 'prime_rib', 'pulled_pork_sandwich', 'ramen', 'ravioli', 'red_velvet_cake', 'risotto', 'samosa', 'sashimi', 'scallops', 'seaweed_salad', 'shrimp_and_grits', 'spaghetti_bolognese', 'spaghetti_carbonara', 'spring_rolls', 'steak', 'strawberry_shortcake', 'sushi', 'tacos', 'takoyaki', 'tiramisu', 'tuna_tartare', 'waffles']
load_dotenv()
# --- SETUP GEMINI ---
GOOGLE_API_KEY = os.getenv('GOOGLE_API_KEY')
genai.configure(api_key=GOOGLE_API_KEY)
model_gemini = genai.GenerativeModel('gemini-2.0-flash')

# --- LOAD IMAGE MODEL ---
model = load_model(MODEL_PATH)

YOUTUBE_API_KEY = os.getenv('YOUTUBE_API_KEY')
def fetch_youtube_video_links(query, max_results=5):
    print(f"Fetching YouTube video links for: {query}")
    if not YOUTUBE_API_KEY:
        print("YouTube API key not found. Please set it in .env file.")
        return []
    url = "https://www.googleapis.com/youtube/v3/search"
    params = {
        "part": "snippet",
        "q": query + " recipe",
        "type": "video",
        "maxResults": max_results,
        "key": YOUTUBE_API_KEY
    }
    response = requests.get(url, params=params)
    video_links = []
    if response.status_code == 200:
        items = response.json().get("items", [])
        for item in items:
            video_id = item["id"]["videoId"]
            video_links.append(f"https://www.youtube.com/watch?v={video_id}")
    else:
        print(f"Error fetching YouTube videos: {response.status_code} - {response.text}")
    if not video_links:
        print("No video links found.")
    else:
        print(f"Found {len(video_links)} video links.")
    return video_links

# --- PREDICT FUNCTION ---
def predict_dish(image_path):
    img = image.load_img(image_path, target_size=(128, 128))
    img = image.img_to_array(img)
    img = np.expand_dims(img, axis=0)
    img /= 255.

    preds = model.predict(img)
    index = np.argmax(preds)
    return food_list[index]

def generate_recipe(dish_name):
    youtube_link = fetch_youtube_video_links(dish_name)
    prompt = f"""
    Generate a detailed recipe for the dish: "{dish_name}".
    Return the response in this JSON format:
    {{
      "title": "Dish Name",
      "ingredients": "[ingredient1, ingredient2, ...]",
      "instructions": "1. Step one\\n2. Step two\\n...",
      "youtubeLinks": "{youtube_link}",
    }}
    Output only the JSON object, no explanation.
    """
    response = model_gemini.generate_content(prompt)
    output = response.text.strip()
    if output.startswith("```json"):
        output = output[7:] 
    if output.endswith("```"):
        output = output[:-3]
    try:
        return json.loads(output)
    except:
        print("Parsing error. Raw Gemini Output:\n", response.text)
        return None

if __name__ == "__main__":
    predicted_dish = predict_dish(IMAGE_PATH)
    recipe_data = generate_recipe(predicted_dish)
    if recipe_data:
        print(json.dumps(recipe_data, indent=2, ensure_ascii=False))
    else:
        print("Failed to generate recipe from Gemini.")
