// ==============================
// Booking and Guest Selection
// ==============================

const dateRangeInput = document.getElementById("date-range");

const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");
const totalPriceInput = document.getElementById("total-price");

const guestsInput = document.getElementById("guests");

const guestModal = document.getElementById("guest-modal");
const guestModalClose = document.getElementById("guest-modal-close");

const guestCount = document.getElementById("guest-count");
const infantCount = document.getElementById("infant-count");
const petCount = document.getElementById("pet-count");

const guestMinus = document.getElementById("guest-minus");
const guestPlus = document.getElementById("guest-plus");

const infantMinus = document.getElementById("infant-minus");
const infantPlus = document.getElementById("infant-plus");

const petMinus = document.getElementById("pet-minus");
const petPlus = document.getElementById("pet-plus");

const datepicker = new HotelDatepicker(
    dateRangeInput,
    {
        minNights: 1,
        selectForward: true,

        // Update booking dates and total price.
        onSelectRange: function () {
            const selectedRange =
                dateRangeInput.value;

            const dates =
                selectedRange.split(" - ");

            const checkinDate =
                new Date(dates[0]);

            const checkoutDate =
                new Date(dates[1]);

            const differenceInMilliseconds =
                checkoutDate - checkinDate;

            const differenceInDays =
                differenceInMilliseconds /
                (1000 * 60 * 60 * 24);

            checkinInput.value =
                dates[0];

            checkoutInput.value =
                dates[1];

            const pricePerNight = 2026;

            const totalPrice =
                differenceInDays *
                pricePerNight;

            totalPriceInput.textContent =
                `USD $${totalPrice.toLocaleString()}`;
        }
    }
);

// Open datepicker from check-in input.
checkinInput.addEventListener(
    "click",
    () => {
        datepicker.open();
    }
);

// Open datepicker from check-out input.
checkoutInput.addEventListener(
    "click",
    () => {
        datepicker.open();
    }
);

// Open guest selection modal.
guestsInput.addEventListener(
    "click",
    () => {
        guestModal.style.display = "flex";

        document.body.classList.add(
            "guest-modal-open"
        );
    }
);

// Update the guest input summary.
function updateGuestSummary() {
    const guests =
        Number(guestCount.textContent);

    const infants =
        Number(infantCount.textContent);

    const pets =
        Number(petCount.textContent);

    let summary = "";

    if (guests === 1) {
        summary = "1 GUEST";
    } else {
        summary = `${guests} GUESTS`;
    }

    if (infants > 0) {
        if (infants === 1) {
            summary =
                `${summary}, 1 INFANT`;
        } else {
            summary =
                `${summary}, ${infants} INFANTS`;
        }
    }

    if (pets > 0) {
        if (pets === 1) {
            summary =
                `${summary}, 1 PET`;
        } else {
            summary =
                `${summary}, ${pets} PETS`;
        }
    }

    guestsInput.value = summary;
}

// Close guest modal.
guestModalClose.addEventListener(
    "click",
    () => {
        updateGuestSummary();

        guestModal.style.display = "none";

        document.body.classList.remove(
            "guest-modal-open"
        );
    }
);

// Close guest modal when clicking outside.
guestModal.addEventListener(
    "click",
    event => {
        if (event.target === guestModal) {
            updateGuestSummary();

            guestModal.style.display = "none";

            document.body.classList.remove(
                "guest-modal-open"
            );
        }
    }
);

// Increase guest count.
guestPlus.addEventListener(
    "click",
    () => {
        let currentGuestCount =
            Number(guestCount.textContent);

        currentGuestCount =
            currentGuestCount + 1;

        guestCount.textContent =
            currentGuestCount;
    }
);

// Decrease guest count.
guestMinus.addEventListener(
    "click",
    () => {
        let currentGuestCount =
            Number(guestCount.textContent);

        if (currentGuestCount > 1) {
            currentGuestCount =
                currentGuestCount - 1;

            guestCount.textContent =
                currentGuestCount;
        }
    }
);

// Increase infant count.
infantPlus.addEventListener(
    "click",
    () => {
        let currentInfantCount =
            Number(infantCount.textContent);

        currentInfantCount =
            currentInfantCount + 1;

        infantCount.textContent =
            currentInfantCount;
    }
);

// Decrease infant count.
infantMinus.addEventListener(
    "click",
    () => {
        let currentInfantCount =
            Number(infantCount.textContent);

        if (currentInfantCount > 0) {
            currentInfantCount =
                currentInfantCount - 1;

            infantCount.textContent =
                currentInfantCount;
        }
    }
);

// Increase pet count.
petPlus.addEventListener(
    "click",
    () => {
        let currentPetCount =
            Number(petCount.textContent);

        currentPetCount =
            currentPetCount + 1;

        petCount.textContent =
            currentPetCount;
    }
);

// Decrease pet count.
petMinus.addEventListener(
    "click",
    () => {
        let currentPetCount =
            Number(petCount.textContent);

        if (currentPetCount > 0) {
            currentPetCount =
                currentPetCount - 1;

            petCount.textContent =
                currentPetCount;
        }
    }
);