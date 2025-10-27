<template>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Runners</h3>
        <p>Configure e gerencie os runners de monitoramento</p>
      </div>
      <div>
        <button @click="startRunners">{{ buttonStart ? 'Parar' : 'Iniciar' }} Runners</button>
      </div>
    </div>

    <div class="small-views">
      <div class="small-view-container">
        <div>
          <h3>Runners Ativos</h3>
          <br><br>
          <h3>{{ activeRunners.length }}</h3>
          <br>
          <br>
          <p>Runners em operação</p>
        </div>
      </div>
      <div class="small-view-container">
        <div>
          <h3>Runners Inativos</h3>
          <br><br>
          <h3>{{ inactiveRunners.length }}</h3>
          <br>
          <br>
          <p>Runners não estão em operação</p>
        </div>
      </div>
    </div>

    <div class="view-container">
      <p>Runners Em Execução</p>
      <div>
        <label class="filtro-label" for="filtro">Filtrar Runners</label>
        <input type="text" id="filtro" v-model="filtro" placeholder="Pesquise por regra">
      </div>
      <div class="table-responsive">
        <h2 v-if="activeRunners.length === 0">Nenhum Runner em Execução</h2>
        <table  v-if="activeRunners.length >= 1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Regra</th>
              <th>Ciclo de Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="runner in activeRunners" :key="runner.id">
              <td data-label="ID">{{ runner.id }}</td>
              <td data-label="Regra">{{ regras.find(regra => regra.id === runner.regra_id)?.nome }}</td>
              <td data-label="Próximas execuções">{{ runner.next_run }} minutos</td>
              <td class="actions" style="text-align: center;"><button @click="pararRunner(runner)">Parar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <br>
    <div class="view-container">
      <p>Runners Pausadas</p>
      <div>
        <label class="filtro-label" for="filtro">Filtrar Runners</label>
        <input type="text" id="filtro" v-model="filtro" placeholder="Pesquise por regra">
      </div>
      <div class="table-responsive">
        <h2 v-if="inactiveRunners.length === 0">Nenhum Runner em Pausa</h2>
        <table  v-if="inactiveRunners.length >= 1">
          <thead>
            <tr>
              <th>ID</th>
              <th>Regra</th>
              <th>Ciclo de Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="runner in inactiveRunners" :key="runner.id">
              <td data-label="ID">{{ runner.id }}</td>
              <td data-label="Regra">{{ regras.find(regra => regra.id === runner.regra_id)?.nome }}</td>
              <td data-label="Próximas execuções">{{ runner.next_run }} minutos</td>
              <td class="actions" style="text-align: center;"><button @click="iniciarRunner(runner)">Iniciar</button></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
      runners: [],
      filtro: '',
      activeRunners: [],
      inactiveRunners: [],
      regras: [],
      startRunner: false,
      buttonStart: false,
    };
  },
  methods: {
    startRunners() {
      this.startRunner = !this.startRunner;
      this.buttonStart = !this.buttonStart;

      if (this.startRunner) {
        this.inactiveRunners.forEach(runner => {
          this.iniciarRunner(runner);
        });
      }
      if (!this.startRunner) {
        this.activeRunners.forEach(runner => {
          this.pararRunner(runner);
        });
      }

    },
    pararRunner(runner) {
      this.activeRunners = this.activeRunners.filter(r => r.id !== runner.id);
      this.inactiveRunners.push(runner);
    },
    iniciarRunner(runner) {
      this.inactiveRunners = this.inactiveRunners.filter(r => r.id !== runner.id);
      this.activeRunners.push(runner);
    },
    carregarLocalStorage() {
      this.regras = JSON.parse(localStorage.getItem('regras')) || [];

      let runnersData = [
        { id: 1, ativo: 'active' , regra_id: '1a2b3c4d-0005', next_run: 5 },
        { id: 2, ativo: 'inactive', regra_id: '1a2b3c4d-0002', next_run: 11 },
        { id: 3, ativo: 'active', regra_id: '1a2b3c4d-0001', next_run: 12 },
        { id: 4, ativo: 'inactive', regra_id: '1a2b3c4d-0003', next_run: 13 },
      ];

      runnersData = runnersData.filter(runner => {
        const runners = this.regras.some(regra => regra.executar === true && regra.id === runner.regra_id);
        return runners;
      });

      this.activeRunners = runnersData.filter(runner => runner.ativo === 'active');
      this.inactiveRunners = runnersData.filter(runner => runner.ativo === 'inactive');
    },
  },
  mounted() {
    this.carregarLocalStorage();
  },
};
</script>
