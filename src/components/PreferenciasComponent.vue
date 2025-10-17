<template>
  <div class="add-modal">
  <div class="modal-content">
    <button class="close-btn" @click="$emit('fechar')">&times;</button>
    <form @submit.prevent="salvarPreferencias">
      <h3>Preferências de Notificação</h3>

      <div class="row">
        <div class="col">
          <label for="hora_inicio">Hora Início</label>
          <input type="time" id="hora_inicio" v-model="hora_inicio">
        </div>

        <div class="col">
          <label for="hora_final">Hora Final</label>
          <input type="time" id="hora_final" v-model="hora_final">
        </div>
      </div>

      <div class="switch-container">
        <span class="switch-label">Enable Push</span>
        <label class="switch">
          <input type="checkbox" v-model="enable_push">
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-container">
        <span class="switch-label">Push Sound</span>
        <label class="switch">
          <input type="checkbox" v-model="push_sound">
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-container">
        <span class="switch-label">WhatsApp Habilitado</span>
        <label class="switch">
          <input type="checkbox" v-model="whatsapp">
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-container">
        <span class="switch-label">Slack Habilitado</span>
        <label class="switch">
          <input type="checkbox" v-model="slack">
          <span class="slider"></span>
        </label>
      </div>

      <div class="switch-container">
        <span class="switch-label">Email Habilitado</span>
        <label class="switch">
          <input type="checkbox" v-model="email">
          <span class="slider"></span>
        </label>
      </div>

      <button type="salvar">Salvar</button>
    </form>
  </div>
</div>
</template>

<script>


export default {
  data(){
    return{
      enable_push: true,
      push_sound: true,
      whatsapp: true,
      slack: true,
      email: true,
    }
  },
  methods: {

  }
}
</script>

<style src="@/assets/styles.css"></style>
