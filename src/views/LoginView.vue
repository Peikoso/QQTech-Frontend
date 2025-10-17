<template>
  <div class="login-container">
    <div class="login-form-container">
      <div class="login-form">
        <h2 class="form-title">Login</h2>
        <form @submit.prevent="handleLogin">
          <div class="form-group">
            <label for="email">Email:</label>
            <input
              class="form-input"
              type="email"
              id="email"
              v-model="email"
              required
              placeholder="Digite seu email"
              autocomplete="email"
            />
          </div>
          <div class="form-group">
            <label for="password">Password:</label>
            <input
              class="form-input"
              type="password"
              id="password"
              v-model="password"
              required
              placeholder="Digite sua senha"
              autocomplete="current-password"
            />
          </div>
          <div class="form-group">
            <button class="login-button">Login</button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>

import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
export default {
  name: 'LoginView',
  data() {
    return {
      email: '',
      password: ''
    }
  },
  methods: {
    handleLogin() {
      const auth = getAuth();
      signInWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
          this.$router.push({ name: 'dashboard' });
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Login failed:', errorCode, errorMessage);
        });
    },

  },
}
</script>

<style>
.login-container {
  min-height: 100vh;
  width: 100vw;
  display: flex;
  flex-direction: column;
  background: #f3f4f6;
  padding: 0;
  margin: 0;
  position: fixed;
  top: 0;
  left: 0;
  overflow-x: hidden;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  z-index: 3000;
}

.login-form-container {
  flex: 1;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
}

.login-form {
  background: white;
  padding: 2.5rem;
  border-radius: 12px;
  box-shadow: 0 5px 25px rgba(0, 0, 0, 0.05);
  width: 100%;
  max-width: 450px;
  transition: transform 0.3s;
}

.form-title {
  color: #333;
  font-size: 1.8rem;
  font-weight: 600;
  margin: 0 0 10px 0;
  text-align: center;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  margin-bottom: 8px;
  font-size: 0.9rem;
  color: #555;
  font-weight: 500;
}

.form-input {
  width: 100%;
  padding: 12px 12px 12px 40px;
  border: 1px solid #ddd;
  border-radius: 8px;
  background-color: #f9f9f9;
  font-size: 1rem;
  transition: all 0.3s;
}

.login-button {
  width: 100%;
  padding: 14px;
  background: #1B5E20;
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1.5rem;
  transition: all 0.3s;
}

.login-button:hover {
  background: #388E3C;
  box-shadow: 0 4px 12px rgba(76, 175, 80, 0.2);
}


@media (max-width: 768px) {
  .login-form-container {
    padding: 1rem;
  }

  .login-form {
    padding: 1.5rem;
  }

  .form-title {
    font-size: 1.5rem;
  }

  .form-subtitle {
    font-size: 0.9rem;
  }
}
</style>
