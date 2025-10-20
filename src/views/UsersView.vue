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
          <tr v-for="user in users" :key="user.id">
            <td>{{ user.nome }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.matricula }}</td>
            <td>{{ user.roles }}</td>
            <td>{{ user.perfil }}</td>
            <td>
              <button @click="editarUser(user)">Editar</button>
              <button @click="excluirUser">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <div class="modal" v-if="novoUsuarioModal">
      <div class="modal-content">
        <button class="close-btn" @click="novoUsuarioModal = false; modoEdicao = false">&times;</button>
        <form @submit.prevent="createUser">
          <label for="matricula">Matricula</label>
          <input type="text" id="matricula" placeholder="Ex.: 203102" v-model="user.matricula">

          <label for="nome">Nome</label>
          <input type="text" id="nome" placeholder="Ex.: João Martins" v-model="user.nome">

          <label for="email">Email</label>
          <input type="email" id="email" placeholder="Ex.: user@example.com" v-model="user.email">

          <label for="password">Senha</label>
          <input type="password" id="password" placeholder="" v-model="user.password">

          <label for="roles">Roles (separados por vírgula)</label>
          <input type="text" id="roles" placeholder="ex.: CANAIS_DIGITAIS" v-model="user.roles">

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
  </div>
</template>

<script>
import { db } from '../firebaseConfig.js'
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { doc, setDoc, onSnapshot, collection } from "firebase/firestore";

export default {
  name: 'UsersView',
  data() {
    return {
      user: {
        nome: '',
        email: '',
        password: '',
        matricula: '',
        perfil: 'viewer',
        roles: '',
      },
      users: [],
      novoUsuarioModal: false,
      unsubscribe: null
    }
  },
  methods: {
    getAllUsers() {
      this.unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
        this.users = [];
        snapshot.forEach((doc) => {
          this.users.push({id: doc.id, ...doc.data()})
        })
      })
    },
    createUser() {
      const auth = getAuth();
      this.user.email = this.user.email.trim();
      this.user.password = this.user.password.trim();
      if (!this.user.email || !this.user.password) {
        alert('Please enter both email and password.');
        return;
      }
      createUserWithEmailAndPassword(auth, this.user.email, this.user.password)
        .then((userCredential) => {
          // Signed up
          const userUID = userCredential.user.uid;

          setDoc(doc(db, 'users', userUID),{
            nome: this.user.nome,
            matricula: this.user.matricula,
            perfil: this.user.perfil,
            roles: this.user.roles,
            email: this.user.email,
            createdAt: new Date(),
          }, {merge: true})

          // ...
        })
        .then(() => {
          this.novoUsuarioModal = false
          this.limparForm()
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error during sign up:', errorCode, errorMessage);
          // ..
        });

    },
    limparForm() {
      this.user.matricula = ''
      this.user.nome = ''
      this.user.email = ''
      this.user.password = ''
      this.user.roles = ''
      this.user.perfil = 'viewer'
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
