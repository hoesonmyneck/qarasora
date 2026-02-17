<template>
  <section class="relative overflow-x-hidden px-6 py-5 max-w-full">
    <div
      class="pointer-events-none fixed inset-x-0 top-0 z-0 h-[50vh] bg-gradient-to-b from-white/5 via-transparent to-transparent"
    ></div>
    <div class="relative z-10 mx-auto max-w-6xl space-y-10">
      <div class="flex flex-wrap items-center justify-end gap-4">
        <div v-if="isAuthenticated" class="flex items-center gap-3">
          <a
            v-if="!isAdmin"
            :href="telegramChatUrl"
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
        <div class="glass w-full rounded-3xl p-6 md:p-8" style="max-width: 400px;">
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

      <div v-else class="grid min-h-[40vh] lg:min-h-[70vh] gap-6 lg:grid-cols-[220px_1fr] overflow-x-hidden">
        <aside class="glass rounded-3xl p-4 !overflow-visible">
          <div class="flex items-center gap-2 text-sm font-semibold text-mist/70">
            <span>☰</span>
            {{ t("portal.menu") }}
          </div>
          <div class="mt-4 flex flex-col gap-2">
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

        <div v-if="!isAdmin" class="overflow-x-hidden max-w-full">
          <div v-show="activeTab === 'database'" class="glass rounded-3xl p-6 overflow-x-hidden">
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
              <div v-if="selectedFarm" class="mt-4 rounded-2xl border border-white/10 bg-black/20 p-4 max-w-full">
                <p class="text-sm font-semibold">
                  {{ t("portal.db.selected") }}
                </p>
                <p class="mt-2 text-sm text-mist/70 force-text-wrap">
                  {{ selectedFarm.name }}
                </p>
                <p class="text-xs text-mist/60 force-text-wrap">
                  {{ selectedFarm.region }} · {{ selectedFarm.area }}
                </p>
                <p class="mt-2 text-xs text-mist/70 force-text-wrap whitespace-pre-line">
                  {{ selectedFarm.note }}
                </p>
              </div>
            </div>
            <div class="rounded-2xl border border-white/10 bg-black/20 p-4">
              <p class="text-sm font-semibold">{{ t("portal.db.table") }}</p>
              <div v-if="farms.length === 0" class="mt-3 text-center text-xs text-mist/60">
                Нет данных о фермах
              </div>
              <div v-else class="mt-3 space-y-2 text-xs text-mist/70 max-w-full">
                <div 
                  v-for="farm in farms" 
                  :key="farm.id"
                  class="flex justify-between gap-2 py-1 hover:bg-white/5 rounded px-2 -mx-2 transition cursor-pointer min-w-0 max-w-full"
                  @click="selectedFarm = farm"
                  :class="selectedFarm?.id === farm.id ? 'bg-white/10' : ''"
                >
                  <span class="font-medium force-text-wrap flex-1 min-w-0">{{ farm.name }}</span>
                  <span class="text-mist/60 flex-shrink-0">{{ farm.region }} · {{ farm.area }}</span>
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
          <div v-if="documents.length === 0" class="mt-6 text-center text-sm text-mist/60">
            Документы пока не загружены
          </div>
          <ul v-else class="mt-4 space-y-3 text-sm text-mist/70">
            <li
              v-for="doc in documents"
              :key="doc.id"
              class="flex items-center justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
            >
              <div class="flex-1 min-w-0 max-w-full">
                <p class="font-medium force-text-wrap">{{ doc.name }}</p>
                <p class="text-xs text-mist/60 mt-1">
                  {{ (doc.size / 1024).toFixed(2) }} KB • {{ new Date(doc.created_at).toLocaleDateString('ru-RU') }}
                </p>
              </div>
              <button
                type="button"
                class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold text-white hover:bg-white/5"
                @click="downloadDocument(doc.id, doc.name)"
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
          <div v-if="newsItems.length === 0" class="mt-6 text-center text-sm text-mist/60">
            Новости пока не добавлены
          </div>
          <div v-else class="mt-6 space-y-3 text-sm text-mist/70">
            <div
              v-for="news in newsItems"
              :key="news.id"
              class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(231,239,232,0.25)]"
              @click="toggleNews(news.id)"
            >
              <div class="flex items-start justify-between gap-2">
                <div class="flex-1 min-w-0 max-w-full">
                  <p class="force-text-wrap">{{ new Date(news.date).toLocaleDateString('ru-RU') }} — {{ news.title }}</p>
                </div>
                <span
                  class="text-mist/60 transition flex-shrink-0"
                  :class="expandedNews.has(news.id) ? 'rotate-180' : ''"
                >
                  ▼
                </span>
              </div>
              <div
                class="overflow-hidden transition-all duration-200"
                :class="expandedNews.has(news.id) ? 'mt-3 max-h-[600px]' : 'max-h-0'"
              >
                <img
                  v-if="news.image_url"
                  :src="`${BACKEND_URL}${news.image_url}`"
                  :alt="news.title"
                  class="w-full h-48 object-cover rounded-xl mb-3"
                />
                <p class="text-xs text-mist/70 whitespace-pre-line force-text-wrap overflow-auto max-w-full">
                  {{ news.detail }}
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
              <!-- Форма добавления/редактирования -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingFarmId ? 'Редактировать ферму' : t("admin.db.form.title") }}
                </p>
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
                  <div class="space-y-2">
                    <p class="text-xs text-mist/60 text-center">— или выберите точку на карте —</p>
                    <div
                      ref="coordMapEl"
                      class="h-96 w-full rounded-2xl overflow-hidden border border-white/10"
                      style="z-index: 1;"
                    ></div>
                  </div>
                  <textarea
                    v-model="farmForm.note"
                    :placeholder="t('admin.db.form.note')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                    rows="3"
                  ></textarea>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                      @click="editingFarmId ? updateFarm() : addFarm()"
                    >
                      {{ editingFarmId ? 'Сохранить' : t("admin.db.form.submit") }}
                    </button>
                    <button
                      v-if="editingFarmId"
                      type="button"
                      class="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5"
                      @click="cancelEditFarm"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>

              <!-- Список ферм -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Список ферм ({{ farms.length }})</p>
                <div v-if="farms.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Фермы пока не добавлены
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="farm in farms"
                    :key="farm.id"
                    class="flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5 gap-3"
                  >
                    <div class="flex-1 min-w-0 max-w-full">
                      <p class="text-sm font-medium force-text-wrap">{{ farm.name }}</p>
                      <p class="text-xs text-mist/60 mt-1 force-text-wrap">
                        {{ farm.region }} · {{ farm.area }}
                      </p>
                    </div>
                    <div class="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5"
                        @click="startEditFarm(farm)"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                        @click="deleteFarm(farm.id)"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
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
              <!-- Форма загрузки/редактирования -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingDocumentId ? 'Редактировать документ' : t("admin.docs.form.title") }}
                </p>
                <div class="grid gap-4">
                  <input
                    v-model="docForm.name"
                    type="text"
                    :placeholder="t('admin.docs.form.name')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <div class="flex flex-col gap-2">
                    <label class="text-xs text-mist/60">
                      {{ editingDocumentId ? 'Новый файл (оставьте пустым, чтобы не менять)' : t("admin.docs.form.file") }}
                    </label>
                    <input
                      type="file"
                      @change="handleFileSelect"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none text-sm"
                    />
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                      @click="editingDocumentId ? updateDocument() : addDocument()"
                    >
                      {{ editingDocumentId ? 'Сохранить' : t("admin.docs.form.submit") }}
                    </button>
                    <button
                      v-if="editingDocumentId"
                      type="button"
                      class="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5"
                      @click="cancelEditDocument"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>

              <!-- Список документов -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Список документов ({{ documents.length }})</p>
                <div v-if="documents.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Документы пока не загружены
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="doc in documents"
                    :key="doc.id"
                    class="flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5 gap-3"
                  >
                    <div class="flex-1 min-w-0 max-w-full">
                      <p class="text-sm font-medium force-text-wrap">{{ doc.name }}</p>
                      <p class="text-xs text-mist/60 mt-1">
                        {{ (doc.size / 1024).toFixed(2) }} KB · {{ new Date(doc.created_at).toLocaleDateString('ru-RU') }}
                      </p>
                    </div>
                    <div class="flex gap-2 flex-shrink-0 flex-wrap">
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5"
                        @click="downloadDocument(doc.id, doc.name)"
                      >
                        Скачать
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5"
                        @click="startEditDocument(doc)"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                        @click="deleteDocument(doc.id)"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
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
              <!-- Форма добавления/редактирования -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingNewsId ? 'Редактировать новость' : t("admin.calendar.form.title") }}
                </p>
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
                  <div>
                    <label class="block text-sm text-mist/70 mb-2">Фото новости (опционально)</label>
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e: any) => newsImage = e.target.files?.[0] || null"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <label v-if="editingNewsId" class="flex items-center gap-2 mt-2 text-sm text-mist/70 cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="removeNewsImage"
                        class="rounded border-white/10"
                      />
                      Удалить текущее фото
                    </label>
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                      @click="editingNewsId ? updateNews() : addNews()"
                    >
                      {{ editingNewsId ? 'Сохранить' : t("admin.calendar.form.submit") }}
                    </button>
                    <button
                      v-if="editingNewsId"
                      type="button"
                      class="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5"
                      @click="cancelEditNews"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>

              <!-- Список новостей -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Список новостей ({{ newsItems.length }})</p>
                <div v-if="newsItems.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Новости пока не добавлены
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="news in adminNewsItems"
                    :key="news.id"
                    class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5"
                  >
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div class="flex-1 min-w-0 max-w-full">
                        <p class="text-sm font-medium force-text-wrap">{{ news.title }}</p>
                        <p class="text-xs text-mist/60 mt-1">
                          {{ new Date(news.date).toLocaleDateString('ru-RU') }}
                        </p>
                        <p class="text-xs text-mist/70 mt-2 line-clamp-2 force-text-wrap overflow-hidden">
                          {{ news.detail }}
                        </p>
                      </div>
                      <div class="flex gap-2 flex-shrink-0 flex-wrap">
                        <button
                          type="button"
                          :class="[
                            'rounded-full border px-3 py-1 text-xs font-semibold whitespace-nowrap',
                            news.pinned ? 'border-hemp bg-hemp/10 text-hemp' : 'border-white/20 hover:bg-white/5'
                          ]"
                          @click="pinNews(news.id, news.pinned)"
                        >
                          {{ news.pinned ? '📌 Открепить' : 'Закрепить' }}
                        </button>
                        <button
                          type="button"
                          class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5 whitespace-nowrap"
                          @click="startEditNews(news)"
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10"
                          @click="deleteNews(news.id)"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'gallery'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">{{ t("admin.gallery.title") }}</p>
            <p class="mt-2 text-sm text-mist/70">
              {{ t("admin.gallery.body") }}
            </p>
            <div class="mt-6 space-y-4">
              <!-- Форма добавления/редактирования фото -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingGalleryId ? 'Редактировать фото' : t("admin.gallery.form.title") }}
                </p>
                <div class="grid gap-4">
                  <input
                    v-model="galleryForm.title"
                    type="text"
                    :placeholder="t('admin.gallery.form.photoTitle')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <div>
                    <label class="block text-sm text-mist/70 mb-2">{{ t("admin.gallery.form.photo") }}</label>
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e: any) => galleryImage = e.target.files?.[0] || null"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <div v-if="editingGalleryId && selectedGalleryItem?.image_url" class="mt-2 flex items-center gap-2">
                      <img
                        :src="`${BACKEND_URL}${selectedGalleryItem.image_url}`"
                        alt="Current"
                        class="h-16 w-16 object-cover rounded"
                      />
                      <button
                        type="button"
                        @click="removeGalleryImageFlag = true; galleryImage = null"
                        class="text-xs text-red-400 hover:text-red-300"
                      >
                        Удалить текущее фото
                      </button>
                    </div>
                  </div>
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                      @click="editingGalleryId ? updateGalleryItem() : addGalleryItem()"
                    >
                      {{ editingGalleryId ? 'Сохранить' : t("admin.gallery.form.submit") }}
                    </button>
                    <button
                      v-if="editingGalleryId"
                      type="button"
                      class="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5"
                      @click="cancelEditGallery()"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>

              <!-- Список фотографий -->
              <div class="space-y-2">
                <p class="text-sm font-semibold">{{ t("admin.gallery.list") }}</p>
                <div v-if="galleryItems.length === 0" class="text-center text-sm text-mist/60 py-8">
                  Фотографии не добавлены
                </div>
                <div v-else class="grid gap-4 md:grid-cols-3">
                  <div
                    v-for="item in galleryItems"
                    :key="item.id"
                    class="rounded-2xl border border-white/10 bg-black/20 p-4 transition hover:bg-white/5"
                  >
                    <img
                      v-if="item.image_url"
                      :src="`${BACKEND_URL}${item.image_url}`"
                      :alt="item.title"
                      class="w-full h-32 object-cover rounded-xl mb-3"
                    />
                    <p v-if="item.title" class="text-sm font-medium mb-2">{{ item.title }}</p>
                    <p class="text-xs text-mist/60 mb-3">{{ new Date(item.created_at).toLocaleDateString('ru-RU') }}</p>
                    <div class="flex gap-2">
                      <button
                        class="flex-1 rounded-xl bg-white/10 px-3 py-2 text-xs transition hover:bg-white/20"
                        @click="startEditGallery(item)"
                      >
                        Редактировать
                      </button>
                      <button
                        class="rounded-xl bg-red-500/20 px-3 py-2 text-xs text-red-400 transition hover:bg-red-500/30"
                        @click="deleteGalleryItem(item.id)"
                      >
                        Удалить
                      </button>
                    </div>
                  </div>
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
              <!-- Форма создания/редактирования -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingUserId ? 'Редактировать пользователя' : t("admin.accounts.form.title") }}
                </p>
                <div class="grid gap-4">
                  <input
                    v-model="accountForm.username"
                    type="text"
                    :placeholder="t('admin.accounts.form.username')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <input
                    v-model="accountForm.password"
                    type="text"
                    :placeholder="editingUserId ? 'Новый пароль (оставьте пустым, чтобы не менять)' : t('admin.accounts.form.password')"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 outline-none"
                  />
                  <div class="flex gap-2">
                    <button
                      type="button"
                      class="flex-1 rounded-2xl bg-hemp px-6 py-3 font-semibold transition hover:scale-[1.02] hover:shadow-[0_0_32px_rgba(91,126,61,0.7)]"
                      @click="editingUserId ? updateUser() : createAccount()"
                    >
                      {{ editingUserId ? 'Сохранить' : t("admin.accounts.form.submit") }}
                    </button>
                    <button
                      v-if="editingUserId"
                      type="button"
                      class="rounded-2xl border border-white/20 px-6 py-3 font-semibold transition hover:bg-white/5"
                      @click="cancelEditUser"
                    >
                      Отмена
                    </button>
                  </div>
                </div>
              </div>

              <!-- Список пользователей -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Список пользователей ({{ users.length }})</p>
                <div v-if="users.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Загрузка...
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="user in users"
                    :key="user.id"
                    class="flex flex-col lg:flex-row lg:items-center lg:justify-between rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5 gap-3"
                  >
                    <div class="flex-1 min-w-0 max-w-full">
                      <p class="text-sm font-medium force-text-wrap">{{ user.username }}</p>
                      <p class="text-xs text-mist/60 mt-1">
                        <span :class="user.is_admin ? 'text-hemp' : ''">
                          {{ user.is_admin ? 'Администратор' : 'Пользователь' }}
                        </span>
                        · Создан: {{ new Date(user.created_at).toLocaleDateString('ru-RU') }}
                      </p>
                    </div>
                    <div v-if="user.id !== currentUser?.id" class="flex gap-2 flex-shrink-0">
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5 whitespace-nowrap"
                        @click="startEditUser(user)"
                      >
                        Редактировать
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 whitespace-nowrap"
                        @click="deleteUser(user.id)"
                      >
                        Удалить
                      </button>
                    </div>
                    <span v-else class="text-xs text-mist/60 flex-shrink-0">Текущий аккаунт</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'applications'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Заявки на вступление</p>
            <p class="mt-2 text-sm text-mist/70">
              Управление заявками от пользователей на вступление в ассоциацию
            </p>
            <div class="mt-6 space-y-4">
              <!-- Список заявок -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Список заявок ({{ applications.length }})</p>
                <div v-if="applications.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Заявок пока нет
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="application in applications"
                    :key="application.id"
                    class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5"
                  >
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div class="flex-1 min-w-0 max-w-full">
                        <p class="text-sm font-medium force-text-wrap">{{ application.name }}</p>
                        <p class="text-xs text-mist/60 mt-1 force-text-wrap">
                          Контакт: {{ application.contact }}
                        </p>
                        <p class="text-xs text-mist/60 mt-1 force-text-wrap">
                          {{ application.region }} {{ application.area ? '· ' + application.area : '' }}
                        </p>
                        <p class="text-xs text-mist/60 mt-1">
                          Дата: {{ new Date(application.created_at).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long', year: 'numeric', hour: '2-digit', minute: '2-digit' }) }}
                        </p>
                        <div class="mt-2">
                          <span
                            :class="[
                              'inline-block rounded-full px-2 py-1 text-xs font-semibold',
                              application.status === 'approved' ? 'bg-green-500/20 text-green-400' :
                              application.status === 'rejected' ? 'bg-red-500/20 text-red-400' :
                              'bg-yellow-500/20 text-yellow-400'
                            ]"
                          >
                            {{ 
                              application.status === 'approved' ? 'Одобрено' :
                              application.status === 'rejected' ? 'Отклонено' :
                              'В обработке'
                            }}
                          </span>
                        </div>
                      </div>
                      <div class="flex gap-2 flex-shrink-0 flex-wrap">
                        <button
                          v-if="application.status !== 'approved'"
                          type="button"
                          class="rounded-full border border-green-500/50 px-3 py-1 text-xs font-semibold text-green-400 hover:bg-green-500/10 whitespace-nowrap"
                          @click="updateApplicationStatus(application.id, 'approved')"
                        >
                          Одобрить
                        </button>
                        <button
                          v-if="application.status !== 'rejected'"
                          type="button"
                          class="rounded-full border border-yellow-500/50 px-3 py-1 text-xs font-semibold text-yellow-400 hover:bg-yellow-500/10 whitespace-nowrap"
                          @click="updateApplicationStatus(application.id, 'rejected')"
                        >
                          Отклонить
                        </button>
                        <button
                          type="button"
                          class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 whitespace-nowrap"
                          @click="deleteApplication(application.id)"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'contacts'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Редактирование контактов</p>
            <p class="mt-2 text-sm text-mist/70">
              Управление контактной информацией организации
            </p>
            <div class="mt-6">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div v-if="contacts" class="space-y-4">
                  <div v-if="!isEditingContacts" class="space-y-3">
                    <div>
                      <p class="text-xs text-mist/60">Название</p>
                      <p class="text-sm">{{ contacts.title }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-mist/60">Адрес</p>
                      <p class="text-sm">{{ contacts.address }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-mist/60">Телефон</p>
                      <p class="text-sm">{{ contacts.phone }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-mist/60">Telegram</p>
                      <p class="text-sm">{{ contacts.telegram }}</p>
                    </div>
                    <div>
                      <p class="text-xs text-mist/60">Email</p>
                      <p class="text-sm">{{ contacts.email }}</p>
                    </div>
                    <button
                      type="button"
                      class="mt-4 rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                      @click="startEditContacts"
                    >
                      Редактировать
                    </button>
                  </div>
                  <div v-else class="space-y-4">
                    <input
                      v-model="contactsForm.title"
                      type="text"
                      placeholder="Название"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <textarea
                      v-model="contactsForm.address"
                      placeholder="Адрес"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                      rows="2"
                    ></textarea>
                    <input
                      v-model="contactsForm.phone"
                      type="text"
                      placeholder="Телефон"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <input
                      v-model="contactsForm.telegram"
                      type="text"
                      placeholder="Telegram"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <input
                      v-model="contactsForm.email"
                      type="email"
                      placeholder="Email"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <div>
                      <label class="block text-sm text-mist/70 mb-2">Фото (опционально)</label>
                      <input
                        type="file"
                        accept="image/*"
                        @change="(e: any) => contactsImage = e.target.files?.[0] || null"
                        class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                      />
                      <label class="flex items-center gap-2 mt-2 text-sm text-mist/70 cursor-pointer">
                        <input
                          type="checkbox"
                          v-model="removeContactsImage"
                          class="rounded border-white/10"
                        />
                        Удалить текущее фото
                      </label>
                    </div>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        class="rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                        @click="updateContacts"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
                        @click="cancelEditContacts"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-sm text-mist/60 py-4">
                  Загрузка...
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'board'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Управление правлением</p>
            <p class="mt-2 text-sm text-mist/70">
              Добавление и редактирование членов правления
            </p>
            <div class="mt-6 space-y-4">
              <!-- Форма добавления/редактирования -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">
                  {{ editingBoardId ? 'Редактирование члена правления' : 'Добавить нового члена правления' }}
                </p>
                <div class="space-y-4">
                  <input
                    v-model="boardForm.name"
                    type="text"
                    placeholder="ФИО"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                  />
                  <input
                    v-model="boardForm.position"
                    type="text"
                    placeholder="Должность"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                  />
                  <textarea
                    v-model="boardForm.description"
                    placeholder="Описание (опционально)"
                    class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    rows="3"
                  ></textarea>
                  <div>
                    <label class="block text-sm text-mist/70 mb-2">Фото (опционально)</label>
                    <input
                      type="file"
                      accept="image/*"
                      @change="(e: any) => boardImage = e.target.files?.[0] || null"
                      class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                    />
                    <label v-if="editingBoardId" class="flex items-center gap-2 mt-2 text-sm text-mist/70 cursor-pointer">
                      <input
                        type="checkbox"
                        v-model="removeBoardImage"
                        class="rounded border-white/10"
                      />
                      Удалить текущее фото
                    </label>
                  </div>
                  <div class="flex gap-2">
                    <button
                      v-if="!editingBoardId"
                      type="button"
                      class="rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                      @click="createBoardMember"
                    >
                      Добавить
                    </button>
                    <template v-else>
                      <button
                        type="button"
                        class="rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                        @click="updateBoardMember"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
                        @click="cancelEditBoardMember"
                      >
                        Отмена
                      </button>
                    </template>
                  </div>
                </div>
              </div>

              <!-- Список членов правления -->
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <p class="mb-4 text-sm font-semibold">Текущие члены правления ({{ boardMembers.length }})</p>
                <div v-if="boardMembers.length === 0" class="text-center text-sm text-mist/60 py-4">
                  Членов правления пока нет
                </div>
                <div v-else class="space-y-2">
                  <div
                    v-for="member in boardMembers"
                    :key="member.id"
                    class="rounded-2xl border border-white/10 bg-black/20 px-4 py-3 transition hover:bg-white/5"
                  >
                    <div class="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-3">
                      <div class="flex-1 min-w-0 max-w-full">
                        <p class="text-sm font-medium force-text-wrap">{{ member.name }}</p>
                        <p class="text-xs text-mist/60 mt-1 force-text-wrap">{{ member.position }}</p>
                        <p v-if="member.description" class="text-xs text-mist/60 mt-1 force-text-wrap">
                          {{ member.description }}
                        </p>
                      </div>
                      <div class="flex gap-2 flex-shrink-0">
                        <button
                          type="button"
                          class="rounded-full border border-white/20 px-3 py-1 text-xs font-semibold hover:bg-white/5 whitespace-nowrap"
                          @click="startEditBoardMember(member)"
                        >
                          Редактировать
                        </button>
                        <button
                          type="button"
                          class="rounded-full border border-red-500/50 px-3 py-1 text-xs font-semibold text-red-400 hover:bg-red-500/10 whitespace-nowrap"
                          @click="deleteBoardMember(member.id)"
                        >
                          Удалить
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div v-show="activeTab === 'settings'" class="glass rounded-3xl p-6">
            <p class="text-lg font-semibold">Настройки системы</p>
            <p class="mt-2 text-sm text-mist/70">
              Управление общими настройками приложения
            </p>
            <div class="mt-6">
              <div class="rounded-2xl border border-white/10 bg-black/20 p-6">
                <div v-if="settings" class="space-y-4">
                  <div v-if="!isEditingSettings" class="space-y-3">
                    <div>
                      <p class="text-xs text-mist/60">Ссылка на Telegram чат</p>
                      <p class="text-sm">{{ settings.telegram_chat_url || 'https://t.me/' }}</p>
                    </div>
                    <button
                      type="button"
                      class="mt-4 rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                      @click="startEditSettings"
                    >
                      Редактировать
                    </button>
                  </div>
                  <div v-else class="space-y-4">
                    <div>
                      <label class="block text-sm text-mist/70 mb-2">Ссылка на Telegram чат</label>
                      <input
                        v-model="settingsForm.telegram_chat_url"
                        type="url"
                        placeholder="https://t.me/your_chat"
                        class="w-full rounded-2xl border border-white/10 bg-black/20 px-4 py-3 text-sm outline-none"
                      />
                      <p class="mt-2 text-xs text-mist/60">
                        Эта ссылка будет отображаться пользователям в личном кабинете
                      </p>
                    </div>
                    <div class="flex gap-2">
                      <button
                        type="button"
                        class="rounded-full bg-hemp px-6 py-3 text-sm font-semibold text-ink"
                        @click="updateSettings"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        class="rounded-full border border-white/20 px-6 py-3 text-sm font-semibold"
                        @click="cancelEditSettings"
                      >
                        Отмена
                      </button>
                    </div>
                  </div>
                </div>
                <div v-else class="text-center text-sm text-mist/60 py-4">
                  Загрузка...
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
import { computed, nextTick, onMounted, onUnmounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import L from "leaflet";
import { useI18n } from "../i18n";
import { authApi, usersApi, newsApi, farmsApi, documentsApi, applicationsApi, contactsApi, boardApi, settingsApi, galleryApi, getToken, BACKEND_URL } from "../services/api";

const { t } = useI18n();
const route = useRoute();

const login = ref("");
const password = ref("");
const rememberMe = ref(false);

const isAuthenticated = ref(!!getToken());
const isAdmin = ref(false);
const currentUser = ref<any>(null);

const mapEl = ref<HTMLDivElement | null>(null);
const mapInstance = ref<L.Map | null>(null);
const coordMapEl = ref<HTMLDivElement | null>(null);
const coordMapInstance = ref<L.Map | null>(null);
const coordMarker = ref<L.Marker | null>(null);

const userTabs = [
  { key: "database" as const, labelKey: "portal.tabs.database" },
  { key: "documents" as const, labelKey: "portal.tabs.documents" },
  { key: "calendar" as const, labelKey: "portal.tabs.calendar" },
];

const adminTabs = [
  { key: "database" as const, labelKey: "admin.tabs.database" },
  { key: "documents" as const, labelKey: "admin.tabs.documents" },
  { key: "calendar" as const, labelKey: "admin.tabs.calendar" },
  { key: "gallery" as const, labelKey: "admin.tabs.gallery" },
  { key: "accounts" as const, labelKey: "admin.tabs.accounts" },
  { key: "applications" as const, labelKey: "admin.tabs.applications" },
  { key: "contacts" as const, labelKey: "admin.tabs.contacts" },
  { key: "board" as const, labelKey: "admin.tabs.board" },
  { key: "settings" as const, labelKey: "admin.tabs.settings" },
];

const tabs = computed(() => (isAdmin.value ? adminTabs : userTabs));

const activeTab = ref<"database" | "documents" | "calendar" | "gallery" | "accounts" | "applications" | "contacts" | "board" | "settings">("database");

const newsItems = ref<any[]>([]);
const expandedNews = ref<Set<number>>(new Set());
const documents = ref<any[]>([]);

// Новости для админ-панели отсортированные только по дате (без учёта pinned)
const adminNewsItems = computed(() => {
  return [...newsItems.value].sort((a, b) => {
    const dateA = new Date(a.date).getTime();
    const dateB = new Date(b.date).getTime();
    
    // Первичная сортировка по дате
    if (dateA !== dateB) {
      return dateB - dateA; // Новые первые
    }
    
    // Вторичная сортировка по id (для стабильности порядка)
    return b.id - a.id; // Новые id первые
  });
});

const toggleNews = (id: number) => {
  if (expandedNews.value.has(id)) {
    expandedNews.value.delete(id);
  } else {
    expandedNews.value.add(id);
  }
};

const loadNews = async () => {
  try {
    const response = await newsApi.getAll();
    if (response.success && response.data) {
      newsItems.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки новостей:', error);
  }
};

const loadDocuments = async () => {
  try {
    const response = await documentsApi.getAll();
    if (response.success && response.data) {
      documents.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки документов:', error);
  }
};

const farms = ref<any[]>([]);
const selectedFarm = ref<any>(null);

const loadFarms = async () => {
  try {
    const response = await farmsApi.getAll();
    if (response.success && response.data) {
      farms.value = response.data;
      if (farms.value.length > 0) {
        selectedFarm.value = farms.value[0];
      }
    }
  } catch (error) {
    console.error('Ошибка загрузки ферм:', error);
  }
};

const farmForm = ref({
  name: "",
  region: "",
  area: "",
  lat: "",
  lng: "",
  note: "",
});

const editingFarmId = ref<number | null>(null);

const docForm = ref({
  name: "",
});

const newsForm = ref({
  title: "",
  detail: "",
});

const newsImage = ref<File | null>(null);

const galleryForm = ref({
  title: "",
});

const galleryImage = ref<File | null>(null);
const galleryItems = ref<any[]>([]);
const editingGalleryId = ref<number | null>(null);
const selectedGalleryItem = ref<any>(null);
const removeGalleryImageFlag = ref(false);
const removeNewsImage = ref(false);
const editingNewsId = ref<number | null>(null);
const users = ref<any[]>([]);
const editingUserId = ref<number | null>(null);
const editingDocumentId = ref<number | null>(null);
const applications = ref<any[]>([]);
const contacts = ref<any>(null);
const isEditingContacts = ref(false);
const boardMembers = ref<any[]>([]);
const editingBoardId = ref<number | null>(null);
const settings = ref<any>(null);
const isEditingSettings = ref(false);
const telegramChatUrl = ref('https://t.me/');

const accountForm = ref({
  username: "",
  password: "",
});

const handleLogin = async () => {
  try {
    const response = await authApi.login(login.value, password.value);
    
    if (response.success && response.data) {
      isAuthenticated.value = true;
      currentUser.value = response.data.user;
      isAdmin.value = response.data.user.isAdmin;
      
      login.value = "";
      password.value = "";
      
      // Загрузка данных после входа
      await loadNews();
      if (isAuthenticated.value) {
        await loadFarms();
        await loadDocuments();
        if (isAdmin.value) {
          await loadUsers();
          await loadApplications();
          await loadContacts();
          await loadBoard();
        }
      }
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка входа');
  }
};

const handleLogout = async () => {
  try {
    await authApi.logout();
  } catch (error) {
    console.error('Ошибка выхода:', error);
  }
  
  isAuthenticated.value = false;
  isAdmin.value = false;
  currentUser.value = null;
  login.value = "";
  password.value = "";
  rememberMe.value = false;
};

const addFarm = async () => {
  try {
    const response = await farmsApi.create({
      name: farmForm.value.name,
      region: farmForm.value.region,
      area: farmForm.value.area,
      lat: parseFloat(farmForm.value.lat),
      lng: parseFloat(farmForm.value.lng),
      note: farmForm.value.note,
    });
    
    if (response.success) {
      alert(`Хозяйство "${farmForm.value.name}" успешно добавлено!`);
      farmForm.value = {
        name: "",
        region: "",
        area: "",
        lat: "",
        lng: "",
        note: "",
      };
      clearCoordMarker();
      await loadFarms();
      
      // Перерисовка карты
      if (mapInstance.value) {
        mapInstance.value.remove();
        mapInstance.value = null;
        await nextTick();
        initMap();
      }
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при добавлении хозяйства');
  }
};

const selectedFile = ref<File | null>(null);

const handleFileSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    selectedFile.value = target.files[0];
  }
};

const addDocument = async () => {
  try {
    if (!selectedFile.value) {
      alert('Пожалуйста, выберите файл');
      return;
    }
    
    const response = await documentsApi.upload(docForm.value.name, selectedFile.value);
    
    if (response.success) {
      alert(`Документ "${docForm.value.name}" успешно загружен!`);
      docForm.value = {
        name: "",
      };
      selectedFile.value = null;
      await loadDocuments();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при загрузке документа');
  }
};

const downloadDocument = async (id: number, name: string) => {
  try {
    const blob = await documentsApi.download(id);
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = name;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  } catch (error: any) {
    alert(error.message || 'Ошибка при скачивании документа');
  }
};

const addNews = async () => {
  try {
    const response = await newsApi.create(
      newsForm.value.title,
      '', // body оставляем пустым
      newsForm.value.detail,
      false,
      newsImage.value || undefined
    );
    
    if (response.success) {
      alert(`Новость "${newsForm.value.title}" успешно добавлена!`);
      newsForm.value = {
        title: "",
        detail: "",
      };
      newsImage.value = null;
      await loadNews();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при добавлении новости');
  }
};

const createAccount = async () => {
  try {
    const response = await usersApi.create(
      accountForm.value.username,
      accountForm.value.password,
      false
    );
    
    if (response.success) {
      alert(`Аккаунт "${accountForm.value.username}" успешно создан!`);
      accountForm.value = {
        username: "",
        password: "",
      };
      await loadUsers();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при создании аккаунта');
  }
};

// Функции для ферм
const startEditFarm = (farm: any) => {
  editingFarmId.value = farm.id;
  farmForm.value = {
    name: farm.name,
    region: farm.region,
    area: farm.area,
    lat: farm.lat.toString(),
    lng: farm.lng.toString(),
    note: farm.note,
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
  // Обновляем маркер на карте для показа текущих координат
  setTimeout(() => updateCoordMarker(), 100);
};

const cancelEditFarm = () => {
  editingFarmId.value = null;
  farmForm.value = {
    name: "",
    region: "",
    area: "",
    lat: "",
    lng: "",
    note: "",
  };
  clearCoordMarker();
};

const updateFarm = async () => {
  try {
    if (!editingFarmId.value) return;
    
    const response = await farmsApi.update(editingFarmId.value, {
      name: farmForm.value.name,
      region: farmForm.value.region,
      area: farmForm.value.area,
      lat: parseFloat(farmForm.value.lat),
      lng: parseFloat(farmForm.value.lng),
      note: farmForm.value.note,
    });
    
    if (response.success) {
      alert('Ферма успешно обновлена!');
      cancelEditFarm();
      await loadFarms();
      
      // Перерисовка карты
      if (mapInstance.value) {
        mapInstance.value.remove();
        mapInstance.value = null;
        await nextTick();
        initMap();
      }
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении фермы');
  }
};

const deleteFarm = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту ферму?')) return;
  
  try {
    const response = await farmsApi.delete(id);
    
    if (response.success) {
      alert('Ферма успешно удалена!');
      await loadFarms();
      
      // Перерисовка карты
      if (mapInstance.value) {
        mapInstance.value.remove();
        mapInstance.value = null;
        await nextTick();
        initMap();
      }
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении фермы');
  }
};

// Функции для документов
const startEditDocument = (doc: any) => {
  editingDocumentId.value = doc.id;
  docForm.value = {
    name: doc.name,
  };
  selectedFile.value = null;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEditDocument = () => {
  editingDocumentId.value = null;
  docForm.value = {
    name: '',
  };
  selectedFile.value = null;
};

const updateDocument = async () => {
  try {
    if (!editingDocumentId.value) return;
    
    const response = await documentsApi.update(
      editingDocumentId.value,
      docForm.value.name,
      selectedFile.value || undefined
    );
    
    if (response.success) {
      alert('Документ успешно обновлён!');
      cancelEditDocument();
      await loadDocuments();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении документа');
  }
};

const deleteDocument = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этот документ?')) return;
  
  try {
    const response = await documentsApi.delete(id);
    
    if (response.success) {
      alert('Документ успешно удалён!');
      await loadDocuments();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении документа');
  }
};

// Функции для новостей
const startEditNews = (news: any) => {
  editingNewsId.value = news.id;
  newsForm.value = {
    title: news.title,
    detail: news.detail,
  };
  newsImage.value = null;
  removeNewsImage.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEditNews = () => {
  editingNewsId.value = null;
  newsForm.value = {
    title: "",
    detail: "",
  };
  newsImage.value = null;
  removeNewsImage.value = false;
};

const updateNews = async () => {
  try {
    if (!editingNewsId.value) return;
    
    const response = await newsApi.update(
      editingNewsId.value,
      newsForm.value.title,
      '',
      newsForm.value.detail,
      undefined,
      newsImage.value || undefined,
      removeNewsImage.value
    );
    
    if (response.success) {
      alert('Новость успешно обновлена!');
      cancelEditNews();
      await loadNews();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении новости');
  }
};

const deleteNews = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту новость?')) return;
  
  try {
    const response = await newsApi.delete(id);
    
    if (response.success) {
      alert('Новость успешно удалена!');
      await loadNews();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении новости');
  }
};

const pinNews = async (id: number, currentlyPinned: boolean) => {
  try {
    // Если уже закреплена - открепить, если не закреплена - закрепить
    const newPinnedState = !currentlyPinned;
    const response = await newsApi.pin(id, newPinnedState);
    
    if (response.success) {
      await loadNews();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при закреплении новости');
  }
};

// Функции для пользователей
const loadUsers = async () => {
  try {
    const response = await usersApi.getAll();
    if (response.success && response.data) {
      users.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки пользователей:', error);
  }
};

const startEditUser = (user: any) => {
  editingUserId.value = user.id;
  accountForm.value = {
    username: user.username,
    password: '',
  };
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEditUser = () => {
  editingUserId.value = null;
  accountForm.value = {
    username: '',
    password: '',
  };
};

const updateUser = async () => {
  try {
    if (!editingUserId.value) return;
    
    const response = await usersApi.update(
      editingUserId.value,
      accountForm.value.username,
      accountForm.value.password || undefined,
      false
    );
    
    if (response.success) {
      alert('Пользователь успешно обновлён!');
      cancelEditUser();
      await loadUsers();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении пользователя');
  }
};

const deleteUser = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этого пользователя?')) return;
  
  try {
    const response = await usersApi.delete(id);
    
    if (response.success) {
      alert('Пользователь успешно удалён!');
      await loadUsers();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении пользователя');
  }
};

// Функции для заявок
const loadApplications = async () => {
  try {
    const response = await applicationsApi.getAll();
    if (response.success && response.data) {
      applications.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки заявок:', error);
  }
};

const updateApplicationStatus = async (id: number, status: 'pending' | 'approved' | 'rejected') => {
  try {
    const response = await applicationsApi.updateStatus(id, status);
    
    if (response.success) {
      await loadApplications();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении статуса заявки');
  }
};

const deleteApplication = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить эту заявку?')) return;
  
  try {
    const response = await applicationsApi.delete(id);
    
    if (response.success) {
      alert('Заявка успешно удалена!');
      await loadApplications();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении заявки');
  }
};

// Функции для контактов
const contactsForm = ref({
  title: '',
  address: '',
  phone: '',
  telegram: '',
  email: ''
});

const contactsImage = ref<File | null>(null);
const removeContactsImage = ref(false);

const loadContacts = async () => {
  try {
    const response = await contactsApi.get();
    if (response.success && response.data) {
      contacts.value = response.data;
      contactsForm.value = {
        title: response.data.title || '',
        address: response.data.address || '',
        phone: response.data.phone || '',
        telegram: response.data.telegram || '',
        email: response.data.email || ''
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки контактов:', error);
  }
};

const startEditContacts = () => {
  isEditingContacts.value = true;
};

const cancelEditContacts = () => {
  isEditingContacts.value = false;
  contactsImage.value = null;
  removeContactsImage.value = false;
  if (contacts.value) {
    contactsForm.value = {
      title: contacts.value.title || '',
      address: contacts.value.address || '',
      phone: contacts.value.phone || '',
      telegram: contacts.value.telegram || '',
      email: contacts.value.email || ''
    };
  }
};

const updateContacts = async () => {
  if (!contacts.value?.id) return;
  
  try {
    const response = await contactsApi.update(
      contacts.value.id,
      contactsForm.value.title,
      contactsForm.value.address,
      contactsForm.value.phone,
      contactsForm.value.telegram,
      contactsForm.value.email,
      contactsImage.value || undefined,
      removeContactsImage.value
    );
    
    if (response.success) {
      alert('Контакты успешно обновлены!');
      isEditingContacts.value = false;
      contactsImage.value = null;
      removeContactsImage.value = false;
      await loadContacts();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении контактов');
  }
};

// Функции для правления
const boardForm = ref({
  name: '',
  position: '',
  description: ''
});

const boardImage = ref<File | null>(null);
const removeBoardImage = ref(false);

const loadBoard = async () => {
  try {
    const response = await boardApi.getAll();
    if (response.success && response.data) {
      boardMembers.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки правления:', error);
  }
};

const loadGallery = async () => {
  try {
    const response = await galleryApi.getAll();
    if (response.success && response.data) {
      galleryItems.value = response.data;
    }
  } catch (error) {
    console.error('Ошибка загрузки галереи:', error);
  }
};

const addGalleryItem = async () => {
  if (!galleryImage.value) {
    alert('Выберите изображение');
    return;
  }

  try {
    const response = await galleryApi.create(
      galleryForm.value.title,
      galleryImage.value
    );

    if (response.success) {
      alert('Фото успешно добавлено!');
      galleryForm.value.title = '';
      galleryImage.value = null;
      // Сбрасываем input файла
      const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
      if (fileInput) fileInput.value = '';
      await loadGallery();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при добавлении фото');
  }
};

const startEditGallery = (item: any) => {
  editingGalleryId.value = item.id;
  selectedGalleryItem.value = item;
  galleryForm.value.title = item.title || '';
  galleryImage.value = null;
  removeGalleryImageFlag.value = false;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const cancelEditGallery = () => {
  editingGalleryId.value = null;
  selectedGalleryItem.value = null;
  galleryForm.value.title = '';
  galleryImage.value = null;
  removeGalleryImageFlag.value = false;
  const fileInput = document.querySelector('input[type="file"][accept="image/*"]') as HTMLInputElement;
  if (fileInput) fileInput.value = '';
};

const updateGalleryItem = async () => {
  if (!editingGalleryId.value) return;

  try {
    const response = await galleryApi.update(
      editingGalleryId.value,
      galleryForm.value.title,
      galleryImage.value || undefined,
      removeGalleryImageFlag.value
    );

    if (response.success) {
      alert('Фото успешно обновлено!');
      cancelEditGallery();
      await loadGallery();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении фото');
  }
};

const deleteGalleryItem = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить это фото?')) return;

  try {
    const response = await galleryApi.delete(id);
    if (response.success) {
      alert('Фото успешно удалено!');
      await loadGallery();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении фото');
  }
};

const createBoardMember = async () => {
  if (!boardForm.value.name || !boardForm.value.position) {
    alert('Заполните имя и должность');
    return;
  }
  
  try {
    const response = await boardApi.create(
      boardForm.value.name,
      boardForm.value.position,
      boardForm.value.description,
      boardImage.value || undefined
    );
    
    if (response.success) {
      alert('Член правления успешно добавлен!');
      boardForm.value = { name: '', position: '', description: '' };
      boardImage.value = null;
      await loadBoard();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при добавлении члена правления');
  }
};

const startEditBoardMember = (member: any) => {
  editingBoardId.value = member.id;
  boardForm.value = {
    name: member.name,
    position: member.position,
    description: member.description || ''
  };
  boardImage.value = null;
  removeBoardImage.value = false;
};

const cancelEditBoardMember = () => {
  editingBoardId.value = null;
  boardForm.value = { name: '', position: '', description: '' };
  boardImage.value = null;
  removeBoardImage.value = false;
};

const updateBoardMember = async () => {
  if (!editingBoardId.value) return;
  
  try {
    const response = await boardApi.update(
      editingBoardId.value,
      boardForm.value.name,
      boardForm.value.position,
      boardForm.value.description,
      boardImage.value || undefined,
      removeBoardImage.value
    );
    
    if (response.success) {
      alert('Данные члена правления обновлены!');
      editingBoardId.value = null;
      boardForm.value = { name: '', position: '', description: '' };
      boardImage.value = null;
      removeBoardImage.value = false;
      await loadBoard();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении члена правления');
  }
};

const deleteBoardMember = async (id: number) => {
  if (!confirm('Вы уверены, что хотите удалить этого члена правления?')) return;
  
  try {
    const response = await boardApi.delete(id);
    
    if (response.success) {
      alert('Член правления успешно удалён!');
      await loadBoard();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при удалении члена правления');
  }
};

// Функции для настроек
const settingsForm = ref({
  telegram_chat_url: ''
});

const loadSettings = async () => {
  try {
    const response = await settingsApi.get();
    if (response.success && response.data) {
      settings.value = response.data;
      telegramChatUrl.value = response.data.telegram_chat_url || 'https://t.me/';
      settingsForm.value = {
        telegram_chat_url: response.data.telegram_chat_url || 'https://t.me/'
      };
    }
  } catch (error) {
    console.error('Ошибка загрузки настроек:', error);
  }
};

const startEditSettings = () => {
  isEditingSettings.value = true;
};

const cancelEditSettings = () => {
  isEditingSettings.value = false;
  if (settings.value) {
    settingsForm.value = {
      telegram_chat_url: settings.value.telegram_chat_url || 'https://t.me/'
    };
  }
};

const updateSettings = async () => {
  if (!settings.value?.id) return;
  
  try {
    const response = await settingsApi.update(
      settings.value.id,
      settingsForm.value.telegram_chat_url
    );
    
    if (response.success) {
      alert('Настройки успешно обновлены!');
      isEditingSettings.value = false;
      await loadSettings();
    }
  } catch (error: any) {
    alert(error.message || 'Ошибка при обновлении настроек');
  }
};

// Инициализация карты для выбора координат
const initCoordMap = () => {
  if (!coordMapEl.value || coordMapInstance.value) return;
  
  const map = L.map(coordMapEl.value, {
    zoomControl: true,
    attributionControl: false,
  });
  
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);
  
  // Центрируем на Казахстане
  const kazakhstanCenter: [number, number] = [48.0, 66.9];
  map.setView(kazakhstanCenter, 6);
  
  // Ограничиваем карту границами Казахстана
  const kzBounds = L.latLngBounds([40.5, 46.0], [55.5, 87.5]);
  map.setMaxBounds(kzBounds);
  
  // Обработчик клика на карту
  map.on('click', (e: L.LeafletMouseEvent) => {
    const { lat, lng } = e.latlng;
    farmForm.value.lat = lat.toFixed(4);
    farmForm.value.lng = lng.toFixed(4);
    
    // Удаляем старый маркер если есть
    if (coordMarker.value) {
      map.removeLayer(coordMarker.value);
    }
    
    // Добавляем новый маркер
    coordMarker.value = L.marker([lat, lng], {
      icon: L.icon({
        iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
        shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
        iconSize: [25, 41],
        iconAnchor: [12, 41],
        popupAnchor: [1, -34],
        shadowSize: [41, 41]
      })
    }).addTo(map);
  });
  
  coordMapInstance.value = map;
};

// Обновление маркера на карте при изменении координат вручную
const updateCoordMarker = () => {
  if (!coordMapInstance.value) return;
  
  const lat = parseFloat(farmForm.value.lat);
  const lng = parseFloat(farmForm.value.lng);
  
  if (isNaN(lat) || isNaN(lng)) {
    // Удаляем маркер если координаты некорректны
    if (coordMarker.value) {
      coordMapInstance.value.removeLayer(coordMarker.value);
      coordMarker.value = null;
    }
    return;
  }
  
  // Удаляем старый маркер
  if (coordMarker.value) {
    coordMapInstance.value.removeLayer(coordMarker.value);
  }
  
  // Добавляем новый маркер
  coordMarker.value = L.marker([lat, lng], {
    icon: L.icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-orange.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    })
  }).addTo(coordMapInstance.value);
  
  // Центрируем карту на маркере, сохраняя текущий зум
  const currentZoom = coordMapInstance.value.getZoom();
  coordMapInstance.value.setView([lat, lng], currentZoom);
};

// Очистка маркера с карты
const clearCoordMarker = () => {
  if (coordMarker.value && coordMapInstance.value) {
    coordMapInstance.value.removeLayer(coordMarker.value);
    coordMarker.value = null;
  }
};

const initMap = () => {
  if (!mapEl.value || mapInstance.value || farms.value.length === 0) return;
  const map = L.map(mapEl.value, {
    zoomControl: false,
    attributionControl: false,
  });
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 18,
  }).addTo(map);

  const bounds = L.latLngBounds(
    farms.value.map((farm) => [farm.lat, farm.lng])
  );
  map.fitBounds(bounds.pad(0.6));

  const kzBounds = L.latLngBounds([40.5, 46.0], [55.5, 87.5]);
  map.setMaxBounds(kzBounds);

  farms.value.forEach((farm) => {
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

// Функция для загрузки всех данных
const loadAllData = async () => {
  if (!isAuthenticated.value) return;
  
  try {
    const response = await authApi.me();
    if (response.success && response.data) {
      currentUser.value = response.data;
      isAdmin.value = response.data.isAdmin;
      await loadNews();
      await loadFarms();
      await loadDocuments();
      if (isAdmin.value) {
        await loadUsers();
        await loadApplications();
        await loadContacts();
        await loadBoard();
        await loadGallery();
      }
      await loadSettings();
    }
  } catch (error) {
    // Токен невалидный, выходим
    handleLogout();
  }
};

// Проверка авторизации при загрузке
onMounted(async () => {
  await loadAllData();
});

// Перезагрузка данных при возврате на страницу
watch(() => route.path, async (newPath) => {
  if (newPath === '/portal' && isAuthenticated.value) {
    await loadAllData();
  }
});

watch(
  [activeTab, isAuthenticated, farms],
  async () => {
    if (activeTab.value !== "database" || !isAuthenticated.value || farms.value.length === 0) return;
    await nextTick();
    initMap();
    mapInstance.value?.invalidateSize();
  }
);

// Инициализация карты выбора координат для админа
watch(
  [activeTab, isAdmin],
  async () => {
    if (activeTab.value === "database" && isAdmin.value) {
      await nextTick();
      initCoordMap();
      // Небольшая задержка для корректного определения размеров
      setTimeout(() => {
        coordMapInstance.value?.invalidateSize();
      }, 100);
    }
  }
);

// Обновление маркера при ручном вводе координат
watch(
  () => [farmForm.value.lat, farmForm.value.lng],
  () => {
    if (coordMapInstance.value && farmForm.value.lat && farmForm.value.lng) {
      updateCoordMarker();
    }
  }
);

// Центрирование карты на выбранном хозяйстве
watch(
  selectedFarm,
  (newFarm) => {
    if (newFarm && mapInstance.value) {
      // Центрируем карту на выбранном хозяйстве с приближением
      mapInstance.value.setView([newFarm.lat, newFarm.lng], 12, {
        animate: true,
        duration: 0.5
      });
    }
  }
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
