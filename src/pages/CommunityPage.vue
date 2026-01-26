<template>
  <section class="relative overflow-hidden px-6 py-20">
    <div
      class="pointer-events-none absolute left-6 top-8 h-52 w-52 rounded-full bg-hemp/20 blur-2xl parallax-layer"
      data-parallax
      data-speed="0.09"
    ></div>
    <div
      class="pointer-events-none absolute right-12 top-16 h-40 w-40 rounded-3xl border border-white/10 parallax-layer"
      data-parallax
      data-speed="0.06"
    ></div>
    <div class="mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          Наше сообщество
        </p>
        <h1 class="text-3xl font-semibold">Закрытое пространство практиков</h1>
        <p class="text-mist/70">
          Мы строим профессиональное ядро отрасли, где знания и ресурсы остаются
          внутри сообщества.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-3">
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Закрытый чат</p>
          <p class="mt-3 text-sm text-mist/70">
            Основная площадка для ежедневного обмена опытом.
          </p>
        </div>
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Экспертный совет</p>
          <p class="mt-3 text-sm text-mist/70">
            Агрономы, юристы и логисты с проверенной практикой.
          </p>
        </div>
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Партнеры</p>
          <p class="mt-3 text-sm text-mist/70">
            Лаборатории, поставщики семян, перерабатывающие компании.
          </p>
        </div>
      </div>
      <div
        class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02] lg:flex lg:items-center lg:justify-between"
        @mousemove="setSpotlight"
        @mouseleave="clearSpotlight"
      >
        <div class="space-y-2">
          <p class="text-lg font-semibold">Личный кабинет участника</p>
          <p class="text-sm text-mist/70">
            Доступ к интерактивной базе данных, библиотеке документов, календарю
            событий и ссылке на закрытый чат.
          </p>
        </div>
        <button
          class="mt-4 rounded-full border border-white/20 px-6 py-3 text-sm font-semibold lg:mt-0"
        >
          Перейти в кабинет
        </button>
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
