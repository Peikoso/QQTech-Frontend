<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Usuários</h3>
        <p>Gerenciamento e criação de usuários</p>
      </div>
      <div>
        <button @click="politicaEscalaModal = true">Política de Escala</button>
        <button @click="novaEscalaModal = true">Nova Escala</button>
      </div>
    </div>
    <div class="view-container">
      <div>
        <label class="filtro-label" for="filtro">Filtrar Nome</label>
        <input type="text" id="filtro" v-model="filtroNome" placeholder="Digite o nome do usuário">
        <label class="filtro-label" for="filtro">Filtrar Roles</label>
        <input type="text" id="filtro" v-model="filtroRole" placeholder="Digite o nome da role">
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Email</th>
              <th>Hora Inicio</th>
              <th>Hora Fim</th>
              <th>Roles</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="escala in escalas" :key="escala.uid">
              <td data-label="Nome">{{ escala.nome }}</td>
              <td data-label="Email">{{ escala.email }}</td>
              <td data-label="Hora Inicio">{{ formatDate(escala.start_dt) }}</td>
              <td data-label="Hora Fim">{{ formatDate(escala.end_dt) }}</td>
              <td data-label="Roles">{{ escala.roles }}</td>
              <td data-label="Perfil">{{ escala.perfil }}</td>
              <td class="actions" data-label="Ações">
                <button @click="editarUser(escala)">Editar</button>
                <button @click="deleteUser(escala)">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="modal" v-if="novaEscalaModal">
      <div class="modal-content">
        <button class="close-btn" @click="novaEscalaModal = false; modoEdicao = false; this.limparForm()">&times;</button>
        <form @submit.prevent="createEscala">
          <label for="user">User</label>
          <select v-model="selectedUserId" id="user">
            <option disabled value="">Selecione um usuário</option>
            <option v-for="user in users" :key="user.uid" :value="user.uid">{{ user.email }}</option>
          </select>

          <label for="start_dt">Hora Inicio</label>
          <input type="datetime-local" id="start_dt" v-model="escala.start_dt">

          <label for="end_dt">Hora Fim</label>
          <input type="datetime-local" id="end_dt" v-model="escala.end_dt">

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
    <div class="modal" v-if="politicaEscalaModal">
      <div class="modal-content">
        <button class="close-btn" @click="politicaEscalaModal = false">&times;</button>
        <h2>Política de Escala</h2>
        <p>Aqui você pode definir as políticas relacionadas às escalas de trabalho.</p>

        <label for="timeout">Tempo de timeout (minutos)</label>
        <input type="number" id="timeout" v-model="timeout" placeholder="Tempo de timeout (minutos)">

        <button @click="salvarPoliticaEscala(timeout)">Salvar</button>
      </div>
    </div>

  </div>
</template>

<script>
import { db } from '../firebaseConfig.js'
import { doc, setDoc, onSnapshot, collection, getDoc, deleteDoc, orderBy, query } from "firebase/firestore";

export default {
  name: 'UsersView',
  data() {
    return {
      user: {
        uid: '',
        nome: '',
        email: '',
        perfil: '',
        roles: '',
      },
      escala: {
        uid: '',
        userUid: '',
        nome: '',
        email: '',
        perfil: '',
        roles: '',
        start_dt: '',
        end_dt: '',
      },
      escalas: [],
      selectedUserId: '',
      users: [],
      novaEscalaModal: false,
      modoEdicao: false,
      unsubscribeUsers: null,
      unsubscribeEscalas: null,
      filtroNome: '',
      filtroRole: '',
      politicaEscalaModal: false,
      timeout: 10,
    }
  },
  methods: {
    getAllUsers() {
      this.unsubscribeUsers = onSnapshot(collection(db, 'users'), (snapshot) => {
        this.users = [];
        snapshot.forEach((doc) => {
          this.users.push({uid: doc.id, ...doc.data()})
        })
      })
    },
    getAllEscalas() {
      this.unsubscribeEscalas = onSnapshot(query(collection(db, 'escalas'), orderBy('start_dt')), (snapshot) => {
        this.escalas = [];
        snapshot.forEach((doc) => {
          this.escalas.push({uid: doc.id, ...doc.data()})
        })
      })
    },
    async createEscala() {
      const userRef = doc(db, "users", this.selectedUserId);
      const userSnap = await getDoc(userRef);

      const user = userSnap.data();

      if(!this.modoEdicao){
        this.escala.uid = crypto.randomUUID();
      }

      await setDoc(doc(db, 'escalas', this.escala.uid),{
        userUid: this.selectedUserId,
        nome: user.nome,
        email: user.email,
        roles: user.roles,
        perfil: user.perfil,
        start_dt: this.escala.start_dt,
        end_dt: this.escala.end_dt,
      }, {merge: true})

      this.limparForm()
      this.novaEscalaModal = false
      this.modoEdicao = false
    },

    editarUser(escala) {
      this.escala.uid = escala.uid,
      this.escala.userUid = escala.userUid,
      this.escala.nome = escala.nome,
      this.escala.email = escala.email,
      this.escala.roles = escala.roles,
      this.escala.perfil = escala.perfil,
      this.escala.start_dt = escala.start_dt,
      this.escala.end_dt = escala.end_dt,

      this.selectedUserId = escala.userUid

      this.novaEscalaModal = true
      this.modoEdicao = true
    },
    limparForm() {
      this.selectedUserId = ''
      this.escala.start_dt = ''
      this.escala.end_dt = ''
    },
    async deleteUser(escala) {
      await deleteDoc(doc(db, 'escalas', escala.uid))
    },
    formatDate(date){
      const dateObj = new Date(date);
      const formatedDate = dateObj.toLocaleString("pt-BR", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit"
      });

      return  formatedDate;
    },
    salvarPoliticaEscala(timeout){
      this.timeout = timeout;
      this.politicaEscalaModal = false;
    }
  },
  mounted() {
      this.getAllUsers();
      this.getAllEscalas();
  },
  beforeUnmount() {
    if(this.unsubscribeUsers){
      this.unsubscribeUsers();
    }
    if(this.unsubscribeEscalas){
      this.unsubscribeEscalas();
    }
  }
}
</script>
