import { defineStore } from "pinia"
import { ref } from "vue"
import { getCurrentUser, useFirebaseAuth } from "vuefire"
import { signOut, type Auth } from "firebase/auth"

export const useAuthStore = defineStore("auth", () => {
  // firebase
  const auth: Auth | null = useFirebaseAuth()

  // refs
  const username = ref<string>("")

  const setUsername = (newUsername: string) => {
    username.value = newUsername
  }

  const getCurrentUserHandler = async () => {
    const data = await getCurrentUser()
    const login = data?.email?.split("@")[0]

    if (login) {
      setUsername(login)
    }
  }
  getCurrentUserHandler()

  const clearUsername = async () => {
    await signOut(auth as Auth)
    username.value = ""
  }

  return { username, setUsername, clearUsername }
})
