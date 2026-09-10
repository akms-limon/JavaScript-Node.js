// ==============================
// Favorite Properties
// ==============================

const favoriteStorageKey = "favoriteProperties";

// Get favorite property IDs.
function getFavoriteIds() {
    const savedFavorites =
        localStorage.getItem(favoriteStorageKey);

    if (!savedFavorites) {
        return [];
    }

    return JSON.parse(savedFavorites);
}

// Save favorite property IDs.
function saveFavoriteIds(favoriteIds) {
    localStorage.setItem(
        favoriteStorageKey,
        JSON.stringify(favoriteIds)
    );
}

// Update favorite hearts after properties are loaded.
function updateFavoriteButtons() {
    const favoriteIds = getFavoriteIds();

    const favoriteButtons = document.querySelectorAll(
        ".property-favorite"
    );

    favoriteButtons.forEach(button => {
        const propertyId = button.dataset.propertyId;

        if (favoriteIds.includes(propertyId)) {
            button.classList.add("active");
        } else {
            button.classList.remove("active");
        }
    });
}

// Toggle favorite property.
function toggleFavorite(button) {
    const propertyId = button.dataset.propertyId;

    let favoriteIds = getFavoriteIds();

    if (favoriteIds.includes(propertyId)) {
        favoriteIds = favoriteIds.filter(
            id => id !== propertyId
        );

        button.classList.remove("active");
    } else {
        favoriteIds.push(propertyId);
        button.classList.add("active");
    }

    saveFavoriteIds(favoriteIds);
}

// Handle favorite heart click.
document.addEventListener("click", event => {
    const favoriteButton = event.target.closest(
        ".property-favorite"
    );

    if (!favoriteButton) {
        return;
    }

    toggleFavorite(favoriteButton);
});