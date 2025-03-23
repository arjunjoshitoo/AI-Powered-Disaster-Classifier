# AI-Powered-Disaster-Classifier
🆘 AI-Powered Disaster Response Map
A weekend-built hackathon project that uses machine learning and geolocation to identify SOS messages from disaster-affected individuals and plot them on a live interactive map in real time.

🚀 What It Does
Classifies messages (e.g. social media posts, text input) as SOS or Not SOS

Uses TF-IDF + Logistic Regression trained on real disaster tweet data

Captures the user’s current location using GPS (browser-based)

Displays SOS alerts as red markers and safe messages as green markers on a Leaflet.js map

Shows prediction confidence score and message details in a popup

Fully functional backend built with Flask and Python

Frontend built using HTML + JavaScript + Leaflet.js

🎯 Use Case
In the event of floods, earthquakes, or any crisis, victims often post messages asking for help. This project acts as an AI-assisted mapping layer for emergency responders, allowing them to visually monitor distress calls in real time and identify hotspots.

🧠 Tech Stack
Layer	    Tools Used
Frontend	HTML, JavaScript, Leaflet.js
Backend	    Flask (Python)
ML Model	TF-IDF Vectorizer + Logistic Regression (scikit-learn)
Dataset	    Disaster Tweets Dataset
Geolocation Navigator.geolocation API (Browser)


📦 Features
✅ Real-time text classification (SOS / Non-SOS)

✅ Live map markers with color-coded urgency

✅ GPS-based user location detection

✅ Confidence scores from the ML model

✅ API endpoint to classify any input text

🧪 Demo Workflow
User opens the app — browser asks for location access

User enters a message (e.g. “There’s a fire in our building. Help!”)

Backend classifies the message and returns SOS status, confidence, and location

Frontend displays a marker on the map with message details

