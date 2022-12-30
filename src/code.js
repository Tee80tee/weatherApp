// set up current location first (lat, lon)
let lon = "";
let lat = "";

function SetLonLat(position) {
    console.log(position.coords.latitude);
    console.log(position.coords.longitude);

    lon = position.coords.longitude;
    lat = position.coords.latitude;
}

navigator.geolocation.getCurrentPosition(SetLonLat);

// things that set country code
const regionNames = new Intl.DisplayNames(
    ['en'], {type: 'region'}
);

// the modal from bootstrap
const changeLocModal = document.getElementById('change-loc-modal');
changeLocModal.addEventListener('show.bs.modal', event => {
    // Button that triggered the modal
    const button = event.relatedTarget;
})

// chang temp unit
let allTempElements = document.querySelectorAll(".temp-num");
allTempElements.forEach(AddListenerToAllTempElements);
let currentUnit = "cel";

function SwtichTempUnit() {
    if (currentUnit === "cel") {
        for (let i = 0; i < allTempElements.length; i++) {

            let tempCel = parseInt(allTempElements[i].innerHTML);
            let tempFah = (tempCel * 1.8) + 32;
            tempFah = Math.round(tempFah);
            allTempElements[i].innerHTML = tempFah + "°F";
        }
        currentUnit = "fah";
    } else {
        for (let i = 0; i < allTempElements.length; i++) {

            let tempFah = parseInt(allTempElements[i].innerHTML);
            let tempCel = (tempFah - 32) * 0.5556;
            tempCel = Math.round(tempCel);
            allTempElements[i].innerHTML = tempCel + "°C";
        }
        currentUnit = "cel";
    }

}

// weather api

// keys
let sheCodeApiKey = "0ffebo21c6c8t4beca1e63be9c2e7be3";
let ninjaApiKey = "JPBT2pFOB6XRKLMTSaoROQ==KdfARqwdyvdq33r8";

let apiUrlForecast = "https://api.shecodes.io/weather/v1/forecast?query=";

function ShowForecast(city) {
    document.querySelector("#spinner").style.visibility = 'visible';
    console.log("hide it");
    let finalUrl = apiUrlForecast + city + "&key=" + sheCodeApiKey;
    axios.get(finalUrl).then(ChangeCity).catch((error) => {
        console.error({error});
    });
}

function ShowTempOfCurrentLocation() {
    document.querySelector("#spinner").style.visibility = 'visible';
    console.log("hide it");
    let finalUrl = `https://api.shecodes.io/weather/v1/forecast?lon=${lon}&lat=${lat}&key=${sheCodeApiKey}`;
    axios.get(finalUrl).then(ChangeCity).catch((error) => {
        console.error({error});
    });
}

function SearchForTemp(event) {
    event.preventDefault();
    let firstFormInput = document.querySelector("#city-name-input");
    console.log(firstFormInput.value);
    ShowForecast(firstFormInput.value);
}

function ChangeCity(response) {
    console.log(response);
    // set everything to cel unit first
    
    //currentUnit = "fah";
    //SwtichTempUnit();
    GetCurrentTime(response.data.city);

    let cityNameElement = document.querySelector("#current-city");
    cityNameElement.innerHTML = response.data.city;

    let currentCountry = document.querySelector("#current-country");
    currentCountry.innerHTML = response.data.country;
    
    let currentTempElement = document.querySelector("#day0-temp");
    let responseTemp = response.data.daily[0].temperature.day;
    currentTempElement.innerHTML = Math.round(responseTemp) + "°C";

    let day1TempElement = document.querySelector("#day1-temp");
    let day1ResponseTemp = response.data.daily[1].temperature.day;
    day1TempElement.innerHTML = Math.round(day1ResponseTemp) + "°C";

    let day2TempElement = document.querySelector("#day2-temp");
    let day2ResponseTemp = response.data.daily[2].temperature.day;
    day2TempElement.innerHTML = Math.round(day2ResponseTemp) + "°C";

    let weatherStatus = document.querySelector("#weather-status");
    weatherStatus.innerHTML = response.data.daily[0].condition.description;
    
    let windSpeed = document.querySelector("#day0-wind");
    windSpeed.innerHTML = response.data.daily[0].wind.speed + " m/s";
    let windSpeed1 = document.querySelector("#day1-wind");
    windSpeed1.innerHTML = response.data.daily[1].wind.speed + " m/s";
    let windSpeed2 = document.querySelector("#day2-wind");
    windSpeed2.innerHTML = response.data.daily[2].wind.speed + " m/s";
    
    let icon1 = document.querySelector("#day1-icon");
    SetVisualByStatus(response.data.daily[1].condition.description, icon1);
    let icon2 = document.querySelector("#day2-icon");
    SetVisualByStatus(response.data.daily[2].condition.description, icon2);

    let icon = document.querySelector("#day0-icon");
    SetVisualByStatus(response.data.daily[0].condition.description, icon);

    document.querySelector("#spinner").style.visibility = 'hidden';
    console.log("show it");
}

let bodyElement = document.querySelector("body");

function SetVisualByStatus(status, element) {

    let category = status.toLowerCase();
    console.log(category);
    if (category.includes("rain")) {
        category = "rain";
    }
    else if(category.includes("clouds"))
    {
        category = "clouds";
    }

    switch (category) {
        case "thunderstorm":
            allTempElements.forEach(function (item) {
                item.style.color = "#C2B280";
            });
            bodyElement.classList.add("thunderBG");
            element.className = "bi bi-cloud-lightning-rain-fill";
            break;
        case "mist":
            allTempElements.forEach(function (item) {
                item.style.color = "#C2B280";
            });
            bodyElement.classList.add("cloudyBG");
            element.className = "bi bi-cloud-haze-fill";
            break;
        case "rain":
            allTempElements.forEach(function (item) {
                item.style.color = "#B0B0B0";
            });
            bodyElement.classList.add("rainBG");
            element.className = "bi bi-cloud-rain-fill";
            break;
        case "snow":
            allTempElements.forEach(function (item) {
                item.style.color = "#BCD4E6";
            });
            bodyElement.classList.add("snowBG");
            element.className = "bi bi-cloud-snow-fill";
            break;
        case "clear sky":
            bodyElement.className = "body";
            allTempElements.forEach(function (item) {
                item.style.color = "#FFD966";
            });
            element.className = "bi bi-sun-fill";
            break;
        case "clouds":
            allTempElements.forEach(function (item) {
                item.style.color = "#c9e1e6";
            });
            bodyElement.classList.add("cloudyBG");
            element.className = "bi bi-clouds-fill";
            break;
        default:
            bodyElement.className = "body";
            allTempElements.forEach(function (item) {
                item.style.color = "#FFD966";
            });
            element.className = "bi bi-cloud-sun-fill";
    }
}

// day thing
function FindNextDay(currentDayNum) {
    let x = currentDayNum + 2;
    let y = 0;
    if (x > 6) {
        y = 6 - currentDayNum;
        return 1 - y;
    } else {
        return x;
    }
}

// get time based on city
function GetCurrentTime(city) {
    let finalUrl = "https://api.api-ninjas.com/v1/worldtime?city=";
    finalUrl = finalUrl+""+city;
    
    axios.get(finalUrl, {
        headers: {
            'X-Api-Key': ninjaApiKey
        }
    }).then(ChangeTime).catch((error) => {
        console.error({error});
    });
}

function ChangeTime(response) {
    // set time of now
    let day0 = document.querySelector("#day0");
    day0.innerHTML = response.data.hour + ":" + response.data.minute + "<br/>Now";
}

let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let now = new Date();

// set time of start place
GetCurrentTime("Bangkok");

// set start place
ShowForecast("Bangkok");

// set days on card
let nextDay = weekday[FindNextDay(now.getDay())];
let day2 = document.querySelector("#day2");
day2.innerHTML = "<br />" + nextDay;

// form
let firstForm = document.querySelector("#city-name-form");
firstForm.addEventListener("submit", SearchForTemp);

// get temp at current location
let getCurrentLocTempButton = document.querySelector("#current-loc-button");
getCurrentLocTempButton.addEventListener("click", ShowTempOfCurrentLocation);

// main card
let mainCard = document.querySelector("#main-card");
let day0Elements = document.querySelectorAll(".day0");

function MainCardHover() {
    day0Elements.forEach(Day0ItemsHover);
}

function Day0ItemsHover(item) {
    item.classList.add("main-card-hover");
}

function MainCardExit() {
    //mainCard.classList.remove("main-card-hover");
    day0Elements.forEach(Day0ItemsExit);
}

function Day0ItemsExit(item) {
    item.classList.remove("main-card-hover");
}

mainCard.addEventListener("mouseover", MainCardHover);
mainCard.addEventListener("mouseout", MainCardExit);

function AddListenerToAllTempElements(item) {
    item.addEventListener("click", SwtichTempUnit);
}

