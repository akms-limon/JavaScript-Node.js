const descriptionLong = document.querySelector(".description-long");
const readMoreButton = document.querySelector(".btn-read-more");
const collapseButton = document.querySelector(".btn-collapse");

// Expand the description.
readMoreButton.addEventListener("click", () => {
    descriptionLong.hidden = false;
    readMoreButton.hidden = true;
});

// Collapse the description.
collapseButton.addEventListener("click", () => {
    descriptionLong.hidden = true;
    readMoreButton.hidden = false;
});


lucide.createIcons();