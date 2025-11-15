<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-800 py-6 px-4">
    <theme-toggle />
    <div class="max-w-[600px] mx-auto">
      <h1
        class="text-2xl mb-4 font-bold text-center text-gray-800 dark:text-gray-50"
      >
        Просмотр постов
      </h1>

      <div class="flex mb-4 gap-4">
        <input
          v-model="PS.searchQuery"
          type="text"
          placeholder="Поиск по заголовку"
          class="flex-1 px-4 py-2 dark:text-gray-300 border border-gray-200 dark:border-gray-50 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          @click="searchPosts"
          :disabled="PS.loading"
          class="flex justify-center w-[80px] px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 hover:cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed items-center"
        >
          <span v-if="PS.loading" class="inline-block">
            <svg
              class="animate-spin h-4 w-4 text-white"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                class="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                stroke-width="4"
              ></circle>
              <path
                class="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </span>
          <span v-else>Поиск</span>
        </button>
      </div>
      <div
        v-if="PS.error"
        class="p-4 bg-red-100 border border-red-400 text-red-700 rounded"
      >
        Ошибка: {{ PS.error }}
      </div>
      <PostsTable @open-user-card="openUserCard" />
      <UserCard
        :is-open="isUserCardOpen"
        :user-email="selectedUserEmail"
        @close="closeUserCard"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { usePostsStore } from "@/stores/posts.js";
import { useUserStore } from "@/stores/users.js";
import ThemeToggle from "@/components/ThemeToggle.vue";
import PostsTable from "@/components/PostsTable.vue";
import UserCard from "@/components/UserCard.vue";
const PS = usePostsStore();
const US = useUserStore();

const isUserCardOpen = ref(false);
const selectedUserEmail = ref("");

const searchPosts = () => {
  PS.fetchPosts(PS.searchQuery);
};

const openUserCard = (email) => {
  selectedUserEmail.value = email;
  isUserCardOpen.value = true;
  US.addUserWatched(email);
};

const closeUserCard = () => {
  isUserCardOpen.value = false;
  selectedUserEmail.value = "";
};

onMounted(async () => {
  await US.fetchUsers();
  await PS.fetchPosts();
});
</script>

<style>
@import "assets/styles/output.css";
</style>
