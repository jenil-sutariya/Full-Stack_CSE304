const weatherData = {
  Ahmedabad: '40°C',
  Mumbai: '33°C',
  Delhi: '37°C',
  Bangalore: '30°C',
  Chennai: '35°C'
};

document.getElementById('getWeatherBtn').addEventListener('click', () => {
  const city = document.getElementById('cityInput').value.trim();
  const output = document.getElementById('weatherOutput');

  if (weatherData[city]) {
    output.textContent = `The weather in ${city} is ${weatherData[city]}`;
  } else {
    output.textContent = `Weather data for "${city}" not found.`;
  }
});
