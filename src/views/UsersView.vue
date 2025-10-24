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
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>Email</th>
            <th>Matricula</th>
            <th>Roles</th>
            <th>Perfil</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="user in users" :key="user.uid">
            <td>{{ user.nome }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.matricula }}</td>
            <td>{{ user.roles }}</td>
            <td>{{ user.perfil }}</td>
            <td>
              <button v-if="!user.pending" @click="editarUser(user)">Editar</button>
              <button v-if="!user.pending" @click="deleteUser(user)">Deletar</button>
              <button v-if="user.pending" @click="aprovarUser(user)">Aprovar</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal" v-if="novoUsuarioModal">
      <div class="modal-content">
        <button class="close-btn" @click="novoUsuarioModal = false; modoEdicao = false; this.limparForm()">&times;</button>
        <form @submit.prevent="createUser">
          <label for="matricula">Matricula</label>
          <input type="text" uid="matricula" placeholder="Ex.: 203102" v-model="user.matricula">

          <label for="nome">Nome</label>
          <input type="text" uid="nome" placeholder="Ex.: João Martins" v-model="user.nome">

          <label for="email">Email</label>
          <input type="email" uid="email" placeholder="Ex.: user@example.com" v-model="user.email" :disabled="modoEdicao">

          <label for="roles">Roles (separados por vírgula)</label>
          <input type="text" uid="roles" placeholder="ex.: CANAIS_DIGITAIS" v-model="user.roles">

          <label for="perfil">Perfil</label>
          <select uid="perfil" v-model="user.perfil">
            <option value="admin">Admin</option>
            <option value="operator">Operator</option>
            <option value="viewer">Viewer</option>
          </select>

          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConfig.js'
import { doc, setDoc, onSnapshot, collection, getDocs, where, query, deleteDoc } from "firebase/firestore";

export default {
  name: 'UsersView',
  data() {
    return {
      user: {
        uid: '',
        nome: '',
        email: '',
        matricula: '',
        perfil: 'viewer',
        roles: '',
        pending: '',
        createdAt: '',
      },
      users: [],
      novoUsuarioModal: false,
      modoEdicao: false,
      unsubscribe: null
    }
  },
  methods: {
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
      this.user.password = ''
      this.user.roles = ''
      this.user.perfil = 'viewer'
      this.user.pending = ''
      this.user.createdAt = ''
    },
    async deleteUser(user) {
      await deleteDoc(doc(db, 'users', user.uid))
    },
  },
  mounted() {
    this.getAllUsers();
  },
  beforeUnmount() {
    if(this.unsubscribe){
      this.unsubscribe();
    }
  }
}
</script>
