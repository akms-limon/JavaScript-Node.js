// ==============================
// Nearby Properties API
// ==============================

const propertySortButton = document.getElementById("property-sort-button");
const propertySortLabel = document.getElementById("property-sort-label");
const propertyDropdown = document.querySelector(".property-dropdown");
const propertyDropdownMenu = document.getElementById("property-dropdown-menu");
const propertyList = document.getElementById("property-list");
const imageServiceBaseUrl = "https://beta.imgservice.rentbyowner.com/640x300/";

// Property limit
function getPropertyLimit() {
    return window.innerWidth < 768 ? 4 : 6;
}

// Escape HTML
function escapeHtml(value) {
    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

// Create property card
function createPropertyCard(property) {
    const propertyId = property.ID;
    const propertyData = property.Property;
    const geoInfo = property.GeoInfo;
    const partner = property.Partner;

    const imageUrl = imageServiceBaseUrl + propertyData.FeatureImage;
    const propertyName = escapeHtml(propertyData.PropertyName);
    const propertyType = escapeHtml(propertyData.PropertyType);
    const reviewScore = propertyData.ReviewScore ?? "N/A";
    const reviews = propertyData.Counts?.Reviews ?? 0;
    const price = propertyData.Price ?? propertyData.CachePrice ?? 0;
    const occupancy = propertyData.Counts?.Occupancy ?? 0;
    const location = escapeHtml(geoInfo?.Display || "");

    let amenities = "";

    if (Array.isArray(propertyData.TopAmenities) && propertyData.TopAmenities.length > 0) {
        amenities = propertyData.TopAmenities
            .slice(0, 4)
            .map(amenity => escapeHtml(amenity.Name))
            .join(" · ");
    }

    if (occupancy) {
        amenities += amenities ? ` · Sleeps ${occupancy}` : `Sleeps ${occupancy}`;
    }

    if (!amenities) {
        amenities = propertyType;
    }

    const badge = escapeHtml(
        propertyData.PropertyHighlight ||
        propertyData.PropertyAttribute ||
        "Nearby Property"
    );

    return `
        <article class="property-card">
            <div class="property-card__photo">
                <img src="${imageUrl}" alt="${propertyName}">

                <div class="property-card-badge-and-icon">
                    <span class="property-card__badge">${badge}</span>

                    <span class="property-card__icons">
                        <span aria-hidden="true">🌴</span>
                        <span aria-hidden="true">📍</span>
                        <button
                            class="property-favorite"
                            type="button"
                            data-property-id="${propertyId}"
                            aria-label="Add to favorites">
                            ♥
                        </button>
                    </span>
                </div>
            </div>

            <div class="property-card__body">
                <p class="property-card__score">
                    <span class="exceptional-stars">★</span>
                    <span class="exceptional-rating">${reviewScore} Exceptional</span>
                    <span class="exceptional-reviews">${reviews} Reviews</span>
                </p>

                <h3>${propertyName}</h3>

                <p class="property-card__price">
                    <span class="price-source">Booking.com</span>
                    <span class="price-amount">From $${Number(price).toLocaleString()}</span>
                    <span class="price-info" aria-hidden="true">ⓘ</span>
                </p>

                <p class="property-card__amenities">${amenities}</p>
                <p class="property-card__location">${location}</p>

                <div class="property-card__actions">
                    <a
                        class="btn btn-ghost"
                        href="${escapeHtml(partner?.URL || "#")}"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        Learn more
                    </a>

                    <button class="btn btn-primary" type="button">
                        See dates
                    </button>
                </div>
            </div>
        </article>
    `;
}

// Mobile swipe
const mobileDots = document.querySelectorAll(".mobile-card-dots span");

let currentPropertyIndex = 0;
let touchStartX = 0;
let touchCurrentX = 0;
let isDragging = false;

function isMobileView() {
    return window.innerWidth <= 767;
}

function updateMobileDots() {
    mobileDots.forEach((dot, index) => {
        let activeDotIndex = 0;

        if (currentPropertyIndex === 1 || currentPropertyIndex === 2) {
            activeDotIndex = 1;
        } else if (currentPropertyIndex >= 3) {
            activeDotIndex = 2;
        }

        dot.classList.toggle("active", index === activeDotIndex);
    });
}

function updateMobileProperty(animate = true, dragOffset = 0) {
    const cards = propertyList.querySelectorAll(".property-card");

    if (!isMobileView() || cards.length === 0) {
        return;
    }

    cards.forEach((card, index) => {
        const position = (index - currentPropertyIndex) * 100;

        card.classList.toggle("swiping", !animate);

        card.style.transform =
            `translateX(${position}%)`;
    });

    updateMobileDots();
}

// Load properties
async function loadProperties(filter) {
    try {
        const limit = getPropertyLimit();

        const response = await fetch(
            `/get-property?${filter}=true&limit=${limit}`
        );

        if (!response.ok) {
            throw new Error("Failed to fetch properties.");
        }

        const properties = await response.json();

        propertyList.innerHTML = "";

        properties.forEach(property => {
            propertyList.innerHTML += createPropertyCard(property);
        });

        updateFavoriteButtons();

        currentPropertyIndex = 0;
        updateMobileProperty();
    } catch (error) {

        propertyList.innerHTML = `
            <p>Unable to load properties right now.</p>
        `;
    }
}

// Initial load
loadProperties("most-popular");

// Dropdown
propertySortButton.addEventListener("click", () => {
    const isOpen = propertyDropdown.classList.toggle("open");

    propertySortButton.setAttribute(
        "aria-expanded",
        isOpen
    );
});

propertyDropdownMenu.addEventListener("click", event => {
    const option = event.target.closest("button");

    if (!option) {
        return;
    }

    const selectedValue = option.dataset.value;
    const selectedLabel = option.textContent;

    propertySortLabel.textContent = selectedLabel;

    propertyDropdown.classList.remove("open");

    propertySortButton.setAttribute(
        "aria-expanded",
        "false"
    );

    loadProperties(selectedValue);
});

document.addEventListener("click", event => {
    if (!propertyDropdown.contains(event.target)) {
        propertyDropdown.classList.remove("open");

        propertySortButton.setAttribute(
            "aria-expanded",
            "false"
        );
    }
});

// Touch start
propertyList.addEventListener("touchstart", event => {
    if (!isMobileView()) {
        return;
    }

    touchStartX = event.touches[0].clientX;
    touchCurrentX = touchStartX;
    isDragging = true;

    updateMobileProperty(false, 0);
}, { passive: true });

// Touch move
propertyList.addEventListener("touchmove", event => {
    if (!isMobileView() || !isDragging) {
        return;
    }

    touchCurrentX = event.touches[0].clientX;

    const dragDistance = touchCurrentX - touchStartX;

    updateMobileProperty(false, dragDistance);
}, { passive: true });

// Touch end
propertyList.addEventListener("touchend", () => {
    if (!isMobileView() || !isDragging) {
        return;
    }

    const swipeDistance = touchCurrentX - touchStartX;
    const cards = propertyList.querySelectorAll(".property-card");
    const swipeThreshold = 60;

    if (swipeDistance < -swipeThreshold) {
        if (currentPropertyIndex < cards.length - 1) {
            currentPropertyIndex++;
        } else {
            currentPropertyIndex = 0;
        }
    } else if (swipeDistance > swipeThreshold) {
        if (currentPropertyIndex > 0) {
            currentPropertyIndex--;
        } else {
            currentPropertyIndex = cards.length - 1;
        }
    }

    isDragging = false;
    updateMobileProperty(true, 0);
}, { passive: true });

// Touch cancel
propertyList.addEventListener("touchcancel", () => {
    isDragging = false;
    updateMobileProperty(true, 0);
});

// Resize
window.addEventListener("resize", () => {
    const cards = propertyList.querySelectorAll(".property-card");

    if (isMobileView()) {
        if (currentPropertyIndex >= cards.length) {
            currentPropertyIndex = Math.max(cards.length - 1, 0);
        }

        updateMobileProperty();
        return;
    }

    cards.forEach(card => {
        card.style.transform = "";
        card.classList.remove("swiping");
    });
});