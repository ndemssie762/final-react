import { useState } from "react";
import Search from "./components/search/search";
import CurrentWeather from "./components/current-weather/current-weather";
import Forecast from "./components/forecast/forecast";
import { WEATHER_API_URL, WEATHER_API_KEY } from "./api";
import "./App.css";

function App() {
  const [currentWeather, setCurrentWeather] = useState(null);
  const [forecast, setForecast] = useState(null);

  const handleOnSearchChange = (searchData) => {
    const [lat, lon] = searchData.value.split(" ");

    const currentWeatherFetch = fetch(
      `${WEATHER_API_URL}/weather?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );
    const forecastFetch = fetch(
      `${WEATHER_API_URL}/forecast?lat=${lat}&lon=${lon}&appid=${WEATHER_API_KEY}&units=imperial`
    );

    Promise.all([currentWeatherFetch, forecastFetch])
      .then(async (responses) => {
        const [weatherResponse, forecastResponse] = await Promise.all(responses.map(response => response.json()));

        if (weatherResponse && forecastResponse) {
          setCurrentWeather({ city: searchData.label, ...weatherResponse });
          setForecast({ city: searchData.label, ...forecastResponse });
        } else {
          console.error("Unexpected response format");
        }
      })
      .catch(error => {
        console.error("Error fetching data:", error);
      });
  };

  return (
    <div className="container">
      <header>
        <h1>Welcome to My Weather App</h1>
      </header>
      <Search onSearchChange={handleOnSearchChange} />
      {currentWeather && <CurrentWeather data={currentWeather} />}
      {forecast && <Forecast data={forecast} />}
      <footer>
        <p>&copy; Nathan Demssie 2024</p>
      </footer>
    </div>
  );
}

export default App;
