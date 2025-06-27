import os
from twilio.rest import Client
import re
from dotenv import load_dotenv

load_dotenv()

TWILIO_SID = os.getenv("TWILIO_SID")
TWILIO_AUTH_TOKEN = os.getenv("TWILIO_AUTH_TOKEN")
TWILIO_PHONE_NUMBER = os.getenv("TWILIO_PHONE_NUMBER")

def is_valid_e164(number):
    return re.match(r'^\+\d{10,15}$', number)

def send_sos(message, recipient):
    if not TWILIO_SID or not TWILIO_AUTH_TOKEN or not TWILIO_PHONE_NUMBER:
        return {"error": "Twilio credentials are missing!"}

    if not is_valid_e164(recipient):
        return {"error": "Invalid recipient phone number. Use E.164 format: +91987XXXXXXX"}

    try:
        client = Client(TWILIO_SID, TWILIO_AUTH_TOKEN)
        msg = client.messages.create(
            body=message,
            from_=TWILIO_PHONE_NUMBER,
            to=recipient
        )
        return {"status": "sent", "message_sid": msg.sid}
    except Exception as e:
        print("\n🚨 Twilio Error:", str(e))
        return {"error": str(e)}
