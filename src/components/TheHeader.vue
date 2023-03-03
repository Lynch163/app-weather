<template>
  <nav>
    <router-link to="/" v-if="isVisibleLink !== '/'"
      >Вернуться на главную</router-link
    >
    <router-link to="/todayWeather" v-if="isVisibleLink !== '/todayWeather'"
      >Погода на сегодня</router-link
    >
    <router-link
      to="/fiveDaysWeather"
      v-if="isVisibleLink !== '/fiveDaysWeather'"
      >Погода на 5 дней</router-link
    >
  </nav>
</template>

<script>
export default {
  name: "AppHeader",
  computed: {
    isVisibleLink() {
      return this.$route.path;
    },
  },
};
</script>
