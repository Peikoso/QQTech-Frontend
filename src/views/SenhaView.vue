<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-form">
        <h2 class="form-title">Recuperar Senha</h2>
        <form @submit.prevent="recuperaSenha">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              class="form-input"
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Digite seu email"
            />
          </div>
          <div class="form-group">
            <button type="submit" class="login-button">Enviar Link de Recuperação</button>
          </div>
        </form>
        <router-link class="link" :to="{ name: 'login' }" style="text-align: center; background-color:  #24723b;">Voltar ao Login</router-link>
      </div>
    </div>
  </div>
</template>


<script>
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
export default {
  name: "SenhaView",
  data() {
    return {
      email: "",
    };
  },
  methods: {
    async recuperaSenha() {
      const auth = getAuth();
      try {
        await sendPasswordResetEmail(auth, this.email);
        alert("Link de recuperação enviado!");
      } catch (error) {
        console.error("Erro ao enviar link de recuperação: ", error);
      }
    },
  },
};
</script>
