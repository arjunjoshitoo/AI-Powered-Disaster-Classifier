# app.py

from flask import Flask, request, jsonify
import pickle

app = Flask(__name__)

# Load saved model and vectorizer
with open('sos_model.pkl', 'rb') as f:
    model = pickle.load(f)

with open('vectorizer.pkl', 'rb') as f:
    vectorizer = pickle.load(f)

@app.route('/')
def home():
    return "SOS Classifier API is Running!"

@app.route('/classify', methods=['POST'])
def classify_message():
    data = request.get_json()
    text = data.get('text', '')

    if not text:
        return jsonify({'error': 'No text provided'}), 400

    text_vec = vectorizer.transform([text])
    proba = model.predict_proba(text_vec)[0][1]  # probability of SOS
    prediction = int(proba > 0.5)   
    sos = bool(prediction)

    # Simulated location (replace later with actual geo)
    sample_coords = {
        "lat": 28.6139 + (0.1 - 0.2 * sos),  # Delhi + random delta
        "lon": 77.2090 + (0.1 - 0.2 * sos)
    }

    return jsonify({
        'sos': bool(prediction),
        'confidence': round(proba, 2),
        'message': text,
        'lat': sample_coords['lat'],
        'lon': sample_coords['lon']
    })

if __name__ == '__main__':
    app.run(debug=True)
