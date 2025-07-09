import { defineStore } from "pinia";
import { ref, computed } from "vue";

export const usePhotosStore = defineStore("photos", () => {
  const photos = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const sortField = ref(null);
  const sortDirection = ref("asc");
  const visibleCount = ref(30);
  const savedAlbumIds = JSON.parse(localStorage.getItem("albumIds")) || [];
  const fetchPhotos = async (albumIds = savedAlbumIds) => {
    loading.value = true;
    error.value = null;
    photos.value = [];
    try {
      let url = "https://jsonplaceholder.typicode.com/photos";
      localStorage.setItem("albumIds", JSON.stringify(albumIds));
      if (albumIds.length > 0) {
        const queryParams = albumIds.map((id) => `albumId=${id}`).join("&");
        url += `?${queryParams}`;
      }

      const response = await fetch(url);
      if (!response.ok) throw new Error("Network response was not ok");
      photos.value = await response.json();
    } catch (err) {
      error.value = err.message;
      photos.value = [];
    } finally {
      loading.value = false;
      visibleCount.value = 30;
    }
  };

  const sortedPhotos = computed(() => {
    if (!sortField.value) return photos.value;

    return [...photos.value].sort((a, b) => {
      let comparison = 0;

      if (a[sortField.value] > b[sortField.value]) {
        comparison = 1;
      } else if (a[sortField.value] < b[sortField.value]) {
        comparison = -1;
      }

      return sortDirection.value === "asc"
        ? comparison
        : sortDirection.value === "desc"
        ? -comparison
        : 0;
    });
  });

  const visiblePhotos = computed(() => {
    return sortedPhotos.value.slice(0, visibleCount.value);
  });

  const loadMore = () => {
    if (visibleCount.value < sortedPhotos.value.length) {
      visibleCount.value += 30;
    }
  };

  const sortBy = (field) => {
    if (sortField.value === field) {
      sortDirection.value =
        sortDirection.value === "asc"
          ? "desc"
          : sortDirection.value === "desc"
          ? null
          : "asc";
    } else {
      sortField.value = field;
      sortDirection.value = "asc";
    }
  };

  return {
    photos,
    loading,
    error,
    visiblePhotos,
    visibleCount,
    sortedPhotos,
    fetchPhotos,
    loadMore,
    sortBy,
    sortField,
    sortDirection,
  };
});
