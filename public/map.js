// ==============================
// Property Map
// ==============================

let propertyMap = null;
let propertyMarkers = [];
let activePropertyId = null;


// ==============================
// Google Map Marker Icons
// ==============================

// Same Google Maps red-dot icon.
// Only the size changes on hover/click.

const GOOGLE_RED_DOT_ICON =
    "https://maps.google.com/mapfiles/ms/icons/red-dot.png";


// ==============================
// Default Marker
// ==============================

function getDefaultMarkerIcon() {

    return {
        url: GOOGLE_RED_DOT_ICON,

        scaledSize:
            new google.maps.Size(
                24,
                24
            ),

        anchor:
            new google.maps.Point(
                12,
                12
            )
    };
}


// ==============================
// Hover Marker
// ==============================

function getHoverMarkerIcon() {

    return {
        url: GOOGLE_RED_DOT_ICON,

        scaledSize:
            new google.maps.Size(
                30,
                30
            ),

        anchor:
            new google.maps.Point(
                15,
                15
            )
    };
}


// ==============================
// Active Marker
// ==============================

function getActiveMarkerIcon() {

    return {
        url: GOOGLE_RED_DOT_ICON,

        scaledSize:
            new google.maps.Size(
                36,
                36
            ),

        anchor:
            new google.maps.Point(
                18,
                18
            )
    };
}


// ==============================
// Load Google Maps
// ==============================

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

            const script =
                document.createElement("script");


            script.src =
                `https://maps.googleapis.com/maps/api/js?key=${encodeURIComponent(data.key)}&callback=initMap`;


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


// ==============================
// Initialize Map
// ==============================

function initMap() {

    const mapContainer =
        document.getElementById(
            "property-map"
        );


    if (!mapContainer) {

        console.error(
            "#property-map not found"
        );

        return;
    }


    propertyMap =
        new google.maps.Map(
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


// ==============================
// Clear Property Markers
// ==============================

function clearPropertyMarkers() {

    propertyMarkers.forEach(
        marker => {

            marker.setMap(null);

        }
    );


    propertyMarkers = [];

    activePropertyId = null;
}


// ==============================
// Update Property Map
// ==============================

function updatePropertyMap() {

    if (!propertyMap) {

        return;
    }


    if (
        !window.nearbyProperties ||
        !Array.isArray(
            window.nearbyProperties
        )
    ) {

        return;
    }


    clearPropertyMarkers();


    const bounds =
        new google.maps.LatLngBounds();


    window.nearbyProperties.forEach(
        property => {

            const propertyId =
                property.ID;


            const latitude =
                Number(
                    property.GeoInfo?.Lat
                );


            const longitude =
                Number(
                    property.GeoInfo?.Lng
                );


            // Invalid coordinates skip

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


            // ==========================
            // Create Marker
            // ==========================

            const marker =
                new google.maps.Marker({

                    position: position,

                    map: propertyMap,

                    icon:
                        getDefaultMarkerIcon()

                });


            marker.propertyId =
                propertyId;


            // ==========================
            // Marker Hover
            // ==========================

            marker.addListener(
                "mouseover",
                () => {

                    // Don't change
                    // clicked marker.

                    if (
                        activePropertyId &&
                        String(
                            activePropertyId
                        ) ===
                        String(
                            propertyId
                        )
                    ) {

                        return;
                    }


                    // Same icon,
                    // only bigger.

                    marker.setIcon(
                        getHoverMarkerIcon()
                    );


                    marker.setZIndex(500);

                }
            );


            // ==========================
            // Marker Mouseout
            // ==========================

            marker.addListener(
                "mouseout",
                () => {

                    // Don't reset
                    // clicked marker.

                    if (
                        activePropertyId &&
                        String(
                            activePropertyId
                        ) ===
                        String(
                            propertyId
                        )
                    ) {

                        return;
                    }


                    // Back to same icon,
                    // normal size.

                    marker.setIcon(
                        getDefaultMarkerIcon()
                    );


                    marker.setZIndex(1);

                }
            );


            // ==========================
            // Marker Click
            // ==========================

            marker.addListener(
                "click",
                () => {

                    activePropertyId =
                        propertyId;


                    // Only the clicked
                    // marker becomes bigger.

                    propertyMarkers.forEach(
                        otherMarker => {

                            if (
                                String(
                                    otherMarker.propertyId
                                ) ===
                                String(
                                    propertyId
                                )
                            ) {

                                // Same Google icon,
                                // only bigger.

                                otherMarker.setIcon(
                                    getActiveMarkerIcon()
                                );


                                otherMarker.setZIndex(
                                    1000
                                );

                            }

                            else {

                                // Other markers
                                // return to normal.

                                otherMarker.setIcon(
                                    getDefaultMarkerIcon()
                                );


                                otherMarker.setZIndex(
                                    1
                                );

                            }

                        }
                    );


                    // ==========================
                    // Highlight Property Card
                    // ==========================

                    highlightProperty(
                        propertyId
                    );

                }
            );


            propertyMarkers.push(
                marker
            );

        }
    );


    // ==========================
    // Show All Property Markers
    // ==========================

    if (!bounds.isEmpty()) {

        propertyMap.fitBounds(
            bounds,
            80
        );

    }
}


// ==============================
// Highlight Property Tile
// ==============================

function highlightProperty(
    propertyId
) {

    const propertyCards =
        document.querySelectorAll(
            ".property-card"
        );


    propertyCards.forEach(
        card => {

            const cardPropertyId =
                card.dataset.propertyId;


            const isActive =
                String(
                    cardPropertyId
                ) ===
                String(
                    propertyId
                );


            card.classList.toggle(
                "property-card--active",
                isActive
            );

        }
    );


    const selectedCard =
        document.querySelector(
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


// ==============================
// Property Tile Hover
// ==============================

function setupPropertyHover() {

    const propertyList =
        document.getElementById(
            "property-list"
        );


    if (!propertyList) {

        return;
    }


    // ==========================
    // Property Card Mouseover
    // ==========================

    propertyList.addEventListener(
        "mouseover",
        event => {

            const card =
                event.target.closest(
                    ".property-card"
                );


            if (!card) {

                return;
            }


            const propertyId =
                card.dataset.propertyId;


            if (!propertyId) {

                return;
            }


            const marker =
                propertyMarkers.find(
                    item =>
                        String(
                            item.propertyId
                        ) ===
                        String(
                            propertyId
                        )
                );


            if (!marker) {

                return;
            }


            // ==========================
            // Property Card Highlight
            // ==========================

            /*
             * IMPORTANT:
             *
             * If this property was selected
             * by clicking the map marker,
             * remove the selected color
             * while hovering the card.
             */

            if (
                activePropertyId &&
                String(
                    activePropertyId
                ) ===
                String(
                    propertyId
                )
            ) {

                card.classList.remove(
                    "property-card--active"
                );

                return;
            }


            // Normal hover property
            // gets highlighted.

            card.classList.add(
                "property-card--active"
            );


            // ==========================
            // Marker Highlight
            // ==========================

            // Same Google icon,
            // only bigger.

            marker.setIcon(
                getHoverMarkerIcon()
            );


            marker.setZIndex(500);

        }
    );


    // ==========================
    // Property Card Mouseout
    // ==========================

    propertyList.addEventListener(
        "mouseout",
        event => {

            const card =
                event.target.closest(
                    ".property-card"
                );


            if (!card) {

                return;
            }


            // Card-এর ভিতরেই mouse move করলে
            // reset করবে না.

            if (
                event.relatedTarget &&
                card.contains(
                    event.relatedTarget
                )
            ) {

                return;
            }


            const propertyId =
                card.dataset.propertyId;


            if (!propertyId) {

                return;
            }


            const marker =
                propertyMarkers.find(
                    item =>
                        String(
                            item.propertyId
                        ) ===
                        String(
                            propertyId
                        )
                );


            if (!marker) {

                return;
            }


            // ==========================
            // Property Card Reset
            // ==========================

            /*
             * Mouse বের হলেই card-এর
             * orange border/color reset হবে.
             *
             * এমনকি marker আগে click করা
             * থাকলেও card normal থাকবে.
             */

            card.classList.remove(
                "property-card--active"
            );


            // ==========================
            // Marker Reset
            // ==========================

            /*
             * যদি marker click করা থাকে,
             * তাহলে marker selected/big
             * অবস্থায় থাকবে.
             */

            if (
                activePropertyId &&
                String(
                    activePropertyId
                ) ===
                String(
                    propertyId
                )
            ) {

                return;
            }


            // অন্যথায় marker normal হবে.

            marker.setIcon(
                getDefaultMarkerIcon()
            );


            marker.setZIndex(1);

        }
    );
}


// ==============================
// Start
// ==============================

setupPropertyHover();

loadGoogleMaps();