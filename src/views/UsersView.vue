<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Usuários</h3>
        <p>Gerenciamento e criação de usuários</p>
      </div>
      <button @click="novoUsuarioModal = true">Novo Usuário</button>
    </div>
    <div class="view-container">
      <div>
        <label class="filtro-label" for="filtro">Filtrar Nome</label>
        <input type="text" id="filtro" v-model="filtroNome" placeholder="Digite o nome do usuário">
        <label class="filtro-label" for="filtro">Filtrar Matricula</label>
        <input type="text" id="filtro" v-model="filtroMatricula" placeholder="Digite a matrícula">
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th></th>
              <th>Nome</th>
              <th>Email</th>
              <th>Matricula</th>
              <th>Roles</th>
              <th>Perfil</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in users.slice(pagInicio, pagFim)" :key="user.uid">
              <td data-label="">
                <div class="avatar-container" style="height: 50px; width: 50px; margin: 0;">
                  <img :src="user.foto || avatarDefault" class="foto-perfil" />
                </div>
              </td>
              <td data-label="Nome">{{ user.nome }}</td>
              <td data-label="Email">{{ user.email }}</td>
              <td data-label="Matricula">{{ user.matricula }}</td>
              <td data-label="Roles">
                <span
                  v-for="(role, index) in user.roles" :key="index"
                  :style="{ backgroundColor: getRoleColor(role) }"
                  class="role-badge"
                >
                  {{ role }}
                </span>
              </td>
              <td data-label="Perfil">{{ user.perfil }}</td>
              <td class="actions" data-label="Ações">
                <button v-if="!user.pending" @click="editarUser(user)">Editar</button>
                <button v-if="!user.pending" @click="deleteUser(user)">Deletar</button>
                <button v-if="user.pending" @click="aprovarUser(user)">Aprovar</button>
                <button v-if="user.pending" @click="deleteUser(user)">Rejeitar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnterior()">Anterior</button>
          <button @click="pagSeguinte()">Seguinte</button>
        </div>
      </div>
    </div>
    <div class="modal" v-if="novoUsuarioModal">
      <div class="modal-content">
        <button class="close-btn" @click="novoUsuarioModal = false; modoEdicao = false; this.limparForm(); this.getAllUsers()">&times;</button>
        <form @submit.prevent="createUser">
          <label for="matricula">Matricula</label>
          <input type="text" id="matricula" placeholder="Ex.: 203102" v-model="user.matricula">

          <label for="nome">Nome</label>
          <input type="text" id="nome" placeholder="Ex.: João Martins" v-model="user.nome">

          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Ex.: user@example.com" v-model="user.email" :disabled="modoEdicao">

          <label for="telefone">Telefone</label>
          <input type="number" id="telefone" placeholder="Ex.: 11912345678" v-model="user.telefone">

          <label for="roles">Roles</label>
          <div>
            <span
            v-for="(role, index) in user.roles" :key="index"
            :style="{ backgroundColor: getRoleColor(role) }"
            class="role-badge">
              {{ role }}
              <button style="all: unset; cursor: pointer;" @click="removerRole(index)">&times;</button>
            </span>
          </div>
          <select id="roles" v-model="selectedRole">
            <option value="" disabled selected>Selecione uma role</option>
            <option v-for="(role, index) in roles" :key="index" :value="role">{{ role.nome }}</option>
          </select>
          <button @click.prevent="adicionarRole">Adicionar Role</button>

          <label for="perfil">Perfil</label>
          <select id="perfil" v-model="user.perfil">
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>

    <div v-if="deleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir este usuário?</p>
        <div class="botoes-confirmacao">
          <button style="background-color: red;" @click="confirmarDelete()">Sim, Excluir</button>
          <button @click="deleteModal = false; limparForm()">Cancelar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConfig.js'
import { doc, setDoc, onSnapshot, collection, getDocs, where, query, deleteDoc } from "firebase/firestore";
import avatarDefault from '@/assets/icons/avatar-default.svg';

export default {
  name: 'UsersView',
  data() {
    return {
      user: {
        uid: '',
        nome: '',
        email: '',
        telefone: '',
        matricula: '',
        perfil: 'viewer',
        roles: [],
        pending: '',
        createdAt: '',
      },
      users: [],
      roles: [],
      selectedRole: '',
      novoUsuarioModal: false,
      modoEdicao: false,
      deleteModal: false,
      unsubscribe: null,
      avatarDefault,
      pagInicio: 0,
      pagFim: 5,
      filtroNome: '',
      filtroMatricula: '',
    }
  },
  methods: {
    adicionarRole(){
      const role = this.selectedRole;
      if(role && !this.user.roles.includes(role.nome)){
        this.user.roles.push(role.nome);
      }
      this.selectedRole = ""
    },
    removerRole(index){
      this.user.roles.splice(index, 1);
    },
    getRoleColor(roleName){
      const role = this.roles.find(r => r.nome === roleName);
      return role ? role.cor : '#bdc3c7';
    },
    getAllUsers() {
      this.unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        this.users = [];
        snapshot.forEach((doc) => {
          this.users.push({uid: doc.id, ...doc.data()})
        })
      })
    },
    async createUser() {
      let q = query(collection(db, "users"), where("email", "==", this.user.email));
      const querySnapshotEmail = await getDocs(q);

      if(this.modoEdicao){
        const filtered = querySnapshotEmail.docs.filter(doc => doc.id !== this.user.uid);
        if(filtered.length > 0){
          alert("E-mail já cadastrado!");
          return;
        }
      }

      if(!querySnapshotEmail.empty && !this.modoEdicao){
          alert("E-mail já cadastrado!");
          return;
      }


      q = query(collection(db, "users"), where("matricula", "==", this.user.matricula));
      const querySnapshotMatricula = await getDocs(q);

      if(this.modoEdicao){
        const filtered = querySnapshotMatricula.docs.filter(doc => doc.id !== this.user.uid);
        if(filtered.length > 0){
          alert("Matrícula já cadastrada!");
          return;
        }
      }

      if(!querySnapshotMatricula.empty && !this.modoEdicao){
          alert("Matrícula já cadastrada!");
          return;
      }

      let uid = crypto.randomUUID();
      if(this.modoEdicao){
        uid = this.user.uid;
      }

      await setDoc(doc(db, 'users', uid),{
        nome: this.user.nome,
        matricula: this.user.matricula,
        perfil: this.user.perfil,
        roles: this.user.roles,
        email: this.user.email,
        telefone: this.user.telefone,
        pending: this.modoEdicao ? this.user.pending : false,
        createdAt: this.modoEdicao ? this.user.createdAt : new Date(),
      }, {merge: true})

      this.limparForm()
      this.novoUsuarioModal = false
      this.modoEdicao = false
    },
    editarUser(user) {
      this.user.uid = user.uid
      this.user.matricula = user.matricula
      this.user.nome = user.nome
      this.user.email = user.email
      this.user.telefone = user.telefone
      this.user.roles = user.roles
      this.user.perfil = user.perfil
      this.user.pending = user.pending
      this.user.createdAt = user.createdAt

      this.novoUsuarioModal = true
      this.modoEdicao = true
    },
    limparForm() {
      this.user.matricula = ''
      this.user.nome = ''
      this.user.email = ''
      this.user.telefone = ''
      this.user.password = ''
      this.user.roles = []
      this.user.perfil = 'viewer'
      this.user.pending = ''
      this.user.createdAt = ''
    },
    deleteUser(user) {
      this.user.uid = user.uid
      this.deleteModal = true
    },
    async confirmarDelete(){
      await deleteDoc(doc(db, 'users', this.user.uid))
      this.limparForm()
      this.deleteModal = false
    },
    async aprovarUser(user) {
      await setDoc(doc(db, 'users', user.uid),{
        pending: false,
      }, {merge: true})
    },
    pagAnterior(){
      if(this.pagInicio > 0){
        this.pagInicio -= 5;
        this.pagFim -= 5;
      }
    },
    pagSeguinte(){
      if(this.pagFim < this.users.length){
        this.pagInicio += 5;
        this.pagFim += 5;
      }
    },
    carregarLocalStorage(){
      this.roles = JSON.parse(localStorage.getItem('roles')) || [];
    }
  },
  created() {
    this.carregarLocalStorage();
    this.getAllUsers();
  },
  beforeUnmount() {
    if(this.unsubscribe){
      this.unsubscribe();
    }
  }
}
</script>
