<template>
  <div :class="{ 'sidebar-aberta': sidebarAberta }">
    <button class="side-button" @click="toggleSidebar">
      ☰
    </button>
    <aside :class="['sidebar', { fechada: !sidebarAberta }]">
      <img :src="logo" alt="logo">
      <br>
      <h2 class="logo">Plantão Monitor</h2>
      <nav>
        <router-link :to="{name: 'dashboard'}" class="link" active-class="ativo">Dashboard</router-link>
        <router-link :to="{name: 'incidentes'}" class="link" active-class="ativo">Incidentes</router-link>
        <router-link :to="{name: 'rules' }" class="link" active-class="ativo">Regras</router-link>
        <router-link :to="{name: 'rota'}" class="link" active-class="ativo">Gestão de Rota</router-link>
        <router-link :to="{name: 'users'}" class="link" active-class="ativo">Usuários</router-link>
        <router-link :to="{name: 'logs'}" class="link" active-class="ativo">Logs de Execução</router-link>
      </nav>

      <div class="user-menu" @click="toggleDropdown">
        <div class="user-info">
          <span>{{ userData.nome }}</span>
        </div>
        <ul v-if="dropdownOpen" class="dropdown">
          <li><a class="link" @click.prevent="preferenciaModal=true">Preferências</a></li>
          <li><a class="link" @click.prevent="logout">Sair</a></li>
        </ul>
      </div>
    </aside>
  </div>
</template>

<script>
import { auth, db } from '../firebaseConfig.js'
import { doc } from 'firebase/firestore';
import { signOut } from 'firebase/auth'
import logo from '@/assets/icons/logo.png'
import { getDoc } from 'firebase/firestore';

export default {
  name: 'NavbarComponent',
  data() {
    return {
      userData: {
        id: '',
        matricula: '',
        nome: '',
        email: '',
        pending: '',
        perfil: '',
        roles: ''
      },
      PermissionsData: [],
      preferenciaModal: false,
      logo,
      dropdownOpen: false,
      sidebarAberta: false,
    }
  },
  methods: {
    async getUserInfo(){
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      if(userDoc.exists()){
        this.userData.id = userDoc.id,
        this.userData.matricula = userDoc.data().matricula
        this.userData.nome = userDoc.data().nome
        this.userData.email = userDoc.data().emai,
        this.userData.pending = userDoc.data().pending
        this.userData.perfil = userDoc.data().perfil
        this.userData.roles = userDoc.data().roles
      }
      else{
        signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.$router.push({ name: 'login' })
          localStorage.removeItem('userData')
        })
        .catch((error) => {
          console.log(error)
          // An error happened.
        })
      }

      localStorage.setItem('userData', JSON.stringify(this.userData))
    },
    clearUserInfo(){
      this.userData = {
        id: '',
        matricula: '',
        nome: '',
        email: '',
        pending: '',
        perfil: '',
        roles: ''
      }
    },
    toggleDropdown() {
      this.dropdownOpen = !this.dropdownOpen
    },
    logout() {
      signOut(auth)
        .then(() => {
          // Sign-out successful.
          this.$router.push({ name: 'login' })
          localStorage.removeItem('userData')
        })
        .catch((error) => {
          console.log(error)
          // An error happened.
        })
    },
    toggleSidebar() {
      this.sidebarAberta = !this.sidebarAberta
    },
  },
  mounted(){
    this.getUserInfo()
  },
  beforeUnmount() {
    this.clearUserInfo()
  }
}
</script>

<style scoped>
.sidebar {
  width: 220px;
  height: 100vh;
  background-color: #269447;
  color: white;
  display: flex;
  flex-direction: column;
  padding: 1rem;
  padding: 1rem;
  transition: transform 0.3s ease;
}

.sidebar.fechada {
  position: fixed;
  left: 0;
  top: 0;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
}

.logo {
  font-size: 1.5rem;
  margin-bottom: 2rem;
}

.link {
  display: block;
  color: #cbd5e1;
  text-decoration: none;
  margin: 0.5rem 0;
  padding: 0.5rem;
  border-radius: 8px;
  transition: 0.2s;
}

.link:hover {
  background-color: #20512e;
  color: #fff;
}

.ativo {
  background-color: #2E7D32;
  color: white;
}

.user-menu {
  margin-top: auto;
  position: relative;
  cursor: pointer;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem;
  border-radius: 8px;
  transition: 0.2s;
}

.user-info:hover {
  background-color: #20512e;
}

.avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
}

.dropdown {
  position: absolute;
  bottom: 3rem;
  left: 0;
  background-color: #269447;
  border: 1px solid #2E7D32;
  border-radius: 8px;
  width: 100%;
  list-style: none;
  padding: 0.5rem 0;
  z-index: 10;
}

.dropdown li a {
  display: block;
  padding: 0.5rem 1rem;
  color: #cbd5e1;
  text-decoration: none;
}

.dropdown li a:hover {
  background-color: #20512e;
  color: white;
}

.side-button {
  margin: 0px;
  position: fixed;
  background-color: #269447;
  color: white;
  border: none;
  border-radius: 0 8px 8px 0;
  cursor: pointer;
  padding: 0.6rem 0.8rem;
  font-size: 1.2rem;
  z-index: 1000;
  transition: background-color 0.3s ease, left 0.3s ease;
}

.sidebar-aberta .side-button {
  left: 220px;
}

.side-button:hover {
  background-color: #20512e;
}

@media (max-width: 768px){
  .side-button{
    margin: 0;
  }
}

</style>
