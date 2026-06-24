import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./PaymentPage.css";

const PRICES = {
  Paris: 65000, Bali: 55000, London: 70000, Dubai: 68000, Maldives: 80000,
  Korea: 60000, Switzerland: 120000, Thailand: 58000, Singapore: 72000, Japan: 110000,
  Turkey: 78000, Canada: 125000, Australia: 130000, Italy: 95000, Germany: 88000,
  Spain: 92000, Greece: 105000, "New York": 115000, "Los Angeles": 110000,
  Bangkok: 52000, Seoul: 82000, Shimla: 28000, Tokyo: 118000, Malaysia: 64000,
  Indonesia: 72000, Vietnam: 58000, Goa: 24000, Kerala: 32000, Kashmir: 38000,
  Manali: 34000, Andaman: 42000, Panama: 105000, Pakistan: 85000, Portugal: 90000,
};

const COUPONS = { TRAVEL20: 0.2, WELCOME10: 0.1 };

export default function PaymentPage() {
  const navigate = useNavigate();
  const booking = JSON.parse(localStorage.getItem("booking") || "null");

  const [payMethod, setPayMethod] = useState("upi");
  const [couponInput, setCouponInput] = useState("");
  const [couponApplied, setCouponApplied] = useState(false);
  const [discount, setDiscount] = useState(0);
  const [timeLeft, setTimeLeft] = useState(300);
  const [expired, setExpired] = useState(false);
  const [status, setStatus] = useState(null); // null | "processing" | "success" | "failed"
  const [card, setCard] = useState({ number: "", name: "", expiry: "", cvv: "" });
  const [bank, setBank] = useState("Select Bank");
  const [wallet, setWallet] = useState("Select Wallet");
  const timerRef = useRef(null);

  const baseTotal = booking ? (PRICES[booking.destination] || 50000) * booking.people : 0;
  const discountAmt = Math.round(baseTotal * discount);
  const total = baseTotal - discountAmt;

  useEffect(() => {
    timerRef.current = setInterval(() => {
      setTimeLeft(t => {
        if (t <= 1) { clearInterval(timerRef.current); setExpired(true); return 0; }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  const fmt = s => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;

  const formattedDate = booking?.date
    ? new Date(booking.date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
    : "";

  function applyCoupon() {
    if (couponApplied) { alert("A coupon has already been applied."); return; }
    const pct = COUPONS[couponInput.toUpperCase()];
    if (pct !== undefined) {
      setDiscount(pct);
      setCouponApplied(true);
      alert(`${pct * 100}% Discount Applied!`);
    } else {
      alert("Invalid Coupon Code");
    }
  }

  function makePayment() {
    if (expired) { alert("Session Expired! Please refresh and try again."); return; }
    if (!payMethod) { alert("Please select a payment method!"); return; }
    if (payMethod === "card") {
      if (!card.number || !card.name || !card.expiry || !card.cvv) { alert("Fill in all card details."); return; }
    }
    if (payMethod === "netbanking" && bank === "Select Bank") { alert("Please select a bank."); return; }
    if (payMethod === "wallet" && wallet === "Select Wallet") { alert("Please select a wallet."); return; }

    clearInterval(timerRef.current);
    setStatus("processing");
    const updated = { ...booking, paidTotal: total };
    localStorage.setItem("booking", JSON.stringify(updated));
    setTimeout(() => {
      setStatus("success");
      setTimeout(() => navigate("/confirmation"), 1800);
    }, 3000);
  }

  if (!booking) return (
    <div><Navbar />
      <div className="payment-page"><p>No booking found. <a href="/trips">Start a new booking</a></p></div>
    </div>
  );

  return (
    <div>
      <Navbar />
      <div className="payment-page">
        <div className="payment-container">
          <h2>Complete Your Payment</h2>
          <div className="payment-layout">
            {/* LEFT */}
            <div className="left-section">
              <div className="booking-summary">
                <h3>Booking Summary</h3>
                <p>📍 Destination: <strong>{booking.destination}</strong></p>
                <p>👤 People: <strong>{booking.people}</strong></p>
                <p>📅 Date: <strong>{formattedDate}</strong></p>
                {couponApplied && <p className="discount-line">🏷 Discount: <span>-₹{discountAmt.toLocaleString("en-IN")}</span></p>}
                <p className="total-line">💰 Total: <strong>₹{total.toLocaleString("en-IN")}</strong></p>
              </div>
              <div className="offers">
                <h3>Available Offers</h3>
                <p>TRAVEL20 → 20% OFF</p>
                <p>WELCOME10 → 10% OFF</p>
              </div>
            </div>

            {/* RIGHT */}
            <div className="right-section">
              <div className="coupon-section">
                <input type="text" placeholder="Enter Coupon Code" value={couponInput}
                  onChange={e => setCouponInput(e.target.value)} disabled={couponApplied} />
                <button onClick={applyCoupon} disabled={couponApplied}>Apply</button>
              </div>

              <div className="payment-options">
                {[["upi","UPI"],["card","Credit / Debit Card"],["netbanking","Net Banking"],["wallet","Wallet"]].map(([val, label]) => (
                  <label key={val} className={`pay-option ${payMethod === val ? "active" : ""}`}>
                    <input type="radio" name="payment" value={val} checked={payMethod === val}
                      onChange={() => setPayMethod(val)} /> {label}
                  </label>
                ))}
              </div>

              <div className="payment-details">
                {payMethod === "upi" && (
                  <div className="upi-section">
                    <h3>Scan & Pay</h3>
                    <img src="/images/qr.png" alt="QR Code" className="qr-img" />
                  </div>
                )}
                {payMethod === "card" && (
                  <div className="card-section">
                    <input type="text" placeholder="Card Number (16 digits)" maxLength={19}
                      value={card.number} onChange={e => setCard(c => ({...c, number: e.target.value}))} />
                    <input type="text" placeholder="Card Holder Name"
                      value={card.name} onChange={e => setCard(c => ({...c, name: e.target.value}))} />
                    <input type="text" placeholder="Expiry Date (MM/YY)" maxLength={5}
                      value={card.expiry} onChange={e => setCard(c => ({...c, expiry: e.target.value}))} />
                    <input type="password" placeholder="CVV (3-4 digits)" maxLength={4}
                      value={card.cvv} onChange={e => setCard(c => ({...c, cvv: e.target.value}))} />
                  </div>
                )}
                {payMethod === "netbanking" && (
                  <select value={bank} onChange={e => setBank(e.target.value)}>
                    {["Select Bank","SBI","HDFC","ICICI","Axis Bank"].map(b => <option key={b}>{b}</option>)}
                  </select>
                )}
                {payMethod === "wallet" && (
                  <select value={wallet} onChange={e => setWallet(e.target.value)}>
                    {["Select Wallet","Paytm","PhonePe","Google Pay","Amazon Pay"].map(w => <option key={w}>{w}</option>)}
                  </select>
                )}
              </div>

              <div className={`timer-box ${expired ? "expired" : ""}`}>
                {expired ? (
                  <><p className="expired-text">Transaction Failed!</p><p>Payment Session Expired. Please try again.</p></>
                ) : status === "processing" ? (
                  <p>Processing Payment...</p>
                ) : status === "success" ? (
                  <p className="success-text">Payment Successful! Redirecting...</p>
                ) : (
                  <p>⏱ Complete payment within {fmt(timeLeft)} min</p>
                )}
              </div>

              <button className="pay-btn" onClick={makePayment} disabled={!!status || expired}>
                {status === "processing" ? "Processing..." : "Pay Now"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
