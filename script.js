
function openLogin() {
    document.getElementById("loginBox").style.display = "flex";
    generateCaptcha();
}

function closeLogin() {
    document.getElementById("loginBox").style.display = "none";
}

function forgotPassword() {
    let username = prompt("Enter your username:");

    if (username === null || username.trim() === "") {
        return;
    }

    alert("Password reset link has been sent for " + username);
}


let captchaCode = "";

function generateCaptcha() {

    let characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";

    captchaCode = "";

    for (let i = 0; i < 6; i++) {
        captchaCode += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    document.getElementById("captchaText").textContent = captchaCode;
}

function loginUser() {

    let username =
        document.getElementById("username").value;

    let password =
        document.getElementById("password").value;

    let captchaInput =
        document.getElementById("captchaInput").value;


    if (username === "" || password === "") {

        alert("Please enter username and password");

        return;
    }


    if (captchaInput === "") {

        alert("Please enter CAPTCHA");

        return;
    }


    if (captchaInput.toUpperCase() !== captchaCode) {

        alert("Incorrect CAPTCHA!");

        generateCaptcha();

        document.getElementById("captchaInput").value = "";

        return;
    }


    alert("Login successful!");

    closeLogin();


    let loginLink =
        document.querySelector(".menu ul li:last-child a");


    loginLink.textContent = "Logout";


    loginLink.onclick = function () {
        logoutUser();
    };
}


function logoutUser() {

    alert("Logged out successfully!");


    let loginLink =
        document.querySelector(".menu ul li:last-child a");


    loginLink.textContent = "Login";


    loginLink.onclick = function () {
        openLogin();
    };
}
let slideIndex = 0;

const slides = document.querySelectorAll(".slideshow .slide");

function changeSlide(newIndex, direction) {

    if (slides.length === 0) return;

    const current = slides[slideIndex];
    const next = slides[newIndex];

    next.style.transition = "none";
    next.style.opacity = "1";
    next.style.visibility = "visible";

    if (direction === "right") {
        next.style.transform = "translateX(100%)";
    } else {
        next.style.transform = "translateX(-100%)";
    }

    
    requestAnimationFrame(function () {

        requestAnimationFrame(function () {

            current.style.transition =
                "transform 1s ease-in-out";

            next.style.transition =
                "transform 1s ease-in-out";

            if (direction === "right") {

                current.style.transform =
                    "translateX(-100%)";

                next.style.transform =
                    "translateX(0)";

            } else {

                current.style.transform =
                    "translateX(100%)";

                next.style.transform =
                    "translateX(0)";
            }
        });
    });

 setTimeout(function () {
    current.classList.remove("active");

    current.style.transition = "";
    current.style.transform = "";
    current.style.opacity = "";
    current.style.visibility = "";

    next.classList.add("active");

    next.style.transition = "";
    next.style.transform = "";
    next.style.opacity = "";
    next.style.visibility = "";

}, 1000);
}


function nextSlide() {

    let newIndex = slideIndex + 1;

    if (newIndex >= slides.length) {
        newIndex = 0;
    }

    changeSlide(newIndex, "right");

    slideIndex = newIndex;
}


function previousSlide() {

    let newIndex = slideIndex - 1;

    if (newIndex < 0) {
        newIndex = slides.length - 1;
    }

    changeSlide(newIndex, "left");

    slideIndex = newIndex;
}



function showSearchOptions() {

    document.getElementById("searchOptions").style.display =
        "block";
}


function hideSearchOptions() {

    document.getElementById("searchOptions").style.display =
        "none";
}


function openDeliveryLocation() {

    const overlay =
        document.getElementById("deliveryOverlay");

    if (overlay) {

        overlay.style.display = "flex";

    }
}


function closeDeliveryLocation() {
    const overlay = document.getElementById("deliveryOverlay");

    if (overlay) {
        overlay.style.display = "none";
    }

   
    const message = document.getElementById("locationMessage");

    if (message) {
        message.innerHTML = "";
    }

    
    const pincodeInput = document.getElementById("pincodeInput");

    if (pincodeInput) {
        pincodeInput.value = "";
    }
}


async function searchPincode() {

    const input =
        document.getElementById("pincodeInput");

    const message =
        document.getElementById("locationMessage");


    if (!input || !message) {
        return;
    }


    const pincode =
        input.value.trim();


    if (pincode === "") {

        message.textContent =
            "Please enter your pincode.";

        return;
    }


    if (!/^\d+$/.test(pincode)) {

        message.textContent =
            "Pincode must contain numbers only.";

        return;
    }


   
    if (pincode.length < 6) {

        message.textContent =
            "Please enter a 6-digit pincode.";

        return;
    }


    
    if (pincode.length > 6) {

        message.textContent =
            "Pincode cannot be more than 6 digits.";

        return;
    }


    
    message.textContent =
        "Searching location...";


    try {

        const response =
            await fetch(
                `https://api.postalpincode.in/pincode/${pincode}`
            );


        const data =
            await response.json();


       
        if (
            !data ||
            !data[0] ||
            data[0].Status !== "Success" ||
            !data[0].PostOffice ||
            data[0].PostOffice.length === 0
        ) {

            message.textContent =
                "Invalid pincode. Please check and try again.";

            return;
        }


        
        const location =
            data[0].PostOffice[0];


        const area =
            location.Name;

        const district =
            location.District;

        const state =
            location.State;


        message.innerHTML = `
            <strong>${pincode}</strong><br>
            ${area}, ${district}, ${state}
        `;


    } catch (error) {

        console.error(error);

        message.textContent =
            "Unable to search pincode. Please try again.";
    }
}


function dontKnowPincode(event) {

    event.preventDefault();


    const message =
        document.getElementById("locationMessage");


    message.innerHTML = `

        <div class="location-search-box">

            <input
                type="text"
                id="locationInput"
                placeholder="Enter a location"
                autocomplete="off"
                oninput="getLocationSuggestions()"
            >

            <span
                class="location-search-icon"
                onclick="getLocationSuggestions()"
            >
                ⌕
            </span>

        </div>


        <div
            id="locationSuggestions"
            class="location-suggestions"
        ></div>

    `;


    document
        .getElementById("locationInput")
        .focus();
}


let locationTimer;


async function getLocationSuggestions() {

    const input =
        document.getElementById("locationInput");


    const suggestions =
        document.getElementById("locationSuggestions");


    if (!input || !suggestions) {

        return;

    }


    const query =
        input.value.trim();


   
    if (query.length < 2) {

        suggestions.innerHTML = "";

        return;
    }


    clearTimeout(locationTimer);


    locationTimer = setTimeout(async function () {


        suggestions.innerHTML = `
            <div class="location-loading">
                Searching...
            </div>
        `;


        try {

            const response =
                await fetch(
                    `https://photon.komoot.io/api/?q=${encodeURIComponent(query)}&limit=5`
                );


            const data =
                await response.json();


            if (
                !data ||
                !data.features ||
                data.features.length === 0
            ) {

                suggestions.innerHTML = `
                    <div class="no-location">
                        No location found
                    </div>
                `;

                return;
            }


            suggestions.innerHTML = "";


            data.features.forEach(function (place) {


                const properties =
                    place.properties;


                const name =
                    properties.name || "";


                const city =
                    properties.city ||
                    properties.town ||
                    properties.village ||
                    properties.municipality ||
                    "";


                const state =
                    properties.state ||
                    "";


                const country =
                    properties.country ||
                    "";


                let displayName =
                    name;


                if (
                    city &&
                    city !== name
                ) {

                    displayName +=
                        ", " + city;

                }


                if (state) {

                    displayName +=
                        ", " + state;

                }


                const option =
                    document.createElement("div");


                option.className =
                    "location-option";


                option.innerHTML = `

                    <span class="location-pin">
                        📍
                    </span>

                    <div>

                        <strong>
                            ${name}
                        </strong>

                        <small>
                            ${city ? city + ", " : ""}
                            ${state}
                            ${country ? ", " + country : ""}
                        </small>

                    </div>

                `;


                option.onclick = function () {

                    selectLocation(
                        displayName,
                        properties
                    );

                };


                suggestions.appendChild(option);

            });


        } catch (error) {

            console.error(error);


            suggestions.innerHTML = `

                <div class="no-location">
                    Unable to find location
                </div>

            `;

        }


    }, 400);
}


function selectLocation(
    locationName,
    properties
) {

    const message =
        document.getElementById("locationMessage");


    message.innerHTML = `

        <div class="selected-location">

            <span class="location-pin">
                📍
            </span>

            <div>

                <strong>
                    ${locationName}
                </strong>

            </div>

        </div>


    `;


    console.log(
        "Selected location:",
        properties
    );
}


async function useCurrentLocation() {

    const message = document.getElementById("locationMessage");

    if (!navigator.geolocation) {
        message.textContent =
            "Location is not supported by your browser.";
        return;
    }

    message.textContent = "Detecting your exact location...";

    navigator.geolocation.getCurrentPosition(
        async function (position) {

            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;

            try {

                const response = await fetch(
                    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}&zoom=18&addressdetails=1`
                );

                const data = await response.json();

                if (!data || !data.address) {
                    message.textContent =
                        "Unable to find your exact location.";
                    return;
                }

                const address = data.address;

                const house = address.house_number || "";
                const road = address.road || "";
                const area =
                    address.suburb ||
                    address.neighbourhood ||
                    address.village ||
                    "";

                const city =
                    address.city ||
                    address.town ||
                    address.municipality ||
                    address.village ||
                    "";

                const district =
                    address.state_district ||
                    address.county ||
                    "";

                const state = address.state || "";
                const pincode = address.postcode || "";
                const country = address.country || "";

                let exactLocation = "";

                if (house) exactLocation += house + ", ";
                if (road) exactLocation += road + ", ";
                if (area) exactLocation += area + ", ";
                if (city) exactLocation += city + ", ";
                if (district && district !== city)
                    exactLocation += district + ", ";
                if (state) exactLocation += state + ", ";
                if (pincode) exactLocation += pincode + ", ";
                if (country) exactLocation += country;

                message.innerHTML = `
                    <div class="selected-location">
                        <span class="location-pin">📍</span>

                        <div>
                            <strong>Your Current Location</strong>

                            <p>${exactLocation}</p>

                            ${
                                pincode
                                    ? `<small>Pincode: ${pincode}</small>`
                                    : ""
                            }
                        </div>
                    </div>
                `;

            } catch (error) {

                console.error(error);

                message.textContent =
                    "Unable to find your exact location. Please try again.";
            }

        },

        function (error) {

            if (error.code === 1) {
                message.textContent =
                    "Location permission denied. Please allow location access.";

            } else if (error.code === 2) {
                message.textContent =
                    "Unable to detect your location.";

            } else if (error.code === 3) {
                message.textContent =
                    "Location request timed out. Please try again.";

            } else {
                message.textContent =
                    "Unable to get your location.";
            }
        },

        {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 0
        }
    );
}

const deliveryOverlay =
    document.getElementById("deliveryOverlay");


if (deliveryOverlay) {

    deliveryOverlay.addEventListener(
        "click",
        function (event) {

            if (event.target === this) {

                closeDeliveryLocation();

            }

        }
    );

}

function toggleCountryDropdown() {

    const dropdown =
        document.getElementById("countryDropdown");


    const arrow =
        document.getElementById("countryArrow");


    if (!dropdown || !arrow) {

        return;

    }


    if (
        dropdown.style.display === "block"
    ) {

      

        dropdown.style.display =
            "none";

        arrow.textContent =
            "▼";

    }

    else {

      

        dropdown.style.display =
            "block";

        arrow.textContent =
            "▲";

    }

}


function selectCountry(
    event,
    flag,
    country
) {

    event.stopPropagation();


    const selectedCountry =
        document.getElementById(
            "selectedCountry"
        );


    const dropdown =
        document.getElementById(
            "countryDropdown"
        );


    selectedCountry.innerHTML = `

        <img
            src="${flag}"
            class="country-flag"
            alt="${country}"
        >

        <span class="country-name">
            ${country}
        </span>

        <span
            class="country-arrow"
            id="countryArrow"
        >
            ▼
        </span>

    `;


    dropdown.style.display =
        "none";
}
