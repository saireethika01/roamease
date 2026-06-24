import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./HomePage.css";

const defaultReviews = [
  { name: "Aarav Sharma", rating: 5, text: "Had an amazing vacation in Goa! The package was extremely budget-friendly, and the hotel was excellent. Highly recommend RoamEase!" },
  { name: "Priya Patel", rating: 5, text: "The Paris Getaway package exceeded all our expectations! The flight and hotel arrangements were smooth, and the customer support was extremely helpful." },
  { name: "Rohan Das", rating: 4, text: "Our trip to Bali was memorable and hassle-free. The itinerary was very well-customized. Will definitely book our next trip with RoamEase!" },
];

export default function HomePage() {
  const [reviews, setReviews] = useState(() => {
    const saved = localStorage.getItem("reviews");
    return saved ? JSON.parse(saved) : defaultReviews;
  });
  const [sheetOpen, setSheetOpen] = useState(false);
  const [reviewForm, setReviewForm] = useState({ name: "", rating: 5, text: "" });

  function handleReviewSubmit(e) {
    e.preventDefault();
    const newReviews = [reviewForm, ...reviews];
    setReviews(newReviews);
    localStorage.setItem("reviews", JSON.stringify(newReviews));
    setSheetOpen(false);
    setReviewForm({ name: "", rating: 5, text: "" });
  }

  const galleryImages = [
    { src: "/images/g1.jpg", label: "g1" },
    { src: "/images/g2.jpg", label: "g2" },
    { src: "/images/g3.jpg", label: "g3" },
    { src: "/images/g4.jpg", label: "g4" },
    { src: "/images/g5.jpg", label: "g5" },
    { src: "/images/g6.jpg", label: "g6" },
  ];

  return (
    <div className="home-page">
      <Navbar />

      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1>Explore the World,<br/>One Journey at a Time</h1>
          <p>Travel isn't always about the destination — it's about the memories you make along the way</p>
          <div className="hero-btns">
            <Link to="/trips" className="btn-primary">View Packages</Link>
            <Link to="/trips" className="btn-secondary">Book Now</Link>
          </div>
        </div>
      </section>

      {/* Services */}
      <section className="services-section" id="services">
        <h2 className="section-title">Our Services</h2>
        <div className="services-grid">
          <div className="service-card">
            <img src="/images/card1.jpg" alt="Budget Packages" />
            <p>Budget-Friendly Packages, Premium Experience</p>
          </div>
          <div className="service-card">
            <img src="/images/card22.jpg" alt="Affordable Trips" />
            <p>Affordable Trips. Unforgettable Memories</p>
          </div>
          <div className="service-card">
            <img src="/images/card3.jpg" alt="Custom Plans" />
            <p>Customized Plans, Just for You</p>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="about-section" id="about">
        <h2 className="section-title">About Us</h2>
        <div className="about-inner">
          <img src="/images/side.jpg" alt="About RoamEase" className="about-img" />
          <p className="about-text">
            Welcome to RoamEase — your trusted companion for unforgettable journeys. We are dedicated to making travel easier, affordable, and more enjoyable for everyone. Whether you're dreaming of relaxing beaches, thrilling adventures, or exploring new cultures, our platform offers personalized travel experiences tailored to your needs. With budget-friendly packages, 24/7 customer support, and secure booking options, we ensure a smooth and hassle-free trip from start to finish.
          </p>
        </div>
      </section>

      <hr className="divider" />

      {/* Reviews */}
      <section className="reviews-section" id="reviews">
        <div className="reviews-header">
          <h2 className="section-title">Reviews</h2>
          <button className="btn-secondary" onClick={() => setSheetOpen(true)}>Add Review</button>
        </div>
        <div className="reviews-marquee">
          <div className="reviews-track">
            {[...reviews, ...reviews, ...reviews].map((r, i) => (
              <div key={i} className="review-card">
                <div className="review-quote">"</div>
                <p className="review-text">"{r.text}"</p>
                <div className="review-author">— {r.name}</div>
                <div className="review-stars">
                  {"★".repeat(r.rating)}{"☆".repeat(5 - r.rating)}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Review Sheet */}
      {sheetOpen && (
        <>
          <div className="sheet-backdrop" onClick={() => setSheetOpen(false)} />
          <div className="sheet open">
            <div className="sheet-header">
              <h3>Add Your Review</h3>
              <button className="close-sheet" onClick={() => setSheetOpen(false)}>×</button>
            </div>
            <form onSubmit={handleReviewSubmit} className="sheet-form">
              <div className="form-group">
                <label>Your Name</label>
                <input type="text" placeholder="e.g. Aarav Sharma" required
                  value={reviewForm.name} onChange={e => setReviewForm(f => ({...f, name: e.target.value}))} />
              </div>
              <div className="form-group">
                <label>Rating</label>
                <div className="star-rating-input">
                  {[5,4,3,2,1].map(star => (
                    <label key={star} className={`star-label ${reviewForm.rating >= star ? "selected" : ""}`}
                      onClick={() => setReviewForm(f => ({...f, rating: star}))}>★</label>
                  ))}
                </div>
              </div>
              <div className="form-group">
                <label>Review</label>
                <textarea placeholder="Share your travel experience..." required rows={4}
                  value={reviewForm.text} onChange={e => setReviewForm(f => ({...f, text: e.target.value}))} />
              </div>
              <button type="submit" className="btn-primary">Submit Review</button>
            </form>
          </div>
        </>
      )}

      <hr className="divider" />

      {/* Gallery */}
      <section className="gallery-section" id="gallery">
        <h2 className="section-title">Our Gallery</h2>
        <div className="gallery-grid">
          {galleryImages.map(img => (
            <img key={img.label} src={img.src} alt={img.label} className="gallery-img" />
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-address">
          <h3>Address</h3>
          <p>RoamEase Pvt. Ltd.</p>
          <p>2nd Floor, Wanderlust Tower,</p>
          <p>MG Road, Banjara Hills,</p>
          <p>Hyderabad, Telangana - 500034</p>
        </div>
        <div className="footer-contact">
          <h3>Contact Us</h3>
          <p>Email: <a href="mailto:contact@roamease.com">contact@roamease.com</a></p>
          <p>Phone: +91-9876543210</p>
          <p>Working Hours: Mon - Fri (9 AM - 6 PM)</p>
          <p>@2025</p>
        </div>
      </footer>
    </div>
  );
}
