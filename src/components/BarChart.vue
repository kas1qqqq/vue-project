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
      label: "Person's email length",
      data: chartData.value,
      backgroundColor: 'seagreen',
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
    // artificial delay / random error
    await timeout()
    const res = await axios.get(URL)

    chartData.value = res.data
      .map((e: { email: string | any[] }) => e.email.length)
      .slice(0, 5)

    chartLabels.value = res.data
      .map((e: { email: string | any[] }) => `User: ${e.email.slice(0, 3)}`)
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
      <p>Oops! Error encountered. Cannot load the chart.</p>
      <button class="btn" @click="getChartData">Retry</button>
    </div>
  </div>
  <div v-if="isLoaded && !isError" class="h-line"></div>
</template>

<style scoped>
.wrapper {
  width: 600px;
  display: flex;
  justify-content: center;
  margin-top: 0.9rem;
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  margin-top: 1rem;
}

.wrapper-error p {
  color: #f1777d;
  display: flex;
  margin: 0 2rem;
  text-align: center;
}

.btn {
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
}

.h-line {
  width: 100%;
  height: 0.3rem;
  border-radius: 0.2rem;
  background: rgb(31, 31, 31);
  background: linear-gradient(
    90deg,
    rgba(31, 31, 31, 0.8) 0%,
    rgba(52, 73, 94, 0.6) 50%,
    rgba(31, 31, 31, 0.8) 100%
  );
  margin-top: 1rem;
  opacity: 0.2;
}

@media (max-width: 600px) {
  .wrapper {
    width: 400px;
  }
}

@media (max-width: 400px) {
  .wrapper {
    width: 300px;
  }
}
</style>
