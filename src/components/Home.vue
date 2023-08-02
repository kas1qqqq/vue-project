<script lang="ts" setup>
import {
  ref,
  computed,
  Transition,
  onMounted,
  watch,
  type ComputedRef,
  type Ref,
} from "vue";

import BarChart from "./BarChart.vue";
import PaginationList from "./PaginationList.vue";
import { useQuoteApi } from "@/utils/useQuoteApi.js";
import { scrollToHandler } from "@/utils/scrollToHandler";

interface QuotesType {
  id: number;
  quote: string;
  author: string;
}

const quotesRef: Ref<HTMLElement | null> = ref(null);

const loadRandomQtyQuotes = (min: number, max: number) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const baseUrl = `https://dummyjson.com/quotes?limit=${loadRandomQtyQuotes(
  3,
  6
)}`;

const url: ComputedRef<string> = computed(() => baseUrl);
const { data, error, retry } = useQuoteApi(url);

// refs
const isPaginationComponentMount = ref<boolean>(false);
const isChartComponentMount = ref<boolean>(false);
const isQuoteComponentMount = ref<boolean>(false);
const isAllComponentMount = ref<boolean>(false);
const isSortAz = ref<boolean>(false);
const isSortZa = ref<boolean>(false);
const percentage = ref<number>(100);

const sortByAz = () => {
  scrollToHandler(quotesRef);

  data.value.quotes.sort((quote_a: QuotesType, quote_b: QuotesType) =>
    quote_a.author > quote_b.author ? 1 : -1
  );

  if (isSortZa.value) isSortZa.value = !isSortZa.value;
  if (!isSortZa.value) isSortAz.value = !isSortZa.value;
};

const sortByZa = () => {
  scrollToHandler(quotesRef);

  data.value.quotes.sort((quote_a: QuotesType, quote_b: QuotesType) =>
    quote_a.author < quote_b.author ? 1 : -1
  );

  if (isSortAz.value) isSortAz.value = !isSortAz.value;
  if (!isSortAz.value) isSortZa.value = !isSortZa.value;
};

const setActiveDeleteQuoteTitleLine = ref<number | null>(null);
const delay = ref<boolean>(false);

const deleteQuote = (idx: number) => {
  setActiveDeleteQuoteTitleLine.value = idx;
  delay.value = true;

  setTimeout(() => {
    data.value.quotes = data.value.quotes.filter(
      (el: QuotesType) => el.id !== idx
    );
    delay.value = false;
  }, 500);
};

// computed
const getQuotesLength: ComputedRef<number> = computed(
  () => data.value?.quotes.length
);

watch(getQuotesLength, () => {
  if (getQuotesLength.value === 0) {
    isSortAz.value = false;
    isSortZa.value = false;
    setActiveDeleteQuoteTitleLine.value = null;
  }
});

// lifecycle hook
onMounted(() => {
  const percentageTimer = setInterval(() => {
    percentage.value--;
    if (percentage.value === 0) clearInterval(percentageTimer);
  }, 63);

  setTimeout(() => {
    isPaginationComponentMount.value = true;
  }, 2000);

  setTimeout(() => {
    isChartComponentMount.value = true;
  }, 4000);

  setTimeout(() => {
    isQuoteComponentMount.value = true;
  }, 6000);

  setTimeout(() => {
    isAllComponentMount.value = true;
  }, 6500);
});
</script>

<template>
  <Transition name="fade">
    <header>
      <Transition name="fade">
        <div v-if="isAllComponentMount" class="notif">
          <p>If you see errors, calm down, it's artificial.</p>
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div v-if="!isAllComponentMount" class="z-index-up all-component-mount">
          <h3>Components are on the way</h3>
          <h3>{{ percentage }}%</h3>
          <img src="../assets/images/Skateboarding.gif" alt="skateboy" />
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div v-if="isPaginationComponentMount">
          <PaginationList />
        </div>
      </Transition>

      <Transition name="slide-fade">
        <div v-if="isChartComponentMount">
          <BarChart />
        </div>
      </Transition>

      <div v-if="error">
        <div
          v-if="isPaginationComponentMount && isChartComponentMount"
          class="wrapper-error"
        >
          <p :style="{ marginBottom: '0.5rem' }">{{ error.message }}</p>
          <button class="btn" @click="retry">Retry</button>
        </div>
      </div>

      <div ref="quotesRef" v-else-if="isQuoteComponentMount && data">
        <div v-if="data && data.quotes.length !== 0" class="wrapper-btn">
          <button
            :class="isSortAz ? 'btn-sort-clicked' : ''"
            class="btn"
            @click="sortByAz"
            :disabled="isSortAz"
          >
            Sort A-z
          </button>

          <button
            :class="isSortZa ? 'btn-sort-clicked' : ''"
            class="btn"
            @click="sortByZa"
            :disabled="isSortZa"
          >
            Sort Z-a
          </button>
        </div>

        <Transition name="slide-fade">
          <div v-if="data.quotes.length === 0">
            <p :style="{ marginTop: '1rem', color: '#e3e3e3' }">
              Load quotes again?
            </p>
            <button class="btn load-btn" @click="retry">Load</button>
          </div>
        </Transition>

        <ul
          v-for="quote in data.quotes"
          :key="quote.id"
          :class="
            quote.id === setActiveDeleteQuoteTitleLine
              ? 'deleteEffect deleteEffectColorOut'
              : ''
          "
          class="wrapper-quotes"
        >
          <li>
            <div
              class="quotes-author"
              :style="{
                textDecoration:
                  quote.id === setActiveDeleteQuoteTitleLine
                    ? 'line-through'
                    : 'none',
              }"
            >
              {{ quote.author }}
              <button
                class="quotes-btn"
                @click="deleteQuote(quote.id)"
                :disabled="delay"
              >
                X
              </button>
            </div>

            <div class="quotes-quote">
              {{ quote.quote }}
            </div>
          </li>
        </ul>
      </div>

      <div v-else>
        <h1
          :style="{
            display:
              isPaginationComponentMount && isChartComponentMount
                ? 'block'
                : 'none',
          }"
          class="quotes-loading"
        >
          Loading quotes...
        </h1>
      </div>
    </header>
  </Transition>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.slide-fade-enter-active {
  transition: all 0.3s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.3s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20%);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease-out;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

header {
  display: flex;
  place-items: center;
  flex-direction: column;
}

.all-component-mount {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  border-radius: 1rem;
  background-color: #252525;
  color: #e3e3e3;
  z-index: 99999 !important;
  animation-name: all-component-mount;
  animation-duration: 6.6s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}
@keyframes all-component-mount {
  0% {
    background-color: #333;
    box-shadow: 0 0 2.5rem #252525;
  }
  90% {
    box-shadow: 0 0 2.5rem #252525;
  }
  100% {
    background-color: #181818;
    box-shadow: 0 0 0rem #181818;
  }
}

.all-component-mount h3:first-child {
  color: #96b5d3;
}

.notif {
  margin-top: -1rem;
  margin-bottom: 1rem;
  font-size: 0.9rem;
  color: rgba(250, 250, 210, 0.3);
  user-select: none;
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

.deleteEffect {
  opacity: 1;
  animation-name: deleteEffect;
  animation-duration: 0.5s;
  animation-iteration-count: 1;
  animation-timing-function: ease-out;
}
@keyframes deleteEffect {
  from {
    opacity: 1;
    filter: brightness(1);
  }
  to {
    opacity: 0;
    transform: scale(0.9);
    filter: contrast(50%);
  }
}

.deleteEffectColorOut {
  border-left: #252525 0.2rem solid !important;
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: 1rem;
}

.wrapper-error p {
  color: #f1777d;
  text-align: center;
  margin: 0 4rem;
}

.wrapper-error button {
  width: 10rem;
}

.wrapper-btn {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1rem;
}

.btn {
  font-size: 1rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(227, 227, 227, 0.1);
  color: hsla(160, 75%, 37%, 1);
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-in-out;
  color: #aae9cd;
  background-color: rgb(227, 227, 227, 0.2);
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
  cursor: pointer;
}

.btn-sort-clicked {
  background-color: rgb(45, 45, 45);
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
  color: rgb(227, 227, 227, 0.2);
}

.load-btn {
  margin-top: 0.5rem;
}

.wrapper-quotes {
  background-color: rgb(31, 31, 31);
  text-align: center;
  list-style-type: none;
  color: whitesmoke;
  margin: 1.4rem 6rem 0 6rem;
  padding: 1rem 2rem;
  box-shadow: 0px 0px 0.5rem rgb(35, 35, 35);
  border-radius: 0.2rem;
  border-left: seagreen 0.2rem solid;
}

.wrapper-quotes:hover {
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
}

.quotes-author {
  font-weight: 500;
  text-transform: capitalize;
  font-size: 1rem;
  color: #f1a5a9;
  margin-left: 2rem;
}

.quotes-quote {
  color: #96b5d3;
  font-size: 0.9rem;
}

.quotes-btn {
  font-weight: bold;
  padding: 0.2rem 0.8rem;
  font-size: 1.2rem;
  margin-left: 0.2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(31, 31, 31);
  color: rgb(220, 44, 44);
}

.quotes-btn:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(35, 35, 35);
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
  cursor: pointer;
  color: rgb(224, 13, 13);
}

.quotes-loading {
  color: whitesmoke;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  animation-name: quotes-loading;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}
@keyframes quotes-loading {
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

@media (max-width: 640px) {
  .wrapper-quotes {
    margin: 1.4rem 0rem 0 0rem;
    padding: 0.5rem 1rem;
  }
}

@media (min-width: 1024px) {
  .wrapper-quotes {
    margin: 1.4rem 16rem 0 16rem;
  }
}
</style>
