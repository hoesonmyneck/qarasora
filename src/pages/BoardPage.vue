<template>
  <section class="relative overflow-hidden px-6 py-20">
    <div
      class="pointer-events-none absolute left-10 top-10 h-60 w-60 rounded-full bg-hemp/25 blur-2xl parallax-layer"
      data-parallax
      data-speed="0.09"
    ></div>
    <div
      class="pointer-events-none absolute right-12 top-24 h-36 w-36 rounded-3xl border border-white/10 parallax-layer"
      data-parallax
      data-speed="0.06"
    ></div>
    <div class="mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          {{ t("board.tagline") }}
        </p>
        <h1 class="text-3xl font-semibold">{{ t("board.title") }}</h1>
        <p class="text-mist/70">
          {{ t("board.body") }}
        </p>
      </div>
      <div class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <div
          v-for="member in boardMembers"
          :key="member.id"
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <img
            v-if="member.image_url"
            :src="`${BACKEND_URL}${member.image_url}`"
            :alt="member.name"
            class="h-16 w-16 rounded-full object-cover"
          />
          <div v-else class="h-16 w-16 rounded-full bg-white/10"></div>
          <p class="mt-4 text-lg font-semibold">{{ member.name }}</p>
          <p class="text-xs text-mist/60 mt-1">{{ member.position }}</p>
          <p v-if="member.description" class="mt-2 text-sm text-mist/70">{{ member.description }}</p>
        </div>
        
        <div
          v-if="boardMembers.length === 0"
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <div class="h-16 w-16 rounded-full bg-white/10"></div>
          <p class="mt-4 text-lg font-semibold">{{ t("board.chair.title") }}</p>
          <p class="text-sm text-mist/70">{{ t("board.chair.body") }}</p>
        </div>
      </div>
    </div>
  </section>
</template>

<script lang="ts">
export default {
  name: 'BoardPage'
}
</script>

<script setup lang="ts">
import { useI18n } from "../i18n";
import { BACKEND_URL } from "../services/api";
import { useBoard } from "../composables/useBoard";

const { t } = useI18n();
const { boardMembers } = useBoard();

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
