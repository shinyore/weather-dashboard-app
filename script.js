const API_KEY = "a234b81284aafc22e3e03a417e02d21f";

let unit = "metric";
let lastCity = "";


let favorites = JSON.parse(localStorage.getItem("favorites")) || [];


let history = JSON.parse(localStorage.getItem("history")) || [];


document.getElementById("city").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    getWeather();
  }
});


async function getWeather() {
  const city = document.getElementById("city").value.trim();

  if (city === "") {
    alert("Enter city name");
    return;
  }

  lastCity = city;


  saveSearch(city);

  const result = document.getElementById("result");
  result.innerHTML = "⏳ Loading...";

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=${unit}`
    );

    const data = await response.json();

    if (data.cod == "404") {
      result.innerHTML = "❌ City not found";
      return;
    }

    if (data.cod == "401") {
      result.innerHTML = "❌ Invalid API key";
      return;
    }

    displayWeather(data);

  } catch (error) {
    result.innerHTML = "❌ Error fetching data";
  }
}


function displayWeather(data) {
  const result = document.getElementById("result");

  result.innerHTML = `
    <h2>${data.name}</h2>
    <button onclick="addFavorite('${data.name}')">⭐ Add to Favorite</button>

    <p>🌡️ Temp: ${data.main.temp} ${unit === "metric" ? "°C" : "°F"}</p>
    <p>🤔 Feels Like: ${data.main.feels_like} ${unit === "metric" ? "°C" : "°F"}</p>
    <p>☁️ Weather: ${data.weather[0].main}</p>
    <p>💧 Humidity: ${data.main.humidity}%</p>
    <p>🌬️ Wind: ${data.wind.speed} m/s</p>
  `;
}


function addFavorite(city) {
  if (!favorites.includes(city)) {
    favorites.push(city);
    localStorage.setItem("favorites", JSON.stringify(favorites));
    displayFavorites();
  } else {
    alert("Already added");
  }
}

function displayFavorites() {
  const favDiv = document.getElementById("favorites");

  favDiv.innerHTML = favorites
    .map(
      (city, index) => `
      <p>
        ⭐ <span onclick="searchFromFavorite('${city}')">${city}</span>
        ❌ <button onclick="removeFavorite(${index})">X</button>
      </p>
    `
    )
    .join("");
}

function removeFavorite(index) {
  favorites.splice(index, 1);
  localStorage.setItem("favorites", JSON.stringify(favorites));
  displayFavorites();
}

function searchFromFavorite(city) {
  document.getElementById("city").value = city;
  getWeather();
}



function saveSearch(city) {
  if (!history.includes(city)) {
    history.unshift(city);


    history = history.slice(0, 5);

    localStorage.setItem("history", JSON.stringify(history));
    displayHistory();
  }
}

function displayHistory() {
  const historyDiv = document.getElementById("history");

  historyDiv.innerHTML = history
    .map(
      (city) => `
      <p onclick="searchFromHistory('${city}')">
        🔍 ${city}
      </p>
    `
    )
    .join("");
}

function searchFromHistory(city) {
  document.getElementById("city").value = city;
  getWeather();
}


function toggleTheme() {
  document.body.classList.toggle("dark");
}

function toggleUnit() {
  unit = unit === "metric" ? "imperial" : "metric";

  if (lastCity !== "") {
    document.getElementById("city").value = lastCity;
    getWeather();
  }
}


displayFavorites();
displayHistory();