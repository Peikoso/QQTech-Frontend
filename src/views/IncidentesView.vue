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
          <option v-for="regra in regras" :key="regra.id" :value="regra.id">
            {{ regra.nome }}
          </option>
        </select>
        <select id="filtro-prioridade" v-model="filtroPrioridade">
          <option value="">Todas as Prioridades</option>
          <option value="Baixa">Baixa</option>
          <option value="Média">Média</option>
          <option value="Alta">Alta</option>
        </select>
      </div>
      <div class="table-responsive">
        <h2 v-if="incidentes.length == 0">Nenhum Incidente Registrado</h2>
        <table v-if="incidentes.length >= 1">
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
            <tr v-for="incidente in incidentes.slice(pagInicio, pagFim)" :key="incidente.id">
              <td data-label="ID" class="actions">
                <span>{{ incidente.id }}</span>
                <button @click="incidenteModal = true; detalhesIncidente(incidente)">Ver</button>
              </td>
              <td data-label="Regra">{{ regras.find((regra) => regra.id === incidente.regra_id)?.nome }}</td>
              <td data-label="Prioridade">{{ regras.find((regra) => regra.id === incidente.regra_id)?.prioridade }}</td>
              <td data-label="Aberta em">{{ incidente.created_at }}</td>
              <td data-label="Status" class="actions">
                <button
                  class="button-status"
                  :class="buttonStatus(incidente.status)"
                  @click="statusIncidente(incidente)"
                >
                  {{ incidente.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnterior">Anterior</button>
          <button @click="pagSeguinte">Seguinte</button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="incidenteModal">
      <div class="modal-content" style="max-width: 800px;">
        <button class="close-btn" style="top: 34px;" @click="incidenteModal = false; this.$router.push({ name: this.$route.name, query: {} })">&times;</button>
        <div class="modal-details">
          <h4>Detalhes do Incidente</h4>
          <p><strong>ID do Incidente:</strong> {{ incidente.id }}</p>
          <p><strong>Criado em:</strong> {{ incidente.created_at }}</p>
          <p><strong>Regra ID:</strong> {{ incidente.regra_id }}</p>
          <p><strong>Status:</strong> {{ incidente.status }}</p>
          <p><strong>Ack em:</strong> {{ incidente.ack_at }}</p>
          <p><strong>User ID ACK:</strong> {{ incidente.user_id_ack }}</p>
          <p><strong>Comentário ACK:</strong> {{ incidente.comentario_ack }}</p>
          <p><strong>Closed em:</strong> {{ incidente.closed_at }}</p>
          <p><strong>User ID Closed:</strong> {{ incidente.user_id_closed }}</p>
          <p><strong>Comentário Closed:</strong> {{ incidente.comentario_closed }}</p>
        </div>
        <div style="justify-content: center; display: flex; margin: 10px;">
          <button class="button-status" :class="buttonStatus(incidente.status)" @click="statusIncidente(incidente);">{{ incidente.status }}</button>
          <button class="button-status" style="width: 90px;" @click="reexecuteIncidente; reexecuteModal = true">Reexecutar</button>
        </div>
        <hr/>
        <div class="modal-details">
          <h2>Logs do Incidente</h2>
          <div class="table-responsive">
            <p v-if="incidente.logs.length == 0"><strong>Nenhum Log Registrado</strong></p>
            <table  v-if="incidente.logs.length >= 1">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Tempo</th>
                  <th>Log</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in incidente.logs" :key="log.id">
                  <td data-label="ID">{{ log.id }}</td>
                  <td data-label="Tempo">{{ log.time }} minutos</td>
                  <td data-label="Log">{{ log.message }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>

    <div v-if="comentarioModal" class="modal">
      <div class="modal-content">
        <button
          class="close-btn"
          @click="comentarioModal = false; this.limparComentario()">&times;</button>
        <form @submit.prevent="salvarComentario()">
          <label for="comentario">Comentário</label>
          <textarea id="comentario" v-model="novoComentario"></textarea>
          <br /><br />
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>

    <div v-if="reexecuteModal" class="modal">
      <div class="modal-content">
        <button
          class="close-btn"
          @click="reexecuteModal = false">&times;</button>
        <div>
          <h2>Reexecutar Regra</h2>
          <p>Tem certeza que deseja reexecutar a regra?</p>
          <button @click="reexecuteIncidente()">Sim</button>
          <button @click="reexecuteModal = false">Não</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'IncidentesView',
  data() {
    return {
      incidente: {
        id: '',
        regra_id: '',
        user_id_ack: '',
        user_id_closed: '',
        status: '',
        comentario_ack: '',
        comentario_closed: '',
        created_at: '',
        ack_at: '',
        closed_at: '',
        logs: [],
      },
      novoComentario: '',
      incidentes: [],
      regras: [],
      user: {},
      filtroStatus: '',
      filtroRegra: '',
      filtroPrioridade: '',
      incidenteModal: false,
      comentarioModal: false,
      reexecuteModal: false,
      pagInicio: 0,
      pagFim: 5,
    }
  },
  methods: {
    detalhesIncidente(incidente) {
      this.incidente.id = incidente.id
      this.incidente.regra_id = incidente.regra_id
      this.incidente.user_id_ack = incidente.user_id_ack
      this.incidente.user_id_closed = incidente.user_id_closed
      this.incidente.status = incidente.status
      this.incidente.comentario_ack = incidente.comentario_ack
      this.incidente.comentario_closed = incidente.comentario_closed
      this.incidente.created_at = incidente.created_at
      this.incidente.ack_at = incidente.ack_at
      this.incidente.closed_at = incidente.closed_at
      this.incidente.logs = incidente.logs || []
    },

    statusIncidente(incidente) {
      this.detalhesIncidente(incidente)

      if (this.incidente.status === 'closed') {
        this.reexecuteModal = true
        return
      }
      this.comentarioModal = true

    },

    carregarLocalStorage() {
      this.incidentes = JSON.parse(localStorage.getItem('incidentes')) || []
      this.regras = JSON.parse(localStorage.getItem('regras')) || []
      this.user = JSON.parse(localStorage.getItem('userData')) || {}
    },

    salvarLocalStorage() {
      localStorage.setItem('incidentes', JSON.stringify(this.incidentes))
      localStorage.setItem('regras', JSON.stringify(this.regras))
    },

    buttonStatus(status) {
      if (status === 'open') {
        return 'button-red'
      } else if (status === 'ack') {
        return 'button-yellow'
      } else {
        return ''
      }
    },

    salvarComentario() {
      let data = {}

      if (this.incidente.status === 'ack') {
        data = {
          id: this.incidente.id,
          regra_id: this.incidente.regra_id,
          user_id_ack: this.incidente.user_id_ack || this.user.id,
          user_id_closed: this.user.id,
          status: 'closed',
          comentario_ack: this.incidente.comentario_ack || this.novoComentario,
          comentario_closed: this.novoComentario,
          created_at: this.incidente.created_at,
          ack_at: this.incidente.ack_at,
          closed_at: new Date(),
          logs: this.incidente.logs,
        }
      }

      if (this.incidente.status === 'open') {
        data = {
          id: this.incidente.id,
          regra_id: this.incidente.regra_id,
          user_id_ack: this.user.id,
          user_id_closed: this.incidente.user_id_closed,
          status: 'ack',
          comentario_ack: this.novoComentario,
          comentario_closed: this.incidente.comentario_closed,
          created_at: this.incidente.created_at,
          ack_at: new Date(),
          closed_at: this.incidente.closed_at,
          logs: this.incidente.logs,
        }
      }

      const index = this.incidentes.findIndex((i) => i.id === this.incidente.id)
      this.incidentes[index] = data

      this.salvarLocalStorage()
      this.limparComentario()
      this.comentarioModal = false
      this.atualizarModal(this.incidente.id)
    },
    atualizarModal(incidenteId) {
      const index = this.incidentes.findIndex((i) => i.id === incidenteId)
      this.detalhesIncidente(this.incidentes[index])
    },
    limparComentario() {
      this.novoComentario = ''
    },
    reexecuteIncidente() {
      const index = this.regras.findIndex((r) => r.id === this.incidente.regra_id)
      const regra = this.regras[index]
      regra.executar = true
      this.regras[index] = regra

      this.salvarLocalStorage()
      this.reexecuteModal = false
    },
    pagAnterior(){
      if(this.pagInicio > 0){
        this.pagInicio -= 5;
        this.pagFim -= 5;
      }
    },
    pagSeguinte(){
      if(this.pagFim < this.incidentes.length){
        this.pagInicio += 5;
        this.pagFim += 5;
      }
    },
  },
  mounted() {
    this.carregarLocalStorage()
    const incidenteId = this.$route.query.incidenteId
    if (incidenteId) {
      const incidente = this.incidentes.find(i => i.id == incidenteId)
      if (incidente) {
        this.incidenteModal = true
        this.detalhesIncidente(incidente)
      }
    }
  },
  watch: {
  '$route.query.incidenteId'(novoId) {
    if (novoId) {
      const incidente = this.incidentes.find(i => i.id == novoId)
      if (incidente) {
        this.incidenteModal = true
        this.detalhesIncidente(incidente)
      }
    }
  }
},
}
</script>
