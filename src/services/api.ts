const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';
// Базовый URL для статических файлов (изображений, документов)
export const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') || 'http://localhost:3001';

interface ApiResponse<T = any> {
  success: boolean;
  message?: string;
  data?: T;
}

// Получение токена из localStorage
const getToken = (): string | null => {
  return localStorage.getItem('qarasora-token');
};

// Сохранение токена в localStorage
const saveToken = (token: string): void => {
  localStorage.setItem('qarasora-token', token);
};

// Удаление токена из localStorage
const removeToken = (): void => {
  localStorage.removeItem('qarasora-token');
};

// Базовая функция для выполнения запросов
async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken();
  
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
      ...options,
      headers,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка запроса');
    }

    return data;
  } catch (error) {
    console.error('API Error:', error);
    throw error;
  }
}

// Авторизация
export const authApi = {
  async login(username: string, password: string) {
    const response = await fetchApi<{ token: string; user: any }>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    });
    
    if (response.data?.token) {
      saveToken(response.data.token);
    }
    
    return response;
  },

  async logout() {
    const response = await fetchApi('/auth/logout', {
      method: 'POST',
    });
    removeToken();
    return response;
  },

  async me() {
    return fetchApi('/auth/me');
  },
};

// Пользователи
export const usersApi = {
  async create(username: string, password: string, isAdmin: boolean = false) {
    return fetchApi('/users', {
      method: 'POST',
      body: JSON.stringify({ username, password, isAdmin }),
    });
  },

  async getAll() {
    return fetchApi('/users');
  },

  async update(id: number, username: string, password?: string, isAdmin?: boolean) {
    const body: any = { username };
    if (password) body.password = password;
    if (isAdmin !== undefined) body.isAdmin = isAdmin;
    
    return fetchApi(`/users/${id}`, {
      method: 'PUT',
      body: JSON.stringify(body),
    });
  },

  async delete(id: number) {
    return fetchApi(`/users/${id}`, {
      method: 'DELETE',
    });
  },
};

// Новости
export const newsApi = {
  async getAll() {
    return fetchApi('/news');
  },

  async getById(id: number) {
    return fetchApi(`/news/${id}`);
  },

  async create(title: string, body: string, detail: string, pinned: boolean = false, image?: File) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('detail', detail);
    formData.append('pinned', pinned.toString());
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/news`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async update(id: number, title: string, body: string, detail: string, pinned?: boolean, image?: File, removeImage?: boolean) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('body', body);
    formData.append('detail', detail);
    if (pinned !== undefined) formData.append('pinned', pinned.toString());
    if (removeImage) formData.append('removeImage', 'true');
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/news/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async pin(id: number, pinned: boolean) {
    return fetchApi(`/news/${id}/pin`, {
      method: 'PATCH',
      body: JSON.stringify({ pinned }),
    });
  },

  async delete(id: number) {
    return fetchApi(`/news/${id}`, {
      method: 'DELETE',
    });
  },
};

// Фермы
export const farmsApi = {
  async getAll() {
    return fetchApi('/farms');
  },

  async getById(id: number) {
    return fetchApi(`/farms/${id}`);
  },

  async create(data: {
    name: string;
    region: string;
    area: string;
    lat: number;
    lng: number;
    note: string;
  }) {
    return fetchApi('/farms', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  async update(
    id: number,
    data: {
      name: string;
      region: string;
      area: string;
      lat: number;
      lng: number;
      note: string;
    }
  ) {
    return fetchApi(`/farms/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  },

  async delete(id: number) {
    return fetchApi(`/farms/${id}`, {
      method: 'DELETE',
    });
  },
};

// Документы
export const documentsApi = {
  async getAll() {
    return fetchApi('/documents');
  },

  async getById(id: number) {
    return fetchApi(`/documents/${id}`);
  },

  async upload(name: string, file: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append('name', name);
    formData.append('file', file);

    const response = await fetch(`${API_BASE_URL}/documents`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка загрузки файла');
    }

    return data;
  },

  async update(id: number, name: string, file?: File) {
    const token = getToken();
    const formData = new FormData();
    formData.append('name', name);
    if (file) {
      formData.append('file', file);
    }

    const response = await fetch(`${API_BASE_URL}/documents/${id}`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Ошибка обновления документа');
    }

    return data;
  },

  async download(id: number) {
    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/documents/${id}/download`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error('Ошибка скачивания файла');
    }

    return response.blob();
  },

  async delete(id: number) {
    return fetchApi(`/documents/${id}`, {
      method: 'DELETE',
    });
  },
};

// Заявки
export const applicationsApi = {
  async create(name: string, contact: string, region?: string, area?: string) {
    return fetchApi('/applications', {
      method: 'POST',
      body: JSON.stringify({ name, contact, region, area }),
    });
  },

  async getAll() {
    return fetchApi('/applications');
  },

  async updateStatus(id: number, status: 'pending' | 'approved' | 'rejected') {
    return fetchApi(`/applications/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    });
  },

  async delete(id: number) {
    return fetchApi(`/applications/${id}`, {
      method: 'DELETE',
    });
  },
};

// Контакты
export const contactsApi = {
  async get() {
    return fetchApi('/contacts');
  },

  async update(id: number, title: string, address: string, phone: string, telegram: string, email: string, image?: File, removeImage?: boolean) {
    const formData = new FormData();
    formData.append('title', title);
    formData.append('address', address);
    formData.append('phone', phone);
    formData.append('telegram', telegram);
    formData.append('email', email);
    if (removeImage) formData.append('removeImage', 'true');
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/contacts/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },
};

// Правление
export const boardApi = {
  async getAll() {
    return fetchApi('/board');
  },

  async create(name: string, position: string, description: string, image?: File) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('description', description);
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/board`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async update(id: number, name: string, position: string, description: string, image?: File, removeImage?: boolean) {
    const formData = new FormData();
    formData.append('name', name);
    formData.append('position', position);
    formData.append('description', description);
    if (removeImage) formData.append('removeImage', 'true');
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/board/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async delete(id: number) {
    return fetchApi(`/board/${id}`, {
      method: 'DELETE',
    });
  },
};

// Настройки
export const settingsApi = {
  async get() {
    return fetchApi('/settings');
  },

  async update(id: number, telegram_chat_url: string) {
    return fetchApi(`/settings/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ telegram_chat_url }),
    });
  },
};

// Галерея
export const galleryApi = {
  async getAll() {
    return fetchApi('/gallery');
  },

  async create(title: string, image: File) {
    const formData = new FormData();
    if (title) formData.append('title', title);
    formData.append('image', image);

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/gallery`, {
      method: 'POST',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async update(id: number, title: string, image?: File, removeImage?: boolean) {
    const formData = new FormData();
    if (title) formData.append('title', title);
    if (removeImage) formData.append('removeImage', 'true');
    if (image) {
      formData.append('image', image);
    }

    const token = getToken();
    const response = await fetch(`${API_BASE_URL}/gallery/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': token ? `Bearer ${token}` : '',
      },
      body: formData,
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Ошибка запроса');
    }

    return response.json();
  },

  async delete(id: number) {
    return fetchApi(`/gallery/${id}`, {
      method: 'DELETE',
    });
  },
};

export { getToken, saveToken, removeToken };
