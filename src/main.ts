import { createApp } from "vue";
import { createPinia } from "pinia";
import { VueFire, VueFireAuth } from "vuefire";

import { firebaseApp } from "./firebase/index";
import App from "./App.vue";
import router from "./router";

import "./assets/css/main.css";

const pinia = createPinia();
const app = createApp(App);

app.use(router);
app.use(pinia);
app.use(VueFire, {
  firebaseApp,
  modules: [
    // ... other modules
    VueFireAuth(),
  ],
});

app.mount("#app");
