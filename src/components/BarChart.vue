<script lang="ts" setup>
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js'
import { ref, computed } from 'vue'
import axios from 'axios'
import { Bar } from 'vue-chartjs'

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale)

const URL: string = 'https://jsonplaceholder.typicode.com/comments'

const isLoaded = ref<boolean | null>(null)
const isError = ref<boolean | null>(null)
const chartData = ref<any>(null)
const chartLabels = ref<any>(null)

const data = computed(() => ({
  labels: chartLabels.value,
  datasets: [
    {
      label: "Length of the user's email",
      data: chartData.value,
      backgroundColor: '#539BF5',
      borderColor: 'rgb(45, 45, 45)',
      borderWidth: 1,
      borderRadius: 4,
    },
  ],
}))

async function getChartData() {
  isLoaded.value = false
  isError.value = false

  try {
    // artificial delay and random error
    await timeout()

    const res = await axios.get(URL)

    chartData.value = res.data
      .map((e: { email: string }) => e.email.length)
      .slice(0, 5)

    chartLabels.value = res.data
      .map(
        (e: { email: string }) =>
          `${e.email.substring(0, e.email.indexOf('@'))}`
      )
      .slice(0, 5)

    isLoaded.value = true
  } catch (e: any) {
    isError.value = true
    console.error(
      'There was an artificial error in ChartApi. Please try again.'
    )
  }
}
getChartData()

// artificial delay
function timeout() {
  return new Promise<void>((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.3) {
        resolve()
      } else {
        reject(new Error('Oops! Error encountered. Cannot load the list.'))
      }
    }, 300)
  })
}
</script>

<template>
  <div class="wrapper">
    <Bar v-if="isLoaded" :data="data" />

    <h1 v-if="!isLoaded && !isError" class="chart-loading">
      Loading charts...
    </h1>

    <div v-if="isError" class="wrapper-error">
      <p>Oops! Error encountered. Cannot load charts.</p>
      <button class="btn" @click="getChartData">Retry</button>
    </div>
  </div>
  <div v-if="isLoaded && !isError" class="h-line"></div>
</template>

<style scoped>
.wrapper {
  width: 40rem;
  display: flex;
  justify-content: center;
  margin-top: 0.9rem;
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1rem;
}

.wrapper-error p {
  color: #f1777d;
  display: flex;
  margin: 0 3rem;
  text-align: center;
}

.btn {
  min-width: 10rem;
  font-size: 0.9rem;
  padding: 0.5rem 2rem;
  margin: 0 4rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(31, 31, 31);
  box-shadow: 0px 0px 0.2rem rgb(31, 31, 31);
  color: hsla(160, 75%, 37%, 1);
}

.btn:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(35, 35, 35);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}

.btn:active {
  box-shadow: 0px 0px 0.3rem rgb(45, 45, 45);
  color: rgba(46, 139, 86, 0.79);
}

.chart-loading {
  color: whitesmoke;
  font-size: 1.2rem;
  margin-top: 0.5rem;
  animation-name: chart-loading;
  animation-duration: 0.5s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes chart-loading {
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

.h-line {
  width: 100%;
  height: 0.5rem;
  border-radius: 0.2rem;
  background: rgb(31, 31, 31);
  background: linear-gradient(
    90deg,
    rgba(31, 31, 31, 0) 0%,
    rgba(52, 73, 94, 0.8) 50%,
    rgba(31, 31, 31, 0) 100%
  );
  margin-top: 1rem;
  opacity: 0.2;
}

@media (max-width: 600px) {
  .wrapper {
    width: 32rem;
  }
}

@media (max-width: 425px) {
  .wrapper {
    width: 19rem;
  }
}
</style>
