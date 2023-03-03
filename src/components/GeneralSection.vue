<template>
  <section class="main_section">
    <template v-if="isEnteredCity">
      <ul v-if="isGettingCities && !isHaveTheWeather">
        <li v-for="city in formData.cities" :key="city.id">
          <span @click="setWeather(city)">
            {{ city.cityName }}
          </span>
        </li>
      </ul>
      <template v-else-if="isHaveTheWeather">
        <slot></slot>
      </template>
    </template>
    <p v-else class="not_city_p">Введите город, чтобы узнать погоду.</p>
  </section>
</template>

<script>
export default {
  name: "GeneralSection",
  props: {
    formData: {
      type: Object,
      required: true,
    },
    theWeather: {
      type: Object,
      required: true,
    },
  },
  emits: ["set-weather"],
  methods: {
    setWeather(city) {
      this.$emit("set-weather", city);
    },
  },
  computed: {
    /**
     * Приводит к булевому значению переменную enteredCity
     * @return {Boolean}
     */
    isEnteredCity() {
      return Boolean(this.formData.enteredCity);
    },
    /**
     * Приводит к булевому значению результат вычисления координат
     * @return {Boolean}
     */
    isGettingCities() {
      return Boolean(this.formData.cities.length);
    },

    isHaveTheWeather() {
      return Boolean(this.theWeather.city);
    },
  },
};
</script>
