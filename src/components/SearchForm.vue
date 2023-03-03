<template>
  <form @submit.prevent="submitCity">
    <label for="city">Город:</label>
    <input type="text" id="city" required v-model.trim="enteredCity" />
    <base-button
      v-if="!formData.coordinates.latitude && !formData.coordinates.longitude"
      >Найти</base-button
    >
    <base-button type="button" @click="clearData" v-else>Очистить</base-button>
  </form>
</template>

<script>
import BaseButton from "@/components/common/BaseButton.vue";

export default {
  name: "FormSearch",
  components: { BaseButton },
  props: {
    formData: {
      type: Object,
      required: true,
    },
  },
  emits: ["entry-city", "back-to-default-state"],
  data() {
    return {
      enteredCity: "",
    };
  },
  methods: {
    /**Отправляет название города в родительский компонент */
    submitCity() {
      this.$emit("entry-city", this.enteredCity);
    },

    /** Отправляет дефолтный объект formData в родительский компонент */
    clearData() {
      this.enteredCity = "";
      const { formData } = {
        formData: {
          enteredCity: "",
          cities: [],
          coordinates: {
            latitude: null,
            longitude: null,
          },
        },
      };
      const theWeather = { theWeather: {} };
      this.$emit("back-to-default-state", { formData, theWeather });
    },
  },
};
</script>
