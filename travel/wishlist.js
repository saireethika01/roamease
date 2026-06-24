let wishlist =
    JSON.parse(
        localStorage.getItem("wishlist")
    ) || [];

let container =
    document.getElementById(
        "wishlistContainer"
    );

// image paths
let images = {
    Bali: "images/bali.jpg",
    Paris: "images/paris.jpg",
    Dubai: "images/dubai.jpg",
    London: "images/london.jpg",
    Maldives: "images/m.jpg",
    Korea: "images/korea.jpg",
    Tokyo: "images/tokyo.jpg",
    Goa: "images/goa.jpg",
    Kashmir: "images/kashmir.jpg",
    Manali: "images/manali.jpg",
    Thailand: "images/thailand.jpg",
    Switzerland: "images/switzerland.jpg",
    Singapore: "images/singapore.jpg",
    Japan: "images/japan.jpg",
    Turkey: "images/turkey.jpg",
    Canada: "images/canada.jpg",
    Australia: "images/australia.jpg",
    Italy: "images/italy.jpg",
    Germany: "images/germany.jpg",
    Spain: "images/spain.jpg",
    Greece: "images/greece.jpg",
    "New York": "images/newyork.jpg",
    "Los Angeles": "images/losangeles.jpg",
    Bangkok: "images/bangkok.jpg",
    Seoul: "images/seoul.jpg",
    Shimla: "images/shimla.jpg",
    Malaysia: "images/malaysia.jpg",
    Indonesia: "images/indonesia.jpg",
    Vietnam: "images/vietnam.jpg",
    Kerala: "images/kerala.jpg",
    Andaman: "images/andaman.jpg",
    Panama: "images/panama.jpg",
    Pakistan: "images/pakistan.jpg",
    Portugal: "images/portugal.jpg"
};

// show empty message if no saved trips
function checkEmptyWishlist() {
    if (wishlist.length === 0) {
        container.innerHTML =
        `
            <div class="empty-wishlist">
                <h2>No saved trips yet ❤️</h2>
            </div>
        `;
    }
}

checkEmptyWishlist();

// create cards
wishlist.forEach(function(place) {
    let card =
        document.createElement("div");

    card.classList.add("package");

    // fallback image: use a high-quality public scenery URL instead of missing local default.jpg
    let imagePath =
        images[place] ||
        "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500";

    card.innerHTML =
    `
    <div class="card">
        <img src="${imagePath}" alt="${place}">
    </div>
    <h3>${place}</h3>
    <div class="wishlist-buttons">
        <a href="booking.html?destination=${encodeURIComponent(place)}" class="button">
            Book Now
        </a>
        <button class="remove-btn">
            Remove
        </button>
    </div>
    `;

    // bind remove button dynamically to avoid index mismatch bugs
    card.querySelector(".remove-btn").addEventListener("click", function() {
        removeTrip(place, card);
    });

    container.appendChild(card);
});

// remove function with smooth DOM transitions
function removeTrip(place, cardElement) {
    wishlist = wishlist.filter(function(item) {
        return item !== place;
    });

    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );

    // Apply smooth fade & scale out animation
    cardElement.style.transition = "opacity 0.3s ease, transform 0.3s ease";
    cardElement.style.opacity = "0";
    cardElement.style.transform = "scale(0.9)";
    
    setTimeout(function () {
        cardElement.remove();
        checkEmptyWishlist();
    }, 300);
}