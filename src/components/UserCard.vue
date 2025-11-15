<template>
  <transition
    enter-active-class="transition-opacity duration-500 ease-out"
    enter-from-class="opacity-0"
    enter-to-class="opacity-100"
    leave-active-class="transition-opacity duration-400 ease-out"
    leave-from-class="opacity-100"
    leave-to-class="opacity-0"
  >
    <div
      v-if="isOpen"
      class="fixed inset-0 background-modal flex items-center justify-center z-50 p-4"
      @click="closeModal"
    >
      <div
        class="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        @click.stop
      >
        <div class="p-6">
          <h2 class="text-2xl font-bold text-gray-900 mb-4">
            Пользователь {{ userData.email }}
          </h2>

          <div class="space-y-3">
            <div v-for="row in rowList" :key="`item-${row}`">
              <label class="text-sm font-medium text-gray-500">{{
                row.label
              }}</label>
              <p
                class="text-gray-900"
                v-if="row?.type === 'link' && userData.website"
              >
                <a
                  :href="`https://${userData.website}`"
                  target="_blank"
                  class="text-blue-600 hover:text-blue-800 hover:underline"
                >
                  {{ userData.website }}
                </a>
              </p>
              <p v-else class="text-gray-900">
                {{ userData[row.key] || "Нет" }}
              </p>
            </div>
          </div>

          <div class="mt-6 flex justify-end">
            <button
              @click="closeModal"
              class="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors cursor-pointer"
            >
              Закрыть
            </button>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>

<script setup>
import { computed, defineProps, defineEmits } from "vue";
import { useUserStore } from "@/stores/users.js";

const props = defineProps({
  isOpen: Boolean,
  userEmail: String,
});

const rowList = [
  {
    label: "Имя",
    key: "name",
  },
  {
    label: "Логин",
    key: "username",
  },
  {
    label: "Телефон",
    key: "phone",
  },
  {
    label: "Веб-сайт",
    key: "website",
    type: "link",
  },
  {
    label: "Название компании",
    key: "companyName",
  },
  {
    label: "Адрес",
    key: "formatedAddress",
  },
];

const emit = defineEmits(["close"]);

const userStore = useUserStore();

const userData = computed(() => {
  return userStore.getUserByEmail(props.userEmail) || {};
});

const closeModal = () => {
  emit("close");
};
</script>
<style scoped>
.background-modal {
  background-color: rgba(0, 0, 0, 0.7);
}
</style>
