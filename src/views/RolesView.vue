<template>
    <div class="conteudo-container">
      <div class="titulo-descricao">
        <h3>Gestão de Roles</h3>
        <p>Gerenciamento e criação de roles</p>
      </div>
      <button @click="roleModal = true">Nova Role</button>
    </div>
    <div class="view-container">
      <div>
        <label class="filtro-label" for="filtro">Filtrar Nome</label>
        <input type="text" id="filtro" v-model="filtroNome" placeholder="Digite o nome da role">
      </div>
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Descrição</th>
              <th>Cor</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="role in roles.slice(pagInicio, pagFim)" :key="role.id">
              <td data-label="Nome">{{ role.nome }}</td>
              <td data-label="Descrição">{{ role.descricao }}</td>
              <td data-label="Cor"><span :style="{ backgroundColor: role.cor, width: '20px', height: '20px', display: 'inline-block' }"></span></td>
              <td class="actions" data-label="Ações">
                <button @click="editarRole(role)">Editar</button>
                <button @click="excluirRole(role)">Deletar</button>
              </td>
            </tr>
          </tbody>
        </table>
        <div style="display: flex; justify-content: center; margin-top: 20px;">
          <button @click="pagAnterior()">Anterior</button>
          <button @click="pagSeguinte()">Seguinte</button>
        </div>
      </div>
    </div>

    <div class="modal" v-if="roleModal">
      <div class="modal-content">
        <button class="close-btn" @click="roleModal = false; this.limparForm()">&times;</button>
        <form @submit.prevent="salvarRole">
          <h2>Editar Role</h2>
          <label for="nome">Nome:</label>
          <input type="text" id="nome" v-model="role.nome" required>

          <label for="descricao">Descrição:</label>
          <input type="text" id="descricao" v-model="role.descricao" required>

          <div style="justify-content: center; align-items: center; display: flex; flex-direction: column; margin-top: 10px; margin-bottom: 10px;">
            <label for="cor">Cor:</label>
            <input :style="{width: '100px', height: '100px',}" type="color" id="cor" v-model="role.cor" required>
          </div>
          <button type="submit">Salvar</button>
        </form>
      </div>
    </div>

    <div v-if="deleteModal" class="modal">
      <div class="modal-content">
        <h3>Confirmar Exclusão</h3>
        <p>Tem certeza que deseja excluir esta role?</p>
        <div class="botoes-confirmacao">
          <button style="background-color: red;" @click="confirmarDelete()">Sim, Excluir</button>
          <button @click="deleteModal = false; limparForm()">Cancelar</button>
        </div>
      </div>
    </div>

</template>

<script>
export default {
  data() {
    return {
      role:{
        id: '',
        nome: '',
        descricao: '',
        cor: '#000000',
      },
      filtroNome: '',
      filtroMatricula: '',
      pagInicio: 0,
      pagFim: 5,
      roles: [],
      roleModal: false,
      editRole: false,
      deleteModal: false,
    };
  },
  methods: {
    pagAnterior(){
      if(this.pagInicio > 0){
        this.pagInicio -= 5;
        this.pagFim -= 5;
      }
    },
    pagSeguinte(){
      if(this.pagFim < this.roles.length){
        this.pagInicio += 5;
        this.pagFim += 5;
      }
    },
    salvarRole() {
      const data = {
        nome: this.role.nome,
        descricao: this.role.descricao,
        cor: this.role.cor,
      };


      if(this.editRole == false){
        const novoData = {
          id: crypto.randomUUID(),
          ...data
        }
        this.roles.push(novoData);
      }else{
        const novoData = {
          id: this.role.id,
          ...data
        }
        const index = this.roles.findIndex(role => role.id === this.role.id)
        this.roles[index] = novoData

      }

      this.salvarLocalStorage();
      this.limparForm();
      this.editRole = false;
      this.roleModal = false;
    },
    editarRole(role) {
      this.roleModal = true;
      this.editRole = true;

      this.role.id = role.id;
      this.role.nome = role.nome;
      this.role.descricao = role.descricao;
      this.role.cor = role.cor;
    },
    excluirRole(role) {
      this.role.id = role.id
      this.deleteModal = true
    },
    confirmarDelete(){
      const index = this.roles.findIndex(r => r.id === this.role.id)
      this.roles.splice(index, 1)
      this.salvarLocalStorage()
      this.limparForm()
      this.deleteModal = false
    },
    limparForm(){
      this.role.nome = '';
      this.role.descricao = '';
      this.role.cor = '#000000';
    },
    carregarLocalStorage() {
      this.roles = JSON.parse(localStorage.getItem('roles')) || [];
    },
    salvarLocalStorage() {
      localStorage.setItem('roles', JSON.stringify(this.roles));
    },
  },
  created() {
    this.carregarLocalStorage();
  },
};
</script>
