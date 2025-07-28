from flask import Flask, request, jsonify
import spacy

app = Flask(__name__)
nlp = spacy.load("en_core_web_sm")

KEYWORDS = {
    "happy": ["happy", "joyful", "excited", "cheerful", "delighted", "great"],
    "sad": ["sad", "down", "blue", "depressed", "gloomy", "upset", "unhappy"],
    "relaxed": ["relaxed", "calm", "peaceful", "chill", "easy", "laid-back"],
    "angry": ["angry", "mad", "furious", "annoyed", "outraged"],
    "adventurous": ["adventurous", "excited", "bold", "curious"],
}

def detect_mood(text):
    text = text.lower()
    for mood, words in KEYWORDS.items():
        if any(word in text for word in words):
            return mood
    return "neutral"

@app.route("/api/analyze", methods=["POST"])
def analyze():
    data = request.json
    text = data.get("text", "")
    mood = detect_mood(text)
    return jsonify({"mood": mood})

if __name__ == "__main__":
    app.run(port=7000, debug=True)
