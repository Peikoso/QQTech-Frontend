<template>
  <div class="modal"  style="background: none; position: relative;">
    <div class="modal-content" style="max-width: 1000px;">
      <div class="conteudo-container" style="display: flex; justify-content: center;">
        <div class="titulo-descricao">
          <h3>Gestão de Perfils</h3>
        </div>
      </div>
      <form @submit.prevent="editPerfil">
        <label for="perfil">Perfil</label>
        <select name="perfil" id="perfil" v-model="perfil.name">
          <option value="operator">Operator</option>
          <option value="viewer">Viewer</option>
        </select>

        <div class="row">
          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Dashboard</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.dashboardAccess">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Gerenciar Dashboard</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.dashboardControl" @change="controlChange()">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Incidentes</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.incidentAccess">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Gerenciar Incidentes</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.incidentControl" @change="controlChange()">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Regras</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.ruleAccess">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Gerenciar Regras</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.ruleControl" @change="controlChange()">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="row">
          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Rotas</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.routeAccess">
                <span class="slider"></span>
              </label>
            </div>
          </div>

          <div class="col">
            <div class="switch-container">
              <span class="switch-label" style=" flex: 1; max-width: 200px;">Gerenciar Rotas</span>
              <label class="switch">
                <input type="checkbox" v-model="perfil.routeControl" @change="controlChange()">
                <span class="slider"></span>
              </label>
            </div>
          </div>
        </div>

        <div class="switch-container">
          <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Logs</span>
          <label class="switch">
            <input type="checkbox" v-model="perfil.logAccess">
            <span class="slider"></span>
          </label>
        </div>

        <div class="switch-container">
          <span class="switch-label" style=" flex: 1; max-width: 200px;">Visualizar Relatórios</span>
          <label class="switch">
            <input type="checkbox" v-model="perfil.reportAccess">
            <span class="slider"></span>
          </label>
        </div>

        <button type="submit">Salvar</button>
      </form>
      <div v-if="saveMessage" class="mensagem-salvo">
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
      perfil: {
        name: 'operator',
        dashboardAccess: false,
        dashboardControl: false,
        incidentAccess: false,
        incidentControl: false,
        ruleAccess: false,
        ruleControl: false,
        logAccess: false,
        reportAccess: false,
      },
      novoUsuarioModal: false,
      modoEdicao: false,
      message: '',
      saveMessage: false,
    }
  },
  methods: {
    editPerfil() {
      this.message = 'Perfil salvo com sucesso!'
      this.saveMessage = true;
      setTimeout(() => {
        this.saveMessage = false;
        this.message = '';
      }, 3000);
    },
    controlChange() {
      if(this.perfil.dashboardControl) {
        this.perfil.dashboardAccess = true;
      }
      if (this.perfil.incidentControl) {
        this.perfil.incidentAccess = true;
      }
      if (this.perfil.ruleControl) {
        this.perfil.ruleAccess = true;
      }
      if (this.perfil.routeControl) {
        this.perfil.routeAccess = true;
      }
    },
    perfilValues(){
      if (this.perfil.name === 'viewer') {
        this.perfil.dashboardAccess = false;
        this.perfil.dashboardControl = false;
        this.perfil.incidentAccess = false;
        this.perfil.incidentControl = false;
        this.perfil.ruleAccess = false;
        this.perfil.ruleControl = false;
        this.perfil.routeAccess = false;
        this.perfil.routeControl = false;
      }
      if(this.perfil.name === 'operator'){
        this.perfil.dashboardAccess = true;
        this.perfil.dashboardControl = true;
        this.perfil.incidentAccess = true;
        this.perfil.incidentControl = true;
        this.perfil.ruleAccess = true;
        this.perfil.routeAccess = true;
      }
    }
  },
  mounted() {
    this.perfilValues();
  },
  watch: {
    'perfil.name'() {
      this.perfilValues();
    }
  }
};
</script>
