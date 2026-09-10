// ==============================
// Property Map
// ==============================

let propertyMap = null;
let propertyMarkers = [];
let activePropertyId = null;

// Google Maps marker icons.
const GOOGLE_RED_DOT_ICON = "https://maps.google.com/mapfiles/ms/icons/red-dot.png";

// Create the default marker icon.
function getDefaultMarkerIcon() {
    return {
        url: GOOGLE_RED_DOT_ICON,
        scaledSize: new google.maps.Size(24, 24),
        anchor: new google.maps.Point(12, 12)
    };
}

// Create the hover marker icon.
function getHoverMarkerIcon() {
    return {
        url: GOOGLE_RED_DOT_ICON,
        scaledSize: new google.maps.Size(30, 30),
        anchor: new google.maps.Point(15, 15)
    };
}

// Create the active marker icon.
function getActiveMarkerIcon() {
    return {
        url: GOOGLE_RED_DOT_ICON,
        scaledSize: new google.maps.Size(36, 36),
        anchor: new google.maps.Point(18, 18)
    };
}

// Load Google Maps.
function loadGoogleMaps() {
    fetch("/api/maps-key")
        .then(response => {
            if (!response.ok) {
                throw new Error(
                    "Failed to get Google Maps API key."
                );
            }

            return response.json();
        })
        .then(data => {
            const script = document.createElement("script");

            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(data.key)}&loading=async&callback=initMap`;

            script.async = true;
            script.defer = true;

            document.head.appendChild(script);
        })
        .catch(error => {
            console.error(
                "Google Maps loading failed:",
                error
            );
        });
}

// Initialize the property map.
function initMap() {
    const mapContainer = document.getElementById("property-map");

    if (!mapContainer) {
        console.error("#property-map not found");
        return;
    }

    propertyMap = new google.maps.Map(
        mapContainer,
        {
            center: {
                lat: 28.3475,
                lng: -81.5412
            },
            zoom: 10
        }
    );

    updatePropertyMap();
}

// Clear all property markers.
function clearPropertyMarkers() {
    propertyMarkers.forEach(marker => {
        marker.setMap(null);
    });

    propertyMarkers = [];
    activePropertyId = null;
}

// Update map markers using loaded properties.
function updatePropertyMap() {
    if (!propertyMap) {
        return;
    }

    if (
        !window.nearbyProperties ||
        !Array.isArray(window.nearbyProperties)
    ) {
        return;
    }

    clearPropertyMarkers();

    const bounds = new google.maps.LatLngBounds();

    window.nearbyProperties.forEach(property => {
        const propertyId = property.ID;
        const latitude = Number(property.GeoInfo?.Lat);
        const longitude = Number(property.GeoInfo?.Lng);

        // Skip properties with invalid coordinates.
        if (
            !Number.isFinite(latitude) ||
            !Number.isFinite(longitude)
        ) {
            return;
        }

        const position = {
            lat: latitude,
            lng: longitude
        };

        bounds.extend(position);

        // Create marker.
        const marker = new google.maps.Marker({
            position: position,
            map: propertyMap,
            icon: getDefaultMarkerIcon()
        });

        marker.propertyId = propertyId;

        // Handle marker hover.
        marker.addListener("mouseover", () => {
            if (
                activePropertyId &&
                String(activePropertyId) === String(propertyId)
            ) {
                return;
            }

            marker.setIcon(getHoverMarkerIcon());
            marker.setZIndex(500);
        });

        // Handle marker mouseout.
        marker.addListener("mouseout", () => {
            if (
                activePropertyId &&
                String(activePropertyId) === String(propertyId)
            ) {
                return;
            }

            marker.setIcon(getDefaultMarkerIcon());
            marker.setZIndex(1);
        });

        // Handle marker click.
        marker.addListener("click", () => {
            activePropertyId = propertyId;

            propertyMarkers.forEach(otherMarker => {
                if (
                    String(otherMarker.propertyId) ===
                    String(propertyId)
                ) {
                    otherMarker.setIcon(getActiveMarkerIcon());
                    otherMarker.setZIndex(1000);
                } else {
                    otherMarker.setIcon(getDefaultMarkerIcon());
                    otherMarker.setZIndex(1);
                }
            });

            highlightProperty(propertyId);
        });

        propertyMarkers.push(marker);
    });

    if (!bounds.isEmpty()) {
        propertyMap.fitBounds(bounds, 80);
    }
}

// Highlight the property card matching the selected marker.
function highlightProperty(propertyId) {
    const propertyCards = document.querySelectorAll(".property-card");

    propertyCards.forEach(card => {
        const cardPropertyId = card.dataset.propertyId;

        const isActive =
            String(cardPropertyId) === String(propertyId);

        card.classList.toggle(
            "property-card--active",
            isActive
        );
    });

    const selectedCard = document.querySelector(
        `.property-card[data-property-id="${CSS.escape(String(propertyId))}"]`
    );

    if (selectedCard) {
        selectedCard.scrollIntoView({
            behavior: "smooth",
            block: "nearest",
            inline: "center"
        });
    }
}

// Set up property card and marker hover interactions.
function setupPropertyHover() {
    const propertyList = document.getElementById("property-list");

    if (!propertyList) {
        return;
    }

    // Handle property card mouseover.
    propertyList.addEventListener("mouseover", event => {
        const card = event.target.closest(".property-card");

        if (!card) {
            return;
        }

        const propertyId = card.dataset.propertyId;

        if (!propertyId) {
            return;
        }

        const marker = propertyMarkers.find(
            item =>
                String(item.propertyId) ===
                String(propertyId)
        );

        if (!marker) {
            return;
        }

        if (
            activePropertyId &&
            String(activePropertyId) === String(propertyId)
        ) {
            card.classList.remove("property-card--active");
            return;
        }

        card.classList.add("property-card--active");
        marker.setIcon(getHoverMarkerIcon());
        marker.setZIndex(500);
    });

    // Handle property card mouseout.
    propertyList.addEventListener("mouseout", event => {
        const card = event.target.closest(".property-card");

        if (!card) {
            return;
        }

        if (
            event.relatedTarget &&
            card.contains(event.relatedTarget)
        ) {
            return;
        }

        const propertyId = card.dataset.propertyId;

        if (!propertyId) {
            return;
        }

        const marker = propertyMarkers.find(
            item =>
                String(item.propertyId) ===
                String(propertyId)
        );

        if (!marker) {
            return;
        }

        card.classList.remove("property-card--active");

        if (
            activePropertyId &&
            String(activePropertyId) === String(propertyId)
        ) {
            return;
        }

        marker.setIcon(getDefaultMarkerIcon());
        marker.setZIndex(1);
    });
}

// Start.
setupPropertyHover();
loadGoogleMaps();