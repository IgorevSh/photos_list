import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useThemeStore = defineStore("theme", () => {
  const isDark = ref(false);

  if (typeof window !== "undefined") {
    isDark.value = localStorage.getItem("theme") === "dark";
  }
  watch(
    isDark,
    (val) => {
      if (typeof window !== "undefined") {
        if (val) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      }
    },
    { immediate: true }
  );

  const toggleTheme = () => {
    isDark.value = !isDark.value;
  };

  return { isDark, toggleTheme };
});
