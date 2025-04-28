const API_KEY = "58b7b4afb23fd8be3d1fdca30ff7105b";
const weatherResult = document.getElementById("weatherResult");
const cityInput = document.getElementById("cityInput");
const searchList = document.getElementById("searchList");

let recentSearches = JSON.parse(localStorage.getItem("recentSearches")) || [];

function displayRecentSearches() {
  searchList.innerHTML = "";
  recentSearches.forEach(city => {
    const li = document.createElement("li");
    li.textContent = city;
    li.onclick = () => {
      cityInput.value = city;
      fetchWeather();
    };
    searchList.appendChild(li);
  });
}

async function fetchWeather() {
  const city = cityInput.value.trim();
  if (!city) {
    weatherResult.innerHTML = "<p>Please enter a city name.</p>";
    return;
  }

  try {
    const response = await fetch(
      `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${API_KEY}&units=metric`
    );
    if (!response.ok) throw new Error("City not found");
    const data = await response.json();

    weatherResult.innerHTML = `
      <h2>${data.name}</h2>
      <p>Temperature: ${data.main.temp}°C</p>
      <p>Humidity: ${data.main.humidity}%</p>
      <p>Weather: ${data.weather[0].description}</p>
    `;

    if (!recentSearches.includes(city)) {
      recentSearches.unshift(city);
      if (recentSearches.length > 5) recentSearches.pop();
      localStorage.setItem("recentSearches", JSON.stringify(recentSearches));
      displayRecentSearches();
    }
  } catch (error) {
    weatherResult.innerHTML = `<p>Error: ${error.message}</p>`;
  }
}

window.fetchWeather = fetchWeather;

displayRecentSearches();