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

function submitMessage() {
    const text = document.getElementById("message").value;
    if (!text.trim()) return alert("Please enter a message.");
    document.getElementById("input-section").style.display = "none";
    document.getElementById("map").style.display = "block";
    
    const city = findCityInText(text);

    if (city && text.toLowerCase().includes("help")) {
        const { lat, lon } = citiesDatabase[city];

        const finalLat = lat + (Math.random() * 0.02 - 0.01);
        const finalLon = lon + (Math.random() * 0.02 - 0.01);
        
        addMarker(finalLat, finalLon, text, true);
    } else {
        mockClassifyMessage(text).then(response => {
            const { sos, lat, lon, message } = response;
            addMarker(lat, lon, message, sos);
        });
    }
    nameId.style.display = "none";
    goTo.style.display = "none";
    homeButton.style.display = "block";
}

document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("map").style.display = "none";
    homeButton.style.display = "none";
});

function addMarker(lat, lon, message, isSOS) {
    map.eachLayer(function(layer) {
        if (layer instanceof L.CircleMarker) {
            map.removeLayer(layer);
        }
    });

    const marker = L.circleMarker([lat, lon], {
        color: isSOS ? 'red' : 'green',
        radius: 8,
        fillOpacity: 1
    }).addTo(map);

    marker.bindPopup(`<b>${isSOS ? "🚨 SOS ALERT" : "✅ Safe Message"}</b><br>${message}`);
    
    try {
        const startPos = map.getCenter();
        const startZoom = map.getZoom();
        const endZoom = isSOS ? 20 : 12; 
        const duration = 1500; 
        const frames = 60;
        const frameTime = duration / frames;

        let currentFrame = 0;

        function easeInOutCubic(t) {
            return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2;
        }

        function animateFrame() {
            if (currentFrame >= frames) {
                map.setView([lat, lon], endZoom, { animate: false });
                marker.openPopup();

                if (isSOS) {
                    setTimeout(() => {
                        map.setView([lat, lon], 10, { animate: true });
                    }, 50000);
                }

                return;
            }

            currentFrame++;
            const progress = easeInOutCubic(currentFrame / frames);

            const newLat = startPos.lat + (lat - startPos.lat) * progress;
            const newLng = startPos.lng + (lon - startPos.lng) * progress;
            const newZoom = startZoom + (endZoom - startZoom) * progress;

            map.setView([newLat, newLng], newZoom, { animate: false });

            setTimeout(animateFrame, frameTime);
        }

        animateFrame();
    } catch (e) {
        console.error("Animation failed, using fallback", e);
        map.setView([lat, lon], isSOS ? 17 : 12);
        marker.openPopup();

        if (isSOS) {
            setTimeout(() => {
                map.setView([lat, lon], 10, { animate: true });
            }, 10000);
        }
    }

    marker.openPopup();

    if (isSOS) {
        blinkMarker(marker);
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

function mockClassifyMessage(text) {
    return new Promise((resolve) => {
        const keywords = ['help', 'trapped', 'earthquake', 'flood', 'need', 'emergency', 'sos'];
        const sos = keywords.some(word => text.toLowerCase().includes(word));

        const locations = [
            { city: "Delhi", lat: 28.6139, lon: 77.2090 },
            { city: "Mumbai", lat: 19.0760, lon: 72.8777 },
            { city: "Bangalore", lat: 12.9716, lon: 77.5946 }
        ];
        const random = locations[Math.floor(Math.random() * locations.length)];

        resolve({
            sos,
            message: text,
            lat: random.lat + Math.random() * 0.05,
            lon: random.lon + Math.random() * 0.05
        });
    });
}
let userMarker;

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