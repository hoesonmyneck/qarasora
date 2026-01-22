<template>
  <section class="relative overflow-hidden px-6 py-20">
    <div
      class="pointer-events-none absolute left-0 top-0 h-full w-full bg-gradient-to-b from-white/5 via-transparent to-transparent"
    ></div>
    <div
      class="pointer-events-none absolute right-10 top-16 h-72 w-72 rounded-full bg-clay/25 blur-3xl parallax-layer"
      data-parallax
      data-speed="0.14"
    ></div>
    <div class="mx-auto max-w-7xl space-y-10">
      <div class="space-y-3">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          Членство и выгода
        </p>
        <h1 class="text-3xl font-semibold">
          Инвестируйте в успех первого сезона
        </h1>
        <p class="text-mist/70">
          Условия членства обсуждаются после заявки — мы подбираем формат под
          масштаб хозяйства и задачи команды.
        </p>
      </div>
      <div class="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div class="grid gap-6 md:grid-cols-2">
          <div class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Живая база данных</p>
            <p class="mt-3 text-sm text-mist/70">
              Онлайн-карта с результатами и вызовами хозяйств участников.
            </p>
          </div>
          <div class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Библиотека первых шагов</p>
            <p class="mt-3 text-sm text-mist/70">
              Шаблоны договоров и заявок на лицензию.
            </p>
          </div>
          <div class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Организация экспорта</p>
            <p class="mt-3 text-sm text-mist/70">
              Поиск покупателей и логистика за рубежом.
            </p>
          </div>
          <div class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Закрытые мероприятия</p>
            <p class="mt-3 text-sm text-mist/70">
              Практические воркшопы и вебинары с экспертами.
            </p>
          </div>
        </div>
        <form class="bg-[#E07A2B] rounded-3xl p-6">
          <p class="text-lg font-semibold">Заявка на вступление</p>
          <div class="mt-4 space-y-4 text-sm text-mist/70">
            <input
              type="text"
              placeholder="Имя и фамилия"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Контакты (телефон / email)"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Регион"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
            <input
              type="text"
              placeholder="Планируемая площадь посева"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
          </div>
          <button
            type="button"
            class="mt-6 w-full bg-black rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink shadow-soft transition hover:scale-[1.02] hover:shadow-[0_0_28px_rgba(91,126,61,0.6)]"
          >
            Отправить заявку
          </button>
          <p class="mt-4 text-xs text-mist/60">
            *Стоимость членства обсуждается индивидуально после первичного контакта.
          </p>
        </form>
      </div>
    </div>
  </section>
</template>
