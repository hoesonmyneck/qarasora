<template>
  <section class="relative overflow-hidden px-6 py-20">
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
          {{ t("gallery.tagline") }}
        </p>
        <h1 class="text-3xl font-semibold">{{ t("gallery.title") }}</h1>
        <p class="text-mist/70">
          {{ t("gallery.body") }}
        </p>
      </div>

      <!-- Модальное окно для просмотра изображения -->
      <div
        v-if="selectedImage"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
        @click="closeModal"
      >
        <button
          class="absolute right-4 top-4 text-4xl text-white hover:text-mist/70 transition"
          @click="closeModal"
        >
          ×
        </button>
        <img
          :src="`${BACKEND_URL}${selectedImage.image_url}`"
          :alt="selectedImage.title"
          class="max-h-[90vh] max-w-full object-contain rounded-2xl"
          @click.stop
        />
        <div v-if="selectedImage.title" class="absolute bottom-8 left-1/2 -translate-x-1/2 bg-black/70 px-6 py-3 rounded-full">
          <p class="text-white text-sm">{{ selectedImage.title }}</p>
        </div>
      </div>

      <!-- Сетка фотографий -->
      <div v-if="images.length === 0" class="text-center text-mist/60 py-20">
        {{ t("gallery.empty") }}
      </div>
      <div v-else class="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="image in images"
          :key="image.id"
          class="spotlight-card group relative aspect-square overflow-hidden rounded-2xl cursor-pointer transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
          @click="openModal(image)"
        >
          <img
            :src="`${BACKEND_URL}${image.image_url}`"
            :alt="image.title"
            class="h-full w-full object-cover transition group-hover:scale-110"
          />
          <div
            v-if="image.title"
            class="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/80 to-transparent p-4 opacity-0 transition group-hover:opacity-100"
          >
            <p class="text-sm text-white">{{ image.title }}</p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'GalleryPage'
}
</script>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useI18n } from "../i18n";
import { galleryApi, BACKEND_URL } from "../services/api";

const { t } = useI18n();
const images = ref<any[]>([]);
const selectedImage = ref<any>(null);

const loadImages = async () => {
  try {
    const response = await galleryApi.getAll();
    if (response.success && response.data) {
      images.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки галереи:', error);
  }
};

onMounted(() => {
  loadImages();
});

const openModal = (image: any) => {
  selectedImage.value = image;
  document.body.style.overflow = 'hidden';
};

const closeModal = () => {
  selectedImage.value = null;
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
</script>
