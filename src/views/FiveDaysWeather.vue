<template>
  <h2>Введите город чтобы узнать погоду на пять дней!</h2>

  <form-search
    :formData="formData"
    @entry-city="setCity"
    @back-to-default-state="
      (formData = $event.formData) && (theWeather = $event.theWeather)
    "
  />

  <general-section
    :formData="formData"
    :theWeather="theWeather"
    @set-weather="setWeather"
  >
    <section
      v-for="day in theWeather.days"
      :key="day.dt"
      :class="backgroundWeatherBlock(day)"
    >
      <h2>{{ theWeather.city }}</h2>
      <h3>{{ day.dt_txt }}</h3>
      <h3>{{ day.main.temp }}°C</h3>
      <p>За окном: {{ day.weather[0].description }}</p>
      <p>Ощущается как: {{ day.main.feels_like }}°C</p>
      <p>Температурный минимум: {{ day.main.temp_min }}°C</p>
      <p>Температурный максимум: {{ day.main.temp_min }}°C</p>
      <p>Влажность: {{ day.main.humidity }}%</p>
      <p>Видимость: {{ day.visibility }}м</p>
      <p>Ветер: {{ day.wind.gust }}м/с</p>
    </section>
  </general-section>
</template>

<script>
/** Библиотеки */
import { v4 as uuidv4 } from "uuid";

/** Запросы */
import api from "@/services/index.js";

/** Константы */
import { backgroundList } from "@/constants";

/** Компоненты */
import FormSearch from "@/components/SearchForm.vue";
import GeneralSection from "@/components/GeneralSection.vue";

export default {
  name: "FiveDaysWeather",
  components: { FormSearch, GeneralSection },
  data() {
    return {
      formData: {
        /** Название населенного пункта, введенного пользователем */
        enteredCity: "",
        /** Города */
        cities: [],
        /** Координаты */
        coordinates: {
          latitude: null,
          longitude: null,
        },
      },
      /** Данные погоды */
      theWeather: {},
    };
  },
  methods: {
    /**
     * Добавляет координаты населенного пункта
     * @async
     */
    async setCity(childValue) {
      try {
        if (!childValue) {
          throw new Error("Город не получен");
        } else {
          this.formData.enteredCity = childValue;
        }
        const { data } = await api.getCity(this.formData.enteredCity);
        this.formData.cities = (
          data?.response?.GeoObjectCollection?.featureMember ?? []
        ).reduce((arr, city) => {
          const geoObject = city?.GeoObject;
          if (geoObject) {
            const dataCity = {};
            dataCity.id = uuidv4();
            if (geoObject.Point?.pos) {
              dataCity.position = geoObject.Point.pos;
            }
            if (geoObject.metaDataProperty?.GeocoderMetaData?.text) {
              dataCity.cityName =
                geoObject.metaDataProperty.GeocoderMetaData.text;
            }
            arr.push(dataCity);
            return arr;
          }
        }, []);
      } catch (err) {
        console.error(err);
      }
    },
    /**
     * Добавляет данные о погоде
     * @async
     * @param {Object} item - объект с данными о выбранном городе
     */
    async setWeather(item) {
      const itemCoords = item.position.split(" ").reverse() ?? [];
      if (itemCoords.length) {
        this.formData.coordinates.latitude = itemCoords[0];
        this.formData.coordinates.longitude = itemCoords[1];
      }
      try {
        if (
          this.formData.coordinates.latitude &&
          this.formData.coordinates.longitude
        ) {
          const { data } = await api.getWeatherFiveDays(
            this.formData.coordinates.latitude,
            this.formData.coordinates.longitude
          );

          if (data) {
            const sortedDays = data.list?.filter((item) => {
              return item.dt_txt?.slice(11) === "12:00:00";
            });
            if (!sortedDays) {
              throw new Error("Не удалось отфильтровать погоду на 5 дней");
            }
            this.theWeather = {
              days: sortedDays ?? "Массив погоды не получен",
              city: data.city?.name ?? "Город не определен",
            };
          } else {
            throw new Error("Произошла ошибка на стороне сервера");
          }
        } else {
          throw new Error("Отсутствуют координаты города.");
        }
      } catch (err) {
        console.error(err);
      }
    },
    // /**
    //  * Значение для фона блока погоды
    //  * @return {String} Возвращает строковое значение
    //  */
    backgroundWeatherBlock(day) {
      if (day) {
        const sub = day.weather[0].description;
        return backgroundList.get(sub);
      } else return "";
    },
  },

  computed: {},
};
</script>
