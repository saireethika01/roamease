from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])
    
    if not messages:
        return jsonify({"error": "Messages are required"}), 400
        
    try:
        # Prepend the system prompt to the messages list
        system_prompt = {
            "role": "system",
            "content": "You are Roamie, an expert travel planner for 'RoamEase'. STRICTLY RESTRICT your answers to travel planning, itineraries, budgets, and destinations. If the user asks anything outside of travel planning (e.g. coding, math, general chatting), politely refuse to answer."
        }
        
        full_messages = [system_prompt] + messages

        chat_completion = client.chat.completions.create(
            messages=full_messages,
            model="llama-3.3-70b-versatile",
            max_tokens=512,
        )
        reply = chat_completion.choices[0].message.content
        return jsonify({"reply": reply})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
