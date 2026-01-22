<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref, watch } from "vue";
import { RouterLink, RouterView, useRoute } from "vue-router";

const navLinks = [
  { to: "/", label: "Главная" },
  { to: "/industry", label: "Отрасль" },
  { to: "/membership", label: "Членство" },
  { to: "/community", label: "Сообщество" },
  { to: "/events", label: "Мероприятия" },
  { to: "/board", label: "Правление" },
  { to: "/contacts", label: "Контакты" },
];

const languages = ["RU", "KZ", "EN"] as const;
const activeLang = ref<(typeof languages)[number]>("RU");
const isLangOpen = ref(false);
const isMobileMenuOpen = ref(false);
const route = useRoute();

const isActive = (to: string) => route.path === to;
const logoTitle = computed(() => {
  if (route.path === "/") return "Qarasora";
  const current = navLinks.find((link) => link.to === route.path);
  return current ? `Qarasora / ${current.label}` : "Qarasora";
});

let layers: HTMLElement[] = [];
let bgLayers: HTMLElement[] = [];
let onScroll = () => {};
let update = () => {};

const refreshLayers = () => {
  layers = Array.from(document.querySelectorAll<HTMLElement>("[data-parallax]"));
  bgLayers = Array.from(
    document.querySelectorAll<HTMLElement>("[data-parallax-bg]")
  );
  update();
};

onMounted(() => {
  let ticking = false;

  update = () => {
    const scrollY = window.scrollY || window.pageYOffset;
    layers.forEach((layer) => {
      const speed = Number(layer.dataset.speed ?? "0.12");
      const offset = Math.round(scrollY * speed * -1);
      layer.style.setProperty("--parallax-offset", `${offset}px`);
    });
    bgLayers.forEach((layer) => {
      const speed = Number(layer.dataset.speed ?? "0.2");
      const rect = layer.getBoundingClientRect();
      const viewport = window.innerHeight || 800;
      const progress = Math.min(
        Math.max((viewport - rect.top) / (viewport + rect.height), 0),
        1
      );
      const offset = Math.round(progress * rect.height * speed * -1);
      layer.style.backgroundPosition = `center ${offset}px`;
    });
    ticking = false;
  };

  onScroll = () => {
    if (!ticking) {
      window.requestAnimationFrame(update);
      ticking = true;
    }
  };

  refreshLayers();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", update);
});

watch(
  () => route.fullPath,
  () => {
    requestAnimationFrame(refreshLayers);
  }
);

onUnmounted(() => {
  window.removeEventListener("scroll", onScroll);
  window.removeEventListener("resize", update);
});
</script>

<template>
  <div class="min-h-screen text-white">
    <header
      class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-ink"
      style="background-color: #0b1410"
    >
      <div class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <RouterLink to="/" class="flex items-center gap-3">
          <div class="logo-cut grid h-10 w-10 place-items-center bg-hemp/80 shadow-soft">
            <span class="text-base font-semibold text-ink">Q</span>
          </div>
          <div>
            <p class="w-[260px] truncate text-lg font-semibold tracking-wide">
              {{ logoTitle }}
            </p>
            <p class="text-xs uppercase text-mist/60">Ассоциация Казахстана</p>
          </div>
        </RouterLink>
        <nav class="hidden items-center gap-6 text-sm text-mist/70 lg:flex -translate-x-8">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="transition hover:text-white"
            :class="isActive(link.to) ? 'text-white' : ''"
          >
            {{ link.label }}
          </RouterLink>
        </nav>
        <div class="flex items-center gap-3">
          <button
            type="button"
            class="flex h-9 w-9 items-center justify-center rounded-full border border-white/10 bg-black/40 text-white lg:hidden"
            @click="isMobileMenuOpen = !isMobileMenuOpen"
            aria-label="Открыть меню"
          >
            <span class="text-lg">☰</span>
          </button>
          <div class="relative">
            <button
              type="button"
              class="flex w-[56px] items-center justify-between rounded-full border border-white/10 bg-black/30 px-3 py-1 text-xs font-semibold text-white"
              @click="isLangOpen = !isLangOpen"
            >
              {{ activeLang }}
              <span class="text-mist/60">▾</span>
            </button>
            <div
              class="absolute right-0 mt-2 w-[90px] rounded-2xl border border-white/10 bg-ink p-2 shadow-soft transition-all duration-200"
              :class="
                isLangOpen
                  ? 'pointer-events-auto scale-100 opacity-100'
                  : 'pointer-events-none scale-95 opacity-0'
              "
            >
              <button
                v-for="lang in languages"
                :key="lang"
                type="button"
                class="flex w-full items-center justify-between rounded-xl px-3 py-2 text-xs font-semibold text-mist/70 hover:bg-white/5 hover:text-white"
                @click="
                  activeLang = lang;
                  isLangOpen = false;
                "
              >
                {{ lang }}
              </button>
            </div>
          </div>
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-[#E07A2B] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(224,122,43,0.45)] transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(224,122,43,0.75)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" />
              <path
                d="M4 20C5.5 16.5 8.5 15 12 15C15.5 15 18.5 16.5 20 20"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Личный кабинет
          </button>
        </div>
      </div>
    </header>

    <div class="fixed inset-0 z-40 lg:hidden">
      <div
        class="absolute inset-0 bg-black/50 transition-opacity duration-200"
        :class="isMobileMenuOpen ? 'opacity-100' : 'pointer-events-none opacity-0'"
        @click="isMobileMenuOpen = false"
      ></div>
      <div
        class="absolute left-0 right-0 top-20 border-b border-white/10 bg-ink px-6 py-5 shadow-soft transition-all duration-200"
        style="background-color: #0b1410"
        :class="
          isMobileMenuOpen
            ? 'translate-y-0 opacity-100'
            : 'pointer-events-none -translate-y-3 opacity-0'
        "
      >
        <nav class="flex flex-col gap-4 text-sm text-mist/70">
          <RouterLink
            v-for="link in navLinks"
            :key="link.to"
            :to="link.to"
            class="transition hover:text-white"
            :class="isActive(link.to) ? 'text-white' : ''"
            @click="isMobileMenuOpen = false"
          >
            {{ link.label }}
          </RouterLink>
          <button
            type="button"
            class="flex items-center gap-2 rounded-full bg-[#E07A2B] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_20px_rgba(224,122,43,0.45)]"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <circle cx="12" cy="8" r="4" stroke="white" stroke-width="2" />
              <path
                d="M4 20C5.5 16.5 8.5 15 12 15C15.5 15 18.5 16.5 20 20"
                stroke="white"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
            Личный кабинет
          </button>
        </nav>
      </div>
    </div>

    <main class="pt-24">
      <RouterView />
    </main>

    <footer class="border-t border-white/10 px-6 py-8 text-sm text-mist/60">
      <div class="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 md:flex-row">
        <p>© 2026 Qarasora. Ассоциация промышленной конопли Казахстана.</p>
        <div class="flex items-center gap-4">
          <RouterLink to="/membership" class="hover:text-white">Вступить</RouterLink>
          <RouterLink to="/contacts" class="hover:text-white">Контакты</RouterLink>
        </div>
      </div>
    </footer>
  </div>
</template>
