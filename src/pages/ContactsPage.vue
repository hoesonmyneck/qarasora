<template>
  <section class="relative overflow-hidden px-6 py-20">
    <div
      class="pointer-events-none fixed right-0 top-0 z-0 h-[50vh] w-1/2 bg-gradient-to-l from-white/5 to-transparent"
    ></div>
    <div
      class="pointer-events-none absolute left-12 top-12 h-40 w-40 rounded-full border border-white/10 parallax-layer"
      data-parallax
      data-speed="0.07"
    ></div>
    <div class="relative z-10 mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">Контакты</p>
        <h1 class="text-3xl font-semibold">Свяжитесь с командой Qarasora</h1>
        <p class="text-mist/70">
          Мы на связи по всем вопросам членства, партнерств и международных
          коммуникаций.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Офис в Казахстане</p>
          <p class="mt-3 text-sm text-mist/70">
            Адрес, телефон, email координатора.
          </p>
          <div class="mt-6 space-y-3 text-sm text-mist/70">
            <p>Международные связи: контакт Асета Бейсенова.</p>
            <p>Закрытый Telegram-канал для членов — доступ после вступления.</p>
          </div>
        </div>
        
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
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
