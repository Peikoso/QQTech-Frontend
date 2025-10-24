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
            <td>{{ incidente.regra }}</td>
            <td>{{ incidente.prioridade }}</td>
            <td>{{ incidente.criado_em }}</td>
            <td>{{ incidente.status }}</td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script>
export default{
  name: 'DashboardView',
  data(){
    return{
      incidentes: [
        {'regra': 'Teste Banco',
        'prioridade': 'Alta',
        'status': 'Open',
        'criado_em': '07/10/2025 06:15'
      }
      ],
      tratamento: 3,
      fechados: 4,
      regras_ativas: 2,
      tempo_medio_ack: 1,
      tempo_medio_res: 10
    }
  }
}
</script>

<style src="@/assets/styles.css"></style>

