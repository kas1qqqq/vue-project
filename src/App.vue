<script lang="ts" setup>
import { RouterLink, RouterView } from "vue-router";

import Greeting from "./components/Greeting.vue";
</script>

<template>
  <header>
    <div class="wrapper">
      <div class="wrapper-nav">
        <nav>
          <RouterLink class="nav" to="/">Home</RouterLink>
          <img
            alt="Vue logo"
            class="logo"
            src="@/assets/images/logo.svg"
            width="50"
            height="50"
          />
          <RouterLink class="nav" to="/map">Map</RouterLink>
        </nav>
      </div>
      <Greeting msg="ue 3 Project" />
    </div>
  </header>

  <RouterView />
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
}

.wrapper {
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo {
  display: block;
  margin-left: 0.3rem;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.8rem;
}

nav a.router-link-exact-active {
  color: var(--color-text);
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a.router-link-inactive {
  background-color: red;
}

nav a {
  display: inline-block;
  padding: 0.5rem 0.5rem;
  margin-right: -0.7rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

nav a:first-of-type {
  border: 0;
}
</style>
