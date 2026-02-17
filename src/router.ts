import { createRouter, createWebHistory } from "vue-router";

import HomePage from "./pages/HomePage.vue";
import IndustryPage from "./pages/IndustryPage.vue";
import MembershipPage from "./pages/MembershipPage.vue";
import CommunityPage from "./pages/CommunityPage.vue";
import EventsPage from "./pages/EventsPage.vue";
import GalleryPage from "./pages/GalleryPage.vue";
import BoardPage from "./pages/BoardPage.vue";
import ContactsPage from "./pages/ContactsPage.vue";
import PortalPage from "./pages/PortalPage.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: "/", name: "home", component: HomePage },
    { path: "/industry", name: "industry", component: IndustryPage },
    { path: "/membership", name: "membership", component: MembershipPage },
    { path: "/community", name: "community", component: CommunityPage },
    { path: "/events", name: "events", component: EventsPage },
    { path: "/gallery", name: "gallery", component: GalleryPage },
    { path: "/board", name: "board", component: BoardPage },
    { path: "/contacts", name: "contacts", component: ContactsPage },
    { path: "/portal", name: "portal", component: PortalPage },
  ],
  scrollBehavior() {
    return { top: 0 };
  },
});

export default router;
