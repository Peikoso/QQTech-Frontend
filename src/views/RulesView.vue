<template>
  <div>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Regras</h3>
        <p>Configure e gerencie as regras de monitoramento</p>
      </div>
      <div>
        <button @click="sandboxModal = true">SandBox</button>
        <button @click="regraModal = true">Nova Regra</button>
      </div>
    </div>
    <div class="view-container">
      <div>
        <label class="filtro-label" for="filtro">Filtrar Regras</label>
        <input type="text" id="filtro" v-model="filtro" placeholder="Digite o nome da regra">
      </div>
      <div class="table-responsive">
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
              <td class="regra-nome-descricao">
                <h4>{{ regra.nome }}</h4>
                <p>{{ regra.descricao }}</p>
              </td>
              <td data-label="Banco">{{ regra.banco }}</td>
              <td data-label="Intervalo">{{ regra.minutoAtualizacao }} minutos</td>
              <td data-label="Prioridade">{{ regra.prioridade }}</td>
              <td data-label="Ações" class="actions">
                <button class="icon-btn" @click="executarRegra(regra)"><img :src="regra.executar ? pause : play"></button>
                <button class="icon-btn" @click="silenciarRegra(regra)"><img :src="regra.silenciar ? volumeMute : volume_up"></button>
                <button @click="editarRegra(regra)">Editar</button>
                <button @click="excluirRegra(regra)">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div class="modal" v-if="regraModal">
      <div class="modal-content">
        <button class="close-btn" @click="regraModal = false; modoEdicao = false; this.limparForm()">&times;</button>
        <form @submit.prevent="salvarRegras()">
          <label for="nome">Nome</label>
          <input type="text" id="nome" placeholder="Nome da regra" v-model="regra.nome">

          <label for="descricao">Descrição</label>
          <input type="text" id="descricao" placeholder="Descreva o propósito da regra" v-model="regra.descricao">

          <label for="sql">SQL</label>
          <textarea id="sql" placeholder="SELECT * FROM ..." v-model="regra.sql"></textarea>
          <p>Apenas comandos SELECT são permitidos</p>

          <div class="row">
            <div class="col">
              <label for="banco">Banco de Dados</label>
              <select id="banco" v-model="regra.banco">
                <option value="PostgreSQL">PostgreSQL</option>
                <option value="Oracle">Oracle</option>
              </select>
            </div>
            <div class="col">
              <label for="prioridade">Prioridade</label>
              <select id="prioridade" v-model="regra.prioridade">
                <option value="Baixa">Baixa</option>
                <option value="Média">Média</option>
                <option value="Alta">Alta</option>
              </select>
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="minutoAtualizacao">Intervalo (minutos)</label>
              <input type="number" id="minutoAtualizacao" v-model.number="regra.minutoAtualizacao" min="0">
            </div>
            <div class="col">
              <label for="qtdErroMax">Máx. Erros</label>
              <input type="number" id="qtdErroMax" v-model.number="regra.qtdErroMax" min="0">
            </div>
          </div>

          <div class="row">
            <div class="col">
              <label for="horaInicio">Hora Início</label>
              <input type="time" id="horaInicio" v-model="regra.horaInicio">
            </div>
            <div class="col">
              <label for="horaFinal">Hora Final</label>
              <input type="time" id="horaFinal" v-model="regra.horaFinal">
            </div>
          </div>

          <label for="roles">Roles (separados por vírgula)</label>
          <input type="text" id="roles" placeholder="INFRA, DEV, CANAIS_DIGITAIS..." v-model="regra.roles">

          <div class="row">
            <div class="col">
              <div class="switch-container">
                <span class="switch-label">Notificação</span>
                <label class="switch">
                  <input type="checkbox" v-model="regra.notificacao">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="col">
              <div class="switch-container">
                <span class="switch-label">Silenciar</span>
                <label class="switch">
                  <input type="checkbox" v-model="regra.silenciar">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
            <div class="col">
              <div class="switch-container">
                <span class="switch-label">Executar</span>
                <label class="switch">
                  <input type="checkbox" v-model="regra.executar">
                  <span class="slider"></span>
                </label>
              </div>
            </div>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>
    <div v-if="sandboxModal" class="modal">
      <div class="modal-content">
        <button class="close-btn" @click="sandboxModal = false; this.limparSandbox()">&times;</button>
        <form @submit.prevent="executarSandbox">
          <label for="sql">SQL</label>
          <textarea id="sql" placeholder="SELECT * FROM ..." v-model="sandbox.sql"></textarea>
          <p>Apenas comandos SELECT são permitidos</p>

          <button type="submit">Executar</button>
          <br><br>
          <p>{{ sandbox.resultado }}</p>
          <hr>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import play from '@/assets/icons/play.svg';
import pause from '@/assets/icons/pause.svg';
import volume_up from '@/assets/icons/volume_up.svg';
import volumeMute from '@/assets/icons/volume_mute.svg';

export default {
  name: 'RulesView',
  data(){
    return{
      regra: {
        id: '',
        nome: '',
        descricao: '',
        sql: '',
        banco: 'PostgreSQL',
        prioridade: 'Média',
        minutoAtualizacao: 0,
        qtdErroMax: 0,
        horaInicio: '00:00',
        horaFinal: '00:00',
        roles: '',
        notificacao: true,
        silenciar: false,
        executar: false
      },
      regras: [],
      filtro: '',
      regraModal: false,
      modoEdicao: false,
      sandboxModal: false,
      sandbox: {
        sql: '',
        resultado: '',
      },
      play,
      pause,
      volume_up,
      volumeMute
    }
  },
  methods: {
    salvarRegras() {
      const data = {
        nome: this.regra.nome,
        descricao: this.regra.descricao,
        sql: this.regra.sql,
        banco: this.regra.banco,
        prioridade: this.regra.prioridade,
        minutoAtualizacao: this.regra.minutoAtualizacao,
        qtdErroMax: this.regra.qtdErroMax,
        horaInicio: this.regra.horaInicio,
        horaFinal: this.regra.horaFinal,
        roles: this.regra.roles,
        notificacao: this.regra.notificacao,
        silenciar: this.regra.silenciar,
        executar: this.regra.executar
      }

      if(this.modoEdicao == false){
        const novoData = {
          id: crypto.randomUUID(),
          ...data
        }
        this.regras.push(novoData);
      }else{
        const novoData = {
          id: this.regra.id,
          ...data
        }
        const index = this.regras.findIndex(regra => regra.id === this.regra.id)
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

      this.regra.id = regra.id
      this.regra.nome = regra.nome
      this.regra.descricao = regra.descricao
      this.regra.sql = regra.sql
      this.regra.banco = regra.banco
      this.regra.prioridade = regra.prioridade
      this.regra.minutoAtualizacao = regra.minutoAtualizacao
      this.regra.qtdErroMax = regra.qtdErroMax
      this.regra.horaInicio = regra.horaInicio
      this.regra.horaFinal = regra.horaFinal
      this.regra.roles = regra.roles
      this.regra.notificacao = regra.notificacao
      this.regra.silenciar = regra.silenciar
      this.regra.executar = regra.executar
    },
    silenciarRegra(regra){
      regra.silenciar = !regra.silenciar
      this.salvarLocalStorageRegras()
    },
    executarRegra(regra){
      regra.executar = !regra.executar
      this.salvarLocalStorageRegras()
    },
    excluirRegra(regra) {
      const index = this.regras.findIndex(r => r.id === regra.id)
      this.regras.splice(index, 1)
      this.salvarLocalStorageRegras()
    },
    carregarLocalStorageRegras() {
      const dados = JSON.parse(localStorage.getItem('regras')) || [];

      return dados
    },
    salvarLocalStorageRegras() {
      localStorage.setItem('regras', JSON.stringify(this.regras))
    },
    limparForm() {
      this.regra.id = '';
      this.regra.nome = '';
      this.regra.descricao = '';
      this.regra.sql = '';
      this.regra.banco = 'PostgreSQL';
      this.regra.prioridade = 'Média';
      this.regra.minutoAtualizacao = 0;
      this.regra.qtdErroMax = 0;
      this.regra.horaInicio = '00:00';
      this.regra.horaFinal = '00:00';
      this.regra.roles = '';
      this.regra.notificacao = true;
      this.regra.silenciar = false;
      this.regra.executar = false;
    },
    limparSandbox(){
      this.sandbox.sql = '';
      this.sandbox.resultado = '';
    },
    executarSandbox(){
      this.sandbox.resultado = 'Sucess'
    }
  },
  mounted() {
    this.regras = this.carregarLocalStorageRegras();
  }
}
</script>
