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
              <span class="w-0">
                {{ sortIcon(column.key) }}
              </span>
            </div>
          </th>
        </tr>
      </thead>
      <tbody
        class="h-[600px] bg-white dark:bg-gray-700 divide-y divide-gray-200"
      >
        <tr
          v-for="post in PS.sortedPosts"
          :key="post.id"
          class="hover:bg-gray-50 text-gray-700 dark:text-gray-300 hover:dark:text-gray-800"
        >
          <td
            v-for="column in columns"
            :key="`${post.id}-${column.key}`"
            class="h-[50px] px-4 py-2 text-sm truncate max-w-[150px]"
            :class="[
              column?.key === 'author' ? 'cursor-pointer' : 'cursor-default',
              {
                visited_user:
                  column?.key === 'author' && userIncludes(post[column.key]),
              },
            ]"
            :title="post[column.key]"
            @click="column.key === 'author' ? openUserCard(post.author) : ''"
          >
            {{ post[column.key] }}
          </td>
        </tr>

        <template v-if="rowsLoading">
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

        <tr v-else-if="PS.sortedPosts.length === 0 && !rowsLoading">
          <td colspan="4" class="p-3 text-center text-gray-500">
            Записей не найдено
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script setup>
import { usePostsStore } from "@/stores/posts.js";
import { useUserStore } from "@/stores/users.js";
import { defineEmits, computed } from "vue";

const emit = defineEmits(["openUserCard"]);
const PS = usePostsStore();
const US = useUserStore();
const columns = [
  {
    key: "id",
    label: "ID",
  },
  {
    key: "title",
    label: "Заголовок",
  },
  {
    key: "author",
    label: "Автор",
  },
  {
    key: "body",
    label: "Контент",
  },
];
const rowsLoading = computed(() => {
  return PS.loading || US.loading;
});
const userIncludes = (email) => {
  return [...US.watchedUsers].includes(email?.toLowerCase());
};
const sortIcon = (field) => {
  if (PS.sortField !== field) return "↕";
  return PS.sortDirection === "asc" ? "↓" : "↑";
};

const handleScroll = (event) => {
  const { scrollTop, scrollHeight, clientHeight } = event.target;
  if (scrollHeight - (scrollTop + clientHeight) < 50) {
    PS.loadMorePosts();
  }
};
const handleSort = (field) => {
  PS.sortPosts(field);
};

const openUserCard = (email) => {
  emit("openUserCard", email);
};
</script>
<style scoped>
.visited_user {
  color: #6090ff;
}
</style>
