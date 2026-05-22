// Load reviews from LocalStorage or use default reviews
let reviews = JSON.parse(localStorage.getItem("reviews"));

const defaultReviews = [
    {
        name: "Aarav Sharma",
        rating: 5,
        text: "Had an amazing vacation in Goa! The package was extremely budget-friendly, and the hotel was excellent. Highly recommend Travel With Us!"
    },
    {
        name: "Priya Patel",
        rating: 5,
        text: "The Paris Getaway package exceeded all our expectations! The flight and hotel arrangements were smooth, and the customer support was extremely helpful."
    },
    {
        name: "Rohan Das",
        rating: 4,
        text: "Our trip to Bali was memorable and hassle-free. The itinerary was very well-customized. Will definitely book our next trip with RoamEase!"
    }
];

if (!reviews) {
    reviews = defaultReviews;
    localStorage.setItem("reviews", JSON.stringify(reviews));
}

// Function to render reviews
function renderReviews() {
    const grid = document.getElementById("reviewsGrid");
    if (!grid) return;
    
    grid.innerHTML = "";
    
    // Create the scrolling marquee track container
    const track = document.createElement("div");
    track.classList.add("reviews-marquee-track");
    
    // Reusable helper to generate a card element
    const createCard = (review) => {
        const card = document.createElement("div");
        card.classList.add("review-card");
        
        let stars = "★".repeat(review.rating) + "☆".repeat(5 - review.rating);
        
        card.innerHTML = `
            <div class="quote-icon">“</div>
            <p class="review-text">"${escapeHTML(review.text)}"</p>
            <div class="review-author">— ${escapeHTML(review.name)}</div>
            <div class="review-stars-container">
                <span class="review-stars">${stars}</span>
                <div class="stars-dotted-line"></div>
            </div>
        `;
        return card;
    };
    
    // Append primary set of reviews
    reviews.forEach(review => {
        track.appendChild(createCard(review));
    });
    
    // For a perfectly seamless continuous loop, we duplicate the review set.
    // If we have very few reviews (less than 4), we repeat the set 3 times to ensure
    // the track width exceeds the viewport width. Otherwise, twice is perfect.
    const repeatCount = reviews.length < 4 ? 3 : 2;
    for (let i = 1; i < repeatCount; i++) {
        reviews.forEach(review => {
            track.appendChild(createCard(review));
        });
    }
    
    grid.appendChild(track);
}

// Utility to escape HTML and prevent XSS
function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
        tag => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            "'": '&#39;',
            '"': '&quot;'
        }[tag] || tag)
    );
}

// Open and Close Side Sheet Functions
function openReviewSheet() {
    const sheet = document.getElementById("reviewSheet");
    const backdrop = document.getElementById("reviewSheetBackdrop");
    if (sheet && backdrop) {
        sheet.classList.add("open");
        backdrop.classList.add("open");
        document.body.style.overflow = "hidden"; // Prevent background scroll
    }
}

function closeReviewSheet() {
    const sheet = document.getElementById("reviewSheet");
    const backdrop = document.getElementById("reviewSheetBackdrop");
    if (sheet && backdrop) {
        sheet.classList.remove("open");
        backdrop.classList.remove("open");
        document.body.style.overflow = ""; // Restore background scroll
    }
}

// Handle Submit
function handleReviewSubmit(event) {
    event.preventDefault();
    
    const nameInput = document.getElementById("reviewName");
    const ratingInput = document.querySelector('input[name="rating"]:checked');
    const textInput = document.getElementById("reviewText");
    
    if (!nameInput || !ratingInput || !textInput) return;
    
    const newReview = {
        name: nameInput.value.trim(),
        rating: parseInt(ratingInput.value),
        text: textInput.value.trim()
    };
    
    reviews.unshift(newReview); // Add to the beginning of the list
    localStorage.setItem("reviews", JSON.stringify(reviews));
    
    // Reset form & close sheet
    event.target.reset();
    closeReviewSheet();
    
    // Re-render in real-time
    renderReviews();
}

// Close sheet when clicking backdrop
window.addEventListener("click", function(event) {
    const backdrop = document.getElementById("reviewSheetBackdrop");
    if (event.target === backdrop) {
        closeReviewSheet();
    }
});

// Render reviews on page load
document.addEventListener("DOMContentLoaded", renderReviews);
