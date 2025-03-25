// 🚨 Disaster Response Map Script (Backend-driven Location)
// Geolocation handled by backend via text parsing

// DOM Elements
const nameId = document.getElementById("nameTag");
const goTo = document.getElementById("goToMap");
const homeButton = document.getElementById("home");
const inputSection = document.getElementById("input-section");
const mapContainer = document.getElementById("map");
const textArea = document.getElementById("message");

const map = L.map('map').setView([20.5937, 78.9629], 5);

// 🗺️ Initialize Map Tiles
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

let userMarker;

// 💡 Create Marker with Popup
function createMarker(lat, lon, color, text, label) {
  const marker = L.circleMarker([lat, lon], {
    color,
    radius: 8,
    fillOpacity: 1
  }).addTo(map);
  marker.bindPopup(`<b>${label}</b><br>${text}`).openPopup();
  return marker;
}

// 🔁 Smooth Marker Blinking
function blinkMarker(marker) {
  let visible = true;
  const interval = setInterval(() => {
    visible = !visible;
    marker.setStyle({ fillOpacity: visible ? 1 : 0 });
  }, 500);
  setTimeout(() => clearInterval(interval), 20000);
}

// 🎯 Add Classified Marker
function addMarker(lat, lon, message, isSOS, isSafe, confidence) {
  if (userMarker) map.removeLayer(userMarker);

  const color = isSOS ? 'red' : isSafe ? 'green' : 'blue';
  const label = isSOS ? "🚨 SOS ALERT" : isSafe ? "✅ Safe Status" : "📍 Location Marker";
  const content = `<b>${label}</b><br>${message}<br>${confidence !== undefined ? `Confidence: ${(confidence * 100).toFixed(1)}%` : ''}`;

  userMarker = L.circleMarker([lat, lon], {
    color,
    radius: 10,
    fillOpacity: 1
  }).addTo(map).bindPopup(content).openPopup();

  map.flyTo([lat, lon], isSOS ? 16 : 14, { animate: true });
  if (isSOS) blinkMarker(userMarker);
}

// 🔄 Submit Button Logic
function submitMessage() {
  const text = textArea.value.trim();
  if (!text) return alert("Please enter a message.");

  // UI Transition Animations
  inputSection.classList.add("hide-left");
  mapContainer.classList.add("active");
  showLoading();

  // Send message text to backend only (no coordinates)
  fetch("http://127.0.0.1:5000/classify", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ text: text })
  })
    .then(res => res.json())
    .then(data => {
      addMarker(data.lat, data.lon, data.message, data.sos, false, data.confidence);
      nameId.style.display = "none";
      goTo.style.display = "none";
      homeButton.style.display = "block";
      hideLoading();
      textArea.value = "";
    })
    .catch(err => {
      alert("Failed to fetch location from message. Please be more specific.");
      hideLoading();
      console.error(err);
    });
}

// 💫 Loading Spinner Toggle
function showLoading() {
  document.getElementById("loadingMessage").style.display = "flex";
}
function hideLoading() {
  document.getElementById("loadingMessage").style.display = "none";
}

// 🧭 UI Setup on Load
window.addEventListener("DOMContentLoaded", () => {
  mapContainer.style.display = "none";
  homeButton.style.display = "none";
  nameId.style.display = "block";
  goTo.style.display = "block";
});

// 🔀 UI Button Logic
goTo.addEventListener('click', () => {
  inputSection.classList.add("hide-left");
  mapContainer.classList.add("active");
  nameId.style.display = "none";
  goTo.style.display = "none";
  homeButton.style.display = "block";
});

homeButton.addEventListener('click', () => {
  homeButton.style.display = "none";
  mapContainer.classList.remove("active");
  inputSection.classList.remove("hide-left");
  nameId.style.display = "block";
  goTo.style.display = "block";
});
