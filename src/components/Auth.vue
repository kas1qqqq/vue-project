<script lang="ts" setup>
import { ref, onMounted, Transition, computed, type Ref } from "vue";
import { useFirebaseAuth } from "vuefire";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  type Auth,
} from "firebase/auth";

import Quiz from "./Quiz.vue";
import { useAuthStore } from "@/stores/auth";
import { scrollToHandler } from "@/utils/scrollToHandler";

// pinia store
const authStore = useAuthStore();

// firebase
const auth: Auth | null = useFirebaseAuth();

// refs
const isCreateAccVisible = ref<boolean>(false);
const isPassShowHide = ref<boolean>(false);
const isFieldRequire = ref<boolean>(false);
const isLoading = ref<boolean>(false);
const isCreateAcc = ref<boolean>(false);
const login = ref<string>("");
const password = ref<string>("");
const confirmPassword = ref<string>("");
const error = ref<string>("");
const btnRef: Ref<HTMLElement | null> = ref(null);

// computed
const isPasswordValid = computed(() => {
  return password.value.length >= 6;
});

const isConfirmPasswordValid = computed(() => {
  return (
    password.value &&
    isPasswordValid.value &&
    confirmPassword.value === password.value
  );
});

const isSignInFormValid = computed(() => {
  return login.value && password.value && isPasswordValid.value;
});

const isSignUpFormValid = computed(() => {
  return (
    login.value &&
    password.value &&
    confirmPassword.value &&
    isPasswordValid.value &&
    isConfirmPasswordValid.value
  );
});

const swapFormHandler = () => {
  isCreateAcc.value = !isCreateAcc.value;
  isPassShowHide.value = false;
  isFieldRequire.value = false;
  login.value = "";
  password.value = "";
  confirmPassword.value = "";
  error.value = "";
};

const resetFormHandler = () => {
  isPassShowHide.value = false;
  isFieldRequire.value = false;
  login.value = "";
  password.value = "";
  confirmPassword.value = "";
  error.value = "";
};

const signInHandler = async () => {
  if (!isSignInFormValid.value) {
    setTimeout(() => {
      scrollToHandler(btnRef);
    }, 0);
    return (isFieldRequire.value = true);
  }

  try {
    error.value = "";
    isLoading.value = true;

    await signInWithEmailAndPassword(
      auth as Auth,
      `${login.value}@firebase.com`,
      password.value
    );

    authStore.setUsername(login.value);
    resetFormHandler();
  } catch (e: any) {
    error.value = e.message;
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

const signUpHandler = async () => {
  if (!isSignUpFormValid.value) {
    setTimeout(() => {
      scrollToHandler(btnRef);
    }, 0);
    return (isFieldRequire.value = true);
  }

  try {
    error.value = "";
    isLoading.value = true;

    await createUserWithEmailAndPassword(
      auth as Auth,
      `${login.value}@firebase.com`,
      password.value
    );

    authStore.setUsername(login.value);
    resetFormHandler();
  } catch (e: any) {
    error.value = e.message;
    console.error(e);
  } finally {
    isLoading.value = false;
  }
};

onMounted(() => {
  setTimeout(
    () => (isCreateAccVisible.value = !isCreateAccVisible.value),
    1000
  );
});
</script>

<template>
  <div v-if="!authStore.username">
    <div class="notif">
      <p>To start the quiz, first register.</p>
    </div>
    <div class="logosContainer">
      <img
        src="../assets/images/pinia-logo.svg"
        width="40"
        height="40"
        alt="Pinia logo"
      />
      <span>+</span>
      <img
        src="../assets/images/firebase-logo.svg"
        width="40"
        height="40"
        alt="Firebase logo"
      />
    </div>
    <h1>Authorization</h1>

    <Transition name="bounce">
      <span
        v-if="isCreateAccVisible"
        class="createAccount"
        @click="swapFormHandler"
        >{{
          !isCreateAcc ? "Create an account?" : "Already have an account?"
        }}</span
      >
    </Transition>

    <Transition name="bounce">
      <p v-if="error" class="error">{{ error }}</p>
    </Transition>

    <form
      v-if="!isCreateAcc"
      @submit.prevent="signInHandler"
      class="formContainer"
    >
      <input
        v-model="login"
        type="text"
        placeholder="Login"
        spellcheck="false"
        class="loginLowerCase"
      />

      <Transition name="bounce">
        <span v-if="!login && isFieldRequire" class="fieldsRequired"
          >Login is required</span
        >
      </Transition>

      <div class="passField">
        <input
          v-model="password"
          :type="isPassShowHide ? 'text' : 'password'"
          placeholder="Password"
        />
        <span
          v-if="password"
          class="showHidePass"
          @click="isPassShowHide = !isPassShowHide"
          >{{ isPassShowHide ? "Hide" : "Show" }}</span
        >
      </div>

      <Transition name="bounce">
        <span v-if="!password && isFieldRequire" class="fieldsRequired"
          >Password is required</span
        >
      </Transition>

      <Transition name="bounce">
        <span v-if="isFieldRequire && !isPasswordValid" class="fieldsRequired"
          >At least 6 characters</span
        >
      </Transition>

      <button
        ref="btnRef"
        type="submit"
        class="btn"
        :class="isLoading && 'btnLoading'"
        :disabled="isFieldRequire && !isSignInFormValid"
      >
        {{ isLoading ? "Loading..." : "Sign In" }}
      </button>
    </form>

    <form v-else @submit.prevent="signUpHandler" class="formContainer">
      <input
        v-model="login"
        type="text"
        placeholder="Login"
        spellcheck="false"
        class="loginLowerCase"
      />

      <Transition name="bounce">
        <span v-if="!login && isFieldRequire" class="fieldsRequired"
          >Login is required</span
        >
      </Transition>

      <div class="passField">
        <input
          v-model="password"
          :type="isPassShowHide ? 'text' : 'password'"
          placeholder="Password"
        />
        <span
          v-if="password"
          class="showHidePass"
          @click="isPassShowHide = !isPassShowHide"
          >{{ isPassShowHide ? "Hide" : "Show" }}</span
        >
      </div>

      <Transition name="bounce">
        <span v-if="!password && isFieldRequire" class="fieldsRequired"
          >Password is required</span
        >
      </Transition>

      <Transition name="bounce">
        <span v-if="isFieldRequire && !isPasswordValid" class="fieldsRequired"
          >At least 6 characters</span
        >
      </Transition>

      <div class="passField">
        <input
          v-model="confirmPassword"
          :type="isPassShowHide ? 'text' : 'password'"
          placeholder="Confirm password"
        />
      </div>

      <Transition name="bounce">
        <span v-if="!confirmPassword && isFieldRequire" class="fieldsRequired"
          >Confirm password is required</span
        >
      </Transition>

      <Transition name="bounce">
        <span
          v-if="isFieldRequire && !isConfirmPasswordValid"
          class="fieldsRequired"
          >Must match</span
        >
      </Transition>

      <button
        ref="btnRef"
        type="submit"
        class="btn"
        :class="isLoading && 'btnLoading'"
        :disabled="isFieldRequire && !isSignUpFormValid"
      >
        {{ isLoading ? "Loading..." : "Sign Up" }}
      </button>
    </form>
  </div>
  <div v-else>
    <Quiz />
  </div>
</template>

<style scoped>
* {
  color: #e3e3e3;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0;
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
    opacity: 1;
  }
}

.logosContainer {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.2rem;
}

.logosContainer span {
  font-size: 1.4rem;
}

p {
  color: #757575;
  animation-name: notif;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes notif {
  0% {
    opacity: 0.6;
  }
  25% {
    opacity: 1;
    filter: brightness(1.1);
  }
  50% {
    opacity: 0.6;
  }
  75% {
    opacity: 1;
    filter: brightness(1.1);
  }
  100% {
    opacity: 0.6;
  }
}

.error {
  width: 70%;
  margin: 0 auto;
  margin-top: 0.5rem;
  padding: 1rem 0.5rem;
  border-radius: 0.2rem;
  color: #ff8081;
  background-color: rgba(41, 0, 0, 0.5);
}

.createAccount {
  color: #757575;
  transition: 0.1s ease-out;
}

.createAccount:hover {
  color: #aae9cd;
  cursor: pointer;
}

input[type="text"],
input[type="password"] {
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.2rem;
  border: 0;
  background-color: #2f2f2f;
  transition: 0.1s ease-out;
}

input[type="text"]:hover,
input[type="password"]:hover {
  background-color: rgb(227, 227, 227, 0.1);
}

.loginLowerCase:not(:placeholder-shown) {
  text-transform: lowercase;
}

.formContainer {
  display: flex;
  flex-direction: column;
  place-items: center;
  gap: 1rem;
  margin-top: 1rem;
}

.passField {
  position: relative;
}

.showHidePass {
  font-size: 0.8rem;
  position: absolute;
  right: 1rem;
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  user-select: none;
}

.fieldsRequired {
  color: #e46962;
  margin-top: -0.5rem;
}

.btn {
  font-size: 1rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(227, 227, 227, 0.1);
  color: hsla(160, 75%, 37%, 1);
  transition: 0.3s ease-out;
}

.btn:disabled {
  opacity: 0.4;
  color: #e3e3e3;
}

.btnLoading {
  color: #e3e3e3;
  pointer-events: none;
  user-select: none;
  animation-name: notif;
  animation-duration: 1s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-out;
  color: #aae9cd;
  background-color: rgb(227, 227, 227, 0.2);
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
  cursor: pointer;
}
</style>
