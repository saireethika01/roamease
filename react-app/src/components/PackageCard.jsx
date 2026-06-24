import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { convertPrice } from "../hooks/useCurrency";
import LeafletMap from "./LeafletMap";
import "./PackageCard.css";

export default function PackageCard({ destination, rates }) {
  const [mapOpen, setMapOpen] = useState(false);
  const [saved, setSaved] = useState(false);
  const cardRef = useRef(null);

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    setSaved(wishlist.includes(destination.name));
  }, [destination.name]);

  function handleSaveTrip() {
    const wishlist = JSON.parse(localStorage.getItem("wishlist") || "[]");
    if (wishlist.includes(destination.name)) {
      alert(`${destination.name} is already saved!`);
      return;
    }
    wishlist.push(destination.name);
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
    setSaved(true);
    alert(`${destination.name} added to wishlist!`);
  }

  const converted = convertPrice(destination.priceNum, rates);

  return (
    <div className="pkg-card" ref={cardRef}>
      <h3 className="pkg-title">{destination.title}</h3>

      <div className="pkg-image-wrap">
        <img src={destination.image} alt={destination.name} className="pkg-image" />
      </div>

      <p className="pkg-rating">⭐ {destination.rating}/5 Rating</p>

      <div className="pkg-places">
        <p className="pkg-places-title">📍 Places Covered:</p>
        <ul>
          {destination.places.map((place) => (
            <li key={place}>{place}</li>
          ))}
        </ul>
      </div>

      <div className="pkg-details">
        <p>🛏 Hotel Stay: {destination.hotel}</p>
        <p>✈ Flight Included: {destination.flight}</p>
        <p>🍽 Meals Included: {destination.meals}</p>
        <p>🚖 Airport Pickup: {destination.pickup}</p>
        <p>🌤 Best Season To Visit: {destination.season}</p>
        <p>👥 Best For: {destination.bestFor}</p>
        <p>🕒 Duration: {destination.duration}</p>
        <p className="pkg-price">💰 Starting From: {destination.price} / person</p>
      </div>

      {converted && (
        <div className="pkg-currency">
          {converted.map(({ code, formatted }) => (
            <span key={code}>≈ {formatted} {code}</span>
          ))}
        </div>
      )}

      {!converted && rates === null && (
        <div className="pkg-currency">Converting currency...</div>
      )}

      <button className="pkg-btn-map" onClick={() => setMapOpen((prev) => !prev)}>
        {mapOpen ? "Hide Map" : "View Map"}
      </button>

      {mapOpen && (
        <div className="pkg-map-box">
          <LeafletMap
            lat={destination.mapCoords[0]}
            lng={destination.mapCoords[1]}
            label={destination.mapLabel}
          />
        </div>
      )}

      <button
        className={`pkg-btn-wishlist ${saved ? "pkg-btn-wishlist--saved" : ""}`}
        onClick={handleSaveTrip}
      >
        {saved ? "♥ Saved" : "♡ Save Trip"}
      </button>

      <Link
        to={`/packages?destination=${encodeURIComponent(destination.name)}`}
        className="pkg-btn-choose"
      >
        Choose Package
      </Link>
    </div>
  );
}
