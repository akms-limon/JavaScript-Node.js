const galleryViewButton = document.querySelector(".gallery-view-btn");
const galleryModal = document.querySelector("#galleryModal");
const galleryModalImages = document.querySelector("#galleryModalImages");
const galleryModalClose = document.querySelector("#galleryModalClose");
const galleryPrev = document.querySelector(".gallery-prev");
const galleryNext = document.querySelector(".gallery-next");
const galleryCurrent = document.querySelector("#galleryCurrent");
const galleryTotal = document.querySelector("#galleryTotal");
const galleryDots = document.querySelectorAll(".gallery-dots .dot");

// Gallery image data and current image index.
let galleryImages = [];
let currentIndex = 0;
let galleryLoaded = false;

const galleryMain = document.querySelector(".gallery-main");


// Fetch gallery images from the server.
async function fetchGalleryImages() {
    const response = await fetch("/images");

    if (!response.ok) {
        throw new Error("Failed to fetch gallery images.");
    }

    return await response.json();
}

// Prepare gallery images by fetching them from the server and storing them in the galleryImages array.
async function prepareGalleryImages() {
    try {
        const images = await fetchGalleryImages();

        const currentImage = galleryMain.getAttribute("src");

        galleryImages = [
            currentImage,
            ...images.filter(image => image !== currentImage)
        ].slice(0, 10);

        galleryLoaded = true;
    } catch (error) {
        console.error("Failed to prepare gallery images:", error);
    }
}


// View all images
galleryViewButton.addEventListener("click", async () => {
    if (!galleryLoaded) {
        await prepareGalleryImages();

        if (!galleryLoaded) {
            return;
        }
    }

    galleryModalImages.innerHTML = "";

    galleryImages.forEach(image => {
        const img = document.createElement("img");

        img.src = image;
        img.alt = "Property image";

        galleryModalImages.appendChild(img);
    });

    galleryModal.classList.add("active");

    document.documentElement.style.overflow = "hidden";
    document.body.style.overflow = "hidden";
});


// Close the gallery modal when the close button is clicked.
galleryModalClose.addEventListener("click", closeGalleryModal);


// Close the gallery modal when clicking outside the content.
galleryModal.addEventListener("click", event => {
    if (event.target === galleryModal) {
        closeGalleryModal();
    }
});


// Close the gallery modal when Escape is pressed.
document.addEventListener("keydown", event => {
    if (event.key === "Escape") {
        closeGalleryModal();
    }
});


function closeGalleryModal() {
    galleryModal.classList.remove("active");

    document.documentElement.style.overflow = "";
    document.body.style.overflow = "";
}



// Gallery navigation buttons
function updateGalleryImage() {
    galleryMain.src = galleryImages[currentIndex];

    galleryCurrent.textContent = currentIndex + 1;
    galleryTotal.textContent = galleryImages.length;

    updateGalleryDots();
}

// Show the next image in the gallery.
async function showNextImage() {
    if (!galleryLoaded) {
        await prepareGalleryImages();

        if (!galleryLoaded) {
            return;
        }
    }

    currentIndex++;

    if (currentIndex >= galleryImages.length) {
        currentIndex = 0;
    }

    updateGalleryImage();
}

// Show the previous image in the gallery.
async function showPreviousImage() {
    if (!galleryLoaded) {
        await prepareGalleryImages();

        if (!galleryLoaded) {
            return;
        }
    }

    currentIndex--;

    if (currentIndex < 0) {
        currentIndex = galleryImages.length - 1;
    }

    updateGalleryImage();
}

// Add event listeners for the gallery navigation buttons.
galleryNext.addEventListener("click", showNextImage);
galleryPrev.addEventListener("click", showPreviousImage);

// ======================================
// Gallery Mobile Swipe
// Same gesture behavior as property cards
// ======================================

let galleryTouchStartX = 0;
let galleryTouchCurrentX = 0;
let galleryIsDragging = false;


// Touch start
galleryMain.addEventListener("touchstart", event => {

    if (window.innerWidth > 767) {
        return;
    }

    galleryTouchStartX = event.touches[0].clientX;
    galleryTouchCurrentX = galleryTouchStartX;

    galleryIsDragging = true;

    galleryMain.style.transition = "none";

}, { passive: true });


// Touch move
galleryMain.addEventListener("touchmove", event => {

    if (window.innerWidth > 767 || !galleryIsDragging) {
        return;
    }

    galleryTouchCurrentX = event.touches[0].clientX;

}, { passive: true });


// Touch end
galleryMain.addEventListener("touchend", async () => {

    if (window.innerWidth > 767 || !galleryIsDragging) {
        return;
    }

    const swipeDistance =
        galleryTouchCurrentX - galleryTouchStartX;

    const swipeThreshold = 60;

    galleryIsDragging = false;


    // Same transition as property cards
    galleryMain.style.transition =
        "transform 0.3s ease";


    // Swipe left → next image
    if (swipeDistance < -swipeThreshold) {

        galleryMain.style.transform =
            "translateX(-100%)";

        await new Promise(resolve => {
            setTimeout(resolve, 300);
        });

        await showNextImage();
    }


    // Swipe right → previous image
    else if (swipeDistance > swipeThreshold) {

        galleryMain.style.transform =
            "translateX(100%)";

        await new Promise(resolve => {
            setTimeout(resolve, 300);
        });

        await showPreviousImage();
    }


    // Reset position
    galleryMain.style.transform =
        "translateX(0)";

}, { passive: true });


// Touch cancel
galleryMain.addEventListener("touchcancel", () => {

    galleryIsDragging = false;

    galleryMain.style.transition =
        "transform 0.3s ease";

    galleryMain.style.transform =
        "translateX(0)";
});


// Update the active dot in the gallery modal based on the current image index.

function updateGalleryDots() {
    let activeDotIndex;

    if (currentIndex === 0) {
        activeDotIndex = 0;
    } else if (currentIndex === 1) {
        activeDotIndex = 1;
    } else if (currentIndex >= 2 && currentIndex <= 7) {
        activeDotIndex = 2;
    } else if (currentIndex === 8) {
        activeDotIndex = 3;
    } else {
        activeDotIndex = 4;
    }

    galleryDots.forEach((dot, index) => {
        dot.classList.remove("active");

        if (index === activeDotIndex) {
            dot.classList.add("active");
        }
    });
}