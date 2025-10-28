export function initMocks() {
  const regrasMock = [
    {
      id: '1a2b3c4d-0001',
      nome: 'Falha de Login',
      descricao: 'Monitora falhas consecutivas de login de usuários',
      sql: "SELECT count(*) FROM logins WHERE success = false AND timestamp > NOW() - INTERVAL '5 minutes'",
      banco: 'PostgreSQL',
      prioridade: 'Alta',
      minuto_atualizacao: 1,
      qtd_erro_max: 5,
      hora_inicio: '00:00',
      hora_final: '23:59',
      roles: 'INFRA',
      notificacao: true,
      silenciar: false,
      executar: true,
      data_adiar: null
    },
    {
      id: '1a2b3c4d-0002',
      nome: 'Banco Offline',
      descricao: 'Verifica se o banco de dados está respondendo',
      sql: 'SELECT 1',
      banco: 'PostgreSQL',
      prioridade: 'Alta',
      minuto_atualizacao: 2,
      qtd_erro_max: 3,
      hora_inicio: '00:00',
      hora_final: '23:59',
      roles: 'INFRA',
      notificacao: true,
      silenciar: false,
      executar: true,
      data_adiar: '2025-12-25'
    },
    {
      id: '1a2b3c4d-0003',
      nome: 'API Lenta',
      descricao: 'Tempo de resposta da API acima de 5 segundos',
      sql: 'SELECT response_time FROM api_monitor WHERE response_time > 5000',
      banco: 'PostgreSQL',
      prioridade: 'Média',
      minuto_atualizacao: 5,
      qtd_erro_max: 2,
      hora_inicio: '06:00',
      hora_final: '22:00',
      roles: 'CANAIS_DIGITAIS',
      notificacao: true,
      silenciar: false,
      executar: false,
      data_adiar: null
    },
    {
      id: '1a2b3c4d-0004',
      nome: 'Serviço de Email',
      descricao: 'Erro ao enviar emails para clientes',
      sql: "SELECT count(*) FROM emails WHERE status='failed' AND timestamp > NOW() - INTERVAL '10 minutes'",
      banco: 'PostgreSQL',
      prioridade: 'Média',
      minuto_atualizacao: 3,
      qtd_erro_max: 5,
      hora_inicio: '07:00',
      hora_final: '21:00',
      roles: 'CANAIS_DIGITAIS',
      notificacao: true,
      silenciar: false,
      executar: true,
      data_adiar: '2025-12-05'
    },
    {
      id: '1a2b3c4d-0005',
      nome: 'CPU Alta',
      descricao: 'Monitoramento de uso da CPU acima de 90%',
      sql: 'SELECT cpu_usage FROM system_metrics WHERE cpu_usage > 90',
      banco: 'PostgreSQL',
      prioridade: 'Média',
      minuto_atualizacao: 1,
      qtd_erro_max: 3,
      hora_inicio: '00:00',
      hora_final: '23:59',
      roles: 'INFRA',
      notificacao: true,
      silenciar: true,
      executar: false,
      data_adiar: null
    },
  ]

  const incidentesMock = [
    {
      id: 'inc-0001',
      regra_id: '1a2b3c4d-0001',
      user_id_ack: '',
      user_id_closed: '',
      status: 'open',
      comentario_ack: '',
      comentario_closed: '',
      created_at: '2025-10-23 09:15',
      ack_at: '',
      closed_at: '',
      logs: [
        { id: 'log-0001', incidente_id: 'inc-0001', time: '2025-10-23 09:15', message: 'Incidente criado' }
      ],
    },
    {
      id: 'inc-0002',
      regra_id: '1a2b3c4d-0002',
      user_id_ack: 'user-002',
      user_id_closed: '',
      status: 'ack',
      comentario_ack: 'Equipe de infraestrutura informada',
      comentario_closed: '',
      created_at: '2025-10-23 08:45',
      ack_at: '2025-10-23 08:50',
      closed_at: '',
      logs: [
        { id: 'log-0002', incidente_id: 'inc-0002', time: '2025-10-23 08:45', message: 'Incidente criado' },
        { id: 'log-0003', incidente_id: 'inc-0002', time: '2025-10-23 08:50', message: 'Incidente reconhecido por user-002' }
      ],
    },
    {
      id: 'inc-0003',
      regra_id: '1a2b3c4d-0003',
      user_id_ack: 'user-003',
      user_id_closed: 'user-003',
      status: 'closed',
      comentario_ack: 'Problema resolvido após ajuste no servidor',
      comentario_closed: 'Problema resolvido após ajuste no servidor',
      created_at: '2025-10-22 16:20',
      ack_at: '2025-10-22 16:25',
      closed_at: '2025-10-22 17:00',
      logs: [
        { id: 'log-0004', incidente_id: 'inc-0003', time: '2025-10-22 16:20', message: 'Incidente criado' },
        { id: 'log-0005', incidente_id: 'inc-0003', time: '2025-10-22 16:25', message: 'Incidente reconhecido por user-003' },
        { id: 'log-0006', incidente_id: 'inc-0003', time: '2025-10-22 17:00', message: 'Incidente fechado por user-003' }
      ],
    },
    {
      id: 'inc-0004',
      regra_id: '1a2b3c4d-0004',
      user_id_ack: '',
      user_id_closed: '',
      status: 'open',
      comentario_ack: '',
      comentario_closed: '',
      created_at: '2025-10-23 10:00',
      ack_at: '',
      closed_at: '',
      logs: [
        { id: 'log-0007', incidente_id: 'inc-0004', time: '2025-10-23 10:00', message: 'Incidente criado' }
      ],
    },
    {
      id: 'inc-0005',
      regra_id: '1a2b3c4d-0005',
      user_id_ack: 'user-005',
      user_id_closed: '',
      status: 'ack',
      comentario_ack: 'Verificar processos ativos',
      comentario_closed: '',
      created_at: '2025-10-23 07:30',
      ack_at: '2025-10-23 07:35',
      closed_at: '',
      logs: [
        { id: 'log-0008', incidente_id: 'inc-0005', time: '2025-10-23 07:30', message: 'Incidente criado' },
        { id: 'log-0009', incidente_id: 'inc-0005', time: '2025-10-23 07:35', message: 'Incidente reconhecido por user-005' }
      ],
    },
  ];

  const logsMock = [
    // 🔔 Notificações
    {
      id: 'log-001',
      type: 'notificacao',
      result: 'Notificação enviada para João (alerta de incidente crítico)',
      run_time: '2025-10-28T01:05:00',
      error: null,
      duration: 0.8,
    },
    {
      id: 'log-002',
      type: 'notificacao',
      result: 'Notificação enviada para Maria (alerta de manutenção programada)',
      run_time: '2025-10-28T01:06:00',
      error: null,
      duration: 1.1,
    },

    // ⚙️ Regras — Execuções
    {
      id: 'log-003',
      type: 'regra',
      result: 'Execução da regra de backup concluída com sucesso',
      run_time: '2025-10-28T01:12:00',
      error: null,
      duration: 3.5,
    },
    {
      id: 'log-004',
      type: 'regra',
      result: 'Erro ao executar regra de integridade (timeout excedido)',
      run_time: '2025-10-28T01:17:00',
      error: 'TimeoutError: operação excedeu o tempo limite',
      duration: 5.2,
    },

    // 🧭 Rotas — Mudanças (CRUD)
    {
      id: 'log-005',
      type: 'rota',
      result: 'Nova rota criada para user_id=12 (canal: Slack) | Período: 2025-10-25 08:00 → 2025-10-25 20:00',
      run_time: '2025-10-28T01:20:00',
      error: null,
      duration: 0.4,
    },
    {
      id: 'log-006',
      type: 'rota',
      result: 'Rota atualizada para user_id=8 (canal: Email) | Novo término: 2025-10-27 22:00',
      run_time: '2025-10-28T01:22:00',
      error: null,
      duration: 0.6,
    },
    {
      id: 'log-007',
      type: 'rota',
      result: 'Rota removida para user_id=5 (canal: SMS)',
      run_time: '2025-10-28T01:25:00',
      error: null,
      duration: 0.3,
    },
  ];


  const runnersMock = [
    { id: 'run-0001', ativo: 'active' , regra_id: '1a2b3c4d-0005', next_run: 5 },
    { id: 'run-0002', ativo: 'inactive', regra_id: '1a2b3c4d-0002', next_run: 11 },
    { id: 'run-0003', ativo: 'active', regra_id: '1a2b3c4d-0001', next_run: 12 },
    { id: 'run-0004', ativo: 'inactive', regra_id: '1a2b3c4d-0003', next_run: 13 },
    { id: 'run-0005', ativo: 'active', regra_id: '1a2b3c4d-0004', next_run: 7 },
  ];

  localStorage.setItem('regras', JSON.stringify(regrasMock))
  localStorage.setItem('incidentes', JSON.stringify(incidentesMock))
  localStorage.setItem('logs', JSON.stringify(logsMock))
  localStorage.setItem('runners', JSON.stringify(runnersMock))
}
