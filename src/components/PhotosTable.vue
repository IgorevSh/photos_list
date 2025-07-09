<template>
  <div
    class="overflow-x-hidden max-h-[600px] min-w-[600px] mx-auto overflow-auto border border-gray-200 rounded-lg scrollbar"
    @scroll="handleScroll"
  >
    <table class="min-w-full divide-y divide-gray-200">
      <thead class="bg-gray-50 dark:bg-gray-800 sticky top-0 z-10">
        <tr class="h-[50px]">
          <th
            v-for="column in columns"
            :key="column.key"
            class="whitespace-nowrap px-4 py-2 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer hover:dark:bg-gray-900 hover:bg-gray-100"
            @click="handleSort(column.key)"
          >
            <div class="relative">
              {{ column.label }}
              <span v-if="props.sortField === column.key" class="w-0">
                {{
                  props.sortDirection === "asc"
                    ? "↓"
                    : props.sortDirection === "desc"
                    ? "↑"
                    : ""
                }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody
        class="h-[600px] bg-white dark:bg-gray-700 divide-y divide-gray-200"
      >
        <template v-if="props.loading">
          <tr v-for="i in 30" :key="`skeleton-${i}`">
            <td
              v-for="column in columns"
              :key="`skeleton-${column.key}`"
              class="h-[50px] px-4 py-2"
            >
              <div
                class="h-[25px] bg-gray-200 dark:bg-gray-700 rounded animate-pulse"
              ></div>
            </td>
          </tr>
        </template>
        <template v-else>
          <tr v-for="photo in props.photos" :key="photo.id">
            <td
              v-for="column in columns"
              :key="`${photo.id}-${column.key}`"
              class="h-[50px] px-4 py-2 text-sm text-gray-700 dark:text-gray-300 truncate max-w-[150px]"
              :title="photo[column.key]"
            >
              {{ photo[column.key] }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { defineProps, defineEmits } from "vue";

const props = defineProps({
  photos: {
    type: Array,
    required: true,
  },
  sortField: {
    type: String,
    default: null,
  },
  sortDirection: {
    type: String,
    default: "asc",
  },
  loading: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(["sort", "load-more"]);

const columns = [
  { key: "id", label: "ID" },
  { key: "albumId", label: "Альбом" },
  { key: "title", label: "Название" },
  { key: "url", label: "Ссылка" },
  { key: "thumbnailUrl", label: "Миниатюра" },
];

const handleSort = (field) => {
  emit("sort", field);
};

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    emit("load-more");
  }
};
</script>
