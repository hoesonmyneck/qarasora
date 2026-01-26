<template>
  <section class="relative overflow-x-hidden px-6 py-20 max-w-full">
    <div
      class="pointer-events-none absolute right-10 top-12 h-72 w-72 rounded-full bg-clay/20 blur-3xl parallax-layer"
      data-parallax
      data-speed="0.11"
    ></div>
    <div
      class="pointer-events-none absolute left-16 top-20 h-32 w-32 rounded-full border border-white/10 parallax-layer"
      data-parallax
      data-speed="0.07"
    ></div>
    <div class="mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          {{ t("events.tagline") }}
        </p>
        <h1 class="text-3xl font-semibold">{{ t("events.title") }}</h1>
        <p class="text-mist/70">
          {{ t("events.body") }}
        </p>
      </div>
      <!-- Закрепленная новость -->
      <div
        v-if="pinnedNews"
        class="spotlight-card rounded-3xl border-2 border-hemp/50 bg-hemp/5 p-6 backdrop-blur transition hover:scale-[1.02] lg:p-8 cursor-pointer"
        @mousemove="setSpotlight"
        @mouseleave="clearSpotlight"
        @click="openModal(pinnedNews)"
      >
        <div class="space-y-3 max-w-full">
          <div class="inline-flex items-center gap-2 rounded-full bg-hemp px-3 py-1 text-xs font-semibold">
            📌 Закреплено
          </div>
          <img
            v-if="pinnedNews.image_url"
            :src="`http://localhost:3001${pinnedNews.image_url}`"
            :alt="pinnedNews.title"
            class="w-full h-64 object-cover rounded-2xl"
          />
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            {{ new Date(pinnedNews.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
          <p class="text-2xl font-semibold force-text-wrap">
            {{ pinnedNews.title }}
          </p>
          <p class="text-sm text-mist/70 force-text-wrap line-clamp-3">
            {{ pinnedNews.detail }}
          </p>
        </div>
      </div>

      <!-- Остальные новости -->
      <div v-if="unpinnedNews.length > 0" class="grid gap-5 lg:grid-cols-2">
        <article
          v-for="news in unpinnedNews"
          :key="news.id"
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02] max-w-full cursor-pointer"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
          @click="openModal(news)"
        >
          <img
            v-if="news.image_url"
            :src="`http://localhost:3001${news.image_url}`"
            :alt="news.title"
            class="w-full h-48 object-cover rounded-2xl mb-4"
          />
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            {{ new Date(news.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
          </p>
          <p class="mt-2 text-lg font-semibold force-text-wrap">
            {{ news.title }}
          </p>
          <p class="mt-2 text-sm text-mist/70 force-text-wrap line-clamp-3">
            {{ news.detail ? (news.detail.length > 150 ? news.detail.substring(0, 150) + '...' : news.detail) : '' }}
          </p>
        </article>
      </div>
    </div>

    <!-- Модальное окно -->
    <Transition name="modal">
      <div
        v-if="selectedNews"
        class="fixed inset-0 z-50 flex items-center justify-center px-4 py-8"
        @click="closeModal"
      >
        <div class="absolute inset-0 bg-black/80 backdrop-blur-sm"></div>
        
        <div
          class="relative z-10 w-full max-h-[90vh] overflow-y-auto glass rounded-3xl p-6 lg:p-8"
          style="max-width: 1500px;"
          @click.stop
        >
          <!-- Крестик закрытия -->
          <button
            type="button"
            class="absolute top-4 right-4 lg:top-6 lg:right-6 flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/40 text-white/80 transition hover:bg-white/10 hover:text-white hover:scale-110"
            @click="closeModal"
          >
            ✕
          </button>

          <!-- Содержимое модального окна -->
          <div class="space-y-4 pr-12">
            <div v-if="selectedNews.pinned" class="inline-flex items-center gap-2 rounded-full bg-hemp px-3 py-1 text-xs font-semibold">
              📌 Закреплено
            </div>
            
            <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
              {{ new Date(selectedNews.date).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric' }) }}
            </p>
            
            <h2 class="text-2xl lg:text-3xl font-semibold force-text-wrap">
              {{ selectedNews.title }}
            </h2>
            
            <img
              v-if="selectedNews.image_url"
              :src="`http://localhost:3001${selectedNews.image_url}`"
              :alt="selectedNews.title"
              class="w-full max-h-96 object-cover rounded-2xl"
            />
            
            <div class="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>
            
            <div class="text-sm lg:text-base text-mist/80 force-text-wrap whitespace-pre-line leading-relaxed">
              {{ selectedNews.detail }}
            </div>
          </div>
        </div>
      </div>
    </Transition>
  </section>
</template>

<script lang="ts">
export default {
  name: 'EventsPage'
}
</script>

<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { useI18n } from "../i18n";
import { newsApi } from "../services/api";

const { t } = useI18n();
const newsItems = ref<any[]>([]);
const selectedNews = ref<any>(null);

// Закрепленная новость
const pinnedNews = computed(() => {
  return newsItems.value.find((news) => news.pinned);
});

// Незакрепленные новости
const unpinnedNews = computed(() => {
  return newsItems.value.filter((news) => !news.pinned);
});

// Модальное окно
const openModal = (news: any) => {
  selectedNews.value = news;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedNews.value = null;
  document.body.style.overflow = '';
};

const setSpotlight = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  target.style.setProperty("--x", `${x}px`);
  target.style.setProperty("--y", `${y}px`);
};

const clearSpotlight = (event: MouseEvent) => {
  const target = event.currentTarget as HTMLElement;
  const rect = target.getBoundingClientRect();
  const x = Math.max(0, Math.min(event.clientX - rect.left, rect.width));
  const y = Math.max(0, Math.min(event.clientY - rect.top, rect.height));
  target.style.setProperty("--x", `${x}px`);
  target.style.setProperty("--y", `${y}px`);
};

const loadNews = async () => {
  try {
    const response = await newsApi.getAll();
    if (response.success && response.data) {
      newsItems.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки новостей:', error);
  }
};

onMounted(() => {
  loadNews();
});
</script>

<style scoped>
/* Анимация модального окна */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.3s ease;
}

.modal-enter-active .glass,
.modal-leave-active .glass {
  transition: transform 0.3s ease, opacity 0.3s ease;
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-from .glass {
  transform: scale(0.9) translateY(20px);
  opacity: 0;
}

.modal-leave-to .glass {
  transform: scale(0.95) translateY(10px);
  opacity: 0;
}
</style>
