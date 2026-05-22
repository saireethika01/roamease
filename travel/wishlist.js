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

    Japan: "images/japan.jpg"
};



// empty wishlist
if (wishlist.length === 0) {

    container.innerHTML =

    `
        <div class="empty-wishlist">

            <h2>
                No saved trips yet ❤️
            </h2>

        </div>
    `;

}



// create cards
wishlist.forEach(function(place, index) {

    let card =
        document.createElement("div");



    card.classList.add("package");



    // fallback image
    let imagePath =
        images[place] ||
        "images/default.jpg";



    card.innerHTML =
    `
    <div class="card">

        <img src="${imagePath}"
        alt="${place}">

    </div>

    <h3>${place}</h3>

    <div class="wishlist-buttons">

        <a href="booking.html?destination=${place}"
        class="button">

            Book Now

        </a>

        <button
        onclick="removeTrip(${index})"
        class="remove-btn">

            Remove

        </button>

    </div>
    `;



    container.appendChild(card);
});




// remove function
function removeTrip(index) {

    wishlist.splice(index, 1);



    localStorage.setItem(
        "wishlist",
        JSON.stringify(wishlist)
    );



    location.reload();
}