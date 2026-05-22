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

// client-side pagination for static package cards
const PAGE_SIZE = 6;
let currentPage = 1;

function initPagination() {
    const packageContainer = document.querySelector(".package-container");
    if (!packageContainer) return;
    
    // Create pagination container
    let paginationContainer = document.getElementById("pagination-container");
    if (!paginationContainer) {
        paginationContainer = document.createElement("div");
        paginationContainer.id = "pagination-container";
        paginationContainer.className = "pagination-container";
        packageContainer.insertAdjacentElement("afterend", paginationContainer);
    }
    
    // Check if a specific place is selected in URL (e.g. redirected from search/filter)
    // If so, only show that place and skip pagination controls
    const urlParams = new URLSearchParams(window.location.search);
    const selectedPlace = urlParams.get("place");
    if (selectedPlace) {
        paginationContainer.style.display = "none";
        return;
    }
    
    const packages = Array.from(document.querySelectorAll(".package"));
    if (packages.length <= PAGE_SIZE) {
        paginationContainer.style.display = "none";
        return;
    }
    
    const totalPages = Math.ceil(packages.length / PAGE_SIZE);
    
    function showPage(page) {
        currentPage = page;
        
        packages.forEach((pkg, index) => {
            const startIdx = (page - 1) * PAGE_SIZE;
            const endIdx = page * PAGE_SIZE;
            if (index >= startIdx && index < endIdx) {
                pkg.style.display = "flex"; // Restores the original flex display from trip.css
            } else {
                pkg.style.display = "none";
            }
        });
        
        renderControls();
        
        // Scroll smoothly to package header section top
        const headingElement = document.querySelector(".t");
        if (headingElement) {
            window.scrollTo({
                top: headingElement.offsetTop - 20,
                behavior: "smooth"
            });
        }
    }
    
    function renderControls() {
        paginationContainer.innerHTML = "";
        
        // Prev button
        const prevBtn = document.createElement("button");
        prevBtn.className = `pagination-btn prev-btn ${currentPage === 1 ? 'disabled' : ''}`;
        prevBtn.innerHTML = "&larr; Prev";
        prevBtn.disabled = currentPage === 1;
        prevBtn.addEventListener("click", () => {
            if (currentPage > 1) showPage(currentPage - 1);
        });
        paginationContainer.appendChild(prevBtn);
        
        // Page buttons
        for (let i = 1; i <= totalPages; i++) {
            const pageBtn = document.createElement("button");
            pageBtn.className = `pagination-btn num-btn ${currentPage === i ? 'active' : ''}`;
            pageBtn.textContent = i;
            pageBtn.addEventListener("click", () => showPage(i));
            paginationContainer.appendChild(pageBtn);
        }
        
        // Next button
        const nextBtn = document.createElement("button");
        nextBtn.className = `pagination-btn next-btn ${currentPage === totalPages ? 'disabled' : ''}`;
        nextBtn.innerHTML = "Next &rarr;";
        nextBtn.disabled = currentPage === totalPages;
        nextBtn.addEventListener("click", () => {
            if (currentPage < totalPages) showPage(currentPage + 1);
        });
        paginationContainer.appendChild(nextBtn);
    }
    
    showPage(1);
}

// Initialize pagination on DOM ready
if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPagination);
} else {
    initPagination();
}