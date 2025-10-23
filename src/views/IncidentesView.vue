<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Incidentes</h3>
        <p>Configure e gerencie os incidentes</p>
      </div>
    </div>
    <div class="view-container">
      <h2 v-if="incidentes.length == 0">Nenhum Incidente Registrado</h2>
      <table  v-if="incidentes.length >= 1">
        <thead>
          <tr>
            <th>Regra</th>
            <th>Prioridade</th>
            <th>Aberta em</th>
            <th>Status</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="incidente in incidentes" :key="incidente.id">
            <td>{{ regras.find(regra => regra.id === incidente.regra_id)?.nome }}</td>
            <td>{{ incidente.descricao }}</td>
            <td>{{ regras.find(regra => regra.id === incidente.regra_id)?.prioridade  }}</td>
            <td>{{ incidente.created_at }}</td>
            <td><button>{{ incidente.status }}</button></td>
            <td>
              <button @click="detalhesIncidente(incidente)">Ver</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal" v-if="incidenteModal">
      <div class="modal-content">
        <button class="close-btn" @click="incidenteModal = false; exibirDetalhes = false">&times;</button>
        <form @submit.prevent="salvarIncidentes">
          <label for="nome">Nome</label>
          <input type="text" id="nome" placeholder="Nome da incidente" v-model="nome">

          <label for="descricao">Descrição</label>
          <input type="text" id="descricao" placeholder="Descreva o propósito da incidente" v-model="descricao">

          <div class="row">
            <div class="col">
              <label for="banco">Banco de Dados</label>
              <select id="banco" v-model="banco">
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="Oracle">Oracle</option>
              </select>
            </div>
            <div class="col">
              <label for="prioridade">Prioridade</label>
              <select id="prioridade" v-model="prioridade">
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="minuto_atualizacao">Intervalo (minutos)</label>
              <input type="number" id="minuto_atualizacao" v-model.number="minuto_atualizacao" min="0">
            </div>
            <div class="col">
              <label for="qtd_erro_max">Máx. Erros</label>
              <input type="number" id="qtd_erro_max" v-model.number="qtd_erro_max" min="0">
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="hora_inicio">Hora Início</label>
              <input type="time" id="hora_inicio" v-model="hora_inicio">
            </div>
            <div class="col">
              <label for="hora_final">Hora Final</label>
              <input type="time" id="hora_final" v-model="hora_final">
            </div>
          </div>

          <label for="roles">Roles (separados por vírgula)</label>
          <input type="text" id="roles" placeholder="admin, operator, viewer" v-model="roles">

          <div class="switch-container">
            <span class="switch-label">WhatsApp Habilitado</span>
            <label class="switch">
              <input type="checkbox" v-model="whatsapp">
              <span class="slider"></span>
            </label>
          </div>

          <button type="submit">Salvar</button>
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
        descricao: '',
        comentario: '',
        created_at: '',
        ack_at: '',
        closed_at: '',
      },
      incidentes: [],
      regras: [],
      incidenteModal: false,
      exibirDetalhes: false
    }
  },
  methods: {
    salvarIncidentes() {
      const data = {
        id: crypto.randomUUID(),
        regra_id: this.incidente.regra_id,
        user_id: this.incidente.user_id,
        status: 'open',
        descricao: this.incidente.descricao,
        comentario: '',
        created_at: '',
        ack_at: '',
        closed_at: '',
      }

      this.incidentes.push(data);


      this.salvarLocalStorageIncidentes()
      this.limparForm()
      this.incidenteModal = false
    },

    detalhesIncidente(incidente) {
      this.exibirDetalhes = true
      this.incidenteModal = true

      this.id = incidente.id
      this.nome = incidente.nome
      this.descricao = incidente.descricao
      this.sql = incidente.sql
      this.banco = incidente.banco
      this.prioridade = incidente.prioridade
      this.minuto_atualizacao = incidente.minuto_atualizacao
      this.qtd_erro_max = incidente.qtd_erro_max
      this.hora_inicio = incidente.hora_inicio
      this.hora_final = incidente.hora_final
      this.roles = incidente.roles
      this.whatsapp = incidente.whatsapp
    },

    excluirIncidente() {
      const index = this.incidentes.findIndex(incidente => incidente.id === this.id)
      this.incidentes.splice(index, 1)
      this.salvarLocalStorageIncidentes()
    },

    carregarLocalStorage() {
      this.incidentes = JSON.parse(localStorage.getItem('incidentes')) || []
      this.regras = JSON.parse(localStorage.getItem('regras')) || []

    },

    salvarLocalStorageIncidentes() {
      localStorage.setItem('incidentes', JSON.stringify(this.incidentes))
    },


    limparForm() {
      this.id = '';
      this.nome = '';
      this.descricao = '';
      this.sql = '';
      this.banco = 'PostgreSQL';
      this.prioridade = 'Média';
      this.minuto_atualizacao = 0;
      this.qtd_erro_max = 0;
      this.hora_inicio = '00:00';
      this.hora_final = '00:00';
      this.roles = '';
      this.whatsapp = true;
    }
  },
  mounted() {
    this.regras = this.carregarLocalStorage();
  }
}
</script>

<style src="@/assets/styles.css"></style>
