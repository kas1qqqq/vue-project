<script lang="ts" setup>
import { ref, computed } from "vue";

interface QuestionsType {
  question: string;
  options: string[];
  correctAnswer: string;
}

interface QuizResultType {
  isPassed: boolean;
  msg: string;
}

const QUESTIONS: QuestionsType[] = [
  {
    question: "What is the capital of France?",
    options: ["Berlin", "London", "Paris"],
    correctAnswer: "Paris",
  },
  {
    question: "What is 2 + 2?",
    options: ["3", "4", "5"],
    correctAnswer: "4",
  },
  {
    question: "In Vue 3, what is the new composition API used for?",
    options: [
      "Managing server-side routes",
      "Handling HTTP requests",
      "Managing state and logic in components",
    ],
    correctAnswer: "Managing state and logic in components",
  },
  {
    question: "What is the root component in a Vue 3 application?",
    options: ["main.js", "App.vue", "index.html"],
    correctAnswer: "App.vue",
  },
  {
    question:
      "In Vue 3, how can you create a reactive data property in a component?",
    options: [
      "Using the `ref` function from Vue composition API",
      "Using the `reactive` function from Vue composition API",
      "Using the `data` option in the component's options object",
    ],
    correctAnswer: "Using the `ref` function from Vue composition API",
  },
  {
    question: "What is the purpose of the v-bind directive in Vue 3 templates?",
    options: [
      "To bind data to an element's attribute",
      "To create a custom directive",
      "To bind a component method to a DOM event",
    ],
    correctAnswer: "To bind a component method to a DOM event",
  },
];

// refs
const currentQuestion = ref<number>(0);
const correctAnswersQty = ref<number>(0);
const selectedElement = ref<null | string>(null);

// computed
const calculatedQuizResult = computed((): QuizResultType => {
  const percentageCorrect = (correctAnswersQty.value / QUESTIONS.length) * 100;

  if (percentageCorrect >= 80) {
    return {
      isPassed: true,
      msg: `Congratulations! Your quiz result is ${percentageCorrect.toFixed(
        0
      )}% and it's equal to or above 80%.`,
    };
  } else {
    return {
      isPassed: false,
      msg: `Your quiz result is ${percentageCorrect.toFixed(
        0
      )}%. Keep practicing to improve.`,
    };
  }
});

const hasNextQuestion = computed((): boolean => {
  return QUESTIONS.length - 1 > currentQuestion.value;
});

const isAnswerCorrect = computed((): boolean => {
  const isCorrect =
    selectedElement.value === QUESTIONS[currentQuestion.value].correctAnswer &&
    true;

  if (isCorrect) {
    correctAnswersQty.value++;
  }

  if (selectedElement.value && hasNextQuestion.value) {
    setTimeout(() => {
      currentQuestion.value++;
      selectedElement.value = null;
    }, 500);
  }

  return isCorrect;
});

const tryAgainHandler = (): void => {
  currentQuestion.value = 0;
  correctAnswersQty.value = 0;
  selectedElement.value = null;
};
</script>

<template>
  <div class="container">
    <h1>The Quiz</h1>
    <h3>{{ QUESTIONS[currentQuestion].question }}</h3>

    <ul>
      <li
        v-for="el in QUESTIONS[currentQuestion].options"
        :key="el"
        :class="{
          nonClicable: selectedElement,
        }"
      >
        <label
          :class="{
            selectedEl: selectedElement === el && !isAnswerCorrect,
            isAnswerCorrect: selectedElement === el && isAnswerCorrect,
            fadeOutLabels: selectedElement === el && isAnswerCorrect,
          }"
        >
          <input
            v-model="selectedElement"
            type="radio"
            :value="el"
            @change="() => isAnswerCorrect"
          />
          {{ el }}
        </label>
      </li>
    </ul>

    <div v-if="!hasNextQuestion && selectedElement" class="result">
      <h2 :class="{ notPassedText: !calculatedQuizResult.isPassed }">
        {{
          calculatedQuizResult.isPassed
            ? "Congratulations, you have passed 🥳"
            : "You didn't pass the quiz 😔"
        }}
      </h2>
      <p>{{ calculatedQuizResult.msg }}</p>
      <span>
        {{ correctAnswersQty }} correct answers out of {{ QUESTIONS.length }}.
      </span>
      <button @click="tryAgainHandler" class="btn">Try again</button>
    </div>
  </div>
</template>

<style scoped>
h1 {
  margin-bottom: 1rem;
}

h3 {
  user-select: none;
}

input {
  display: none;
}

.nonClicable {
  pointer-events: none;
  user-select: none;
}

label {
  display: inline-block;
  font-weight: 500;
  padding: 1rem 2rem;
  width: 20rem;
  border-radius: 0.2rem;
  cursor: pointer;
  user-select: none;
}

label:not(:is(.isAnswerCorrect, .selectedEl)):hover {
  background-color: rgb(159, 159, 159, 0.2);
  transition: 0.1s ease-out;
}

.fadeOutLabels {
  animation-duration: 0.5s;
  animation: fadeOutLabels;
  transition: 0.1s ease-in-out;
  background-color: transparent;
}
@keyframes fadeOutLabels {
  0%,
  100% {
    transform: translate(0, 0);
  }
  25% {
    transform: translate(-2px, -2px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  }
  50% {
    transform: translate(2px, 2px);
    box-shadow: 2px 2px 3px rgba(0, 0, 0, 0.5);
  }
  75% {
    transform: translate(-2px, 2px);
    box-shadow: -2px -2px 3px rgba(0, 0, 0, 0.5);
  }
}

ul {
  list-style-type: none;
  display: flex;
  flex-direction: column;
  place-items: center;
  justify-content: center;
  padding: 0;
}

li {
  margin: 0.5rem;
}

.selectedEl {
  background-color: #e46962;
  animation-name: wrongAnswer;
  animation-duration: 0.5s;
  transition: 0.1s ease-out;
}
@keyframes wrongAnswer {
  0% {
    background-color: rgba(112, 128, 144, 0.5);
  }
  100% {
    background-color: #e46962;
  }
}

.isAnswerCorrect {
  font-weight: bold;
  color: black;
  background-color: #aae9cd;
  animation-duration: 0.5s;
  transition: 0.1s ease-out;
}

.result > h2 {
  color: #aae9cd;
  font-weight: bold;
}

.result > p {
  font-weight: 500;
}

.passedText {
  color: #aae9cd;
  font-weight: bold;
}

.notPassedText {
  color: #e46962 !important;
  font-weight: bold;
}

.btn {
  margin: 1rem auto 0 auto;
  display: block;
  font-weight: bold;
  font-size: 0.9rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: transparent;
  box-shadow: 0px 0px 0.2rem rgb(31, 31, 31, 0);
  color: #dc362e;
  transition: 0.3s ease-out;
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-in-out;
  background-color: #fff0f0;
  color: #dc362e !important;
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  cursor: pointer;
}
</style>
