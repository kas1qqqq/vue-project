import { createRouter, createWebHashHistory } from "vue-router"

import HomeView from "@/views/HomeView.vue"
import MapView from "@/views/MapView.vue"
import Auth from "@/components/Auth.vue"
import Quiz from "@/components/Quiz.vue"
import NotFound from "@/components/NotFound.vue"

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
      path: "/auth",
      name: "auth",
      component: Auth,
    },
    {
      path: "/quiz",
      name: "quiz",
      component: Quiz,
    },
    {
      path: "/:catchAll(.*)",
      name: "notFound",
      component: NotFound,
    },
  ],
})

export default router
