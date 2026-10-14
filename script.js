const darkModeToggle = document.getElementById("darkModeToggle");
const historyList = document.getElementById("historyList");
const forecastList = document.getElementById("forecastList");
const hourlyList = document.getElementById("hourlyList");
const clearHistoryBtn = document.getElementById("clearHistoryBtn");
let searchedCities = JSON.parse(
    localStorage.getItem("searchedCities")
) || [];


function getWeatherInfo(code) {
    if (code === 0) {
        return { icon: "☀️", description: "Clear sky" };
    }

    if (code === 1) {
        return { icon: "🌤️", description: "Mainly clear" };
    }

    if (code === 2) {
        return { icon: "⛅", description: "Partly cloudy" };
    }

    if (code === 3) {
        return { icon: "☁️", description: "Overcast" };
    }

    if ([45, 48].includes(code)) {
        return { icon: "🌫️", description: "Foggy" };
    }

    if ([51, 53, 55, 56, 57].includes(code)) {
        return { icon: "🌦️", description: "Drizzle" };
    }

    if ([61, 63, 65, 66, 67, 80, 81, 82].includes(code)) {
        return { icon: "🌧️", description: "Rainy" };
    }

    if ([71, 73, 75, 77, 85, 86].includes(code)) {
        return { icon: "🌨️", description: "Snow" };
    }

    if ([95, 96, 99].includes(code)) {
        return { icon: "⛈️", description: "Thunderstorm" };
    }

    return { icon: "🌡️", description: "Weather unavailable" };
}

function updateHistory(city) {
    if (searchedCities.includes(city)) {
        return;
    }

    searchedCities.push(city);

    localStorage.setItem(
        "searchedCities",
        JSON.stringify(searchedCities)
    );

    displayCityButton(city);
}

function displayCityButton(city) {
    const cityButton = document.createElement("button");
    cityButton.textContent = city;

    cityButton.addEventListener("click", function () {
        cityInput.value = city;
        searchBtn.click();
    });

    historyList.appendChild(cityButton);
}


searchedCities.forEach(function (city) {
    updateHistory(city);
});

const searchBtn = document.getElementById("searchBtn");
const cityInput = document.getElementById("cityInput");
const unitToggle = document.getElementById("unitToggle");
const locationBtn = document.getElementById("locationBtn");
let temperatureUnit = "celsius";

searchBtn.addEventListener("click", function () {
    const city = cityInput.value.trim();

    if (city === "") {
        document.getElementById("cityName").textContent =
            "Please enter a city name.";
        return;
    }

    document.getElementById("cityName").textContent = "Loading...";
    document.getElementById("temperature").textContent = "";
    document.getElementById("humidity").textContent = "Humidity: --";
    document.getElementById("wind-speed").textContent = "Wind speed: --";
    document.getElementById("description").textContent = "";

    // Step 1: Find the city's coordinates
    fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1&language=en&format=json`)
        .then(response => response.json())
        .then(locationData => {
            if (!locationData.results || locationData.results.length === 0) {
                document.getElementById("cityName").textContent =
                    "City not found. Try another name.";
                return;
            }

            const location = locationData.results[0];
            const latitude = location.latitude;
            const longitude = location.longitude;

            // Step 2: Get weather for that city's coordinates
            
              return fetch(
                 `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=${temperatureUnit}`
                )

                .then(response => response.json())
                .then(weatherData => {
                    const temperature =
                        weatherData.current.temperature_2m;

                    const weatherCode =
                        weatherData.current.weather_code;
                    const humidity =
                        weatherData.current.relative_humidity_2m;

                    const windSpeed =
                        weatherData.current.wind_speed_10m; 
                        const weatherIcon = document.getElementById("weatherIcon");

if (weatherCode === 0) {
    weatherIcon.textContent = "☀️";
} else if ([1, 2, 3].includes(weatherCode)) {
    weatherIcon.textContent = "🌤️";
} else if ([45, 48].includes(weatherCode)) {
    weatherIcon.textContent = "🌫️";
} else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
    weatherIcon.textContent = "🌦️";
} else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
    weatherIcon.textContent = "🌧️";
} else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
    weatherIcon.textContent = "❄️";
} else if ([95, 96, 99].includes(weatherCode)) {
    weatherIcon.textContent = "⛈️";
} else {
    weatherIcon.textContent = "🌡️";
}

                    document.getElementById("cityName").textContent =
                        location.name;

                    document.getElementById("temperature").textContent =
                         temperature + (temperatureUnit === "celsius" ? "°C" : "°F");

                        document.getElementById("humidity").textContent =
                       "Humidity: " + humidity + "%";

                    document.getElementById("wind-speed").textContent =
                        "Wind speed: " + windSpeed + " km/h";

                    let description;

                    if (weatherCode === 0) {
                        description = "Clear sky";
                    } else if ([1, 2, 3].includes(weatherCode)) {
                        description = "Partly cloudy or overcast";
                    } else if ([45, 48].includes(weatherCode)) {
                        description = "Foggy";
                    } else if ([51, 53, 55, 56, 57].includes(weatherCode)) {
                        description = "Drizzle";
                    } else if ([61, 63, 65, 66, 67, 80, 81, 82].includes(weatherCode)) {
                        description = "Rain";
                    } else if ([71, 73, 75, 77, 85, 86].includes(weatherCode)) {
                        description = "Snow";
                    } else if ([95, 96, 99].includes(weatherCode)) {
                        description = "Thunderstorm";
                    } else {
                        description = "Weather conditions unavailable";
                    }

                    document.getElementById("description").textContent =
                        description;
               updateHistory(city);
               

const hourly = weatherData.hourly;
hourlyList.innerHTML = "";

for (let i = 0; i < 8; i++) {
    const hourCard = document.createElement("div");
    hourCard.className = "hour-card";

    const time = new Date(hourly.time[i]);
    const hourName = time.toLocaleTimeString("en-US", {
        hour: "numeric",
        hour12: true
    });

    const info = getWeatherInfo(hourly.weather_code[i]);

    hourCard.innerHTML = `
        <h3>${hourName}</h3>
        <p class="hour-icon">${info.icon}</p>
        <p>${info.description}</p>
        <p>${hourly.temperature_2m[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
    `;

    hourlyList.appendChild(hourCard);
}
               
const daily = weatherData.daily;

forecastList.innerHTML = "";

for (let i = 0; i < daily.time.length; i++) {
    const dayCard = document.createElement("div");
    dayCard.className = "forecast-card";

    const date = new Date(daily.time[i] + "T12:00:00");
    const dayName = date.toLocaleDateString("en-US", {
        weekday: "short"
    });

    
const info = getWeatherInfo(daily.weather_code[i]);

dayCard.innerHTML = `
    <h3>${dayName}</h3>
    <p class="forecast-icon">${info.icon}</p>
    <p>${info.description}</p>
    <p>High: ${daily.temperature_2m_max[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
<p>Low: ${daily.temperature_2m_min[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
`;


    forecastList.appendChild(dayCard);
}

                    });
        })
        .catch(error => {
            console.log("Weather error:", error);
            document.getElementById("cityName").textContent =
                "Could not load weather. Please try again.";
        });
});
searchedCities.forEach(function (city) {
    displayCityButton(city);
});
clearHistoryBtn.addEventListener("click", function () {
    searchedCities = [];

    localStorage.removeItem("searchedCities");

    historyList.innerHTML = "";
});


unitToggle.addEventListener("click", function () {
    temperatureUnit =
        temperatureUnit === "celsius" ? "fahrenheit" : "celsius";

    unitToggle.textContent =
        temperatureUnit === "celsius" ? "Switch to °F" : "Switch to °C";

    if (cityInput.value.trim() !== "") {
        searchBtn.click();
    }
});
darkModeToggle.addEventListener("click", function () {
    document.body.classList.toggle("dark-mode");

    if (document.body.classList.contains("dark-mode")) {
        darkModeToggle.textContent = "☀️ Light Mode";
    } else {
        darkModeToggle.textContent = "🌙 Dark Mode";
    }
});



locationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
        alert("Your browser does not support location services.");
        return;
    }

    locationBtn.textContent = "📍 Finding your location...";

    navigator.geolocation.getCurrentPosition(
        function (position) {
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            
fetch(
    `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`
)
    .then(response => response.json())
    .then(place => {
        
console.log("Location details:", place);

const city =
    place.city ||
    place.locality ||
    place.localityInfo?.administrative?.[2]?.name ||
    place.localityInfo?.administrative?.[1]?.name ||
    place.principalSubdivision ||
    "Your Current Location";

    window.detectedCity = city;


        document.getElementById("cityName").textContent = city;
    })
    .catch(error => {
        console.log("Could not identify your city:", error);
    });


            document.getElementById("cityName").textContent =
                "Loading your local weather...";
            document.getElementById("temperature").textContent = "";
            document.getElementById("humidity").textContent = "Humidity: --";
            document.getElementById("wind-speed").textContent = "Wind speed: --";
            document.getElementById("description").textContent = "";

            fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code,relative_humidity_2m,wind_speed_10m&hourly=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto&temperature_unit=${temperatureUnit}`
            )
                .then(response => {
                    if (!response.ok) {
                        throw new Error("Weather request failed");
                    }
                    return response.json();
                })
                .then(weatherData => {
                    const current = weatherData.current;
                    const info = getWeatherInfo(current.weather_code);

                   document.getElementById("cityName").textContent =
    window.detectedCity || "Your Current Location";

                    document.getElementById("temperature").textContent =
                        current.temperature_2m +
                        (temperatureUnit === "celsius" ? "°C" : "°F");

                    document.getElementById("humidity").textContent =
                        "Humidity: " + current.relative_humidity_2m + "%";

                    document.getElementById("wind-speed").textContent =
                        "Wind speed: " + current.wind_speed_10m + " km/h";

                    document.getElementById("description").textContent =
                        info.description;

                    document.getElementById("weatherIcon").textContent =
                        info.icon;

                    // Show the hourly forecast
                    const hourly = weatherData.hourly;
                    hourlyList.innerHTML = "";

                    for (let i = 0; i < 8; i++) {
                        const hourCard = document.createElement("div");
                        hourCard.className = "hour-card";

                        const time = new Date(hourly.time[i]);
                        const hourName = time.toLocaleTimeString("en-US", {
                            hour: "numeric",
                            hour12: true
                        });

                        const hourInfo = getWeatherInfo(hourly.weather_code[i]);

                        hourCard.innerHTML = `
                            <h3>${hourName}</h3>
                            <p class="hour-icon">${hourInfo.icon}</p>
                            <p>${hourInfo.description}</p>
                            <p>${hourly.temperature_2m[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
                        `;

                        hourlyList.appendChild(hourCard);
                    }

                    // Show the five-day forecast
                    const daily = weatherData.daily;
                    forecastList.innerHTML = "";

                    for (let i = 0; i < daily.time.length; i++) {
                        const dayCard = document.createElement("div");
                        dayCard.className = "forecast-card";

                        const date = new Date(daily.time[i] + "T12:00:00");
                        const dayName = date.toLocaleDateString("en-US", {
                            weekday: "short"
                        });

                        const dayInfo = getWeatherInfo(daily.weather_code[i]);

                        dayCard.innerHTML = `
                            <h3>${dayName}</h3>
                            <p class="forecast-icon">${dayInfo.icon}</p>
                            <p>${dayInfo.description}</p>
                            <p>High: ${daily.temperature_2m_max[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
                            <p>Low: ${daily.temperature_2m_min[i]}${temperatureUnit === "celsius" ? "°C" : "°F"}</p>
                        `;

                        forecastList.appendChild(dayCard);
                    }
                })
                
.catch(error => {
    console.log("Location weather error:", error);
    document.getElementById("cityName").textContent =
        "Could not load local weather. Please try again.";
})
.finally(() => {
    locationBtn.textContent = "📍 Use My Location";
});


            console.log("Latitude:", latitude);
            console.log("Longitude:", longitude);
        },
        function () {
            alert("Location permission was denied or unavailable.");
            locationBtn.textContent = "📍 Use My Location";
        }
    );
});

function updateDateTime() {
    const dateTimeElement = document.getElementById("currentDateTime");

    if (!dateTimeElement) return;

    const now = new Date();

    dateTimeElement.textContent = now.toLocaleString("en-KE", {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
    });
}

updateDateTime();
setInterval(updateDateTime, 60000);
