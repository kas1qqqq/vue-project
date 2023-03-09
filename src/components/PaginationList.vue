<script lang="ts" setup>
import { onMounted, ref } from 'vue'
import VueElementLoading from 'vue-element-loading'
import PaginationComponent from './PaginationComponent.vue'
import { usePostsApi } from '../assets/usePostsApi'

const currentPage = ref<number>(1)
const rowsPerPage = ref<number>(3)
const isSortAz = ref<boolean>(false)

const {
  posts,
  isRetryLoadPosts,
  isError,
  loadPosts,
  retryWithDelay,
  numberOfPages,
} = usePostsApi(currentPage, rowsPerPage)

onMounted(async () => loadPosts())

function sortByAz(): void {
  isSortAz.value = !isSortAz.value
  if (isSortAz.value) {
    posts.value.sort((post_a: { title: string }, post_b: { title: string }) =>
      post_a.title > post_b.title ? 1 : -1
    )
  }

  if (!isSortAz.value) {
    posts.value.map((post) => post.id > 1)
    posts.value.sort((post_a: { id: number }, post_b: { id: number }) =>
      post_a.id > post_b.id ? 1 : -1
    )
  }
}
</script>

<template>
  <Transition name="slide-fade">
    <div v-if="!isError" class="wrapper">
      <div v-if="posts.length && !isError" class="wrapper-btn">
        <button
          class="btn-sort"
          :class="isSortAz ? 'btn-sort-clicked' : ''"
          @click="sortByAz"
        >
          Sort A-z
        </button>
      </div>

      <ul>
        <li v-for="post in posts" :key="post.id" class="wrapper-posts">
          <div class="posts-title">{{ post.title }}</div>
          <div class="posts-body">{{ post.body }}</div>
        </li>
      </ul>

      <pagination-component
        class="pagination-component"
        v-model="currentPage"
        :numberOfPages="numberOfPages"
      />
    </div>
  </Transition>

  <div v-if="posts.length && !isError" class="h-line"></div>

  <div v-if="isError" class="wrapper-error">
    <p id="z-index-up">
      Oops! Error encountered. Cannot load the pagination list.
    </p>

    <div class="wrapper-skateboarding">
      <vue-element-loading
        :active="isError"
        class="btn unselect"
        backgroundColor="transparent"
      >
        <img
          :class="isRetryLoadPosts ? 'skateboarding-run' : 'skateboarding'"
          src="../assets/images/Skateboarding.gif"
        />
      </vue-element-loading>

      <button
        :class="isRetryLoadPosts ? 'btn-run' : 'btn'"
        class="z-index-up"
        @click="retryWithDelay"
      >
        {{ !isRetryLoadPosts ? 'Retry' : 'Loading...' }}
      </button>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.slide-fade-enter-active {
  transition: all 0.5s ease-out;
}

.slide-fade-leave-active {
  transition: all 0.5s cubic-bezier(1, 0.5, 0.8, 1);
}

.slide-fade-enter-from,
.slide-fade-leave-to {
  transform: translateX(20px);
  opacity: 0;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.unselect {
  user-select: none;
  cursor: default !important;
}

.z-index-up {
  z-index: 9999;
}

.z-index-down {
  z-index: -9999;
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

.wrapper {
  display: flex;
  place-items: center;
  flex-direction: column;
}

.wrapper-error {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.wrapper-error p {
  color: #f1777d;
}

.wrapper-error button {
  margin: 0 5.9rem;
}

.wrapper-btn {
  display: flex;
  justify-content: center;
}

.btn {
  padding: 0.5rem 2rem;
  margin: 0 1rem;
  border: none;
  border-radius: 0.2rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  background-color: rgb(35, 35, 35, 0.8);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  color: hsla(160, 75%, 37%, 1);
}

.btn-sort {
  padding: 0.5rem 2rem;
  margin: 0 1rem;
  border: none;
  border-radius: 0.2rem;
  background-color: rgb(35, 35, 35, 0.8);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  color: hsla(160, 75%, 37%, 1);
}

.btn-run {
  padding: 0.5rem 2rem;
  margin: 0 1rem;
  border: none;
  border-radius: 0.2rem;
  border-bottom-left-radius: 1.5rem;
  border-bottom-right-radius: 1.5rem;
  background-color: rgb(35, 35, 35, 0.8);
  box-shadow: 0px 0px 0.2rem rgb(35, 35, 35);
  color: hsla(160, 75%, 37%, 1);
  animation-name: btn-run;
  animation-duration: 3s;
  animation-iteration-count: infinite;
  animation-timing-function: ease-in-out;
}

@keyframes btn-run {
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
    margin: 0 1rem;
  }
}

.btn:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(40, 40, 40);
  box-shadow: 0px 0px 0.3rem rgb(45, 45, 45);
  cursor: pointer;
}

.btn:active {
  box-shadow: 0px 0px 0.3rem rgb(45, 45, 45);
  color: rgba(46, 139, 86, 0.79);
}

.btn-sort:hover {
  transition: 0.1s ease-in-out;
  background-color: rgb(40, 40, 40);
  box-shadow: 0px 0px 0.3rem rgb(45, 45, 45);
  cursor: pointer;
}

.btn-sort:active {
  box-shadow: 0px 0px 0.3rem rgb(35, 35, 35);
  background-color: rgb(35, 35, 35);
  color: rgba(46, 139, 86, 0.79);
}

.btn-sort-clicked {
  background-color: rgb(45, 45, 45);
  box-shadow: 0px 0px 0.2rem rgb(45, 45, 45);
  color: rgba(46, 139, 86, 0.59);
}

.wrapper-skateboarding {
  display: flex;
  flex-direction: column;
  margin: 0 2rem;
}

.skateboarding {
  width: 1.5rem;
  height: 1.5rem;
  left: -8.6rem;
  top: 0.2rem;
  transform: rotate(45deg);
}

.skateboarding-run {
  width: 1.5rem;
  height: 1.5rem;
  left: -8.6rem;
  top: 0.47rem;
  animation-name: skateboarding;
  animation-duration: 3s;
  animation-iteration-count: 1;
  animation-timing-function: ease-in-out;
}

@keyframes skateboarding {
  0% {
    transform: rotate(45deg);
    top: 0.2rem;
    left: -8.6rem;
  }
  10% {
    top: 0.42rem;
  }
  20% {
    transform: rotate(0deg);
    top: 0.5rem;
  }
  90% {
    transform: rotate(0deg);
    top: 0.5rem;
  }
  100% {
    transform: rotate(-45deg);
    top: 0.2rem;
    left: 8.6rem;
  }
}

.wrapper-posts {
  background-color: rgb(31, 31, 31);
  box-shadow: 0px 0px 0.5rem rgb(35, 35, 35);
  border-radius: 0.2rem;
  border-left: seagreen 0.2rem solid;
  text-align: center;
  list-style-type: none;
  color: whitesmoke;
  margin: 1.4rem 6rem 0 6rem;
  display: flex;
  flex-direction: column;
  padding: 1rem 2rem;
}

.posts-title {
  font-weight: 500;
  text-transform: capitalize;
  font-size: 1rem;
  color: #f3ab26;
}

.posts-body {
  color: grey;
  font-size: 0.9rem;
}

.posts-loading {
  color: whitesmoke;
  font-size: 1.2rem;
  margin-top: 0.5rem;
}

@media (max-width: 640px) {
  .wrapper-posts {
    margin: 1.4rem 1rem 0 1rem;
  }
}
@media (min-width: 1024px) {
  .wrapper-posts {
    margin: 1.4rem 12rem 0 12rem;
  }
}
</style>
