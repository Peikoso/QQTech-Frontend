<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3> Logs e Auditoria</h3>
        <p>Monitore as atividades do sistema</p>
      </div>
    </div>
    <div class="view-container">
      <div class="filtro-container">
        <label class="filtro-label" for="filtro">Filtrar Logs</label>
        <select id="filtro-tipo" v-model="filtroTipo">
          <option value="">Todos</option>
          <option value="notificacao">Notificações</option>
          <option value="regra">Regras</option>
          <option value="incidente">Incidentes</option>
          <option value="rota">Rotas</option>
        </select>
      </div>
      <p>Execuções Recentes</p>
      <div class="table-responsive">
        <h2 v-if="logs.length == 0">Nenhum log registrado</h2>
        <table  v-if="logs.length >= 1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Tipo</th>
              <th>Resultado</th>
              <th>Tempo de Execução</th>
              <th>Erro</th>
              <th>Duração</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td data-label="ID">{{ log.id }}</td>
              <td data-label="Tipo">{{ log.type }}</td>
              <td data-label="Resultado">{{ log.result }}</td>
              <td data-label="Tempo de Execução">{{ log.run_time }}</td>
              <td data-label="Erro">{{ log.error || 'Nenhum' }}</td>
              <td data-label="Duração">{{ log.duration }} s</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'LogsView',
  data() {
    return {
      logs: [],
      filtroTipo: ''
    };
  },
  methods: {
    carregarLocalStorage() {
      this.logs = JSON.parse(localStorage.getItem('logs')) || [];
    },
  },
  mounted() {
    this.carregarLocalStorage();
  }
};
</script>
