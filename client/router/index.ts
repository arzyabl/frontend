import { storeToRefs } from "pinia";
import { createRouter, createWebHistory } from "vue-router";

import { useUserStore } from "@/stores/user";
import CallView from "../views/CallView.vue";
import CircleDetailsView from "../views/CircleDetailsView.vue";
import CirclePostsView from "../views/CirclePostsView.vue";
import CreateCircleView from "../views/CreateCircleView.vue";
import LoginView from "../views/LoginView.vue";
import MyCirclesView from "../views/MyCirclesView.vue";
import NotFoundView from "../views/NotFoundView.vue";
import SettingView from "../views/SettingView.vue";
import BrowseView from "../views/BrowseView.vue";

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/setting",
      name: "Settings",
      component: SettingView,
      meta: { requiresAuth: true },
    },
    {
      path: "/browse",
      name: "Browse Circles",
      component: BrowseView,
      meta: { requiresAuth: true },
    },
    {
      path: "/circles",
      name: "My Circles",
      component: MyCirclesView,
      meta: { requiresAuth: true },
    },
    {
      path: "/circles/:id/",
      name: "Circle Posts",
      component: CirclePostsView,
      meta: { requiresAuth: true },
    },

    {
      path: "/circles/:id/details",
      name: "Circle Details",
      component: CircleDetailsView,
      meta: { requiresAuth: true },
    },

    {
      path: "/circles/create/",
      name: "Create Circle",
      component: CreateCircleView,
      meta: { requiresAuth: true },
    },

    {
      path: "/calls/:callId/",
      name: "Call",
      component: CallView,
      meta: { requiresAuth: true },
    },
    {
      path: "/login",
      name: "Login",
      component: LoginView,
      meta: { requiresAuth: false },
      beforeEnter: (to, from) => {
        const { isLoggedIn } = storeToRefs(useUserStore());
        if (isLoggedIn.value) {
          return { name: "Settings" };
        }
      },
    },
    {
      path: "/:catchAll(.*)",
      name: "not-found",
      component: NotFoundView,
    },
  ],
});

/**
 * Navigation guards to prevent user from accessing wrong pages.
 */
router.beforeEach((to, from) => {
  const { isLoggedIn } = storeToRefs(useUserStore());

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: "Login" };
  }
});

export default router;
