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
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">Мероприятия</p>
        <h1 class="text-3xl font-semibold">Собираем отрасль офлайн</h1>
        <p class="text-mist/70">
          Формируем календарь практик и создаем площадки для решений.
        </p>
      </div>
      <div
        class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02] lg:flex lg:items-center lg:justify-between"
        @mousemove="setSpotlight"
        @mouseleave="clearSpotlight"
      >
        <div class="space-y-3">
          <div class="inline-flex items-center gap-2 rounded-full bg-hemp/20 px-3 py-1 text-xs font-semibold text-mist">
            Закрепленная новость
          </div>
          <p class="text-lg font-semibold">
            Национальный День Конопли Qarasora
          </p>
          <p class="text-sm text-mist/70">
            1 декабря 2026, Астана — итоги первого сезона и стратегическая
            сессия.
          </p>
        </div>
        <button class="mt-4 rounded-full bg-hemp px-6 py-3 text-sm font-semibold lg:mt-0">
          Забронировать участие
        </button>
      </div>

      <div class="grid gap-5 lg:grid-cols-2">
        <article
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            12 ноября 2026
          </p>
          <p class="mt-2 text-lg font-semibold">
            Открыт прием заявок на полевые воркшопы 2026
          </p>
          <p class="mt-2 text-sm text-mist/70">
            Посевная, уход и уборка на базе хозяйств участников. Места
            ограничены.
          </p>
        </article>
        <article
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            28 октября 2026
          </p>
          <p class="mt-2 text-lg font-semibold">
            Обновлены рекомендации по контрактам и лицензиям
          </p>
          <p class="mt-2 text-sm text-mist/70">
            В библиотеке появились новые шаблоны заявок и чек-листы по
            соответствию.
          </p>
        </article>
        <article
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            10 октября 2026
          </p>
          <p class="mt-2 text-lg font-semibold">
            Подписан меморандум с логистическими партнерами
          </p>
          <p class="mt-2 text-sm text-mist/70">
            Доступны новые маршруты для экспорта волокна и семян.
          </p>
        </article>
        <article
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-xs uppercase tracking-[0.2em] text-mist/60">
            22 сентября 2026
          </p>
          <p class="mt-2 text-lg font-semibold">
            Итоги пилотного сезона: результаты первых хозяйств
          </p>
          <p class="mt-2 text-sm text-mist/70">
            Делимся данными по урожайности и выводами агрономов.
          </p>
        </article>
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
