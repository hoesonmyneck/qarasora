<template>
  <section class="relative min-h-[78vh] overflow-hidden px-6 py-20">
    <div
      class="pointer-events-none absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-hemp/10 to-transparent"
    ></div>
    <div
      class="pointer-events-none absolute left-10 top-10 h-56 w-56 rounded-full bg-hemp/20 blur-2xl parallax-layer"
      data-parallax
      data-speed="0.1"
    ></div>
    <img
      :src="industryImage"
      alt="Исследования промышленной конопли"
      class="pointer-events-none absolute right-10 top-16 h-55 w-120 rounded-3xl border border-white/10 object-cover shadow-soft parallax-layer"
      data-parallax
      data-speed="0.06"
    />
    <div class="mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          Отрасль в Казахстане
        </p>
        <h1 class="text-3xl font-semibold">Почему промышленная конопля?</h1>
        <p class="text-mist/70">
          Переход к новой культуре — это инвестиция в устойчивость, экспортный
          потенциал и здоровье почвы.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-3 mt-40">
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Экономика</p>
          <p class="mt-3 text-sm text-mist/70">
            Культура с понятной экономикой: спрос на волокно, семена и костру уже
            сформирован в переработке и экспорте. Рентабельность достигается за
            счет комплексного использования сырья и выстраивания каналов сбыта.
            Государственная поддержка и прозрачные правила усиливают
            предсказуемость проекта.
          </p>
        </div>
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Агрономия</p>
          <p class="mt-3 text-sm text-mist/70">
            Подходит для климата Казахстана: культура засухоустойчива, быстро
            набирает зеленую массу и помогает восстанавливать структуру почвы.
            В севообороте улучшает состояние полей и снижает нагрузку на
            агрохимию при правильной агротехнике.
          </p>
        </div>
        <div
          class="glass spotlight-card rounded-3xl p-6 transition hover:scale-[1.02]"
          @mousemove="setSpotlight"
          @mouseleave="clearSpotlight"
        >
          <p class="text-lg font-semibold">Закон</p>
          <p class="mt-3 text-sm text-mist/70">
            Закон делает отрасль легальной и понятной: промышленное назначение
            культуры четко закреплено. Мы даем практичный разбор требований,
            лицензирования и отчетности — чтобы запуск был безопасным и
            соответствовал регуляторике.
          </p>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import industryImage from "../../1744804041scits_1000x768.jpg";

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
