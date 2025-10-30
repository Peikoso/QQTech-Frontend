<template>
  <div class="modal"  style="background: none; position: relative; z-index: 500;">
    <div class="modal-content" style="max-width: 1000px;">
      <div class="conteudo-container" style="display: flex; justify-content: center;">
        <div class="titulo-descricao">
          <h3>Canais de Notificação</h3>
        </div>
      </div>
      <form @submit.prevent="editarCanais">
        <label for="serverKey">Firebase Server Key</label>
        <input
          type="password"
          id="serverKey"
          v-model="serverKey"
          placeholder="Insira sua Server Key"
          required
        />

        <label for="smtpHost">SMTP Host</label>
        <input
          type="password"
          id="smtpHost"
          v-model="smtpHost"
          placeholder="Insira seu SMTP Host"
          required
        />
        <button type="submit">Salvar Canais</button>
      </form>
      <div v-if="saveCanais" class="mensagem-salvo">
        {{ message }}
      </div>

      <div class="conteudo-container" style="display: flex; justify-content: center;">
        <div class="titulo-descricao">
          <h3> Settings / Integrations / API</h3>
        </div>
      </div>
      <form @submit.prevent="editarSettings">
        <label for="serviceAccount">Service Account (Firebase)</label>
        <input
          type="password"
          id="serviceAccount"
          v-model="serviceAccount"
          placeholder="Insira sua Server Key"
          required
        />

        <label for="apiToken">API Token</label>
        <input
          type="password"
          id="apiToken"
          v-model="apiToken"
          placeholder="Insira seu API Token"
          required
        />
        <button type="submit">Salvar Configurações</button>
      </form>
      <div v-if="saveSettings" class="mensagem-salvo">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'PerfilView',
  data() {
    return {
      serverKey: '12321321312312321312',
      smtpHost: 'smtp.meuservidor.com',
      serviceAccount: '21321312312123213123213231',
      apiToken: 'asdasdasdasdasdasdasdasdasdasd',
      saveCanais: false,
      saveSettings: false,
      message: ''
    }
  },
  methods: {
    editarCanais() {
      this.message = 'Canais salvas com sucesso!'
      this.saveCanais = true;
      setTimeout(() => {
        this.saveCanais = false;
        this.message = '';
      }, 3000);
    },
    editarSettings() {
      this.message = 'Configurações salvas com sucesso!'
      this.saveSettings = true;
      setTimeout(() => {
        this.saveSettings = false;
        this.message = '';
      }, 3000);
    }
  },
};
</script>
