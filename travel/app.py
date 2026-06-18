from flask import Flask, request, jsonify
from flask_cors import CORS
from groq import Groq
import os
import json
import hashlib
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from dotenv import load_dotenv

load_dotenv()

app = Flask(__name__)
CORS(app)

GROQ_API_KEY = os.environ.get("GROQ_API_KEY")
client = Groq(api_key=GROQ_API_KEY)

SMTP_SERVER = os.environ.get("SMTP_SERVER", "smtp-relay.brevo.com")
SMTP_PORT = int(os.environ.get("SMTP_PORT", 587))
SMTP_LOGIN = os.environ.get("SMTP_LOGIN")
SMTP_PASSWORD = os.environ.get("SMTP_PASSWORD")
SMTP_SENDER = os.environ.get("SMTP_SENDER", "noreply@roamease.com")

# Simple in-memory cache for API responses
response_cache = {}
MAX_CACHE_SIZE = 100

@app.route("/api/chat", methods=["POST"])
def chat():
    data = request.json
    messages = data.get("messages", [])
    
    if not messages:
        return jsonify({"error": "Messages are required"}), 400
        
    # Generate a cache key based on the exact message history
    messages_json = json.dumps(messages, sort_keys=True)
    cache_key = hashlib.md5(messages_json.encode('utf-8')).hexdigest()
    
    if cache_key in response_cache:
        return jsonify({"reply": response_cache[cache_key], "cached": True})
        
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
        
        # Add response to cache, remove oldest if over size limit
        if len(response_cache) >= MAX_CACHE_SIZE:
            response_cache.pop(next(iter(response_cache)))
        response_cache[cache_key] = reply
        
        return jsonify({"reply": reply, "cached": False})
    except Exception as e:
        return jsonify({"error": str(e)}), 500

def send_smtp_email(recipient, subject, html_body):
    if not SMTP_LOGIN or not SMTP_PASSWORD:
        raise Exception("SMTP credentials not configured.")
        
    msg = MIMEMultipart("alternative")
    msg["Subject"] = subject
    msg["From"] = f"RoamEase <{SMTP_SENDER}>"
    msg["To"] = recipient

    msg.attach(MIMEText(html_body, "html"))

    with smtplib.SMTP(SMTP_SERVER, SMTP_PORT) as server:
        server.starttls()
        server.login(SMTP_LOGIN, SMTP_PASSWORD)
        server.sendmail(SMTP_SENDER, recipient, msg.as_string())

@app.route("/api/send-email", methods=["POST"])
def send_email():
    data = request.json
    email_type = data.get("type")
    recipient = data.get("email")
    
    if not recipient:
        return jsonify({"error": "Recipient email is required"}), 400
        
    try:
        if email_type == "confirmation":
            name = data.get("name", "Valued Guest")
            destination = data.get("destination", "Your Destination")
            date = data.get("date", "")
            people = data.get("people", "1")
            transaction = data.get("transaction", "")
            ticketId = data.get("ticketId", "")
            
            subject = f"Booking Confirmation: {destination} - RoamEase"
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #8a2be2; text-align: center;">Booking Confirmed! 🎉</h2>
                  <p>Dear <strong>{name}</strong>,</p>
                  <p>Thank you for booking your trip with RoamEase! We are thrilled to assist you on your next adventure.</p>
                  <hr style="border: 0; border-top: 1px solid #eee;">
                  <h3 style="color: #333;">Trip Summary:</h3>
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Destination:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{destination}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Travel Date:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{date}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Guests:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{people}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Transaction ID:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{transaction}</td>
                    </tr>
                  </table>
                  <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin-top: 20px; text-align: center;">
                    <span style="font-size: 16px;"><strong>Booking Reference:</strong> {ticketId}</span>
                  </div>
                  <p style="margin-top: 20px; font-size: 12px; color: #777; text-align: center;">
                    Note: Cancellation is allowed only within 7 days from the booking date.
                  </p>
                  <p style="text-align: center; font-weight: bold; margin-top: 20px; color: #8a2be2;">RoamEase Travel Team</p>
                </div>
              </body>
            </html>
            """
        elif email_type == "cancellation":
            name = data.get("name", "Valued Guest")
            destination = data.get("destination", "Your Destination")
            transaction = data.get("transaction", "")
            
            subject = f"Booking Cancellation Confirmed: {destination} - RoamEase"
            html_body = f"""
            <html>
              <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                <div style="max-width: 600px; margin: 0 auto; border: 1px solid #ddd; padding: 20px; border-radius: 8px;">
                  <h2 style="color: #d9534f; text-align: center;">Booking Cancelled</h2>
                  <p>Dear <strong>{name}</strong>,</p>
                  <p>This is to confirm that your booking for <strong>{destination}</strong> has been cancelled successfully.</p>
                  <p>A refund has been initiated back to your original payment method. The refund details are as follows:</p>
                  <hr style="border: 0; border-top: 1px solid #eee;">
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Destination:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{destination}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;"><strong>Transaction ID:</strong></td>
                      <td style="padding: 8px 0; border-bottom: 1px solid #eee;">{transaction}</td>
                    </tr>
                  </table>
                  <p style="margin-top: 20px; font-size: 13px; color: #555;">
                    The refund should appear in your account in 5-7 business days. If you have any questions, please contact our support team at support@roamease.com.
                  </p>
                  <p style="text-align: center; font-weight: bold; margin-top: 20px; color: #d9534f;">RoamEase Travel Team</p>
                </div>
              </body>
            </html>
            """
        else:
            return jsonify({"error": "Invalid email type"}), 400
            
        send_smtp_email(recipient, subject, html_body)
        return jsonify({"success": True, "message": "Email sent successfully."})
    except Exception as e:
        print("SMTP Error details:", str(e))
        return jsonify({"error": str(e)}), 500

if __name__ == "__main__":
    app.run(port=5000, debug=True)
