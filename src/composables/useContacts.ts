import { ref } from 'vue';
import { contactsApi } from '../services/api';

const contacts = ref<any>(null);
const isLoading = ref(false);
const isLoaded = ref(false);

export function useContacts() {
  const loadContacts = async () => {
    if (isLoaded.value) {
      return; // Данные уже загружены
    }

    if (isLoading.value) {
      return; // Уже загружаем
    }

    isLoading.value = true;
    try {
      const response = await contactsApi.get();
      if (response.success && response.data) {
        contacts.value = response.data;
        isLoaded.value = true;
      }
    } catch (error) {
      console.error('Ошибка загрузки контактов:', error);
    } finally {
      isLoading.value = false;
    }
  };

  return {
    contacts,
    isLoading,
    isLoaded,
    loadContacts
  };
}
