<template>
  <h2>Usuários</h2>
</template>

<script>
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
export default {
  name: 'UsersView',
  data() {
    return {
      email: '',
      password: '',
      isLoading: false,
    }
  },
  methods: {
    createUser() {
      const auth = getAuth();
      this.email = this.email.trim();
      this.password = this.password.trim();
      if (!this.email || !this.password) {
        alert('Please enter both email and password.');
        return;
      }
      this.isLoading = true;
      createUserWithEmailAndPassword(auth, this.email, this.password)
        .then(() => {
        })
        .catch((error) => {
          const errorCode = error.code;
          const errorMessage = error.message;
          console.error('Error during sign up:', errorCode, errorMessage);
          // ..
        });
    },
  }
}
</script>
