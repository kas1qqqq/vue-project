<script lang="ts" setup>
import { RouterLink, RouterView } from "vue-router"

import Greeting from "@/components/Greeting.vue"
import { useAuthStore } from "@/stores/auth"

// pinia store
const authStore = useAuthStore()
</script>

<template>
  <header>
    <div class="wrapper">
      <div>
        <nav>
          <RouterLink class="nav" to="/">Home</RouterLink>
          <img
            alt="Vue logo"
            class="logo"
            src="@/assets/images/logo.svg"
            width="60"
            height="60"
          />
          <div class="sublinkWrapper">
            <RouterLink class="nav" to="/map">Map</RouterLink>
            <div>|</div>
            <RouterLink class="nav" to="/auth">Quiz</RouterLink>
          </div>
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
  margin: 0 auto;
}

.sublinkWrapper {
  display: flex;
  align-items: center;
  color: #e3e3e3;
}

nav {
  width: 100%;
  font-size: 1rem;
  text-align: center;
  margin-bottom: 1.8rem;
  user-select: none;
}

nav a.router-link-exact-active {
  color: #a1a1a1;
}

nav a.router-link-exact-active:hover {
  background-color: transparent;
}

nav a {
  display: inline-block;
  padding: 0.5rem;
  margin: 0.5rem;
  border-radius: 0.2rem;
}

nav a:first-of-type {
  border: 0;
}
</style>
