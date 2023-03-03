<template>
  <h2>Введите город чтобы узнать погоду на сегодня!</h2>
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
    <section :class="backgroundWeatherBlock">
      <h2>{{ theWeather.city }}</h2>
      <h3>{{ theWeather.temperature }}°C</h3>
      <p>За окном: {{ theWeather.description }}</p>
      <p>Ощущается как: {{ theWeather.feels_like }}°C</p>
      <p>Температурный минимум: {{ theWeather.min }}°C</p>
      <p>Температурный максимум: {{ theWeather.max }}°C</p>
      <p>Влажность: {{ theWeather.humidity }}%</p>
      <p>Видимость: {{ theWeather.visibility }}м</p>
      <p>Ветер: {{ theWeather.gust }}м/с</p>
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
  name: "TodayWeather",
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
          const { data } = await api.getWeather(
            this.formData.coordinates.latitude,
            this.formData.coordinates.longitude
          );

          if (data) {
            this.theWeather = {
              city: data.name ?? "Город не определен",
              temperature: data.main?.temp ?? "Температура не определена",
              description:
                data.weather[0]?.description ?? "Описание не найдено",
              feels_like: data.main?.feels_like ?? "Температура не определена",
              min: data.main?.temp_min ?? "Температура не определена",
              max: data.main?.temp_max ?? "Температура не определена",
              humidity: data.main?.humidity ?? "Влажность не определена",
              visibility: data.visibility ?? "Видимость не определена",
              gust: data.wind?.gust ?? "Скорость ветра не определена",
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
  },

  computed: {
    /**
     * Значение для фона блока погоды
     * @return {String} Возвращает строковое значение
     */
    backgroundWeatherBlock() {
      if (this.theWeather.description) {
        return backgroundList.get(this.theWeather.description);
      } else return "";
    },
  },
};
</script>
