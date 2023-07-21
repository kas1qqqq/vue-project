import { defineStore } from "pinia";
import { ref } from "vue";

export const useAuthStore = defineStore("auth", () => {
  const username = ref<string>("");

  const setUsername = (newUsername: string) => (username.value = newUsername);

  const clearUsername = () => (username.value = "");

  return { username, setUsername, clearUsername };
});
