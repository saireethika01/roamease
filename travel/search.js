const famousDestinations = [

    "Bali",
    "Maldives",
    "Dubai",
    "Paris",
    "London",
    "Korea",
    "Switzerland",
    "Thailand",
    "Singapore",
    "Japan",
    "Turkey",
    "Canada",
    "Australia",
    "Italy",
    "Germany",
    "Spain",
    "Greece",
    "New York",
    "Los Angeles",
    "Bangkok",
    "Seoul",
    "Shimla",
    "Tokyo",
    "Malaysia",
    "Indonesia",
    "Vietnam",
    "Goa",
    "Kerala",
    "Kashmir",
    "Manali",
    "Andaman",
    "Panama",
    "Pakistan",
    "Paris",
    "Portugal",
    "Phuket"

];



let searchInput =
    document.getElementById("searchInput");

let searchResults =
    document.getElementById("searchResults");



searchInput.addEventListener("keyup",
async function () {

    let value =
        searchInput.value.toLowerCase();

    searchResults.innerHTML = "";



    // stop if empty
    if (value === "") {

        return;
    }



    // famous destinations filter
    let localResults =
        famousDestinations.filter(function (place) {

            return place
                .toLowerCase()
                .startsWith(value);
                
        });



    // countries API
    let response =
        await fetch(
            `https://restcountries.com/v3.1/name/${value}`
        );



    let countries = [];



    if (response.ok) {

        let data = await response.json();

        countries = data.map(function (country) {

            return country.name.common;
        });
    }



    // combine both
    let finalResults = [
        ...new Set([
            ...localResults,
            ...countries
        ])
    ];



    // show results
    finalResults.forEach(function (place) {

        let div =
            document.createElement("div");

        div.classList.add("result-item");

        div.textContent = place;



        // click result
        div.addEventListener("click",
        function () {

            searchInput.value = place;

            searchResults.innerHTML = "";

            window.location.href =
                `trip.html?place=${place.toLowerCase()}`;
        });



        searchResults.appendChild(div);
    });
});