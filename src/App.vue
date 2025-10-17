<template>
  <div class="app-container">
    <NavbarComponent />
    <main class="conteudo">
      <router-view />
    </main>
  </div>

</template>

<script>
import NavbarComponent from './components/NavbarComponent.vue'

export default {
  name: 'App',
  components: {
    NavbarComponent
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
