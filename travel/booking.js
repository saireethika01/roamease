// disable past dates
let today =
    new Date().toISOString().split("T")[0];

document.getElementById("date").min =
    today;



// auto-fill destination
let params =
    new URLSearchParams(window.location.search);

let destination =
    params.get("destination");



if (destination) {

    document.getElementById("destination").value =
        destination;
}



// booking submit
function handleBooking(event) {

    event.preventDefault();

    let name =
        document.getElementById("name").value;

    let email =
        document.getElementById("email").value;

    let destination =
        document.getElementById("destination").value;

    let people =
        document.getElementById("people").value;

    let date =
        document.getElementById("date").value;



    let bookingData = {

        name,

        email,

        destination:
            destination.charAt(0).toUpperCase() +
            destination.slice(1).toLowerCase(),

        people,

        date,

        bookingCreatedAt:
            new Date().toISOString()
    };



    localStorage.setItem(
        "booking",
        JSON.stringify(bookingData)
    );



    window.location.href =
        "payment.html";
}



// seasonal climate data
const climateData = {

    bali: `
        <p>Temperature: 27°C - 31°C</p>
        <p>Condition: Warm Tropical Climate</p>
        <p>Humidity: Moderate</p>
    `,



    dubai: `
        <p>Temperature: 30°C - 40°C</p>
        <p>Condition: Hot Desert Climate</p>
        <p>Humidity: Dry Weather</p>
    `,



    london: `
        <p>Temperature: 10°C - 20°C</p>
        <p>Condition: Cool & Cloudy</p>
        <p>Humidity: Frequent Rain</p>
    `,



    paris: `
        <p>Temperature: 12°C - 22°C</p>
        <p>Condition: Mild Climate</p>
        <p>Humidity: Pleasant Weather</p>
    `,



    maldives: `
        <p>Temperature: 28°C - 32°C</p>
        <p>Condition: Sunny Beach Weather</p>
        <p>Humidity: High Humidity</p>
    `,



    korea: `
        <p>Temperature: 5°C - 25°C</p>
        <p>Condition: Cool Seasonal Weather</p>
        <p>Humidity: Chilly Evenings</p>
    `,



    switzerland: `
        <p>Temperature: -2°C - 12°C</p>
        <p>Condition: Snowy Mountain Climate</p>
        <p>Humidity: Cold Breeze</p>
    `,



    thailand: `
        <p>Temperature: 26°C - 34°C</p>
        <p>Condition: Tropical Weather</p>
        <p>Humidity: Humid Climate</p>
    `,



    singapore: `
        <p>Temperature: 27°C - 33°C</p>
        <p>Condition: Warm Tropical Weather</p>
        <p>Humidity: High Humidity</p>
    `,



    japan: `
        <p>Temperature: 6°C - 22°C</p>
        <p>Condition: Pleasant Seasonal Climate</p>
        <p>Humidity: Moderate</p>
    `,



    goa: `
        <p>Temperature: 25°C - 33°C</p>
        <p>Condition: Sunny Beach Weather</p>
        <p>Humidity: Humid</p>
    `,



    kerala: `
        <p>Temperature: 23°C - 32°C</p>
        <p>Condition: Tropical Monsoon Climate</p>
        <p>Humidity: High Humidity</p>
    `,



    kashmir: `
        <p>Temperature: -5°C - 15°C</p>
        <p>Condition: Snowy Cold Climate</p>
        <p>Humidity: Cool Breeze</p>
    `,



    manali: `
        <p>Temperature: -3°C - 18°C</p>
        <p>Condition: Hill Station Climate</p>
        <p>Humidity: Cold Air</p>
    `
};



// weather forecast
async function getWeather() {

    let destination =
        document.getElementById("destination").value;

    let date =
        document.getElementById("date").value;



    // stop if empty
    if (!destination || !date) {

        return;
    }



    // today's date
    let today =
        new Date();

    // selected date
    let selectedDate =
        new Date(date);

    // difference in days
    let diffTime =
        selectedDate - today;

    let diffDays =
        diffTime / (1000 * 60 * 60 * 24);



    // if date after 5 days
    if (diffDays > 5) {

        let climateInfo =
            climateData[destination.toLowerCase()];



        document.getElementById("weatherBox").innerHTML =

        `
            <h3>Weather Forecast</h3>

            ${climateInfo || "<p>Climate data unavailable.</p>"}
        `;

        return;
    }



    // fetch weather API
    let response = await fetch(

        `https://api.openweathermap.org/data/2.5/forecast?q=${destination}&units=metric&appid=766a6b615aedc7e60e2e75d5b4505aa4`
    );



    let data = await response.json();



    // find matching forecast
    let forecast =
        data.list.find(function(item) {

            return item.dt_txt.includes(date);
        });



    // if no forecast found
    if (!forecast) {

        let climateInfo =
            climateData[destination.toLowerCase()];



        document.getElementById("weatherBox").innerHTML =

        `
            <h3>Weather Forecast</h3>

            ${climateInfo || "<p>Climate data unavailable.</p>"}
        `;

        return;
    }



    let temperature =
        forecast.main.temp;

    let condition =
        forecast.weather[0].main;

    let humidity =
        forecast.main.humidity;



    // show live weather
    document.getElementById("weatherBox").innerHTML =

    `
        <h3>Weather Forecast</h3>

        <p>Temperature: ${temperature}°C</p>

        <p>Condition: ${condition}</p>

        <p>Humidity: ${humidity}%</p>
    `;
}



// update weather automatically
document.getElementById("destination")
    .addEventListener("input", getWeather);

document.getElementById("date")
    .addEventListener("change", getWeather);