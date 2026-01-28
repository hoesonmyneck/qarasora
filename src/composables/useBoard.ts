import { ref } from 'vue';
import { boardApi } from '../services/api';

const boardMembers = ref<any[]>([]);
const isLoading = ref(false);
const isLoaded = ref(false);

export function useBoard() {
  const loadBoard = async () => {
    if (isLoaded.value) {
      return; // Данные уже загружены
    }

    if (isLoading.value) {
      return; // Уже загружаем
    }

    isLoading.value = true;
    try {
      const response = await boardApi.getAll();
      if (response.success && response.data) {
        boardMembers.value = response.data;
        isLoaded.value = true;
      }
    } catch (error) {
      console.error('Ошибка загрузки правления:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    boardMembers,
    isLoading,
    isLoaded,
    loadBoard
  };
}
