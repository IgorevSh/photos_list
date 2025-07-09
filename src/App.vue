<template>
  <div class="min-h-screen bg-gray-50 dark:bg-gray-800 py-8 px-4">
    <theme-toggle />
    <div class="max-w-[600px] mx-auto">
      <h1
        class="text-2xl mb-4 font-bold text-center text-gray-800 dark:text-gray-50"
      >
        Просмотр фотографий
      </h1>

      <div class="flex mb-4 gap-4">
        <input
          v-model="albumIdsInput"
          type="text"
          placeholder="Введите ID альбомов через пробел (например: 1 2 3)"
          class="flex-1 px-4 py-2 dark:text-gray-300 border border-gray-200 dark:border-gray-50 rounded-md focus:outline-none focus:border-blue-500"
        />
        <button
          @click="searchPhotos"
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

      <PhotosTable
        :photos="PS.visiblePhotos"
        :sort-field="PS.sortField"
        :sort-direction="PS.sortDirection"
        :loading="PS.loading"
        @sort="handleSort"
        @load-more="handleLoadMore"
      />
    </div>
  </div>
</template>
<script setup>
import { ref, onMounted } from "vue";
import { usePhotosStore } from "./stores/photos";
import PhotosTable from "./components/PhotosTable.vue";
import ThemeToggle from "@/components/ThemeToggle.vue";

const PS = usePhotosStore();
const albumIdsInput = ref(
  JSON.parse(localStorage.getItem("albumIds"))?.join(" ") || ""
);

const searchPhotos = () => {
  const ids = albumIdsInput.value
    .split(" ")
    .map((id) => id.trim())
    .filter((id) => id !== "");
  PS.fetchPhotos(ids);
};

const handleSort = (field) => {
  PS.sortBy(field);
};

const handleLoadMore = () => {
  PS.loadMore();
};

onMounted(() => {
  PS.fetchPhotos();
});
</script>

<style>
@import "assets/styles/output.css";
</style>
