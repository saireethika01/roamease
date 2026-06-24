import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import "./ConfirmationPage.css";

const PRICES = {
  Paris: 65000, Bali: 55000, London: 70000, Dubai: 68000, Maldives: 80000,
  Korea: 60000, Switzerland: 120000, Thailand: 58000, Singapore: 72000, Japan: 110000,
  Turkey: 78000, Canada: 125000, Australia: 130000, Italy: 95000, Germany: 88000,
  Spain: 92000, Greece: 105000, "New York": 115000, "Los Angeles": 110000,
  Bangkok: 52000, Seoul: 82000, Shimla: 28000, Tokyo: 118000, Malaysia: 64000,
  Indonesia: 72000, Vietnam: 58000, Goa: 24000, Kerala: 32000, Kashmir: 38000,
  Manali: 34000, Andaman: 42000, Panama: 105000, Pakistan: 85000, Portugal: 90000,
};

export default function ConfirmationPage() {
  const navigate = useNavigate();
  const booking = JSON.parse(localStorage.getItem("booking") || "null");

  const [txnId] = useState(() => {
    let id = localStorage.getItem("transactionId");
    if (!id) { id = "TXN" + Math.floor(Math.random() * 1000000); localStorage.setItem("transactionId", id); }
    return id;
  });
  const [ticketId] = useState(() => {
    let id = localStorage.getItem("ticketId");
    if (!id) { id = "TRV" + Math.floor(10000 + Math.random() * 90000); localStorage.setItem("ticketId", id); }
    return id;
  });

  // send confirmation email via Flask backend
  useEffect(() => {
    if (!booking) return;
    const formattedDate = new Date(booking.date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
    fetch("http://127.0.0.1:5000/api/send-email", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ type: "confirmation", name: booking.name, destination: booking.destination, date: formattedDate, people: booking.people, transaction: txnId, ticketId, email: booking.email }),
    }).catch(() => {});
  }, []);

  if (!booking) return (
    <div><Navbar />
      <div className="confirm-page">
        <p>No booking found. <Link to="/trips">Start a booking</Link></p>
      </div>
    </div>
  );

  const formattedDate = new Date(booking.date + "T12:00:00").toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" });
  const paidTotal = booking.paidTotal || (PRICES[booking.destination] || 50000) * booking.people;

  function cancelBooking() {
    if (!window.confirm("Are you sure you want to cancel this ticket?")) return;
    const created = new Date(booking.bookingCreatedAt);
    const diffDays = (new Date() - created) / (1000 * 60 * 60 * 24);
    if (diffDays <= 7) {
      fetch("http://127.0.0.1:5000/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ type: "cancellation", name: booking.name, destination: booking.destination, transaction: txnId, email: booking.email }),
      }).catch(() => {});
      alert("Booking Cancelled Successfully!\n\nRefund has been initiated.");
      localStorage.removeItem("booking");
      setTimeout(() => navigate("/"), 1500);
    } else {
      alert("Cancellation period expired!");
    }
  }

  async function downloadTicket() {
    // Load jsPDF from CDN if not bundled
    if (!window.jspdf) {
      await new Promise(resolve => {
        const s = document.createElement("script");
        s.src = "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";
        s.onload = resolve;
        document.head.appendChild(s);
      });
    }
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF("p", "mm", "a4");

    // Header
    doc.setFillColor(15, 23, 42);
    doc.rect(15, 15, 180, 26, "F");
    doc.setFillColor(138, 43, 226);
    doc.rect(15, 41, 180, 2, "F");
    doc.setFillColor(255, 255, 255);
    doc.circle(26, 28, 7, "F");
    doc.setFillColor(138, 43, 226);
    doc.circle(26, 28, 4, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(20);
    doc.setTextColor(255, 255, 255);
    doc.text("RoamEase", 37, 31);
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8.5);
    doc.setTextColor(196, 181, 253);
    doc.text("Explore the World, One Journey at a Time", 37, 36);
    doc.setFillColor(138, 43, 226);
    doc.roundedRect(140, 24, 48, 8, 2, 2, "F");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(8.5);
    doc.setTextColor(255, 255, 255);
    doc.text("BOARDING PASS / E-TICKET", 164, 29.5, { align: "center" });

    // Card body
    doc.setFillColor(245, 243, 255);
    doc.rect(135.2, 48.2, 59.6, 109.6, "F");
    doc.setDrawColor(226, 232, 240);
    doc.setLineWidth(0.45);
    doc.roundedRect(15, 48, 180, 110, 3, 3, "S");
    doc.setDrawColor(138, 43, 226);
    doc.setLineWidth(0.5);
    doc.setLineDashPattern([2, 2], 0);
    doc.line(135, 48, 135, 158);
    doc.setLineDashPattern([], 0);

    // Fields helper
    const field = (label, value, x, y, isStatus = false) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8.5);
      doc.setTextColor(148, 163, 184);
      doc.text(label, x, y);
      if (isStatus) {
        doc.setFillColor(22, 163, 74);
        doc.roundedRect(x, y + 2, 34, 6.5, 1, 1, "F");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8);
        doc.setTextColor(255, 255, 255);
        doc.text("CONFIRMED & PAID", x + 17, y + 6.3, { align: "center" });
      } else {
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(15, 23, 42);
        doc.text(String(value), x, y + 6);
      }
    };

    doc.setFont("Helvetica", "bold");
    doc.setFontSize(13);
    doc.setTextColor(15, 23, 42);
    doc.text("PASSENGER BOARDING PASS", 25, 62);
    doc.setDrawColor(241, 245, 249);
    doc.setLineWidth(0.3);
    doc.line(25, 65, 125, 65);

    field("PASSENGER NAME", booking.name, 25, 74);
    field("TICKET CLASS", "Standard Tour Package", 78, 74);
    field("DESTINATION ROUTE", `DELHI (DEL) -> ${booking.destination.toUpperCase()}`, 25, 92);
    field("TRAVEL DATE", formattedDate, 25, 110);
    field("PASSENGERS COUNT", booking.people + " Guest(s)", 78, 110);
    field("BOOKING STATUS", "", 25, 128, true);
    field("TOTAL PAID AMOUNT", "INR " + paidTotal.toLocaleString("en-IN"), 78, 128);
    field("PASSENGER EMAIL", booking.email, 25, 146);
    field("TRANSACTION ID", txnId, 78, 146);

    // Stub
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(138, 43, 226);
    doc.text("TICKET STUB", 145, 62);
    const stub = (label, value, x, y) => {
      doc.setFont("Helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(100, 116, 139);
      doc.text(label, x, y);
      doc.setFont("Helvetica", "bold");
      doc.setFontSize(9.5);
      doc.setTextColor(15, 23, 42);
      doc.text(String(value), x, y + 5);
    };
    stub("PASSENGER", booking.name.slice(0, 16), 145, 72);
    stub("DESTINATION", booking.destination.toUpperCase(), 145, 82);
    stub("BOOKING REF", ticketId, 145, 92);
    doc.setDrawColor(138, 43, 226);
    doc.setFillColor(255, 255, 255);
    doc.roundedRect(150, 102, 30, 30, 1.5, 1.5, "FD");
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(7.5);
    doc.setTextColor(100, 116, 139);
    doc.text("QR CODE", 165, 120, { align: "center" });

    // Footer
    doc.setFont("Helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(100, 116, 139);
    doc.text("Thank you for traveling with RoamEase!", 105, 260, { align: "center" });
    doc.setFont("Helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(148, 163, 184);
    doc.text("For support: support@roamease.com | +91-9876543210", 105, 265, { align: "center" });

    doc.save(`RoamEase_Ticket_${ticketId}.pdf`);
  }

  return (
    <div>
      <Navbar />
      <div className="confirm-page">
        <div className="confirm-container">
          <div className="confirm-icon">✅</div>
          <h1>Payment Successful</h1>
          <h2>Your Trip Has Been Confirmed!</h2>
          <div className="confirm-details">
            <p>📍 Destination: <strong>{booking.destination}</strong></p>
            <p>👤 People: <strong>{booking.people}</strong></p>
            <p>📅 Travel Date: <strong>{formattedDate}</strong></p>
            <p>💰 Total Amount: <strong>₹{paidTotal.toLocaleString("en-IN")}</strong></p>
            <p>🆔 Transaction ID: <strong>{txnId}</strong></p>
          </div>
          <p className="email-msg">📧 Booking confirmation will be sent to your email.</p>
          <p className="cancel-note">Note: Cancellation is allowed only within 7 days from booking date.</p>
          <div className="confirm-actions">
            <button onClick={downloadTicket} className="download-btn">📄 Download Ticket</button>
            <button onClick={cancelBooking} className="cancel-btn">Cancel Booking</button>
          </div>
          <Link to="/" className="home-link">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
