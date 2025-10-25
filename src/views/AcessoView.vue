<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-form">
        <h2 class="form-title">Solicitar Acesso</h2>
        <form @submit.prevent="createUser">
          <div class="form-group">
            <label for="matricula">Matricula</label>
            <input class="form-input" type="text" id="matricula" placeholder="Ex.: 203102" v-model="user.matricula">
          </div>

          <div class="form-group">
            <label for="nome">Nome</label>
            <input class="form-input" type="text" id="nome" placeholder="Ex.: João Martins" v-model="user.nome">
          </div>

          <div class="form-group">
            <label for="email">Email</label>
            <input class="form-input" type="email" id="email" placeholder="Ex.: user@example.com" v-model="user.email" :disabled="modoEdicao">
          </div>

          <div class="form-group">
            <label for="roles">Roles (separados por vírgula)</label>
            <input class="form-input" type="text" id="roles" placeholder="ex.: CANAIS_DIGITAIS" v-model="user.roles">
          </div>

          <div class="form-group">
            <button class="login-button" type="submit">Salvar</button>
          </div>
        </form>
        <router-link class="link" :to="{ name: 'login' }" style="text-align: center; background-color:  #24723b;">Voltar ao Login</router-link>
      </div>
    </div>
  </div>
</template>

<script>
import { db } from '../firebaseConfig.js'
import { doc, setDoc, collection, getDocs, where, query } from "firebase/firestore";

export default {
  name: "AcessoView",
  data() {
    return {
      modoEdicao: false,
      user: {
        matricula: "",
        nome: "",
        email: "",
        roles: "",
      },
    };
  },
  methods: {
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
        perfil: 'operator',
        roles: this.user.roles,
        email: this.user.email,
        pending: true,
        createdAt: new Date(),
      }, {merge: true})

      alert("Solicitação de acesso enviada com sucesso! Após a aprovação digite a senha que deseja utilizar no primeiro login.");

      this.$router.push({ name: 'login' });
    },
  },
};
</script>
