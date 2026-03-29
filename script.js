const API_KEY = "a234b81284aafc22e3e03a417e02d21f";

async function getWeather() {
  const city = document.getElementById("city").value.trim();
  const result = document.getElementById("result");
  const loading = document.getElementById("loading");

  if (city === "") {
    alert("Please enter a city name");
    return;
  }


  loading.classList.remove("hidden");
  result.innerHTML = "";

  try {

    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );

    const data = await response.json();

    console.log(data); 


    if (data.cod == 404) {
      result.innerHTML = `<p>❌ City not found</p>`;
    } else if (data.cod == 401) {
      result.innerHTML = `<p>❌ Invalid API Key</p>`;
    } else {

      result.innerHTML = `
        <h2>${data.name}</h2>
        <p>🌡️ Temperature: ${data.main.temp} °C</p>
        <p>☁️ Weather: ${data.weather[0].main}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
        <p>🌬️ Wind Speed: ${data.wind.speed} m/s</p>
      `;
    }

  } catch (error) {
    result.innerHTML = `<p>⚠️ Error fetching data</p>`;
  }


  loading.classList.add("hidden");
}