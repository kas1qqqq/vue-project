<script lang="ts" setup>
import { useSound } from "@vueuse/sound";
import { ref, computed, watch, type Ref } from "vue";

import { QUESTIONS } from "@/utils/quizQuestions";
import { scrollToHandler } from "@/utils/scrollToHandler";
import popCorrectSound from "@/assets/sounds/pop-correct.mp3";
import popIncorrectSound from "@/assets/sounds/pop-incorrect.mp3";
import winSound from "@/assets/sounds/win.wav";
import loseSound from "@/assets/sounds/lose.wav";

interface QuizResultType {
  isPassed: boolean;
  msg: string;
}

// refs
const currentQuestion = ref<number>(0);
const correctAnswersQty = ref<number>(0);
const selectedElement = ref<null | string>(null);
const resultRef: Ref<HTMLElement | null> = ref(null);
const questionsRef: Ref<HTMLElement | null> = ref(null);

// sounds
const popCorrect = useSound(popCorrectSound, { volume: 0.4 });
const popIncorrect = useSound(popIncorrectSound, { volume: 0.4 });
const win = useSound(winSound, { volume: 0.4 });
const lose = useSound(loseSound, { volume: 0.4 });

// computed
const calculatedQuizResult = computed((): QuizResultType => {
  const percentageCorrect = (correctAnswersQty.value / QUESTIONS.length) * 100;

  if (percentageCorrect >= 80) {
    setTimeout(() => (win.play(), scrollToHandler(resultRef)), 0);
    return {
      isPassed: true,
      msg: `Congratulations! Your quiz result is ${percentageCorrect.toFixed(
        0
      )}% and it's equal to or above 80%.`,
    };
  } else {
    setTimeout(() => (lose.play(), scrollToHandler(resultRef)), 0);
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
    if (hasNextQuestion.value) {
      setTimeout(() => popCorrect.play(), 0);
    }
  } else {
    if (hasNextQuestion.value) {
      setTimeout(() => popIncorrect.play(), 0);
    }
  }

  if (selectedElement.value && hasNextQuestion.value) {
    setTimeout(() => {
      currentQuestion.value++;
      selectedElement.value = null;
    }, 500);
  }

  return isCorrect;
});

watch(currentQuestion, () => {
  if (hasNextQuestion.value) {
    return setTimeout(() => {
      scrollToHandler(questionsRef);
    }, 0);
  }
});

const tryAgainHandler = () => {
  currentQuestion.value = 0;
  correctAnswersQty.value = 0;
  selectedElement.value = null;
};
</script>

<template>
  <div class="container">
    <h1>The Quiz</h1>
    <h3>{{ QUESTIONS[currentQuestion].question }}</h3>

    <ul ref="questionsRef">
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

    <div
      ref="resultRef"
      v-if="!hasNextQuestion && selectedElement"
      class="result"
    >
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
    <p v-else class="questionsRemain">
      {{ currentQuestion + 1 }}/{{ QUESTIONS.length }}
    </p>
  </div>
</template>

<style scoped>
* {
  color: #e3e3e3;
}

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
  animation-duration: 0.3s;
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
  animation-duration: 0.3s;
  transition: 0.1s ease-out;
}
@keyframes wrongAnswer {
  0% {
    background-color: rgba(112, 128, 144, 0.5);
    color: #fff0f0;
  }
  25% {
    transform: translate(-2px, -2px);
    box-shadow: 0 0 3px rgba(0, 0, 0, 0.5);
  }
  100% {
    background-color: #e46962;
  }
}

.isAnswerCorrect {
  font-weight: bold;
  color: black;
  background-color: #aae9cd;
  animation-duration: 0.3s;
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
  font-size: 1rem;
  padding: 0.5rem 2rem;
  border: none;
  border-radius: 0.2rem;
  background-color: transparent;
  color: #dc362e;
  transition: 0.3s ease-out;
}

.btn:not(:disabled):hover {
  transition: 0.1s ease-in-out;
  background-color: #fff0f0;
  color: #dc362e !important;
  box-shadow: 0px 0px 0.2rem rgb(227, 227, 227, 0.2);
  cursor: pointer;
}

.questionsRemain {
  color: #aae9cd;
  text-align: right;
  padding: 0.5rem 0.5rem;
}
</style>
