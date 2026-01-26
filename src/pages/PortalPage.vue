<template>
  <section class="relative overflow-hidden px-6 py-5">
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-0 h-[50vh] bg-gradient-to-b from-white/5 via-transparent to-transparent"
    ></div>
    <div class="relative z-10 mx-auto max-w-6xl space-y-10">
      <div class="flex flex-wrap items-center justify-between gap-4">
        <p class="text-sm uppercase tracking-[0.2em] text-mist/60">
          {{ isAdmin ? t("admin.tagline") : t("portal.tagline") }}
        </p>
        <div v-if="isAuthenticated" class="flex items-center gap-3">
          <a
            v-if="!isAdmin"
            href="https://t.me/"
            target="_blank"
            rel="noreferrer"
            class="rounded-2xl bg-[#E0A22B] px-4 py-2 text-xs font-semibold text-ink shadow-[0_0_18px_rgba(224,162,43,0.45)] transition hover:shadow-[0_0_26px_rgba(224,162,43,0.7)]"
          >
            {{ t("portal.chat") }}
          </a>
          <button
            type="button"
            class="rounded-2xl bg-[#8F3B2E] px-4 py-2 text-xs font-semibold text-white shadow-[0_0_18px_rgba(143,59,46,0.45)] transition hover:shadow-[0_0_26px_rgba(143,59,46,0.7)]"
            @click="handleLogout"
          >
            {{ isAdmin ? t("admin.logout") : t("portal.logout") }}
          </button>
        </div>
      </div>

      <div v-if="!isAuthenticated" class="flex min-h-[60vh] items-center justify-center">
        <div class="glass w-full max-w-xl rounded-3xl p-6 md:p-8">
          <p class="text-lg font-semibold">{{ t("portal.login.title") }}</p>
          <p class="mt-2 text-sm text-mist/70">
            {{ t("portal.login.body") }}
          </p>
          <div class="mt-6 grid gap-4">
            <input
              v-model="login"
              type="text"
              :placeholder="t('portal.login.username')"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
            <input
              v-model="password"
              type="password"
              :placeholder="t('portal.login.password')"
              class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
            />
          </div>
          <label class="mt-4 flex items-center gap-3 text-sm text-mist/70">
            <input v-model="rememberMe" type="checkbox" class="h-4 w-4 accent-hemp" />
            {{ t("portal.login.remember") }}
          </label>
          <button
            type="button"
            class="mt-6 rounded-full bg-[#E07A2B] px-8 py-3 text-sm font-semibold text-white shadow-[0_0_24px_rgba(224,122,43,0.45)] transition hover:scale-[1.02] hover:shadow-[0_0_36px_rgba(224,122,43,0.7)]"
            @click="handleLogin"
          >
            {{ t("portal.login.submit") }}
          </button>
        </div>
      </div>

      <div v-else class="grid min-h-[70vh] gap-6 lg:grid-cols-[220px_1fr]">
        <aside class="glass rounded-3xl p-4">
          <div class="flex items-center gap-2 text-sm font-semibold text-mist/70">
            <span>☰</span>
            {{ t("portal.menu") }}
          </div>
          <div class="mt-4 flex h-full flex-col gap-2">
            <button
              v-for="tab in tabs"
              :key="tab.key"
              type="button"
              class="spotlight-card rounded-2xl px-4 py-3 text-left text-sm font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
              @mousemove.capture="setSpotlight"
              @mouseleave="clearSpotlight"
              :class="
                activeTab === tab.key
                  ? 'bg-hemp text-ink shadow-[0_0_20px_rgba(231,239,232,0.35)]'
                  : 'border border-white/10 text-mist/70 hover:text-white'
              "
              @click="activeTab = tab.key as any"
            >
              {{ t(tab.labelKey) }}
            </button>
          </div>
        </aside>

        <div v-if="!isAdmin">
          <div v-show="activeTab === 'database'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("portal.db.title") }}</p>
          <p class="mt-2 text-sm text-mist/70">
            {{ t("portal.db.body") }}
          </p>
          <div class="mt-6 space-y-4">
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm font-semibold">{{ t("portal.db.map") }}</p>
              <div
                ref="mapEl"
                class="mt-3 h-96 rounded-xl border border-white/10 bg-ink/70"
              ></div>
              <div class="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4">
                <p class="text-sm font-semibold">
                  {{ t("portal.db.selected") }}
                </p>
                <p class="mt-2 text-sm text-mist/70">
                  {{ t(selectedFarm.nameKey) }}
                </p>
                <p class="text-xs text-mist/60">
                  {{ t(selectedFarm.regionKey) }} · {{ t(selectedFarm.areaKey) }}
                </p>
                <p class="mt-2 text-xs text-mist/70">
                  {{ t(selectedFarm.noteKey) }}
                </p>
              </div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm font-semibold">{{ t("portal.db.table") }}</p>
              <div class="mt-3 space-y-2 text-xs text-mist/70">
                <div class="flex justify-between">
                  <span>{{ t("portal.db.row1.name") }}</span>
                  <span>{{ t("portal.db.row1.meta") }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t("portal.db.row2.name") }}</span>
                  <span>{{ t("portal.db.row2.meta") }}</span>
                </div>
                <div class="flex justify-between">
                  <span>{{ t("portal.db.row3.name") }}</span>
                  <span>{{ t("portal.db.row3.meta") }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div v-show="activeTab === 'documents'" class="glass rounded-3xl p-6">
          <p class="text-lg font-semibold">{{ t("portal.docs.title") }}</p>
          <p class="mt-2 text-sm text-mist/70">
            {{ t("portal.docs.body") }}
          </p>
          <ul class="mt-4 space-y-3 text-sm text-mist/70">
            <li
              class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
            >
              <span>{{ t("portal.docs.item1") }}</span>
              <button
                type="button"
                class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
              >
                {{ t("portal.docs.download") }}
              </button>
            </li>
            <li
              class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
            >
              <span>{{ t("portal.docs.item2") }}</span>
              <button
                type="button"
                class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
              >
                {{ t("portal.docs.download") }}
              </button>
            </li>
            <li
              class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
            >
              <span>{{ t("portal.docs.item3") }}</span>
              <button
                type="button"
                class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
              >
                {{ t("portal.docs.download") }}
              </button>
            </li>
          </ul>
        </div>

        <div v-show="activeTab === 'calendar'" class="glass rounded-3xl p-6">
          <p class="text-lg font-semibold">{{ t("portal.calendar.title") }}</p>
          <p class="mt-2 text-sm text-mist/70">
            {{ t("portal.calendar.body") }}
          </p>
          <div class="mt-6 space-y-3 text-sm text-mist/70">
            <div
              v-for="news in newsItems"
              :key="news.id"
              class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
              @click="toggleNews(news.id)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1">
                  <p>{{ t(news.dateKey) }} — {{ t(news.titleKey) }}</p>
                </div>
                <span
                  class="text-mist/60 transition"
                  :class="expandedNews.has(news.id) ? 'rotate-180' : ''"
                >
                  ▼
                </span>
              </div>
              <div
                class="overflow-hidden transition-all duration-200"
                :class="expandedNews.has(news.id) ? 'mt-3 max-h-96' : 'max-h-0'"
              >
                <p class="text-xs text-mist/70">
                  {{ t(news.bodyKey) }}
                </p>
                <p class="mt-2 text-xs text-mist/60">
                  {{ t(news.detailKey) }}
                </p>
              </div>
            </div>
          </div>
        </div>
        </div>

        <div v-if="isAdmin">
          <div v-show="activeTab === 'database'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("admin.db.title") }}</p>
            <p class="mt-2 text-sm text-mist/70">
              {{ t("admin.db.body") }}
            </p>
            <div class="mt-6 space-y-4">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">{{ t("admin.db.form.title") }}</p>
                <div class="grid gap-4">
                  <input
                    v-model="farmForm.name"
                    type="text"
                    :placeholder="t('admin.db.form.name')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="farmForm.region"
                    type="text"
                    :placeholder="t('admin.db.form.region')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="farmForm.area"
                    type="text"
                    :placeholder="t('admin.db.form.area')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="farmForm.lat"
                    type="number"
                    step="0.0001"
                    :placeholder="t('admin.db.form.lat')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="farmForm.lng"
                    type="number"
                    step="0.0001"
                    :placeholder="t('admin.db.form.lng')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <textarea
                    v-model="farmForm.note"
                    :placeholder="t('admin.db.form.note')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                    rows="3"
                  ></textarea>
                  <button
                    type="button"
                    class="rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                    @click="addFarm"
                  >
                    {{ t("admin.db.form.submit") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'documents'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("admin.docs.title") }}</p>
            <p class="mt-2 text-sm text-mist/70">
              {{ t("admin.docs.body") }}
            </p>
            <div class="mt-6 space-y-4">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">{{ t("admin.docs.form.title") }}</p>
                <div class="grid gap-4">
                  <input
                    v-model="docForm.name"
                    type="text"
                    :placeholder="t('admin.docs.form.name')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <div class="flex flex-col gap-2">
                    <label class="text-xs text-mist/60">{{ t("admin.docs.form.file") }}</label>
                    <input
                      type="file"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none text-sm"
                    />
                  </div>
                  <button
                    type="button"
                    class="rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                    @click="addDocument"
                  >
                    {{ t("admin.docs.form.submit") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'calendar'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("admin.calendar.title") }}</p>
            <p class="mt-2 text-sm text-mist/70">
              {{ t("admin.calendar.body") }}
            </p>
            <div class="mt-6 space-y-4">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">{{ t("admin.calendar.form.title") }}</p>
                <div class="grid gap-4">
                  <input
                    v-model="newsForm.title"
                    type="text"
                    :placeholder="t('admin.calendar.form.newsTitle')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <textarea
                    v-model="newsForm.detail"
                    :placeholder="t('admin.calendar.form.detail')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                    rows="5"
                  ></textarea>
                  <button
                    type="button"
                    class="rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                    @click="addNews"
                  >
                    {{ t("admin.calendar.form.submit") }}
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'accounts'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("admin.accounts.title") }}</p>
            <p class="mt-2 text-sm text-mist/70">
              {{ t("admin.accounts.body") }}
            </p>
            <div class="mt-6 space-y-4">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">{{ t("admin.accounts.form.title") }}</p>
                <div class="grid gap-4">
                  <input
                    v-model="accountForm.username"
                    type="text"
                    :placeholder="t('admin.accounts.form.username')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="accountForm.password"
                    type="password"
                    :placeholder="t('admin.accounts.form.password')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <button
                    type="button"
                    class="rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                    @click="createAccount"
                  >
                    {{ t("admin.accounts.form.submit") }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, nextTick, onUnmounted, ref, watch } from "vue";
import L from "leaflet";
import { useI18n } from "../i18n";

const { t } = useI18n();

const login = ref("");
const password = ref("");
const rememberMe = ref(false);

const storedAuth =
  typeof window !== "undefined" ? localStorage.getItem("qarasora-portal-auth") : null;
const storedAdmin =
  typeof window !== "undefined" ? localStorage.getItem("qarasora-admin-mode") : null;
const isAuthenticated = ref(storedAuth === "true");
const isAdmin = ref(storedAdmin === "true");

const mapEl = ref<HTMLDivElement | null>(null);
const mapInstance = ref<L.Map | null>(null);

const userTabs = [
  { key: "database" as const, labelKey: "portal.tabs.database" },
  { key: "documents" as const, labelKey: "portal.tabs.documents" },
  { key: "calendar" as const, labelKey: "portal.tabs.calendar" },
];

const adminTabs = [
  { key: "database" as const, labelKey: "admin.tabs.database" },
  { key: "documents" as const, labelKey: "admin.tabs.documents" },
  { key: "calendar" as const, labelKey: "admin.tabs.calendar" },
  { key: "accounts" as const, labelKey: "admin.tabs.accounts" },
];

const tabs = computed(() => (isAdmin.value ? adminTabs : userTabs));

const activeTab = ref<"database" | "documents" | "calendar" | "accounts">("database");

const newsItems = [
  {
    id: "news1",
    dateKey: "events.news1.date",
    titleKey: "events.news1.title",
    bodyKey: "events.news1.body",
    detailKey: "portal.calendar.news1.detail",
  },
  {
    id: "news2",
    dateKey: "events.news2.date",
    titleKey: "events.news2.title",
    bodyKey: "events.news2.body",
    detailKey: "portal.calendar.news2.detail",
  },
  {
    id: "news3",
    dateKey: "events.news3.date",
    titleKey: "events.news3.title",
    bodyKey: "events.news3.body",
    detailKey: "portal.calendar.news3.detail",
  },
  {
    id: "news4",
    dateKey: "events.news4.date",
    titleKey: "events.news4.title",
    bodyKey: "events.news4.body",
    detailKey: "portal.calendar.news4.detail",
  },
];

const expandedNews = ref<Set<string>>(new Set());

const toggleNews = (id: string) => {
  if (expandedNews.value.has(id)) {
    expandedNews.value.delete(id);
  } else {
    expandedNews.value.add(id);
  }
};

const farms = [
  {
    id: "farm1",
    lat: 51.1694,
    lng: 71.4491,
    nameKey: "portal.db.farm1.name",
    regionKey: "portal.db.farm1.region",
    areaKey: "portal.db.farm1.area",
    noteKey: "portal.db.farm1.note",
  },
  {
    id: "farm2",
    lat: 49.8064,
    lng: 73.0855,
    nameKey: "portal.db.farm2.name",
    regionKey: "portal.db.farm2.region",
    areaKey: "portal.db.farm2.area",
    noteKey: "portal.db.farm2.note",
  },
  {
    id: "farm3",
    lat: 43.2383,
    lng: 76.9453,
    nameKey: "portal.db.farm3.name",
    regionKey: "portal.db.farm3.region",
    areaKey: "portal.db.farm3.area",
    noteKey: "portal.db.farm3.note",
  },
];

const selectedFarm = ref(farms[0]);

const farmForm = ref({
  name: "",
  region: "",
  area: "",
  lat: "",
  lng: "",
  note: "",
});

const docForm = ref({
  name: "",
});

const newsForm = ref({
  title: "",
  detail: "",
});

const accountForm = ref({
  username: "",
  password: "",
});

const handleLogin = () => {
  if (login.value === "admin" && password.value === "admin") {
    isAdmin.value = true;
    isAuthenticated.value = true;
    if (typeof window !== "undefined") {
      localStorage.setItem("qarasora-portal-auth", "true");
      localStorage.setItem("qarasora-admin-mode", "true");
    }
  } else {
    isAdmin.value = false;
    isAuthenticated.value = true;
    if (rememberMe.value && typeof window !== "undefined") {
      localStorage.setItem("qarasora-portal-auth", "true");
    }
  }
  login.value = "";
  password.value = "";
};

const handleLogout = () => {
  isAuthenticated.value = false;
  isAdmin.value = false;
  login.value = "";
  password.value = "";
  rememberMe.value = false;
  if (typeof window !== "undefined") {
    localStorage.removeItem("qarasora-portal-auth");
    localStorage.removeItem("qarasora-admin-mode");
  }
};

const addFarm = () => {
  console.log("Добавление хозяйства:", farmForm.value);
  alert(`Хозяйство "${farmForm.value.name}" добавлено! (В будущем отправится на бекенд)`);
  farmForm.value = {
    name: "",
    region: "",
    area: "",
    lat: "",
    lng: "",
    note: "",
  };
};

const addDocument = () => {
  console.log("Добавление документа:", docForm.value);
  alert(`Документ "${docForm.value.name}" добавлен! (В будущем отправится на бекенд)`);
  docForm.value = {
    name: "",
  };
};

const addNews = () => {
  const currentDate = new Date().toLocaleDateString("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
  console.log("Добавление новости:", { ...newsForm.value, date: currentDate });
  alert(`Новость "${newsForm.value.title}" добавлена с датой ${currentDate}! (В будущем отправится на бекенд)`);
  newsForm.value = {
    title: "",
    detail: "",
  };
};

const createAccount = () => {
  console.log("Создание аккаунта:", accountForm.value);
  alert(
    `Аккаунт "${accountForm.value.username}" создан! (В будущем отправится на бекенд)`
  );
  accountForm.value = {
    username: "",
    password: "",
  };
};

const initMap = () => {
  if (!mapEl.value || mapInstance.value) return;
  const map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 10,
  }).addTo(map);

  const bounds = L.latLngBounds(
    farms.map((farm) => [farm.lat, farm.lng])
  );
  map.fitBounds(bounds.pad(0.6));

  const kzBounds = L.latLngBounds([40.5, 46.0], [55.5, 87.5]);
  map.setMaxBounds(kzBounds);

  farms.forEach((farm) => {
    const marker = L.circleMarker([farm.lat, farm.lng], {
      radius: 7,
      color: "#E07A2B",
      weight: 2,
      fillColor: "#E07A2B",
      fillOpacity: 0.9,
    }).addTo(map);
    marker.on("click", () => {
      selectedFarm.value = farm;
    });
  });

  mapInstance.value = map;
};

watch(
  [activeTab, isAuthenticated],
  async () => {
    if (activeTab.value !== "database" || !isAuthenticated.value) return;
    await nextTick();
    initMap();
    mapInstance.value?.invalidateSize();
  },
  { immediate: true }
);

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
  const x = event.clientX - rect.left;
  const y = event.clientY - rect.top;
  target.style.setProperty("--x", `${x}px`);
  target.style.setProperty("--y", `${y}px`);
};

onUnmounted(() => {
  mapInstance.value?.remove();
  mapInstance.value = null;
});
</script>
