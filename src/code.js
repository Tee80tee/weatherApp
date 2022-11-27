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
let apiKey = "97bed167ec49bff56e6c1b63daef9c86";
let apiUrl = "https://api.openweathermap.org/data/2.5/weather?";

function ShowTempOfCurrentLocation(){
    let finalUrl = `${apiUrl}lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;

    axios.get(finalUrl).then(ChangeCity).catch((error) => {
        console.error({error});
    });
}

function SearchForTemp(event) {
    event.preventDefault();
    let firstFormInput = document.querySelector("#city-name-input");

    let finalUrl = apiUrl + "q=" + firstFormInput.value + "&appid=" + apiKey + "&units=metric";
    return axios.get(finalUrl).then(ChangeCity).catch((error) => {
        console.error({error});
    });
}

function ChangeCity(response) {
    console.log(response);
    // set everything to cel unit first
    currentUnit = "fah";
    SwtichTempUnit();
    
    let cityNameElement = document.querySelector("#current-city");
    cityNameElement.innerHTML = response.data.name;
    let currentTempElement = document.querySelector("#day0-temp");
    let responseTemp = response.data.main.temp;
    currentTempElement.innerHTML = Math.round(responseTemp) + "°C";
    
    let currentCountry = document.querySelector("#current-country");
    currentCountry.innerHTML = regionNames.of(response.data.sys.country);
    let weatherStatus = document.querySelector("#weather-status");
    weatherStatus.innerHTML = response.data.weather[0].description;
    let icon = document.querySelector("#day0-icon");
    SetIcon(response.data.weather[0].main, icon);
}

function SetIcon(status, element) {
    
    switch (status)
    {
        case "Thunderstorm":
            element.className = "bi bi-cloud-lightning-rain-fill";
            break;
        case "Drizzle":
            element.className = "bi bi-cloud-drizzle-fill";
            break;
        case "Rain":
            element.className = "bi bi-cloud-rain-fill";
            break;
        case "Snow":
            element.className = "bi bi-cloud-snow-fill";
            break;
        case "Clear":
            element.className = "bi bi-sun-fill"; 
            break;
        case "Clouds":
            element.className = "bi bi-clouds-fill";
            break;
        case "Fog":
            element.className = "bi bi-cloud-fog2-fill";
            break;
        default:
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

let weekday = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
let now = new Date();

// set time of now
let day0 = document.querySelector("#day0");
day0.innerHTML = now.getUTCHours() + ":" + now.getUTCMinutes() + "<br/>Now";

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

  

