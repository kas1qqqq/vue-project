<script lang="ts" setup>
import { useAuthStore } from "@/stores/auth"

// store
const authStore = useAuthStore()
</script>

<template>
  <p v-if="authStore.username" class="username">
    <img
      src="../assets/images/firebase-logo.svg"
      width="30"
      height="30"
      alt="Firebase logo"
    />
    {{ authStore.username }}
  </p>

  <a
    v-if="authStore.username"
    @click="authStore.clearUsername"
    class="authLink"
  >
    Exit
  </a>
</template>

<style scoped>
h1 {
  font-weight: bold;
  font-size: 2.6rem;
  top: -0.5rem;
  user-select: none;
}

button {
  font-size: 1rem;
  padding: 0.5rem 1rem;
  background-color: #2f2f2f;
  border-radius: 0.2rem;
  border: 0;
  color: #41b883;
  cursor: pointer;
}

.authLink {
  position: absolute;
  top: 0;
  right: 0;
  color: #41b883;
  display: inline-block;
  padding: 0.5rem 0.5rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  cursor: pointer;
}

.authLink:hover {
  transition: 0.1s ease-in-out;
  background-color: #fff0f0;
  color: #dc362e !important;
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}

.username {
  display: flex;
  align-items: center;
  font-size: 1rem;
  font-weight: bold;
  position: absolute;
  top: 0;
  left: 0;
  padding: 0.5rem 0.5rem;
  margin-right: -0.7rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
  color: #aae9cd;
  margin-left: -0.5rem;
}

a.router-link-exact-active {
  color: #a1a1a1;
}
</style>
