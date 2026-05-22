emailjs.init("SV3AkwM3-qT4fThHm");

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
document.getElementById("confirmAmount").innerHTML =
    document.getElementById("summaryTotal")
        ? document.getElementById("summaryTotal").innerHTML
        : "Total Amount Confirmed";



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


function downloadTicket() {

    const { jsPDF } = window.jspdf;

    const doc = new jsPDF();



    // booking data
    let bookingData = JSON.parse(
        localStorage.getItem("booking")
    );



    // random ids
    let bookingId =
        "TRV" + Math.floor(Math.random() * 100000);

    let transactionId =
        "PAY" + Math.floor(Math.random() * 100000);



    // title
    doc.setFontSize(20);

    doc.text(
        "Travel Booking Ticket",
        20,
        20
    );



    // details
    doc.setFontSize(12);

    doc.text(
        "Booking ID: " + bookingId,
        20,
        40
    );

    doc.text(
        "Transaction ID: " + transactionId,
        20,
        50
    );

    doc.text(
        "Passenger Name: " + bookingData.name,
        20,
        60
    );

    doc.text(
        "Destination: " + bookingData.destination,
        20,
        70
    );

    doc.text(
        "Travel Date: " + bookingData.date,
        20,
        80
    );

    doc.text(
        "Passengers: " + bookingData.people,
        20,
        90
    );

    doc.text(
        "Payment Status: Successful",
        20,
        100
    );



    // footer
    doc.text(
        "Thank you for booking with us!",
        20,
        130
    );



    // download
    doc.save("TravelTicket.pdf");
}