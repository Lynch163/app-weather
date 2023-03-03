/** Библиотеки */
import axios from "axios";

import Geocoder from "./geocoder.js";
import Weather from "./weather.js";

const geocoderAxiosInstance = axios.create({
  baseURL: `https://geocode-maps.yandex.ru/`,
});

const weatherAxiosInstance = axios.create({
  baseURL: "https://api.openweathermap.org/data/2.5/",
});

const api = {
  ...Geocoder(geocoderAxiosInstance),
  ...Weather(weatherAxiosInstance),
};

export default api;
