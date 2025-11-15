import { defineStore } from "pinia";
import { ref } from "vue";
export const useUserStore = defineStore("users", () => {
  const users = ref([]);
  const loading = ref(false);

  const watchedUsers = ref(
    new Set(JSON.parse(localStorage.getItem("watchedUsers") || "[]"))
  );

  const fetchUsers = async () => {
    loading.value = true;
    try {
      const response = await fetch(
        "https://jsonplaceholder.typicode.com/users"
      );
      users.value = await response.json();
      users.value = formatUserList(users.value);
    } catch (error) {
      alert("Сервис временно недоступен. Пожалуйста попробуйте позже.");
      console.error("Ошибка загрузки:", error);
    } finally {
      loading.value = false;
    }
  };

  const getUserById = (id) => {
    return users.value.find((user) => user.id === id);
  };

  const getUserByEmail = (email) => {
    return users.value.find((user) => user.email === email);
  };

  const getUserEmailById = (id) => {
    const user = getUserById(id);
    return user ? user.email : "Нет";
  };

  const formatUserList = (users) => {
    return users.map((user) => {
      return Object.assign(user, {
        companyName: user.company?.name,
        formatedAddress: formatUserAddress(user?.address),
      });
    });
  };

  const formatUserAddress = (address) => {
    if (!address) return "";
    const { street, suite, city } = address;
    return [street, suite, city].filter(Boolean).join(", ");
  };

  const addUserWatched = (user) => {
    watchedUsers.value.add(user?.toLowerCase());
    localStorage.setItem(
      "watchedUsers",
      JSON.stringify([...watchedUsers.value])
    );
  };

  return {
    users,
    loading,
    fetchUsers,
    getUserById,
    getUserByEmail,
    getUserEmailById,
    formatUserAddress,
    addUserWatched,
    watchedUsers,
  };
});
