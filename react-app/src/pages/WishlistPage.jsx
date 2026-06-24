import { useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./WishlistPage.css";

const IMAGES = {
  Bali: "/images/bali.jpg", Paris: "/images/paris.jpg", Dubai: "/images/dubai.jpg",
  London: "/images/london.jpg", Maldives: "/images/m.jpg", Korea: "/images/korea.jpg",
  Tokyo: "/images/tokyo.jpg", Goa: "/images/goa.jpg", Kashmir: "/images/kashmir.jpg",
  Manali: "/images/manali.jpg", Thailand: "/images/thailand.jpg", Switzerland: "/images/switzerland.jpg",
  Singapore: "/images/singapore.jpg", Japan: "/images/japan.jpg", Turkey: "/images/turkey.jpg",
  Canada: "/images/canada.jpg", Australia: "/images/australia.jpg", Italy: "/images/italy.jpg",
  Germany: "/images/germany.jpg", Spain: "/images/spain.jpg", Greece: "/images/greece.jpg",
  "New York": "/images/newyork.jpg", "Los Angeles": "/images/losangeles.jpg",
  Bangkok: "/images/bangkok.jpg", Seoul: "/images/seoul.jpg", Shimla: "/images/shimla.jpg",
  Malaysia: "/images/malaysia.jpg", Indonesia: "/images/indonesia.jpg", Vietnam: "/images/vietnam.jpg",
  Kerala: "/images/kerala.jpg", Andaman: "/images/andaman.jpg", Panama: "/images/panama.jpg",
  Pakistan: "/images/pakistan.jpg", Portugal: "/images/portugal.jpg",
};

export default function WishlistPage() {
  const [wishlist, setWishlist] = useState(() =>
    JSON.parse(localStorage.getItem("wishlist") || "[]")
  );
  const [removing, setRemoving] = useState(null);

  function removeTrip(place) {
    setRemoving(place);
    setTimeout(() => {
      const updated = wishlist.filter(p => p !== place);
      setWishlist(updated);
      localStorage.setItem("wishlist", JSON.stringify(updated));
      setRemoving(null);
    }, 300);
  }

  return (
    <div>
      <Navbar />
      <div className="wishlist-page">
        <h1 className="wishlist-title">My Wishlist</h1>
        {wishlist.length === 0 ? (
          <div className="empty-wishlist">
            <span className="empty-icon">❤️</span>
            <h2>No saved trips yet</h2>
            <p>Browse destinations and add them to your wishlist</p>
            <Link to="/trips" className="browse-btn">Browse Destinations</Link>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlist.map(place => (
              <div key={place}
                className={`wishlist-card ${removing === place ? "removing" : ""}`}
              >
                <img
                  src={IMAGES[place] || "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500"}
                  alt={place}
                />
                <h3>{place}</h3>
                <div className="wishlist-actions">
                  <Link
                    to={`/booking?destination=${encodeURIComponent(place)}`}
                    className="book-btn"
                  >
                    Book Now
                  </Link>
                  <button className="remove-btn" onClick={() => removeTrip(place)}>
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
