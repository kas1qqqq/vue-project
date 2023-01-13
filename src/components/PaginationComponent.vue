<template>
  <div class="pagination-container">
    <ul v-if="numberOfPages >= 1" class="pagination">
      <li
        class="page-item"
        aria-label="go to previous page"
        @click="previous()"
        :class="{
          disabled: currentPage === 1,
        }"
      >
        <span class="page-link">&laquo;</span>
      </li>
      <li
        v-for="index in numberOfPages"
        :key="index"
        :aria-label="'go to page ' + index"
        class="page-item"
        @click="setCurrentPage(index)"
      >
        <div
          class="page-link"
          :class="{
            'active-page': currentPage === index,
          }"
        >
          {{ index }}
        </div>
      </li>
      <li
        class="page-item"
        :class="{
          disabled: currentPage === numberOfPages || !numberOfPages,
        }"
        aria-label="go to next page"
        @click="next()"
      >
        <div class="page-link">&raquo;</div>
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
import { toRefs } from 'vue'

const props = defineProps({
  numberOfPages: {
    required: true,
    type: Number,
  },
  modelValue: {
    required: true,
    type: Number,
  },
})

const { numberOfPages, modelValue: currentPage } = toRefs(props)

const emit = defineEmits(['update:modelValue'])

const setCurrentPage = (number: Number) => {
  emit('update:modelValue', number)
}

const previous = () => {
  if (currentPage.value === 1) return
  emit('update:modelValue', currentPage.value - 1)
}

const next = () => {
  if (currentPage.value >= numberOfPages.value) return
  emit('update:modelValue', currentPage.value + 1)
}
</script>

<style scoped>
.pagination-container {
  display: inline-block;
}

.pagination {
  background-color: rgb(35, 35, 35, 0.8);
  margin-top: 1rem;
  padding: 0.5rem;
  display: flex;
  gap: 0.4rem;
  align-items: center;
  border: none;
  align-content: center;
  border-radius: 0.2rem;
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
}

.page-item {
  display: flex;
  cursor: pointer;
  user-select: none;
}

.page-link {
  border-radius: 0.2rem;
  padding: 0.6rem 0.9rem;
  font-size: 0.8rem;
  font-weight: 700;
}

.page-link:hover {
  color: seagreen;
  background-color: rgb(45, 45, 45);
  border: none;
}

.active-page {
  background-color: seagreen !important;
  color: whitesmoke !important;
}
.active-page:hover {
  border: none;
}

.disabled .page-link {
  opacity: 0.4;
}

.disabled {
  pointer-events: none;
}
</style>
