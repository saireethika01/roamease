// get booking data
let bookingData = JSON.parse(
    localStorage.getItem("booking")
);



// show booking details
document.getElementById("summaryDestination").textContent =
    "Destination: " + bookingData.destination;

document.getElementById("summaryPeople").textContent =
    "People: " + bookingData.people;



let formattedDate = new Date(bookingData.date)
    .toLocaleDateString("en-GB", {

        day: "2-digit",

        month: "long",

        year: "numeric"
    });



document.getElementById("summaryDate").textContent =
    "Travel Date: " + formattedDate;




// package prices
let prices = {

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



// calculate total
var total =
    prices[bookingData.destination] *
    bookingData.people;



// show total
document.getElementById("summaryTotal").innerHTML =
    "Total Amount: &#8377; " + total;




// payment method elements
let upi =
    document.getElementById("upi");

let card =
    document.getElementById("card");

let netbanking =
    document.getElementById("netbanking");

let wallet =
    document.getElementById("wallet");




// sections
let upiSection =
    document.getElementById("upiSection");

let cardSection =
    document.getElementById("cardSection");

let bankSection =
    document.getElementById("bankSection");

let walletSection =
    document.getElementById("walletSection");




// switching function
function showPaymentSection() {

    // hide all
    upiSection.style.display = "none";

    cardSection.style.display = "none";

    bankSection.style.display = "none";

    walletSection.style.display = "none";



    // show selected
    if (upi.checked) {

        upiSection.style.display = "block";
    }

    else if (card.checked) {

        cardSection.style.display = "block";
    }

    else if (netbanking.checked) {

        bankSection.style.display = "block";
    }

    else if (wallet.checked) {

        walletSection.style.display = "block";
    }
}




// event listeners
upi.addEventListener(
    "change",
    showPaymentSection
);

card.addEventListener(
    "change",
    showPaymentSection
);

netbanking.addEventListener(
    "change",
    showPaymentSection
);

wallet.addEventListener(
    "change",
    showPaymentSection
);




// initial display
showPaymentSection();




// coupon system
let couponApplied = false;

function formatTime(seconds) {
    let m = Math.floor(seconds / 60);
    let s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
}

function applyCoupon() {
    if (couponApplied) {
        alert("A coupon code has already been applied to this transaction.");
        return;
    }

    let coupon =
        document.getElementById("couponInput")
        .value
        .toUpperCase();

    if (coupon === "TRAVEL20") {
        total =
            total - (total * 20 / 100);
        couponApplied = true;
        alert("20% Discount Applied!");
    }

    else if (coupon === "WELCOME10") {
        total =
            total - (total * 10 / 100);
        couponApplied = true;
        alert("10% Discount Applied!");
    }

    else {
        alert("Invalid Coupon Code");
        return;
    }

    // update total
    document.getElementById("summaryTotal")
        .innerHTML =
        "Total Amount: &#8377; " + total;
}


// payment timer
let paymentExpired = false;
let timeLeft = 300;

// show timer immediately
document.getElementById("loader").style.display =
    "block";

document.getElementById("loader").innerHTML =
`
    <p id="timerText">
        Complete payment within 5:00 min
    </p>
`;

// countdown
let paymentTimer = setInterval(function () {
    timeLeft--;

    document.getElementById("timerText")
        .innerHTML =
        "Complete payment within " +
        formatTime(timeLeft) +
        " min";

    // timer expired
    if (timeLeft <= 0) {
        clearInterval(paymentTimer);
        paymentExpired = true;

        document.getElementById("loader").innerHTML =
        `
            <p style="color:red;">
                Transaction Failed!
            </p>
            <p>
                Payment Session Expired.
                Please Try Again.
            </p>
        `;
    }
}, 1000);




// pay now button
function makePayment() {

    // session expired
    if (paymentExpired) {

        alert(
            "Session Expired! Please refresh and try again."
        );

        return;
    }



    // check payment method
    if (
        !upi.checked &&
        !card.checked &&
        !netbanking.checked &&
        !wallet.checked
    ) {

        alert("Please select a payment method!");

        return;
    }

    // validate card fields if card is checked
    if (card.checked) {
        const num = document.getElementById("cardNumber").value.trim();
        const cardName = document.getElementById("cardHolderName").value.trim();
        const expiry = document.getElementById("cardExpiry").value.trim();
        const cvv = document.getElementById("cardCvv").value.trim();

        if (!num || !cardName || !expiry || !cvv) {
            alert("Please fill in all credit/debit card details.");
            return;
        }

        const cleanNum = num.replace(/\s+/g, '').replace(/-/g, '');
        if (cleanNum.length < 15 || cleanNum.length > 19 || isNaN(cleanNum)) {
            alert("Please enter a valid card number (15 to 19 digits).");
            return;
        }

        if (cardName.length < 2) {
            alert("Please enter a valid cardholder name.");
            return;
        }

        const expiryRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
        if (!expiryRegex.test(expiry)) {
            alert("Please enter a valid expiry date in MM/YY format.");
            return;
        }

        if (cvv.length < 3 || cvv.length > 4 || isNaN(cvv)) {
            alert("Please enter a valid CVV (3 or 4 digits).");
            return;
        }
    }

    // validate bank selection if net banking is checked
    if (netbanking.checked) {
        const bankSelect = document.querySelector("#bankSection select");
        if (bankSelect.value === "Select Bank") {
            alert("Please select your bank.");
            return;
        }
    }

    // validate wallet selection if wallet is checked
    if (wallet.checked) {
        const walletSelect = document.querySelector("#walletSection select");
        if (walletSelect.value === "Select Wallet") {
            alert("Please select your wallet.");
            return;
        }
    }

    // stop timer
    clearInterval(paymentTimer);

    // Save final paid total in localStorage booking object
    if (bookingData) {
        bookingData.paidTotal = total;
        localStorage.setItem("booking", JSON.stringify(bookingData));
    }

    // processing text
    document.getElementById("loader").innerHTML =

    `
        <p>
            Processing Payment...
        </p>
    `;




    // success after 3 sec
    setTimeout(function () {

        document.getElementById("loader").innerHTML =

        `
            <p style="color:green;">
                Payment Successful!
            </p>
        `;



        // redirect
        setTimeout(function () {

            window.location.href =
                "confirmation.html";

        }, 2000);

    }, 3000);
}