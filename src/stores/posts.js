import { defineStore } from "pinia";
import { ref, computed } from "vue";
import { useUserStore } from "./users.js";
export const usePostsStore = defineStore("posts", () => {
  const posts = ref([]);
  const loading = ref(false);
  const currentPage = ref(1);
  const itemsPerPage = 30;
  const searchQuery = ref("");
  const sortField = ref("id");
  const sortDirection = ref("asc");
  const userStore = useUserStore();

  const fetchPosts = async () => {
    loading.value = true;
    posts.value = [];
    try {
      let url = "https://jsonplaceholder.typicode.com/posts";
      if (searchQuery.value) {
        url += `?title_like=${encodeURIComponent(searchQuery.value)}`;
      }

      const response = await fetch(url);
      const allPosts = await response.json();

      posts.value = allPosts;
      currentPage.value = 1;
    } catch (error) {
      alert("Сервис временно недоступен. Пожалуйста попробуйте позже.");
      console.error("Ошибка загрузки:", error);
    } finally {
      loading.value = false;
    }
  };

  const enrichedPosts = computed(() => {
    return posts.value.map((post) => ({
      ...post,
      author: userStore.getUserEmailById(post.userId),
    }));
  });

  const sortedPosts = computed(() => {
    const sorted = [...enrichedPosts.value].sort((a, b) => {
      let aValue = a[sortField.value];
      let bValue = b[sortField.value];

      if (aValue < bValue) return sortDirection.value === "asc" ? -1 : 1;
      if (aValue > bValue) return sortDirection.value === "asc" ? 1 : -1;
      return 0;
    });

    return sorted.slice(0, currentPage.value * itemsPerPage);
  });

  const sortPosts = (field) => {
    if (sortField.value === field) {
      sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
    } else {
      sortField.value = field;
      sortDirection.value = "asc";
    }
    currentPage.value = 1;
  };

  const loadMorePosts = () => {
    if (currentPage.value * itemsPerPage < enrichedPosts.value.length) {
      currentPage.value += 1;
    }
  };

  const hasMorePosts = computed(() => {
    return currentPage.value * itemsPerPage < sortedPosts.value.length;
  });
  return {
    posts,
    loading,
    searchQuery,
    sortField,
    sortDirection,
    fetchPosts,
    sortPosts,
    sortedPosts,
    enrichedPosts,
    loadMorePosts,
    hasMorePosts,
  };
});
