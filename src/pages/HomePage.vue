<template>
  <section class="relative overflow-hidden">
    <div
      class="pointer-events-none absolute left-0 top-0 h-full w-full section-grid opacity-40"
    ></div>
    <div
      class="pointer-events-none absolute -left-32 top-10 h-72 w-72 rounded-full bg-hemp/40 blur-3xl parallax-layer"
      data-parallax
      data-speed="0.18"
    ></div>
    <div
      class="pointer-events-none absolute right-0 top-32 h-96 w-96 rounded-full bg-clay/30 blur-3xl parallax-layer"
      data-parallax
      data-speed="0.12"
    ></div>
    <div class="mx-auto grid max-w-7xl gap-12 px-6 py-20 lg:grid-cols-[1.1fr_0.9fr]">
      <div class="flex h-full flex-col justify-between gap-8">
        <div class="space-y-8">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          {{ t("home.tagline") }}
        </p>
        <h1 class="text-4xl font-semibold leading-tight md:text-5xl">
          {{ t("home.title") }}
        </h1>
        <p class="text-lg text-mist/70">
          {{ t("home.body") }}
        </p>
        </div>
        <div>
          <div class="mb-6 flex flex-wrap gap-4">
            <RouterLink
              to="/membership"
              class="rounded-full bg-[#E07A2B] px-9 py-4 text-base font-semibold text-white shadow-[0_0_32px_rgba(91,126,61,0.7)] transition hover:scale-[1.02] hover:shadow-[0_0_46px_rgba(91,126,61,0.95)]"
            >
              {{ t("home.cta.join") }}
            </RouterLink>
            <RouterLink
              to="/industry"
              class="rounded-full border border-white/20 px-8 py-4 text-base font-semibold transition hover:scale-[1.02]"
            >
              {{ t("home.cta.industry") }}
            </RouterLink>
          </div>
          <div class="section-divider"></div>
          <div class="mt-6 grid gap-4 text-sm text-mist/70 md:grid-cols-3">
            <div
              class="glass spotlight-card cursor-default rounded-2xl px-4 py-3"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              {{ t("home.badge.data") }}
            </div>
            <div
              class="glass spotlight-card cursor-default rounded-2xl px-4 py-3"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              {{ t("home.badge.legal") }}
            </div>
          </div>
        </div>
      </div>
      <div class="relative">
        <div class="glass rounded-[28px] p-8 shadow-soft">
          <p class="text-base uppercase text-mist/60 cursor-default">
            {{ t("home.assoc.title") }}
          </p>
          <div class="mt-6 space-y-5">
            <div
              class="spotlight-card rounded-2xl border border-white/10 p-5 transition hover:scale-[1.02]"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              <div class="flex items-start gap-4">
                <img
                  :src="iconData"
                  :alt="t('home.icon.chart')"
                  class="h-16 w-16 rounded-2xl bg-white/10 p-3"
                />
                <div class="cursor-default">
                  <p class="text-base font-semibold">
                    {{ t("home.assoc.data.title") }}
                  </p>
                  <p class="text-sm text-mist/70 md:text-base">
                    {{ t("home.assoc.data.body") }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="spotlight-card rounded-2xl border border-white/10 p-5 transition hover:scale-[1.02]"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              <div class="flex items-start gap-4">
                <img
                  :src="iconDocument"
                  :alt="t('home.icon.document')"
                  class="h-16 w-16 rounded-2xl bg-white/10 p-3"
                />
                <div class="cursor-default">
                  <p class="text-base font-semibold">
                    {{ t("home.assoc.risk.title") }}
                  </p>
                  <p class="text-sm text-mist/70 md:text-base">
                    {{ t("home.assoc.risk.body") }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="spotlight-card rounded-2xl border border-white/10 p-5 transition hover:scale-[1.02]"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              <div class="flex items-start gap-4">
                <img
                  :src="iconExport"
                  :alt="t('home.icon.export')"
                  class="h-16 w-16 rounded-2xl bg-white/10 p-3"
                />
                <div class="cursor-default">
                  <p class="text-base font-semibold">
                    {{ t("home.assoc.export.title") }}
                  </p>
                  <p class="text-sm text-mist/70 md:text-base">
                    {{ t("home.assoc.export.body") }}
                  </p>
                </div>
              </div>
            </div>
            <div
              class="spotlight-card rounded-2xl border border-white/10 p-5 transition hover:scale-[1.02]"
              @mousemove="setSpotlight"
              @mouseleave="clearSpotlight"
            >
              <div class="flex items-start gap-4">
                <img
                  :src="iconCommunity"
                  :alt="t('home.icon.community')"
                  class="h-16 w-16 rounded-2xl bg-white/10 p-3"
                />
                <div class="cursor-default">
                  <p class="text-base font-semibold">
                    {{ t("home.assoc.community.title") }}
                  </p>
                  <p class="text-sm text-mist/70 md:text-base">
                    {{ t("home.assoc.community.body") }}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="relative mb-16 h-[340px] overflow-hidden md:h-[420px]">
    <div
      class="parallax-bg absolute left-0 right-0 -top-16 h-[calc(100%+128px)]"
      data-parallax-bg
      data-speed="0.6"
      :style="{ backgroundImage: `url(${heroImage})` }"
      role="img"
      :aria-label="t('home.image.alt')"
    ></div>
    <div class="absolute inset-0 bg-ink/40"></div>
    <div
      class="pointer-events-none absolute -left-16 -top-12 h-56 w-56 rounded-full bg-hemp/20 blur-2xl parallax-layer"
      data-parallax
      data-speed="0.06"
    ></div>
    <div
      class="pointer-events-none absolute right-10 top-6 h-40 w-40 rounded-full border border-white/10 parallax-layer"
      data-parallax
      data-speed="0.04"
    ></div>
  </section>

  
</template>

<script setup lang="ts">
import { RouterLink } from "vue-router";
import { useI18n } from "../i18n";
import heroImage from "../../4ae103d7-a832-422e-bf58-448c1ef08c6d.jpeg";
import iconData from "../assets/icon-data.svg";
import iconDocument from "../assets/icon-document.svg";
import iconExport from "../assets/icon-export.svg";
import iconCommunity from "../assets/icon-community.svg";

const { t } = useI18n();

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
