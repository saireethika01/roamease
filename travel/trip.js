// get selected place from URL
let params =
    new URLSearchParams(window.location.search);

let selectedPlace =
    params.get("place");



// if place selected
if (selectedPlace) {

    let packages =
        document.querySelectorAll(".package");



    packages.forEach(function(card) {

        if (card.id !== selectedPlace) {

            card.style.display = "none";
        }
    });
}



// store created maps
let maps = {};



// reusable toggle map function
function toggleMap(mapId, lat, lng, placeName) {

    let mapDiv =
        document.getElementById(mapId);



    // show map
    if (mapDiv.style.display === "none" ||
        mapDiv.style.display === "") {

        mapDiv.style.display = "block";



        // create map only first time
        if (!maps[mapId]) {

            maps[mapId] = L.map(mapId).setView(
                [lat, lng],
                10
            );



            // map layer
            L.tileLayer(
                'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',

                {
                    attribution:
                    '&copy; OpenStreetMap contributors'
                }

            ).addTo(maps[mapId]);



            // marker
            L.marker([lat, lng])

                .addTo(maps[mapId])

                .bindPopup(placeName)

                .openPopup();
        }



        // refresh map properly
        setTimeout(function () {

            maps[mapId].invalidateSize();

        }, 200);
    }



    // hide map
    else {

        mapDiv.style.display = "none";
    }
}



// currency converter settings
const currencyApiUrl =
    "https://open.er-api.com/v6/latest/INR";

const currenciesToShow = [
    "USD",
    "EUR",
    "GBP"
];



// get package price from the existing price text
function getPackagePrice(priceText) {

    let onlyNumbers =
        priceText.replace(/[^\d]/g, "");

    return Number(onlyNumbers);
}



// format converted amount for display
function formatCurrency(amount, currencyCode) {

    return new Intl.NumberFormat(
        "en-US",
        {
            style: "currency",
            currency: currencyCode,
            maximumFractionDigits: 0
        }
    ).format(amount);
}



// create the loading box below each package price
function addCurrencyBox(priceLine) {

    let currencyBox =
        document.createElement("div");

    currencyBox.className =
        "currency-conversion";

    currencyBox.textContent =
        "Converting currency...";

    priceLine.insertAdjacentElement(
        "afterend",
        currencyBox
    );

    return currencyBox;
}



// find all package price lines on the page
function getPackagePriceLines() {

    let packages =
        document.querySelectorAll(".package");

    let priceLines = [];

    packages.forEach(function(packageCard) {

        let paragraphs =
            packageCard.querySelectorAll("p");

        paragraphs.forEach(function(paragraph) {

            if (paragraph.textContent.includes("Starting From")) {

                priceLines.push(paragraph);
            }
        });
    });

    return priceLines;
}



// show the same fallback message for every package
function showCurrencyError(currencyBoxes) {

    currencyBoxes.forEach(function(currencyBox) {

        currencyBox.textContent =
            "Currency conversion unavailable";
    });
}



// show USD, EUR and GBP values below one package price
function showConvertedPrices(priceLine, currencyBox, rates) {

    let inrPrice =
        getPackagePrice(priceLine.textContent);

    if (!inrPrice) {

        currencyBox.textContent =
            "Currency conversion unavailable";

        return;
    }

    currencyBox.innerHTML =
        currenciesToShow.map(function(currencyCode) {

            let convertedAmount =
                inrPrice * rates[currencyCode];

            return `
                <span style="display: block;">
                    &asymp; ${formatCurrency(convertedAmount, currencyCode)} ${currencyCode}
                </span>
            `;
        }).join("");
}



// fetch rates once and update every package card
async function loadCurrencyConversions() {

    let priceLines =
        getPackagePriceLines();

    if (priceLines.length === 0) {

        return;
    }

    let currencyBoxes =
        priceLines.map(addCurrencyBox);

    try {

        let response =
            await fetch(currencyApiUrl);

        if (!response.ok) {

            throw new Error("Currency API request failed");
        }

        let data =
            await response.json();

        let rates =
            data.rates;

        let hasRequiredRates =
            currenciesToShow.every(function(currencyCode) {

                return rates && rates[currencyCode];
            });

        if (data.result !== "success" || !hasRequiredRates) {

            throw new Error("Currency rates unavailable");
        }

        priceLines.forEach(function(priceLine, index) {

            showConvertedPrices(
                priceLine,
                currencyBoxes[index],
                rates
            );
        });
    }

    catch (error) {

        showCurrencyError(currencyBoxes);
    }
}



loadCurrencyConversions();



// save wishlist
function saveTrip(destination) {

    // get existing wishlist
    let wishlist =
        JSON.parse(
            localStorage.getItem("wishlist")
        ) || [];



    // avoid duplicates
    if (!wishlist.includes(destination)) {

        wishlist.push(destination);

        localStorage.setItem(
            "wishlist",
            JSON.stringify(wishlist)
        );



        alert(
            destination +
            " added to wishlist!"
        );
    }

    else {

        alert(
            destination +
            " already saved!"
        );
    }
}