<template>
  <div class="app-container">
    <NavbarComponent v-if="currentUser" />
    <main class="conteudo">
      <router-view />
    </main>
  </div>

</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue'
import { auth } from './firebaseConfig.js'
import { onAuthStateChanged } from 'firebase/auth'
export default {
  name: 'App',
  components: {
    NavbarComponent
  },
  data() {
    return {
      currentUser: null
    }
  },
  mounted() {
    this.unsubscribe = onAuthStateChanged(auth, (user) => {
      this.currentUser = user
    })
  },
  beforeUnmount() {
    if (this.unsubscribe) this.unsubscribe()
  }

}

</script>

<style>
*{
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
}

.app-container {
  display: flex;
  height: 100vh;
}

.conteudo {
  flex: 1;
  padding: 2rem;
  background: #f3f4f6;
  overflow-y: auto;
}
</style>
