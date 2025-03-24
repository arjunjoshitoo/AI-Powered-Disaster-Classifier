const nameId = document.getElementById("nameTag");
const goTo = document.getElementById("goToMap");
const homeButton = document.getElementById("home");
const map = L.map('map').setView([20.5937, 78.9629], 5);

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const citiesDatabase = {
    "delhi": { lat: 28.6139, lon: 77.2090 },
    "mumbai": { lat: 19.0760, lon: 72.8777 },
    "bangalore": { lat: 12.9716, lon: 77.5946 },
    "kolkata": { lat: 22.5726, lon: 88.3639 },
    "chennai": { lat: 13.0827, lon: 80.2707 },
    "hyderabad": { lat: 17.3850, lon: 78.4867 },
    "ahmedabad": { lat: 23.0225, lon: 72.5714 },
    "pune": { lat: 18.5204, lon: 73.8567 },
    "jaipur": { lat: 26.9124, lon: 75.7873 },
    "lucknow": { lat: 26.8467, lon: 80.9462 }
};

function findCityInText(text) {
    const lowerText = text.toLowerCase();
    for (const city in citiesDatabase) {
        if (lowerText.includes(city)) {
            return city;
        }
    }
    return null;
}
function showLoading() {
    document.getElementById("loadingMessage").style.display = "block";
}


function hideLoading() {
    document.getElementById("loadingMessage").style.display = "none";
}


function submitMessage() {
    const text = document.getElementById("message").value.toLowerCase().trim();
    if (!text) return alert("Please enter a message.");

    document.getElementById("input-section").style.display = "none";
    document.getElementById("map").style.display = "block";

    const positiveKeywords = ["fine", "ok", "safe", "all good", "no issues", "doing well"];
    const emergencyKeywords = ["help", "trapped", "earthquake", "flood", "need help", "emergency", "sos"];

    let isSOS = emergencyKeywords.some(word => text.includes(word));
    let isSafe = positiveKeywords.some(word => text.includes(word));
    showLoading();
    if (navigator.geolocation) {
        hideLoading();
        navigator.geolocation.watchPosition((position) => {
            const { latitude, longitude } = position.coords;
            addMarker(latitude, longitude, text, isSOS, isSafe);
        }, (error) => {
            
            console.error("Geolocation error:", error);
        }, { enableHighAccuracy: true, timeout: 3000, maximumAge: 0 });
    } else {
        alert("Geolocation is not supported by your browser.");
    }

    nameId.style.display = "none";
    goTo.style.display = "none";
    homeButton.style.display = "block";
    hideLoading();
    
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("map").style.display = "none";
    homeButton.style.display = "none";
    nameId.style.display = "block";
    goTo.style.display = "block";
    
});

let userMarker;
function addMarker(lat, lon, message, isSOS, isSafe) {
    if (userMarker) {
        map.removeLayer(userMarker);
    }

    let markerColor = isSOS ? 'red' : isSafe ? 'green' : 'blue';

    userMarker = L.circleMarker([lat, lon], {
        color: markerColor,
        radius: 8,
        fillOpacity: 1
    }).addTo(map);

    const statusMessage = isSOS ? "🚨 SOS ALERT" : isSafe ? "✅ Safe Status" : "📍 Location Marker";
    userMarker.bindPopup(`<b>${statusMessage}</b><br>${message}`).openPopup();

    map.flyTo([lat, lon], isSOS ? 16 : 14)

    if (isSOS) {
        blinkMarker(userMarker);
    }
}
function blinkMarker(marker) {
    let visible = true;
    const blinkInterval = setInterval(() => {
        visible = !visible;
        marker.setStyle({ fillOpacity: visible ? 1 : 0 });
    }, 500); 

    setTimeout(() => clearInterval(blinkInterval), 20000); 
}

function trackUserLocation() {
    if (!navigator.geolocation) {
        return;
    }
    navigator.geolocation.watchPosition(
        (position) => {
            const { latitude, longitude } = position.coords;
            if (userMarker) {
                userMarker.setLatLng([latitude, longitude]);
            } else {
                userMarker = L.circleMarker([latitude, longitude], {
                    color: 'blue',
                    radius: 8,
                    fillOpacity: 1
                }).addTo(map).bindPopup("📍 You are here").openPopup();
            }
            map.setView([latitude, longitude], 13);
        },
        (error) => {
            console.error("Error getting location:", error);
        },
        { enableHighAccuracy: true, maximumAge: 0 }
    );
}

trackUserLocation();

goTo.addEventListener('click', () => {
    document.getElementById("input-section").style.display = "none";
    document.getElementById("map").style.display = "block";
    nameId.style.display = "none";
    goTo.style.display = "none";
    homeButton.style.display = "block";
});

homeButton.addEventListener('click', () => {
    homeButton.style.display = "none";
    document.getElementById("map").style.display = "none";
    document.getElementById("input-section").style.display = "block";
    nameId.style.display = "block";
    goTo.style.display = "block";
});
