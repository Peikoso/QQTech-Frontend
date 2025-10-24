<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Incidentes</h3>
        <p>Configure e gerencie os incidentes</p>
      </div>
    </div>
    <div class="view-container">
      <div class="filtro-container">
        <label class="filtro-label" for="filtro">Filtrar Incidentes</label>
        <select id="filtro-status" v-model="filtroStatus">
          <option value="">Todos</option>
          <option value="open">Open</option>
          <option value="ack">ACK</option>
          <option value="closed">Closed</option>
        </select>
        <select id="filtro-regra" v-model="filtroRegra">
          <option value="">Todas as Regras</option>
          <option v-for="regra in regras" :key="regra.id" :value="regra.id">{{ regra.nome }}</option>
        </select>
        <select id="filtro-prioridade" v-model="filtroPrioridade">
          <option value="">Todas as Prioridades</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
      <h2 v-if="incidentes.length == 0">Nenhum Incidente Registrado</h2>
      <table  v-if="incidentes.length >= 1">
        <thead>
          <tr>
            <th>ID</th>
            <th>Regra</th>
            <th>Prioridade</th>
            <th>Aberta em</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incidente in incidentes" :key="incidente.id">
            <td>
              <button @click="detalhesIncidente(incidente)">Ver</button>
              {{ incidente.id }}
            </td>
            <td>{{ regras.find(regra => regra.id === incidente.regra_id)?.nome }}</td>
            <td>{{ regras.find(regra => regra.id === incidente.regra_id)?.prioridade  }}</td>
            <td>{{ incidente.created_at }}</td>
            <td><button>{{ incidente.status }}</button></td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal" v-if="incidenteModal">
      <div class="modal-content">
        <button class="close-btn" @click="incidenteModal = false; exibirDetalhes = false">&times;</button>
        <form @submit.prevent="atualizarIncidentes">
          <div>
            <h2>Detalhes do Incidente</h2>
            <p><strong>ID do Incidente:</strong> {{ incidente.id }}</p>
            <p><strong>Regra ID:</strong> {{ incidente.regra_id }}</p>
            <p><strong>User ID:</strong> {{ incidente.user_id }}</p>
            <p><strong>Status:</strong> {{ incidente.status }}</p>
            <p><strong>Comentário:</strong> {{ incidente.comentario }}</p>
            <p><strong>Criado em:</strong> {{ incidente.created_at }}</p>
            <p><strong>Ack em:</strong> {{ incidente.ack_at }}</p>
            <p><strong>Closed em:</strong> {{ incidente.closed_at }}</p>
          </div>
          <br><hr><br>
          <div>
            <h2>Logs do Incidente</h2>
          </div>
        </form>
      </div>
    </div>

  </div>
</template>

<script>
export default {
  name: 'IncidentesView',
  data(){
    return{
      incidente: {
        id: '',
        regra_id: '',
        user_id: '',
        status: '',
        comentario: '',
        created_at: '',
        ack_at: '',
        closed_at: '',
      },
      incidentes: [],
      regras: [],
      filtroStatus: '',
      filtroRegra: '',
      filtroPrioridade: '',
      incidenteModal: false,
    }
  },
  methods: {
    atualizarIncidentes() {


      this.salvarLocalStorageIncidentes()
      this.limparForm()
      this.incidenteModal = false
    },

    detalhesIncidente(incidente) {
      this.exibirDetalhes = true
      this.incidenteModal = true

      this.incidente.id = incidente.id
      this.incidente.regra_id = incidente.regra_id
      this.incidente.user_id = incidente.user_id
      this.incidente.status = incidente.status
      this.incidente.comentario = incidente.comentario
      this.incidente.created_at = incidente.created_at
      this.incidente.ack_at = incidente.ack_at
      this.incidente.closed_at = incidente.closed_at

    },

    carregarLocalStorage() {
      this.incidentes = JSON.parse(localStorage.getItem('incidentes')) || []
      this.regras = JSON.parse(localStorage.getItem('regras')) || []
    },

    salvarLocalStorage() {
      localStorage.setItem('incidentes', JSON.stringify(this.incidentes))
    },
  },
  mounted() {
    this.carregarLocalStorage();
  }
}
</script>

<style src="@/assets/styles.css"></style>
