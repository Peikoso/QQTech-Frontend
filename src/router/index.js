import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import IncidentesView from '../views/IncidentesView.vue'
import RulesView from '../views/RulesView.vue'
import UsersView from '../views/UsersView.vue'
import LogsView from '../views/LogsView.vue'
import LoginView from '../views/LoginView.vue'
import { auth } from '../firebaseConfig.js'
import { onAuthStateChanged } from "firebase/auth";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView
    },
    {
      path: '/',
      redirect: '/dashboard',
      meta: { requiresAuth: true }
    },
    {
      path: '/dashboard',
      name: 'dashboard',
      component: DashboardView,
      meta: { requiresAuth: true }
    },
    {
      path: '/incidentes',
      name: 'incidentes',
      component: IncidentesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/rules',
      name: 'rules',
      component: RulesView,
      meta: { requiresAuth: true }
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true }
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogsView,
      meta: { requiresAuth: true }
    }
  ],
})


router.beforeEach((to, from, next) => {
  const unsubscribe = onAuthStateChanged(auth, (user) => {
    if (to.name !== "login" && !user) {
      next({ name: "login" });
    }
    if (to.name === "login" && user) {
      next({ name: "dashboard" });
    }
    next();
    unsubscribe();
  });
});

export default router
