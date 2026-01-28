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
      if (response.success && response.data && response.data.length > 0) {
        contacts.value = response.data[0];
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
