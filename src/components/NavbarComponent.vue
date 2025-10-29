<template>
  <div :class="{ 'sidebar-aberta': sidebarAberta }">
    <header class="top-navbar">
      <div class="top-navbar-content">
        <button class="side-button" @click="toggleSidebar">☰</button>
        <button v-if="incidentes.length > 0" class="top-alert" @click="notificacaoModal=true">
          <img :src="notificacaoImg" />
          <span class="alert-count">{{ incidentes.length }}</span>
        </button>
      </div>
    </header>
    <aside :class="['sidebar', { fechada: !sidebarAberta }]">
      <img :src="logo" alt="logo" />
      <br />
      <h2 class="logo">Plantão Monitor</h2>
      <nav>
        <router-link :to="{ name: 'dashboard' }" class="link" active-class="ativo"
          >Dashboard</router-link
        >
        <router-link
          v-if="!(userData.perfil === 'viewer')"
          :to="{ name: 'incidentes' }"
          class="link"
          active-class="ativo"
        >
          Incidentes
        </router-link>
        <router-link
          v-if="!(userData.perfil === 'viewer')"
          :to="{ name: 'rules' }"
          class="link"
          active-class="ativo"
        >
          Regras
        </router-link>
        <router-link
          v-if="userData.perfil === 'admin'"
          :to="{ name: 'runners' }"
          class="link"
          active-class="ativo"
        >
          Runners
        </router-link>
        <div v-if="userData.perfil === 'admin'">
          <hr>
        </div>
        <router-link
          v-if="(userData.perfil === 'admin')"
          :to="{ name: 'logs' }"
          class="link"
          active-class="ativo"
        >
          Logs de Execução
        </router-link>
        <router-link
          v-if="(userData.perfil === 'admin')"
          :to="{ name: 'relatorios' }"
          class="link"
          active-class="ativo"
        >
          Relatórios e Métricas
        </router-link>
        <router-link
          v-if="userData.perfil === 'admin'"
          :to="{ name: 'rota' }"
          class="link"
          active-class="ativo"
        >
          Gestão de Rotas
        </router-link>
        <router-link
          v-if="userData.perfil === 'admin'"
          :to="{ name: 'users' }"
          class="link"
          active-class="ativo"
        >
          Gestão de Usuários
        </router-link>
        <router-link
          v-if="userData.perfil === 'admin'"
          :to="{ name: 'perfil' }"
          class="link"
          active-class="ativo"
        >
          Gestão de Perfils
        </router-link>
      </nav>

      <div class="user-menu" @click="toggleDropdown">
        <div class="user-info">
          <span>{{ userData.nome }}</span>
        </div>
        <ul v-if="dropdownOpen" class="dropdown">
          <li v-if="!(userData.perfil === 'viewer')">
            <a class="link" @click="perfilModal = true">Perfil</a>
            <a class="link" @click="preferenciaModal = true">Preferências</a>
          </li>
          <li><a class="link" @click.prevent="logout">Sair</a></li>
        </ul>
      </div>
    </aside>

    <div class="modal" v-if="preferenciaModal" style="z-index: 2000">
      <div class="modal-content">
        <button class="close-btn" @click="preferenciaModal = false">&times;</button>
        <h2>Preferências</h2>
        <form @submit.prevent="salvarPreferencias">
          <div class="switch-container">
            <span class="switch-label">Notificações de Push</span>
            <label class="switch">
              <input type="checkbox" v-model="preferencia.enablePush" />
              <span class="slider"></span>
            </label>
          </div>

          <div class="switch-container">
            <span class="switch-label">Notificações Sonoras de Push</span>
            <label class="switch">
              <input type="checkbox" v-model="preferencia.pushSound" />
              <span class="slider"></span>
            </label>
          </div>
          <br />
          <h5 style="text-align: center">Janela de Não Perturbe</h5>
          <div class="row">
            <div class="col">
              <label for="hora_inicio">Hora Início</label>
              <input type="time" id="hora_inicio" v-model="preferencia.startTime" />
            </div>
            <div class="col">
              <label for="hora_final">Hora Final</label>
              <input type="time" id="hora_final" v-model="preferencia.endTime" />
            </div>
          </div>
          <br />
          <h5 style="text-align: center">Canais de Notificação</h5>
          <div class="row">
            <div class="col">
              <div class="switch-container">
                <span class="switch-label">Email</span>
                <label class="switch">
                  <input type="checkbox" v-model="preferencia.enableEmail" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>

            <div class="col">
              <div class="switch-container">
                <span class="switch-label">ComuniQ</span>
                <label class="switch">
                  <input type="checkbox" v-model="preferencia.enableComuniQ" />
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>


    <div class="modal" v-if="perfilModal" style="z-index: 2000">
      <div class="modal-content">
        <button class="close-btn" @click="perfilModal = false; getUserInfo()">&times;</button>
        <h2>Perfil</h2>
        <form @submit.prevent="salvarPerfil">
          <div class="row">
            <div class="col">
              <label for="nome">Nome</label>
              <input type="text" id="nome" v-model="userData.nome" :disabled="true" />
            </div>
            <div class="col">
              <div class="avatar-container">
                <img :src="userData.foto || avatarDefault" class="foto-perfil" />
                <label for="file-avatar" class="editar-overlay">Editar</label>
                <input id="file-avatar" type="file" @change="atualizarAvatar" accept="image/*"/>
              </div>
            </div>
          </div>

          <label for="email">Email</label>
          <input type="email" id="email" v-model="userData.email" :disabled="true" />

          <div class="row">
            <div class="col">
              <label for="matricula">Matrícula</label>
              <input type="text" id="matricula" v-model="userData.matricula" :disabled="true" />
            </div>
            <div class="col">
              <label for="perfil">Perfil</label>
              <input type="text" id="perfil" v-model="userData.perfil" :disabled="true" />
            </div>
          </div>

          <label for="roles">Roles</label>
          <input type="text" id="roles" v-model="userData.roles" :disabled="true" />

          <label for="telefone">Telefone</label>
          <input type="number" id="telefone" v-model="userData.telefone" />

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>

    <div class="modal" v-if="notificacaoModal" style="z-index: 3000;">
      <div class="modal-content" style="max-width: 800px;">
        <button class="close-btn" style="top: 34px;" @click="notificacaoModal = false">&times;</button>
        <div class="modal-details">
          <h2>Notificações</h2>
          <div class="table-responsive">
            <p v-if="incidentes.length == 0"><strong>Nenhuma Notificação Registrada</strong></p>
            <table v-if="incidentes.length >= 1">
              <thead>
                <tr>
                  <th>Incidente ID:</th>
                  <th>Prioridade</th>
                  <th>Aberta em</th>
                  <th>Ação</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="incidente in incidentes" :key="incidente.id">
                  <td data-label="ID">{{ incidente.id }}</td>
                  <td data-label="Prioridade">{{ regras.find((regra) => regra.id === incidente.regra_id)?.prioridade }}</td>
                  <td data-label="Aberta em">{{ incidente.created_at }} minutos</td>
                  <td class="actions" style="text-align: center;">
                    <button @click="this.$router.push({ name: 'incidentes', query: { incidenteId: incidente.id } }); this.notificacaoModal = false">Ir</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from '../firebaseConfig.js'
import { doc, setDoc } from 'firebase/firestore'
import { signOut } from 'firebase/auth'
import { getDoc } from 'firebase/firestore'
import logo from '@/assets/icons/logo.png'
import notificacaoImg from '@/assets/icons/notifications.svg'
import avatarDefault from '@/assets/icons/avatar-default.svg'

export default {
  name: 'NavbarComponent',
  data() {
    return {
      userData: {
        id: '',
        matricula: '',
        nome: '',
        email: '',
        telefone: '',
        pending: '',
        perfil: '',
        roles: '',
        foto: '',
      },
      preferencia: {
        enablePush: false,
        pushSound: false,
        startTime: '00:00',
        endTime: '00:00',
        enableEmail: false,
        enableComuniQ: false,
      },
      incidente: {
        id: '',
        regra_id: '',
        user_id_ack: '',
        user_id_closed: '',
        status: '',
        comentario_ack: '',
        comentario_closed: '',
        created_at: '',
        ack_at: '',
        closed_at: '',
        logs: [],
      },
      incidentes: [],
      regras: [],
      preferenciaModal: false,
      perfilModal: false,
      notificacaoModal: false,
      dropdownOpen: false,
      sidebarAberta: false,
      avatarDefault,
      logo,
      notificacaoImg,
    }
  },
  methods: {
    async getUserInfo() {
      const userDoc = await getDoc(doc(db, 'users', auth.currentUser.uid))
      if (userDoc.exists()) {
        this.userData.id = userDoc.id
        this.userData.matricula = userDoc.data().matricula
        this.userData.nome = userDoc.data().nome
        this.userData.email = userDoc.data().email
        this.userData.telefone = userDoc.data().telefone || ''
        this.userData.pending = userDoc.data().pending
        this.userData.perfil = userDoc.data().perfil
        this.userData.roles = userDoc.data().roles
        this.userData.foto = userDoc.data().foto || this.avatarDefault

        const prefDoc = await getDoc(doc(db, 'preferences', this.userData.id))
        if (prefDoc.exists()) {
          this.preferencia.enablePush = prefDoc.data().enablePush
          this.preferencia.pushSound = prefDoc.data().pushSound
          this.preferencia.startTime = prefDoc.data().startTime
          this.preferencia.endTime = prefDoc.data().endTime
          this.preferencia.enableEmail = prefDoc.data().enableEmail
          this.preferencia.enableComuniQ = prefDoc.data().enableComuniQ
        }
      }
      else if (auth.currentUser.isAnonymous === true) {
        this.userData.id = 'visitante'
        this.userData.matricula = 'visitante'
        this.userData.nome = 'visitante'
        this.userData.email = 'visitante'
        this.userData.pending = 'visitante'
        this.userData.perfil = 'viewer'
        this.userData.roles = 'visitante'
        this.userData.foto = this.avatarDefault
      }
      else {
        await signOut(auth)
        this.$router.push({ name: 'login' })
        localStorage.removeItem('userData')
      }

      console.log(this.userData)
      localStorage.setItem('userData', JSON.stringify(this.userData))
    },
    clearUserInfo() {
      this.userData = {
        id: '',
        matricula: '',
        nome: '',
        email: '',
        telefone: '',
        pending: '',
        perfil: '',
        roles: '',
        foto: '',
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
    async salvarPreferencias() {
      await setDoc(
        doc(db, 'preferences', this.userData.id),
        {
          enablePush: this.preferencia.enablePush,
          pushSound: this.preferencia.pushSound,
          startTime: this.preferencia.startTime,
          endTime: this.preferencia.endTime,
          enableEmail: this.preferencia.enableEmail,
          enableComuniQ: this.preferencia.enableComuniQ,
        },
        { merge: true },
      )
      this.preferenciaModal = false
    },
    carregarLocalStorage() {
      this.regras = JSON.parse(localStorage.getItem('regras')) || []
      const incidentesData = JSON.parse(localStorage.getItem('incidentes')) || []
      this.incidentes = incidentesData.filter((incidente) => incidente.status === 'open')
    },
    async salvarPerfil() {
      await setDoc(doc(db, 'users', this.userData.id),{
        telefone: this.userData.telefone,
      }, {merge: true})

      this.perfilModal = false
      this.getUserInfo()
    },
    atualizarAvatar(event) {
      const file = event.target.files[0]
      if (file) {
        const reader = new FileReader()
        reader.onload = (e) => {
          this.userData.foto = e.target.result
        }
        reader.readAsDataURL(file)
      }
    },
  },
  mounted() {
    this.getUserInfo()
    this.carregarLocalStorage()
  },
  beforeUnmount() {
    this.clearUserInfo()
  },
}
</script>
