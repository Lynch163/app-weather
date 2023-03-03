import { createRouter, createWebHistory } from "vue-router";

import mainPage from "@/views/MainPage.vue";
import today from "@/views/TodayWeather.vue";
import fiveDays from "@/views/FiveDaysWeather.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "mainPage", component: mainPage },
    {
      path: "/todayWeather",
      name: "todayWeather",
      component: today,
    },
    {
      path: "/fiveDaysWeather",
      name: "fiveDaysWeather",
      component: fiveDays,
    },
    { path: "/:notFound(.*)", component: mainPage },
  ],
});

export default router;
