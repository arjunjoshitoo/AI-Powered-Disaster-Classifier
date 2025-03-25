from flask import Flask, request, jsonify
import pickle
from geopy.geocoders import Nominatim

app = Flask(__name__)

# Load model and vectorizer
with open('sos_model.pkl', 'rb') as f:
    model = pickle.load(f)
with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

geolocator = Nominatim(user_agent="disaster-response-map")

@app.route('/classify', methods=['POST'])
def classify_message():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    # Predict SOS
    vec = vectorizer.transform([text])
    proba = model.predict_proba(vec)[0][1]
    prediction = int(proba > 0.5)

    # Extract location using geopy
    location = geolocator.geocode(text)
    if location:
        lat, lon = location.latitude, location.longitude
    else:
        lat, lon = 20.5937, 78.9629  # fallback to center of India

    return jsonify({
        'sos': bool(prediction),
        'confidence': round(proba, 2),
        'message': text,
        'lat': lat,
        'lon': lon
    })

if __name__ == '__main__':
    app.run(debug=True)
