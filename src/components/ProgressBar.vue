<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{
  totalQuestions: number;
  answerAnyQuestionsQty: number;
}>();

const progressWidth = computed(() => {
  return (props.answerAnyQuestionsQty / props.totalQuestions) * 100 + "%";
});
</script>

<template>
  <div class="bar progress-bar" :style="{ width: progressWidth }"></div>
  <div class="bar shadow-bar"></div>
</template>

<style scoped>
.bar {
  height: 10px;
  border-radius: 1rem;
  margin: 1rem 0;
  transition: width 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.progress-bar {
  position: relative;
  background: radial-gradient(circle, #e0f8ed, #e0f8ed);
  z-index: 1;
  box-shadow: 0 0 1px #e0f8ed;
  overflow: hidden;
  animation: pulse 2s infinite;
  transform-origin: left right;
}
@keyframes pulse {
  0% {
    transform: scaleX(1);
  }
  50% {
    transform: scaleX(1.1);
  }
  100% {
    transform: scaleX(1);
  }
}

.shadow-bar {
  position: absolute;
  top: 0;
  background: #e3e3e3;
  opacity: 0.5;
  min-width: 100%;
}
</style>
