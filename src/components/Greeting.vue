<script lang="ts" setup>
import { useAuthStore } from "../stores/auth";

defineProps({
  msg: {
    type: String,
    required: true,
  },
});

// store
const authStore = useAuthStore();
</script>

<template>
  <h1 class="green">{{ msg }}</h1>

  <router-link v-if="!authStore.username" to="/auth/signin" class="signInLink"
    >Sign In</router-link
  >

  <p v-if="authStore.username" class="username">
    {{ authStore.username }}
  </p>

  <a
    v-if="authStore.username"
    @click="authStore.clearUsername()"
    class="signInLink btn"
  >
    Sign Out
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

.signInLink {
  position: absolute;
  top: 0;
  right: 0;
  display: inline-block;
  padding: 0.5rem 0.5rem;
  margin-right: -0.7rem;
  border-radius: 0.2rem;
  margin-top: 0.5rem;
  margin-bottom: 0.5rem;
}

.btn {
  font-size: 0.9rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: transparent;
  box-shadow: 0px 0px 0.2rem rgb(31, 31, 31, 0);
  color: hsla(160, 75%, 37%, 1);
  transition: 0.3s ease-out;
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-in-out;
  background-color: #fff0f0;
  color: #dc362e;
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}

.username {
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
  color: var(--color-text);
}

@media (max-width: 480px) {
  .username {
    display: none;
  }
}
</style>
