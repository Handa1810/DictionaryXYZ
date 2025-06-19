from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import difflib
import random
import os
from deep_translator import GoogleTranslator

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

dict_path = os.path.join(os.path.dirname(__file__), 'dict.csv')
df = pd.read_csv(dict_path)
df.dropna(subset=['word'], inplace=True)                 
df['word'] = df['word'].astype(str).str.lower()        


def clean_definition(text):
    import re
    text = re.sub(r'\*\*(.*?)\*\*', r'\1', text) 
    text = re.sub(r'(\d+\.\s+)', r'\n\1', text)   
    return text.strip()

@app.route("/define", methods=["POST"])
def define_word():
    word = request.get_json().get("word", "").strip().lower()
    result = df[df['word'] == word]
    definition = result.iloc[0]['definition'] if not result.empty else "Definition not found."
    cleaned_definition = clean_definition(definition)
    suggestions = difflib.get_close_matches(word, df['word'].tolist(), n=3)
    return jsonify({"definition": cleaned_definition, "suggestions": suggestions})

@app.route("/word-of-the-day", methods=["GET"])
def word_of_the_day():
    row = df.sample(1).iloc[0]
    return jsonify({"word": row['word'], "definition": clean_definition(row['definition'])})

@app.route("/translate", methods=["POST"])
def translate():
    data = request.get_json()
    word = data.get("word", "")
    lang = data.get("lang", "hi")
    try:
        translated = GoogleTranslator(source='auto', target=lang).translate(word)
        return jsonify({"translated": translated})
    except Exception as e:
        return jsonify({"error": str(e)}), 400

if __name__ == "__main__":
    app.run(debug=True)