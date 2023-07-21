import { createRouter, createWebHashHistory } from "vue-router";

import HomeView from "../views/HomeView.vue";
import MapView from "../views/MapView.vue";
import SignIn from "../components/SignIn.vue";

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "home",
      component: HomeView,
    },
    {
      path: "/map",
      name: "map",
      component: MapView,
    },
    {
      path: "/auth/signin",
      name: "signin",
      component: SignIn,
    },
  ],
});

export default router;
