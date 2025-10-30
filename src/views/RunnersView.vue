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
              <th>Prioridade</th>
              <th>Ciclo de Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="runner in activeRunners.slice(pagInicioOn, pagFimOn)" :key="runner.id">
              <td data-label="ID">{{ runner.id }}</td>
              <td data-label="Regra">{{ regras.find(regra => regra.id === runner.regra_id)?.nome }}</td>
              <td data-label="Prioridade">{{ regras.find(regra => regra.id === runner.regra_id)?.prioridade }}</td>
              <td data-label="Ciclo de Execução">{{ regras.find(regra => regra.id === runner.regra_id)?.minuto_atualizacao  }} minutos</td>
              <td class="actions"><button @click="pararRunner(runner)">Parar</button></td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnteriorOn">Anterior</button>
          <button @click="pagSeguinteOn">Seguinte</button>
        </div>
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
              <th>Prioridade</th>
              <th>Ciclo de Execução</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="runner in inactiveRunners.slice(pagInicioOff, pagFimOff)" :key="runner.id">
              <td data-label="ID">{{ runner.id }}</td>
              <td data-label="Regra">{{ regras.find(regra => regra.id === runner.regra_id)?.nome }}</td>
              <td data-label="Prioridade">{{ regras.find(regra => regra.id === runner.regra_id)?.prioridade }}</td>
              <td data-label="Ciclo de Execução">{{ regras.find(regra => regra.id === runner.regra_id)?.minuto_atualizacao  }} minutos</td>
              <td class="actions"><button @click="iniciarRunner(runner)">Iniciar</button></td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnteriorOff">Anterior</button>
          <button @click="pagSeguinteOff">Seguinte</button>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
      runner: {
        id: '',
        ativo: '',
        regra_id: '',
      },
      regrasAtivas: [],
      runners: [],
      filtro: '',
      activeRunners: [],
      inactiveRunners: [],
      regras: [],
      startRunner: false,
      buttonStart: false,
      pagInicioOn: 0,
      pagFimOn: 5,
      pagInicioOff: 0,
      pagFimOff: 5,
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
      const data = {
        id: runner.id,
        ativo: 'inactive',
        regra_id: runner.regra_id,
      }
      const index = this.runners.findIndex(r => r.id === runner.id);
      this.runners[index] = data;

      this.activeRunners = this.activeRunners.filter(r => r.id !== runner.id);
      this.inactiveRunners.push(runner);
      this.salvarLocalStorage();
    },
    iniciarRunner(runner) {
      const data = {
        id: runner.id,
        ativo: 'active',
        regra_id: runner.regra_id,
      }
      const index = this.runners.findIndex(r => r.id === runner.id);
      this.runners[index] = data;

      this.inactiveRunners = this.inactiveRunners.filter(r => r.id !== runner.id);
      this.activeRunners.push(runner);
      this.salvarLocalStorage();
    },
    salvarLocalStorage() {
      localStorage.setItem('runners', JSON.stringify(this.runners));
    },
    carregarLocalStorage() {
      this.regras = JSON.parse(localStorage.getItem('regras')) || [];
      this.runners = JSON.parse(localStorage.getItem('runners')) || [];

      this.regrasAtivas = this.runners.filter(runner => {
        const runners = this.regras.some(regra => regra.executar === true && regra.id === runner.regra_id);
        return runners;
      });

      this.activeRunners = this.regrasAtivas.filter(runner => runner.ativo === 'active');
      this.inactiveRunners = this.regrasAtivas.filter(runner => runner.ativo === 'inactive');
    },
    pagAnteriorOn(){
      if(this.pagInicioOn > 0){
        this.pagInicioOn -= 5;
        this.pagFimOn -= 5;
      }
    },
    pagSeguinteOn(){
      if(this.pagFimOn < this.activeRunners.length){
        this.pagInicioOn += 5;
        this.pagFimOn += 5;
      }
    },
    pagAnteriorOff(){
      if(this.pagInicioOff > 0){
        this.pagInicioOff -= 5;
        this.pagFimOff -= 5;
      }
    },
    pagSeguinteOff(){
      if(this.pagFimOff < this.inactiveRunners.length){
        this.pagInicioOff += 5;
        this.pagFimOff += 5;
      }
    },
  },
  created() {
    this.carregarLocalStorage();
  },
};
</script>
