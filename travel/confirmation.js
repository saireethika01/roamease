emailjs.init("SV3AkwM3-qT4fThHm");

// Pre-load brand logo and QR code images for high-quality PDF ticket generation
const logoImg = new Image();
logoImg.src = "images/icon.png";

const qrImg = new Image();
qrImg.src = "images/qr.png";

// get booking data
let bookingData = JSON.parse(
    localStorage.getItem("booking")
);



// show details
document.getElementById("confirmDestination").textContent =
    "Destination: " + bookingData.destination;

document.getElementById("confirmPeople").textContent =
    "People: " + bookingData.people;



// format date
let formattedDate = new Date(bookingData.date)
    .toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "long",

        year: "numeric"
    });

document.getElementById("confirmDate").textContent =
    "Travel Date: " + formattedDate;



// show amount
if (bookingData && bookingData.paidTotal) {
    document.getElementById("confirmAmount").innerHTML =
        "Total Amount: &#8377; " + bookingData.paidTotal.toLocaleString('en-IN');
} else {
    document.getElementById("confirmAmount").textContent =
        "Total Amount Confirmed";
}



// transaction id
// check existing transaction id
let txnId =
    localStorage.getItem("transactionId");
// if not existing, create new one
if (!txnId) {

    txnId =
        "TXN" + Math.floor(Math.random() * 1000000);

    localStorage.setItem(
        "transactionId",
        txnId
    );
}

document.getElementById("transactionId").textContent =
    "Transaction ID: " + txnId;



// send confirmation email
emailjs.send("service_3i538fn",
"template_tqngyki", {

    name: bookingData.name,

    destination: bookingData.destination,

    date: formattedDate,

    people: bookingData.people,

    transaction: txnId,

    email: bookingData.email
});



// cancel booking
function cancelBooking() {

    // booking creation date
    let bookingDate =
        new Date(bookingData.bookingCreatedAt);

    // current date
    let currentDate =
        new Date();

    // difference in milliseconds
    let difference =
        currentDate - bookingDate;

    // convert into days
    let days =
        difference / (1000 * 60 * 60 * 24);



    


    // check 7 days
    if (days <= 7) {

        alert("Booking Cancelled Successfully!\n\nRefund has been initiated.");

        // send cancellation email
     emailjs.send(
    "service_1c0a6xg",
    "template_y1kxqsb",
    {

        name: bookingData.name,

        destination: bookingData.destination,

        transaction: txnId,

        email: bookingData.email
    },

    "iGjPq2NUqpfGy3R8q"
    );

        localStorage.removeItem("booking");

        setTimeout(function () {

          window.location.href = "index.html";

        }, 2000);
    }

    else {

        alert(
            "Cancellation period expired!"
        );
    }
}


// Helper to load image as a promise
function loadImage(src) {
    return new Promise((resolve) => {
        const img = new Image();
        img.onload = () => resolve(img);
        img.onerror = () => resolve(null);
        img.src = src;
    });
}

async function downloadTicket() {
    const btn = document.querySelector(".download-btn");
    const originalText = btn.textContent;
    
    // Set button to loading state with premium spinner micro-interaction
    btn.innerHTML = `<span class="spinner" style="
        display: inline-block;
        width: 12px;
        height: 12px;
        border: 2px solid white;
        border-radius: 50%;
        border-top-color: transparent;
        animation: spin 0.8s linear infinite;
        margin-right: 8px;
        vertical-align: middle;
    "></span> Generating PDF...`;
    btn.disabled = true;
    
    // Add CSS keyframe for spinner animation if not already present
    if (!document.getElementById("pdf-spinner-style")) {
        const style = document.createElement("style");
        style.id = "pdf-spinner-style";
        style.innerHTML = `@keyframes spin { to { transform: rotate(360deg); } }`;
        document.head.appendChild(style);
    }
    
    try {
        const { jsPDF } = window.jspdf;
        
        // Portrait A4 page, dimensions: 210mm x 297mm
        const doc = new jsPDF("p", "mm", "a4");
        
        // Fetch persistent booking data from LocalStorage
        let bookingData = JSON.parse(localStorage.getItem("booking"));
        if (!bookingData) return;
        
        // Manage persistent Ticket ID
        let ticketId = localStorage.getItem("ticketId");
        if (!ticketId) {
            ticketId = "TRV" + Math.floor(10000 + Math.random() * 90000);
            localStorage.setItem("ticketId", ticketId);
        }
        
        // Retrieve actual transaction ID
        let transactionId = localStorage.getItem("transactionId") || ("TXN" + Math.floor(Math.random() * 1000000));
        
        // Format travel date nicely
        let formattedDate = new Date(bookingData.date).toLocaleDateString("en-GB", {
            day: "2-digit",
            month: "long",
            year: "numeric"
        });
        
        // Package prices for safety fallback calculations
        const prices = {
            Paris: 65000,
            Bali: 55000,
            London: 70000,
            Dubai: 68000,
            Maldives: 80000,
            Korea: 60000,
            Switzerland: 120000,
            Thailand: 58000,
            Singapore: 72000,
            Japan: 110000,
            Turkey: 78000,
            Canada: 125000,
            Australia: 130000,
            Italy: 95000,
            Germany: 88000,
            Spain: 92000,
            Greece: 105000,
            "New York": 115000,
            "Los Angeles": 110000,
            Bangkok: 52000,
            Seoul: 82000,
            Shimla: 28000,
            Tokyo: 118000,
            Malaysia: 64000,
            Indonesia: 72000,
            Vietnam: 58000,
            Goa: 24000,
            Kerala: 32000,
            Kashmir: 38000,
            Manali: 34000,
            Andaman: 42000,
            Panama: 105000,
            Pakistan: 85000,
            Portugal: 90000,
            Phuket: 62000
        };

        // Load images in parallel to ensure high-resolution synchronous drawing
        const [logo, qr] = await Promise.all([
            loadImage("images/icon.png"),
            loadImage("images/qr.png")
        ]);
        
        // ----------------------------------------------------
        // 1. TICKET HEADER BLOCK (Charcoal & Violet Theme)
        // ----------------------------------------------------
        // Charcoal top banner
        doc.setFillColor(15, 23, 42); // Charcoal #0f172a
        doc.rect(15, 15, 180, 26, "F");
        
        // Violet header bottom stripe
        doc.setFillColor(138, 43, 226); // Violet #8a2be2
        doc.rect(15, 41, 180, 2, "F");
        
        // Add brand logo inside a white circular border
        doc.setFillColor(255, 255, 255);
        doc.circle(26, 28, 7, "F");
        if (logo) {
            doc.addImage(logo, "PNG", 21.5, 23.5, 9, 9);
        } else {
            // Fallback logo design
            doc.setFillColor(138, 43, 226);
            doc.circle(26, 28, 4, "F");
            doc.setFillColor(255, 255, 255);
            doc.circle(26, 28, 1.8, "F");
        }
        
        // Brand Name and Subtitle in header
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(20);
        doc.setTextColor(255, 255, 255);
        doc.text("RoamEase", 37, 31);
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8.5);
        doc.setTextColor(196, 181, 253); // Soft Violet-200
        doc.text("Explore the World, One Journey at a Time", 37, 36);
        
        // E-Ticket Right Badge Pill
        doc.setFillColor(138, 43, 226); // Violet
        doc.roundedRect(140, 24, 48, 8, 2, 2, "F");
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(255, 255, 255);
        doc.text("BOARDING PASS / E-TICKET", 164, 29.5, { align: "center" });
        
        // ----------------------------------------------------
        // 2. MAIN TICKET CARD CONTAINER (With Tear Line & Punch Holes)
        // ----------------------------------------------------
        // Draw Lavender Stub Background (Right 30%)
        doc.setFillColor(245, 243, 255); // Soft Lavender #f5f3ff
        doc.rect(135.2, 48.2, 59.6, 109.6, "F");
        
        // Draw outer borders
        doc.setDrawColor(226, 232, 240); // Slate-200
        doc.setLineWidth(0.45);
        doc.roundedRect(15, 48, 180, 110, 3, 3, "S");
        
        // Draw dashed ticket stub tear line
        doc.setDrawColor(138, 43, 226); // Violet Accent
        doc.setLineWidth(0.5);
        doc.setLineDashPattern([2, 2], 0);
        doc.line(135, 48, 135, 158);
        doc.setLineDashPattern([], 0); // Restore solid line
        
        // Draw visual physical-style ticket punch holes
        doc.setFillColor(255, 255, 255);
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.45);
        doc.circle(135, 48, 3.5, "FD"); // Top punch hole
        doc.circle(135, 158, 3.5, "FD"); // Bottom punch hole
        
        // ----------------------------------------------------
        // 3. TICKET BODY: PASSENGER DETAILS (LEFT SIDE)
        // ----------------------------------------------------
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(13);
        doc.setTextColor(15, 23, 42); // Charcoal
        doc.text("PASSENGER BOARDING PASS", 25, 62);
        
        // Separator line
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.3);
        doc.line(25, 65, 125, 65);
        
        // Helper function for left fields
        const drawField = (label, value, x, y, isStatus = false) => {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(148, 163, 184); // Slate-400
            doc.text(label, x, y);
            
            if (isStatus) {
                // Draw green success badge
                doc.setFillColor(22, 163, 74); // Green #16a34a
                doc.roundedRect(x, y + 2, 34, 6.5, 1, 1, "F");
                doc.setFont("Helvetica", "bold");
                doc.setFontSize(8);
                doc.setTextColor(255, 255, 255);
                doc.text("CONFIRMED & PAID", x + 17, y + 6.3, { align: "center" });
            } else {
                doc.setFont("Helvetica", "bold");
                doc.setFontSize(11);
                doc.setTextColor(15, 23, 42); // Charcoal
                doc.text(String(value), x, y + 6);
            }
        };
        
        // Column 1: x = 25, Column 2: x = 78
        // Row 1
        drawField("PASSENGER NAME", bookingData.name, 25, 74);
        drawField("TICKET CLASS", "Standard Tour Package", 78, 74);
        
        // Row 2: Visual Route
        const routeStr = "DELHI (DEL)  ->  " + bookingData.destination.toUpperCase();
        drawField("DESTINATION ROUTE", routeStr, 25, 92);
        
        // Row 3
        drawField("TRAVEL DATE", formattedDate, 25, 110);
        drawField("PASSENGERS COUNT", bookingData.people + " Guest(s)", 78, 110);
        
        // Row 4
        drawField("BOOKING STATUS", "", 25, 128, true);
        
        const paidAmount = bookingData.paidTotal 
            ? "INR " + bookingData.paidTotal.toLocaleString('en-IN')
            : "INR " + (prices[bookingData.destination] * bookingData.people).toLocaleString('en-IN');
        drawField("TOTAL PAID AMOUNT", paidAmount, 78, 128);
        
        // Row 5
        drawField("PASSENGER EMAIL", bookingData.email, 25, 146);
        drawField("TRANSACTION ID", transactionId, 78, 146);
        
        // ----------------------------------------------------
        // 4. TICKET STUB: DETAILS & CODES (RIGHT SIDE)
        // ----------------------------------------------------
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(11);
        doc.setTextColor(138, 43, 226); // Violet Accent
        doc.text("TICKET STUB", 145, 62);
        
        const drawStubField = (label, value, x, y, isRef = false) => {
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8);
            doc.setTextColor(100, 116, 139); // Slate-500
            doc.text(label, x, y);
            
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(isRef ? 10.5 : 9.5);
            if (isRef) {
                doc.setTextColor(138, 43, 226); // Violet for ref
            } else {
                doc.setTextColor(15, 23, 42); // Charcoal for others
            }
            doc.text(String(value), x, y + 5);
        };
        
        drawStubField("PASSENGER", bookingData.name.length > 18 ? bookingData.name.slice(0, 16) + ".." : bookingData.name, 145, 72);
        drawStubField("DESTINATION", bookingData.destination.toUpperCase(), 145, 82);
        drawStubField("BOOKING REF", ticketId, 145, 92, true);
        
        // QR Code area frame
        doc.setDrawColor(138, 43, 226);
        doc.setFillColor(255, 255, 255);
        doc.setLineWidth(0.4);
        doc.roundedRect(150, 102, 30, 30, 1.5, 1.5, "FD");
        
        if (qr) {
            doc.addImage(qr, "PNG", 152.5, 104.5, 25, 25);
        } else {
            // Stately QR vector fallback
            doc.setFillColor(138, 43, 226);
            doc.rect(154, 106, 6, 6, "F");
            doc.rect(170, 106, 6, 6, "F");
            doc.rect(154, 122, 6, 6, "F");
            doc.rect(162, 114, 8, 8, "F");
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(7);
            doc.text("VERIFIED", 165, 130, { align: "center" });
        }
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(7.5);
        doc.setTextColor(100, 116, 139);
        doc.text("SCAN FOR TRIP INFO", 165, 137, { align: "center" });
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(6.5);
        doc.setTextColor(148, 163, 184);
        doc.text("Please present at check-in", 165, 142, { align: "center" });
        
        // ----------------------------------------------------
        // 5. TRAVEL ITINERARY & BOARDING INSTRUCTIONS
        // ----------------------------------------------------
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(12);
        doc.setTextColor(15, 23, 42);
        doc.text("TRAVEL ITINERARY & BOARDING INSTRUCTIONS", 15, 178);
        
        // Boundary container
        doc.setDrawColor(226, 232, 240);
        doc.setFillColor(255, 255, 255);
        doc.setLineWidth(0.45);
        doc.roundedRect(15, 182, 180, 58, 2, 2, "S");
        
        const drawItineraryItem = (num, title, text, y) => {
            // Purple bullet circle
            doc.setFillColor(138, 43, 226);
            doc.circle(23, y + 1.2, 1.2, "F");
            
            // Bold Instruction title
            doc.setFont("Helvetica", "bold");
            doc.setFontSize(9);
            doc.setTextColor(15, 23, 42);
            doc.text(num + ". " + title, 28, y);
            
            // Normal Instruction text
            doc.setFont("Helvetica", "normal");
            doc.setFontSize(8.5);
            doc.setTextColor(71, 85, 105); // Slate-600
            doc.text(text, 28, y + 4.5);
        };
        
        drawItineraryItem("1", "Pre-Departure Check-in", "Please arrive at the terminal at least 3 hours before your scheduled travel date. Have this printed ticket ready.", 191);
        drawItineraryItem("2", "Baggage Policy & Rules", "Each passenger is allowed 25kg of checked luggage and 7kg of cabin baggage. Prohibited items strictly apply.", 203);
        drawItineraryItem("3", "Accommodation & Travel Guides", "Your custom tour itinerary, hotel reservation details, and guide info will be delivered via email standard 48 hours prior.", 215);
        drawItineraryItem("4", "Cancellation & Full Refund Policy", "Cancellation is allowed within 7 days from the booking date for a full refund. After this period, cancel fees will be assessed.", 227);
        
        // ----------------------------------------------------
        // 6. TICKET FOOTER & LEGAL
        // ----------------------------------------------------
        // Thin gray bottom rule
        doc.setDrawColor(241, 245, 249);
        doc.setLineWidth(0.4);
        doc.line(15, 252, 195, 252);
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(100, 116, 139);
        doc.text("Thank you for traveling with RoamEase!", 105, 260, { align: "center" });
        
        doc.setFont("Helvetica", "normal");
        doc.setFontSize(8);
        doc.setTextColor(148, 163, 184); // Slate-400
        doc.text("For booking support or enquiries, please contact us at support@roamease.com or call +91-9876543210.", 105, 265, { align: "center" });
        doc.text("RoamEase Travel Technologies Pvt. Ltd. • Wanderlust Tower, MG Road, Hyderabad, India.", 105, 270, { align: "center" });
        
        doc.setFont("Helvetica", "bold");
        doc.setFontSize(8.5);
        doc.setTextColor(138, 43, 226); // Violet Accent
        doc.text("www.roamease.com", 105, 276, { align: "center" });
        
        // Download PDF Action
        doc.save(`RoamEase_Ticket_${ticketId}.pdf`);
        
    } catch (e) {
        console.error("Error generating PDF", e);
        alert("Failed to generate PDF ticket. Please try again.");
    } finally {
        // Restore button state
        btn.textContent = originalText;
        btn.disabled = false;
    }
}