<script lang="ts" setup>
import { ref, onMounted, Transition, computed, watch } from "vue";
import { useRouter } from "vue-router";

import { useAuthStore } from "../stores/auth";

// store
const authStore = useAuthStore();

// router
const router = useRouter();

// refs
const loginAttempts = ref<number>(0);
const isHintVisible = ref<boolean>(false);
const isPassShowHide = ref<boolean>(false);
const isFieldRequire = ref<boolean>(false);
const login = ref<string>("");
const password = ref<string>("");
const btnFocus = ref<null | any>(null);

// computed
const isUserDataMatch = computed(() =>
  login.value === "admin" && password.value === "12345" ? true : false
);

const submitHandler = () => {
  if (login.value && password.value) {
    loginAttempts.value++;
  } else {
    isFieldRequire.value = true;
  }

  if (isUserDataMatch.value) {
    authStore.setUsername(login.value);
    router.push("/");
  }
};

onMounted(() => {
  if (authStore.username) {
    router.back();
  }

  setTimeout(() => (isHintVisible.value = !isHintVisible.value), 1000);
});

watch(isUserDataMatch, () => {
  btnFocus.value.focus();
  isPassShowHide.value = false;
});
</script>

<template>
  <div>
    <img
      src="../assets/images/pinia-logo.svg"
      width="40"
      height="40"
      alt="pinia store logo"
    />
    <h1>Pinia Auth</h1>

    <Transition name="bounce">
      <p v-if="isHintVisible && !isUserDataMatch && loginAttempts < 3">
        Please make {{ 3 - loginAttempts }}
        {{ 3 - loginAttempts === 1 ? "mistake" : "mistakes" }} to show the hint
      </p>
    </Transition>

    <Transition name="bounce">
      <p v-if="loginAttempts >= 3 && !isUserDataMatch">
        Login: admin<br />Password: 12345
      </p>
    </Transition>

    <form @submit.prevent="submitHandler" class="formContainer">
      <input v-model="login" type="text" placeholder="Login" />

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

      <button
        ref="btnFocus"
        type="submit"
        :class="isUserDataMatch && 'btnSuccess'"
        class="btn"
        :disabled="isFieldRequire && (!login || !password)"
      >
        Submit
      </button>
    </form>
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

input[type="text"],
input[type="password"] {
  font-size: 1rem;
  padding: 1rem 1.5rem;
  border-radius: 0.2rem;
  border: 0;
  background-color: #2f2f2f;
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
  background-color: rgb(31, 31, 31);
  box-shadow: 0px 0px 0.2rem rgb(31, 31, 31);
  color: hsla(160, 75%, 37%, 1);
  transition: 0.3s ease-out;
}

.btn:not(:disabled):active {
  background-color: rgb(22, 154, 110) !important;
  color: #e3e3e3;
}

.btn:disabled {
  opacity: 0.6;
  color: #e46962;
  background-color: #e3e3e3;
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(35, 35, 35);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}

.btnSuccess {
  background-color: hsla(160, 75%, 37%, 1);
  color: #e3e3e3;
  transition: 0.3s ease-in;
}

.btnSuccess:hover {
  color: hsla(160, 75%, 37%, 1);
  background-color: #e3e3e3 !important;
}
</style>
