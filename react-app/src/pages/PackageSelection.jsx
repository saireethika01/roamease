import { useState } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import destinations from "../data/destinations";
import { useCurrencyRates, convertPrice } from "../hooks/useCurrency";
import "./PackageSelection.css";

function incrementDuration(dur, add) {
  const m = dur.match(/(\d+)\s*Days?\s*\/\s*(\d+)\s*Nights?/i);
  if (m) return `${parseInt(m[1]) + add} Days / ${parseInt(m[2]) + add} Nights`;
  return dur;
}

export default function PackageSelection() {
  const [params] = useSearchParams();
  const destParam = params.get("destination") || "";
  const navigate = useNavigate();
  const { rates } = useCurrencyRates();

  const key = destParam.toLowerCase().replace(/\s+/g, "");
  const dest = destinations.find(d => d.id === key || d.name.toLowerCase() === destParam.toLowerCase());

  if (!destParam || !dest) {
    return (
      <div>
        <Navbar />
        <div className="pkg-sel-page">
          <p className="pkg-sel-error">No destination selected. <Link to="/trips">Go back to Destinations</Link></p>
        </div>
      </div>
    );
  }

  const classicPrice = dest.priceNum;
  const premiumPrice = Math.round(classicPrice * 1.35);
  const elitePrice = Math.round(classicPrice * 1.75);

  const tiers = [
    {
      key: "classic",
      label: "Classic",
      price: classicPrice,
      hotel: "3-Star Standard Hotel",
      meals: "Breakfast Included",
      duration: dest.duration,
      places: dest.places.slice(0, 2),
      badge: null,
    },
    {
      key: "premium",
      label: "Premium",
      price: premiumPrice,
      hotel: "4-Star Premium Hotel",
      meals: "Breakfast & Dinner Included",
      duration: incrementDuration(dest.duration, 1),
      places: dest.places,
      badge: "Best Value",
    },
    {
      key: "elite",
      label: "Elite",
      price: elitePrice,
      hotel: "5-Star Ultra Luxury Resort",
      meals: "All Meals Included",
      duration: incrementDuration(dest.duration, 2),
      places: [...dest.places, "Private Guided Tour & VIP Access"],
      badge: "Top Pick",
    },
  ];

  return (
    <div>
      <Navbar />
      <div className="pkg-sel-page">
        <h1 className="pkg-sel-title">Choose Your Package for {dest.name}</h1>
        <Link to="/trips" className="back-link">← Back to Destinations</Link>
        <div className="pkg-sel-grid">
          {tiers.map(tier => {
            const conv = convertPrice(tier.price, rates);
            return (
              <div key={tier.key} className={`tier-card tier-${tier.key}`}>
                {tier.badge && <span className="tier-badge">{tier.badge}</span>}
                <h3>{tier.label} Package</h3>
                <div className="tier-price">
                  ₹{tier.price.toLocaleString("en-IN")}
                  <span className="tier-per"> / person</span>
                </div>
                {conv && (
                  <div className="tier-conv">
                    {conv.map(c => <span key={c.code}>≈ {c.formatted} {c.code}</span>)}
                  </div>
                )}
                <div className="tier-details">
                  <p>🕒 {tier.duration}</p>
                  <p>🛏 {tier.hotel}</p>
                  <p>🍽 {tier.meals}</p>
                  <div className="tier-places">
                    <p>📍 Places Covered:</p>
                    <ul>{tier.places.map(p => <li key={p}>{p}</li>)}</ul>
                  </div>
                </div>
                <Link
                  to={`/booking?destination=${encodeURIComponent(dest.name)}&package=${tier.label}`}
                  className="tier-btn"
                >
                  Book Now
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
