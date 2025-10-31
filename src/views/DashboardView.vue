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
            <tr v-for="incidente in incidentes.slice(pagInicio, pagFim)" :key="incidente.id">
              <td data-label="Regra">{{ regras.find(regra => regra.id === incidente.regra_id)?.nome }}</td>
              <td data-label="Prioridade">{{ regras.find(regra => regra.id === incidente.regra_id)?.prioridade  }}</td>
              <td data-label="Aberta em">{{ incidente.created_at }}</td>
              <td data-label="Status" class="actions">
                <button
                  :disabled="user.perfil === 'viewer'"
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
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnterior">Anterior</button>
          <button @click="pagSeguinte">Seguinte</button>
        </div>
      </div>
    </div>
    <div v-if="comentarioModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" @click="comentarioModal = false; this.limparIncidente()">&times;</button>
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
      incidente: {
        id: '',
        regra_id: '',
        user_escalado: '',
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
      incidentes: [],
      regras: [],
      user: {},
      filtroStatus: '',
      filtroRegra: '',
      filtroPrioridade: '',
      tratamento: 3,
      fechados: 4,
      regras_ativas: 2,
      tempo_medio_ack: 1,
      tempo_medio_res: 10,
      comentarioModal: false,
      novoComentario: '',
      pagInicio: 0,
      pagFim: 5,
    }
  },
  methods: {
    carregarLocalStorage() {
      this.incidentes = JSON.parse(localStorage.getItem('incidentes')) || []
      this.regras = JSON.parse(localStorage.getItem('regras')) || []
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
        this.incidente.id = incidente.id
        this.incidente.user_escalado = incidente.user_escalado
        this.incidente.regra_id = incidente.regra_id
        this.incidente.user_id_ack = incidente.user_id_ack
        this.incidente.user_id_closed = incidente.user_id_closed
        this.incidente.status = incidente.status
        this.incidente.comentario_ack = incidente.comentario_ack
        this.incidente.comentario_closed = incidente.comentario_closed
        this.incidente.created_at = incidente.created_at
        this.incidente.ack_at = incidente.ack_at
        this.incidente.closed_at = incidente.closed_at
        this.incidente.logs = incidente.logs
        this.comentarioModal = true
      }
    },
    adicionarComentario() {
      let data = {}

      if (this.incidente.status === 'ack') {
        data = {
          id: this.incidente.id,
          user_escalado: this.incidente.user_escalado,
          regra_id: this.incidente.regra_id,
          user_id_ack: this.incidente.user_id_ack,
          user_id_closed: this.user.id,
          status: 'closed',
          comentario_ack: this.incidente.comentario_ack,
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
          user_escalado: this.incidente.user_escalado,
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
      this.limparIncidente()
      this.comentarioModal = false
    },
    limparIncidente() {
      this.incidente.id = ''
      this.incidente.regra_id = ''
      this.incidente.user_escalado = ''
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
  created(){
    const checkUser = setInterval(() => {
      const userData = JSON.parse(localStorage.getItem('userData'))
      if (userData) {
        this.user = userData
        clearInterval(checkUser)
      }
    }, 100);

    this.carregarLocalStorage()
  }
}
</script>
