<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3> Logs e Auditoria</h3>
        <p>Monitore as atividades do sistema</p>
      </div>
    </div>
    <div class="view-container">
      <p>Execuções Recentes</p>
      <div class="table-responsive">
        <h2 v-if="logs.length == 0">Nenhum log registrado</h2>
        <table  v-if="logs.length >= 1">
          <thead>
            <tr>
              <th>Run ID</th>
              <th>Rule</th>
              <th>Result</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in logs" :key="log.id">
              <td data-label="Run ID">{{ log.id }}</td>
              <td data-label="Rule">{{ log.rule_id }}</td>
              <td data-label="Result">{{ log.result }}</td>
              <td data-label="Duration">{{ log.duration }} s</td>
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
