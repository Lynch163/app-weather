function Weather(axios) {
  return {
    getWeather(latitude, longitude) {
      return axios.get(
        `weather?lat=${latitude}&lon=${longitude}&appid=bd3eb293903c08cfd12c3dc9206bc32a&lang=ru&units=metric`
      );
    },
    getWeatherFiveDays(latitude, longitude) {
      return axios.get(
        `forecast?lat=${latitude}&lon=${longitude}&appid=bd3eb293903c08cfd12c3dc9206bc32a&lang=ru&units=metric`
      );
    },
  };
}

export default Weather;
