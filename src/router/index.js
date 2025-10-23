import { createRouter, createWebHistory } from 'vue-router'
import DashboardView from '../views/DashboardView.vue'
import IncidentesView from '../views/IncidentesView.vue'
import RulesView from '../views/RulesView.vue'
import RotasView from '@/views/RotasView.vue'
import UsersView from '../views/UsersView.vue'
import LogsView from '../views/LogsView.vue'
import LoginView from '../views/LoginView.vue'
import { useUserStore } from '../stores/user.js'
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from '../firebaseConfig.js'
import { doc, getDoc } from "firebase/firestore";

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
     path: '/rota',
     name: 'rota',
     component: RotasView,
     meta: { requiresAuth: true}
    },
    {
      path: '/users',
      name: 'users',
      component: UsersView,
      meta: { requiresAuth: true, perfil: 'admin' }
    },
    {
      path: '/logs',
      name: 'logs',
      component: LogsView,
      meta: { requiresAuth: true }
    }
  ],
})


// Guard global assíncrono
router.beforeEach(async (to, from, next) => {
  const userStore = useUserStore()

  // aguarda Firebase Auth carregar usuário se ainda não estiver
  if (userStore.loading) {
    await new Promise((resolve) => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          const userDocRef = doc(db, 'users', user.uid);
          const userSnap = await getDoc(userDocRef);

          if (userSnap.exists()) {
            const userData = userSnap.data();
            userStore.setUser({
              uid: user.uid,
              nome: userData.nome,
              email: userData.email,
              perfil: userData.perfil,
            });
          } else {
            userStore.clearUser();
          }
        } else {
          userStore.clearUser();
        }

        unsubscribe(); // não escuta mais
        resolve(true);
      });
    });
  }

  // verifica se rota exige autenticação
  if (to.meta.requiresAuth && !userStore.uid) {
    return next({ name: 'login' });
  }

  // verifica perfil específico (ex: admin)
  if (to.meta.perfil && userStore.uid && to.meta.perfil !== userStore.perfil) {
    return next({ name: 'dashboard' });
  }

  next();
});


export default router
