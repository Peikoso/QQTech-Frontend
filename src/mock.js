export function initMocks(){
  const regrasMock = [
  {
    id: "1a2b3c4d-0001",
    nome: "Falha de Login",
    descricao: "Monitora falhas consecutivas de login de usuários",
    sql: "SELECT count(*) FROM logins WHERE success = false AND timestamp > NOW() - INTERVAL '5 minutes'",
    banco: "PostgreSQL",
    prioridade: "Alta",
    minuto_atualizacao: 1,
    qtd_erro_max: 5,
    hora_inicio: "00:00",
    hora_final: "23:59",
    roles: "INFRA",
    notificacao: true,
    silenciar: false,
    executar: true
  },
  {
    id: "1a2b3c4d-0002",
    nome: "Banco Offline",
    descricao: "Verifica se o banco de dados está respondendo",
    sql: "SELECT 1",
    banco: "PostgreSQL",
    prioridade: "Alta",
    minuto_atualizacao: 2,
    qtd_erro_max: 3,
    hora_inicio: "00:00",
    hora_final: "23:59",
    roles: "INFRA",
    notificacao: true,
    silenciar: false,
    executar: true
  },
  {
    id: "1a2b3c4d-0003",
    nome: "API Lenta",
    descricao: "Tempo de resposta da API acima de 5 segundos",
    sql: "SELECT response_time FROM api_monitor WHERE response_time > 5000",
    banco: "PostgreSQL",
    prioridade: "Média",
    minuto_atualizacao: 5,
    qtd_erro_max: 2,
    hora_inicio: "06:00",
    hora_final: "22:00",
    roles: "CANAIS_DIGITAIS",
    notificacao: true,
    silenciar: false,
    executar: false
  },
  {
    id: "1a2b3c4d-0004",
    nome: "Serviço de Email",
    descricao: "Erro ao enviar emails para clientes",
    sql: "SELECT count(*) FROM emails WHERE status='failed' AND timestamp > NOW() - INTERVAL '10 minutes'",
    banco: "PostgreSQL",
    prioridade: "Média",
    minuto_atualizacao: 3,
    qtd_erro_max: 5,
    hora_inicio: "07:00",
    hora_final: "21:00",
    roles: "CANAIS_DIGITAIS",
    notificacao: true,
    silenciar: false,
    executar: true
  },
  {
    id: "1a2b3c4d-0005",
    nome: "CPU Alta",
    descricao: "Monitoramento de uso da CPU acima de 90%",
    sql: "SELECT cpu_usage FROM system_metrics WHERE cpu_usage > 90",
    banco: "PostgreSQL",
    prioridade: "Média",
    minuto_atualizacao: 1,
    qtd_erro_max: 3,
    hora_inicio: "00:00",
    hora_final: "23:59",
    roles: "INFRA",
    notificacao: true,
    silenciar: true,
    executar: false
  }
];


const incidentesMock = [
  {
    id: "inc-0001",
    regra_id: "1a2b3c4d-0001",
    user_id: "",
    status: "open",
    comentario: "",
    created_at: "2025-10-23 09:15",
    ack_at: "",
    closed_at: ""
  },
  {
    id: "inc-0002",
    regra_id: "1a2b3c4d-0002",
    user_id: "user-002",
    status: "ack",
    comentario: "Equipe de infraestrutura informada",
    created_at: "2025-10-23 08:45",
    ack_at: "2025-10-23 08:50",
    closed_at: ""
  },
  {
    id: "inc-0003",
    regra_id: "1a2b3c4d-0003",
    user_id: "user-003",
    status: "closed",
    comentario: "Problema resolvido após ajuste no servidor",
    created_at: "2025-10-22 16:20",
    ack_at: "2025-10-22 16:25",
    closed_at: "2025-10-22 17:00"
  },
  {
    id: "inc-0004",
    regra_id: "1a2b3c4d-0004",
    user_id: "",
    status: "open",
    comentario: "",
    created_at: "2025-10-23 10:00",
    ack_at: "",
    closed_at: ""
  },
  {
    id: "inc-0005",
    regra_id: "1a2b3c4d-0005",
    user_id: "user-005",
    status: "ack",
    comentario: "Verificar processos ativos",
    created_at: "2025-10-23 07:30",
    ack_at: "2025-10-23 07:35",
    closed_at: ""
  }
];

localStorage.setItem('regras', JSON.stringify(regrasMock));
localStorage.setItem('incidentes', JSON.stringify(incidentesMock));

}

