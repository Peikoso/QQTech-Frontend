<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Regras</h3>
        <p>Configure e gerencie as regras de monitoramento</p>
      </div>
      <button @click="regraModal = true">Nova Regra</button>
    </div>
    <div class="view-container">
      <h2 v-if="regras.length == 0">Nenhuma Regra Registrada </h2>
      <table  v-if="regras.length >= 1">
        <thead>
          <tr>
            <th>Nome</th>
            <th>Banco</th>
            <th>Intervalo</th>
            <th>Prioridade</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="regra in regras" :key="regra.id">
            <td>
              <h3>{{ regra.nome }}</h3>
              <p>{{ regra.descricao }}</p>
            </td>
            <td>{{ regra.banco }}</td>
            <td>{{ regra.minuto_atualizacao }} minutos</td>
            <td>{{ regra.prioridade }}</td>
            <td>
              <button @click="editarRegra(regra)">Editar</button>
              <button @click="excluirRegra">Excluir</button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="modal" v-if="regraModal">
      <div class="modal-content">
        <button class="close-btn" @click="regraModal = false; modoEdicao = false">&times;</button>
        <form @submit.prevent="salvarRegras">
          <label for="nome">Nome</label>
          <input type="text" id="nome" placeholder="Nome da regra" v-model="nome">

          <label for="descricao">Descrição</label>
          <input type="text" id="descricao" placeholder="Descreva o propósito da regra" v-model="descricao">

          <label for="sql">SQL</label>
          <textarea id="sql" placeholder="SELECT * FROM ..." v-model="sql"></textarea>
          <p>Apenas comandos SELECT são permitidos</p>

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
  name: 'RulesView',
  data(){
    return{
      id: '',
      nome: '',
      descricao: '',
      sql: '',
      banco: 'PostgreSQL',
      prioridade: 'Média',
      minuto_atualizacao: 0,
      qtd_erro_max: 0,
      hora_inicio: '00:00',
      hora_final: '00:00',
      roles: '',
      whatsapp: true,
      regras: [],
      regraModal: false,
      modoEdicao: false
    }
  },
  methods: {
    salvarRegras() {
      const data = {
        nome: this.nome,
        descricao: this.descricao,
        sql: this.sql,
        banco: this.banco,
        prioridade: this.prioridade,
        minuto_atualizacao: this.minuto_atualizacao,
        qtd_erro_max: this.qtd_erro_max,
        hora_inicio: this.hora_inicio,
        hora_final: this.hora_final,
        roles: this.roles,
        whatsapp: this.whatsapp,
      }

      if(this.modoEdicao == false){
        const novoData = {
          id: crypto.randomUUID(),
          ...data
        }
        this.regras.push(novoData);
      }else{
        const novoData = {
          id: this.id,
          ...data
        }
        const index = this.regras.findIndex(regra => regra.id === this.id)
        this.regras[index] = novoData

      }

      this.salvarLocalStorageRegras()
      this.limparForm()
      this.modoEdicao = false
      this.regraModal = false
    },

    editarRegra(regra) {
      this.modoEdicao = true
      this.regraModal = true

      this.id = regra.id
      this.nome = regra.nome
      this.descricao = regra.descricao
      this.sql = regra.sql
      this.banco = regra.banco
      this.prioridade = regra.prioridade
      this.minuto_atualizacao = regra.minuto_atualizacao
      this.qtd_erro_max = regra.qtd_erro_max
      this.hora_inicio = regra.hora_inicio
      this.hora_final = regra.hora_final
      this.roles = regra.roles
      this.whatsapp = regra.whatsapp
    },

    excluirRegra() {
      const index = this.regras.findIndex(regra => regra.id === this.id)
      this.regras.splice(index, 1)
      this.salvarLocalStorageRegras()
    },

    carregarLocalStorageRegras() {
      const dados = JSON.parse(localStorage.getItem('regras')) || []

      return dados
    },

    salvarLocalStorageRegras() {
      localStorage.setItem('regras', JSON.stringify(this.regras))
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
    this.regras = this.carregarLocalStorageRegras();
  }
}
</script>

<style src="@/assets/styles.css"></style>
