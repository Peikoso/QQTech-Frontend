<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Dashboard de Monitoramento</h3>
        <p>Visão geral do sistema de plantão em tempo real</p>
      </div>
    </div>
    <div class="small-views">
      <div class="small-view-container">
        <div>
          <h3>Incidentes Abertos</h3>
          <br><br>
          <h3>{{ incidentes.length }}</h3>
          <br>
          <br>
          <p>Aguardando ação</p>
        </div>
      </div>
      <div class="small-view-container">
        <div>
          <h3>Em Tratamento</h3>
          <br><br>
          <h3>{{ tratamento }}</h3>
          <br>
          <br>
          <p>Reconhecidos</p>
        </div>
      </div>
      <div class="small-view-container">
        <div>
          <h3>Fechados</h3>
          <br><br>
          <h3>{{ fechados }}</h3>
          <br>
          <br>
          <p>Resolvidos</p>
        </div>
      </div>
      <div class="small-view-container">
        <div>
          <h3>Regras Ativas</h3>
          <br><br>
          <h3>{{ regras_ativas }}</h3>
          <br>
          <br>
          <p>Em execução</p>
        </div>
      </div>
    </div>
    <div class="small-views">
      <div class="small-view-container">
        <div>
          <h3>Tempo Médio de ACK</h3>
          <br><br>
          <h3>{{ tempo_medio_ack}} minutos</h3>
          <br>
          <br>
          <p>Desde criação até reconhecimento</p>
        </div>
      </div>
      <div class="small-view-container">
        <div>
          <h3>Tempo Médio de Resolução</h3>
          <br><br>
          <h3>{{ tempo_medio_res }} minutos</h3>
          <br>
          <br>
          <p>Desde criação até fechamento</p>
        </div>
      </div>
    </div>
    <div class="view-container">
      <p>Feed de Incidentes</p>
      <div>
        <label class="filtro-label" for="filtro">Filtrar incidentes</label>
        <input type="text" id="filtro" v-model="filtro" placeholder="Pesquise por regra, status, prioridade...">
      </div>
      <div class="table-responsive">
        <h2 v-if="incidentes.length == 0">Nenhum incidente</h2>
        <table  v-if="incidentes.length >= 1">
          <thead>
            <tr>
              <th>Regra</th>
              <th>Prioridade</th>
              <th>Aberta em</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="incidente in incidentes" :key="incidente.id">
              <td data-label="Regra">{{ regras.find(regra => regra.id === incidente.regra_id)?.nome }}</td>
              <td data-label="Prioridade">{{ regras.find(regra => regra.id === incidente.regra_id)?.prioridade  }}</td>
              <td data-label="Aberta em">{{ incidente.created_at }}</td>
              <td data-label="Status" class="actions" style="text-align: center">
                <button
                  class="button-status"
                  :class="buttonStatus(incidente.status)"
                  @click="mudarStatus(incidente)"
                >
                  {{ incidente.status }}
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div v-if="comentarioModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" @click="comentarioModal = false; this.limparComentario()">&times;</button>
        <form @submit.prevent="adicionarComentario()">
          <label for="comentario">Comentário</label>
          <textarea id="comentario" v-model="novoComentario"></textarea>
          <br /><br />
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
export default{
  name: 'DashboardView',
  data(){
    return{
      incidentes: [],
      regras: [],
      user: {},
      filtro: '',
      tratamento: 3,
      fechados: 4,
      regras_ativas: 2,
      tempo_medio_ack: 1,
      tempo_medio_res: 10,
      comentarioModal: false,
      novoComentario: '',
    }
  },
  methods: {
    carregarLocalStorage() {
      this.incidentes = JSON.parse(localStorage.getItem('incidentes')) || []
      this.regras = JSON.parse(localStorage.getItem('regras')) || []
      this.user = JSON.parse(localStorage.getItem('userData')) || {}
    },

    salvarLocalStorage() {
      localStorage.setItem('incidentes', JSON.stringify(this.incidentes))
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

    mudarStatus(incidente) {
      if (incidente.status === 'ack' || incidente.status === 'open') {
        this.incidente = incidente
        this.comentarioModal = true
      }
    },
    adicionarComentario() {
      let novoIncidente = { ...this.incidente }

      if(novoIncidente.status === 'ack') {
        novoIncidente.user_id_closed = this.user.id
        novoIncidente.status = 'closed'
        novoIncidente.comentario_closed = this.novoComentario
        novoIncidente.closed_at = new Date()
      }

      if (novoIncidente.status === 'open') {
        novoIncidente.user_id_ack = this.user.id
        novoIncidente.status = 'ack'
        novoIncidente.comentario_ack = this.novoComentario
        novoIncidente.ack_at = new Date()
      }

      const index = this.incidentes.findIndex(incidente => incidente.id === novoIncidente.id)
      this.incidentes[index] = novoIncidente

      this.comentarioModal = false
      this.salvarLocalStorage()
      this.limparIncidente()
    },
    limparIncidente() {
      this.incidente.id = ''
      this.incidente.regra_id = ''
      this.incidente.user_id_ack = ''
      this.incidente.user_id_closed = ''
      this.incidente.status = ''
      this.incidente.comentario_ack = ''
      this.incidente.comentario_closed = ''
      this.incidente.created_at = ''
      this.incidente.ack_at = ''
      this.incidente.closed_at = ''
      this.novoComentario = ''
    },
  },
  mounted(){
    this.carregarLocalStorage()
  }
}
</script>
