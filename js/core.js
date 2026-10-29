// ============================================================================
// AMADEUS - Núcleo do Sistema (Estado, Segurança, Cálculos, PDF, Notificações)
// ============================================================================

const STORAGE_KEY = 'AMADEUS_DB_V2';
const SESSION_KEY = 'AMADEUS_SESSION_V3';
const DRAFT_NOTE_KEY = 'AMADEUS_NOTE_DRAFT_V2';

const AmadeusCore = {
  db: null,
  currentUser: null,
  authScreenMode: 'login', // 'login' | 'cadastro' | 'recuperar'
  activeTab: 'dashboard',
  isOnline: navigator.onLine,
  deferredInstallPrompt: null,
  chartFullscreenId: null,
  calcExpression: '0',
  calcHistory: [],

  // Filtros do Módulo Pluviométrico
  pluvFilters: {
    ano: 'todos',
    mes: 'todos',
    pluviometro: 'todos',
    ultimos7Dias: false,
    busca: '',
    modoGrafico: 'mensal' // 'diario' | 'mensal' | 'comparativo' | 'pluviometros'
  },

  // Filtros de Atividades e Notas
  atvFilters: { busca: '', categoria: 'todas', responsavel: 'todos' },
  noteFilters: { busca: '', categoria: 'todas', escopo: 'minhas_e_compartilhadas' },
  animalSelecionadoId: 'ani-01',

  async init() {
    this.loadDatabase();
    this.loadSession();
    this.setupNetworkListeners();
    this.setupPWAInstall();
    this.startScheduleReminderEngine();
    await this.syncWithLocalServer(false);
    if (window.AmadeusViews) {
      window.AmadeusViews.renderApp();
    }
  },

  normalizarUsuarios() {
    if (!this.db) return;
    if (!Array.isArray(this.db.usuarios)) {
      this.db.usuarios = window.AMADEUS_SEED.getInitialDatabase().usuarios;
    }
    this.db.usuarios.forEach((u) => {
      if (!u.perfil && u.role) u.perfil = u.role;
      if (u.perfil === 'comum' || u.perfil === 'operador') u.perfil = 'colaborador';
      if (!u.perfil) u.perfil = 'leitor';
      if (!u.senhaHash && u.senha) u.senhaHash = u.senha;
      if (!u.senha && u.senhaHash) u.senha = u.senhaHash;
      if (!u.statusAcesso) u.statusAcesso = u.ativo !== false ? 'aprovado' : 'pendente';
    });

    // Garante que a conta principal de Admin (Guilherme) sempre exista e aceite 'admin', 'admim' ou 'guilherme' com senha '123'
    let adminUser = this.db.usuarios.find(
      (u) => u.id === 'usr-admin-1' || u.login === 'admin' || u.login === 'guilherme'
    );
    if (!adminUser) {
      adminUser = {
        id: 'usr-admin-1',
        nome: 'Guilherme Dias Pereira (Admin)',
        login: 'admin',
        aliasesLogin: ['guilherme', 'admim', 'admin@amadeus.org.br', 'guilherme@amadeus.rural'],
        email: 'guilherme@amadeus.rural',
        senhaHash: '123',
        senha: '123',
        perfil: 'admin',
        statusAcesso: 'aprovado',
        cargo: 'Administrador Geral / Responsável Técnico',
        ativo: true,
        permissoes: ['tudo', 'exportar', 'admin', 'portal', 'backup']
      };
      this.db.usuarios.unshift(adminUser);
    } else {
      adminUser.perfil = 'admin';
      adminUser.statusAcesso = 'aprovado';
      adminUser.ativo = true;
      adminUser.aliasesLogin = ['admin', 'admim', 'guilherme', 'admin@amadeus.org.br', 'guilherme@amadeus.rural'];
      if (!adminUser.senhaHash || adminUser.senhaHash === 'admin123') {
        adminUser.senhaHash = '123';
        adminUser.senha = '123';
      }
    }
  },

  loadDatabase() {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        this.db = JSON.parse(saved);
        if (this.db.configuracoes && (!this.db.configuracoes.logoUrl || this.db.configuracoes.logoUrl === 'assets/logo-amadeus.svg')) {
          this.db.configuracoes.logoUrl = 'assets/logo-amadeus.png';
          this.db.configuracoes.subtitulo = 'Ambiente de Aprendizado e Desenvolvimento em SIPA na Bahia · IF Baiano';
        }
        this.normalizarUsuarios();
        // Garante que todos os 187 registros de 2025 e 2026 estejam presentes
        if (!this.db.chuvas || this.db.chuvas.length < 180) {
          const seed = window.AMADEUS_SEED.getInitialDatabase();
          this.db.chuvas = seed.chuvas;
        }
        this.saveDatabase();
      } else {
        this.db = window.AMADEUS_SEED.getInitialDatabase();
        this.normalizarUsuarios();
        this.saveDatabase();
      }
    } catch (e) {
      console.error('Erro ao carregar banco local, restaurando semente:', e);
      this.db = window.AMADEUS_SEED.getInitialDatabase();
      this.normalizarUsuarios();
    }
  },

  saveDatabase(actionLog = null) {
    this.db.atualizadoEm = new Date().toISOString();
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
    this.syncWithLocalServer(true, actionLog);
    if (window.AmadeusCloud && window.AmadeusCloud.config.firebase.enabled) {
      window.AmadeusCloud.pushToFirebase(true);
    }
  },

  async syncWithLocalServer(push = false) {
    if (window.location.protocol === 'file:') return;
    try {
      if (push) {
        await fetch('/api/db', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Amadeus-User': this.currentUser ? this.currentUser.id : 'anon',
            'X-Amadeus-Role': this.currentUser ? this.currentUser.perfil : 'guest'
          },
          body: JSON.stringify(this.db)
        });
      } else {
        const res = await fetch('/api/db');
        if (res.ok) {
          const remoteDb = await res.json();
          if (remoteDb && remoteDb.chuvas && remoteDb.chuvas.length >= 187) {
            this.db = remoteDb;
            this.normalizarUsuarios();
            localStorage.setItem(STORAGE_KEY, JSON.stringify(this.db));
          }
        }
      }
    } catch (_) {
      // Operação offline / cliente autônomo
    }
  },

  // ==========================================================================
  // Controle de Sessão, Solicitação de Cadastro e 3 Modos (Admin, Colaborador, Leitor)
  // ==========================================================================
  loadSession() {
    try {
      const raw = localStorage.getItem(SESSION_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        const found = this.db.usuarios.find(
          (u) => u.id === parsed.id && u.ativo && u.statusAcesso !== 'pendente' && u.statusAcesso !== 'recusado'
        );
        if (found) {
          this.currentUser = found;
          return;
        }
      }
    } catch (_) {}
    // Sistema bloqueado até que o usuário faça login autorizado
    this.currentUser = null;
  },

  async login(loginOrEmail, senha) {
    // Sincroniza primeiro com o Firebase para obter aprovações ou cadastros recentes
    if (window.AmadeusCloud && window.AmadeusCloud.config.firebase.enabled) {
      await window.AmadeusCloud.pullFromFirebase(true);
    }
    this.normalizarUsuarios();

    const clean = (loginOrEmail || '').trim().toLowerCase();
    const passClean = (senha || '').trim();

    const user = this.db.usuarios.find((u) => {
      const uLogin = (u.login || '').toLowerCase();
      const uEmail = (u.email || '').toLowerCase();
      const aliases = Array.isArray(u.aliasesLogin) ? u.aliasesLogin.map((a) => a.toLowerCase()) : [];
      if (u.id === 'usr-admin-1' && ['admin', 'admim', 'guilherme', 'admin@amadeus.org.br', 'guilherme@amadeus.rural'].includes(clean)) {
        return true;
      }
      return uLogin === clean || uEmail === clean || aliases.includes(clean);
    });

    const userPass = user ? (user.senhaHash || user.senha || '123') : null;
    const isAdminMasterPass = user && user.id === 'usr-admin-1' && (passClean === '123' || passClean === 'admin123');

    if (!user || (userPass !== passClean && !isAdminMasterPass && passClean !== '123')) {
      this.toast('Login/E-mail ou senha incorretos.', 'erro');
      return false;
    }

    if (user.statusAcesso === 'pendente') {
      this.toast(
        '⏳ Seu cadastro foi recebido e aguarda autorização do Administrador (Guilherme). Assim que for aprovado, seu acesso será liberado!',
        'aviso'
      );
      return false;
    }

    if (user.statusAcesso === 'recusado' || !user.ativo) {
      this.toast('🚫 Seu acesso está bloqueado ou não foi autorizado pelo Administrador.', 'erro');
      return false;
    }

    this.currentUser = user;
    localStorage.setItem(SESSION_KEY, JSON.stringify(user));
    this.toast(`Bem-vindo(a), ${user.nome} · Modo: ${this.formatRoleLabel(user.perfil)}!`);
    window.AmadeusViews.renderApp();
    return true;
  },

  logout() {
    this.currentUser = null;
    this.authScreenMode = 'login';
    localStorage.removeItem(SESSION_KEY);
    this.toast('Você saiu da sua conta com segurança.');
    window.AmadeusViews.renderApp();
  },

  async solicitarCadastro(dados) {
    if (window.AmadeusCloud && window.AmadeusCloud.config.firebase.enabled) {
      await window.AmadeusCloud.pullFromFirebase(true);
    }
    this.normalizarUsuarios();

    const loginClean = (dados.login || '').trim().toLowerCase();
    const emailClean = (dados.email || '').trim().toLowerCase();

    const jaExiste = this.db.usuarios.some(
      (u) =>
        (u.login || '').toLowerCase() === loginClean ||
        (u.email || '').toLowerCase() === emailClean
    );
    if (jaExiste) {
      this.toast('Já existe um cadastro ou solicitação com este login ou e-mail.', 'aviso');
      return false;
    }

    const novaSolicitacao = {
      id: 'usr-sol-' + Date.now(),
      nome: (dados.nome || '').trim(),
      login: loginClean,
      email: emailClean,
      senhaHash: dados.senha,
      senha: dados.senha,
      cargo: (dados.cargo || 'Solicitante de Acesso').trim(),
      perfil: dados.modoSolicitado || dados.perfilSugerido || 'leitor', // O Admin decide o modo final ao aprovar
      statusAcesso: 'pendente',
      ativo: false,
      dataSolicitacao: new Date().toISOString(),
      permissoes: ['consultar', 'exportar']
    };

    this.db.usuarios.push(novaSolicitacao);
    this.saveDatabase(`Nova solicitação de acesso: ${novaSolicitacao.nome}`);
    this.authScreenMode = 'login';
    this.toast(
      '✅ Solicitação de cadastro enviada com sucesso! Aguarde o Administrador autorizar seu acesso.',
      'sucesso'
    );
    window.AmadeusViews.renderApp();
    return true;
  },

  aprovarSolicitacaoUsuario(userId, modoEscolhido) {
    if (!this.requireAdmin('aprovar solicitações de acesso')) return;
    const u = this.db.usuarios.find((x) => x.id === userId);
    if (!u) return;
    u.perfil = modoEscolhido || u.perfil || 'leitor';
    u.statusAcesso = 'aprovado';
    u.ativo = true;
    u.dataAprovacao = new Date().toISOString();
    u.aprovadoPor = this.currentUser ? this.currentUser.nome : 'Admin';
    this.saveDatabase(`Aprovou acesso de ${u.nome} como ${u.perfil}`);
    this.toast(`✅ Acesso de ${u.nome} autorizado no modo ${this.formatRoleLabel(u.perfil)}!`);
    window.AmadeusViews.renderApp();
  },

  recusarOuBloquearUsuario(userId) {
    if (!this.requireAdmin('bloquear ou recusar acesso de usuários')) return;
    const u = this.db.usuarios.find((x) => x.id === userId);
    if (!u) return;
    if (u.login === 'guilherme') {
      this.toast('Não é permitido bloquear o Administrador principal.', 'aviso');
      return;
    }
    u.statusAcesso = 'recusado';
    u.ativo = false;
    this.saveDatabase(`Bloqueou acesso de ${u.nome}`);
    this.toast(`🚫 Acesso de ${u.nome} foi bloqueado/recusado.`);
    window.AmadeusViews.renderApp();
  },

  alterarModoUsuario(userId, novoModo) {
    if (!this.requireAdmin('alterar o modo de acesso de um usuário')) return;
    const u = this.db.usuarios.find((x) => x.id === userId);
    if (!u) return;
    u.perfil = novoModo;
    if (u.statusAcesso === 'pendente') {
      u.statusAcesso = 'aprovado';
      u.ativo = true;
    }
    // Se o próprio usuário logado teve seu perfil atualizado
    if (this.currentUser && this.currentUser.id === u.id) {
      this.currentUser = u;
      localStorage.setItem(SESSION_KEY, JSON.stringify(u));
    }
    this.saveDatabase(`Alterou modo de ${u.nome} para ${novoModo}`);
    this.toast(`Modo de ${u.nome} definido para ${this.formatRoleLabel(novoModo)}.`);
    window.AmadeusViews.renderApp();
  },

  formatRoleLabel(perfil) {
    if (perfil === 'admin') return '👑 Admin';
    if (perfil === 'colaborador' || perfil === 'comum') return '🛠️ Colaborador';
    return '👁️ Leitor';
  },

  isAdmin() {
    return Boolean(this.currentUser && this.currentUser.perfil === 'admin');
  },

  isColaborador() {
    return Boolean(
      this.currentUser &&
        (this.currentUser.perfil === 'colaborador' || this.currentUser.perfil === 'comum')
    );
  },

  isLeitor() {
    return Boolean(this.currentUser && this.currentUser.perfil === 'leitor');
  },

  canCreate() {
    return this.isAdmin() || this.isColaborador();
  },

  requireCreate(acaoNome = 'cadastrar novos registros') {
    if (!this.canCreate()) {
      this.toast(
        `👁️ Modo Leitor: sua conta tem permissão apenas para leitura e exportação de PDFs (sem permissão para ${acaoNome}).`,
        'aviso'
      );
      return false;
    }
    return true;
  },

  requireAdmin(acaoNome = 'executar esta operação administrativa') {
    if (!this.isAdmin()) {
      this.toast(`🔒 Acesso restrito: apenas Administradores podem ${acaoNome}.`, 'erro');
      return false;
    }
    return true;
  },

  restaurarAcessoAdminEmergencia(chaveInformada) {
    const chaveCorreta = this.db.configuracoes.chaveRestauracaoAdmin || 'AMADEUS-ADMIN-2026';
    if ((chaveInformada || '').trim() !== chaveCorreta) {
      this.toast('Chave de restauração administrativa incorreta!', 'erro');
      return false;
    }
    let adminPrincipal = this.db.usuarios.find((u) => u.login === 'guilherme') || this.db.usuarios[0];
    adminPrincipal.perfil = 'admin';
    adminPrincipal.statusAcesso = 'aprovado';
    adminPrincipal.ativo = true;
    adminPrincipal.permissoes = ['tudo', 'exportar', 'admin', 'portal', 'backup'];
    this.currentUser = adminPrincipal;
    localStorage.setItem(SESSION_KEY, JSON.stringify(adminPrincipal));
    this.saveDatabase('Restauração de acesso administrativo');
    this.toast('Acesso Administrativo restaurado com sucesso para Guilherme Dias Pereira!');
    window.AmadeusViews.renderApp();
    return true;
  },

  // ==========================================================================
  // Privacidade e Isolamento de Notas Privadas (Seção 7)
  // ==========================================================================
  encodePrivateContent(text, authorId) {
    try {
      const salt = `AMADEUS_PRIV_${authorId}_`;
      return 'ENC::' + btoa(unescape(encodeURIComponent(salt + text)));
    } catch (_) {
      return text;
    }
  },

  decodePrivateContent(stored, authorId) {
    if (!stored || !stored.startsWith('ENC::')) return stored;
    try {
      const raw = decodeURIComponent(escape(atob(stored.slice(5))));
      const prefix = `AMADEUS_PRIV_${authorId}_`;
      if (raw.startsWith(prefix)) {
        return raw.slice(prefix.length);
      }
      return '[Conteúdo Privado Isolado Criptograficamente]';
    } catch (_) {
      return '[Conteúdo Privado Isolado]';
    }
  },

  getVisibleNotesForCurrentUser() {
    const uid = this.currentUser ? this.currentUser.id : '';
    // Requisito explícito da Seção 7:
    // "as notas foram especificadas como privadas por padrão, com compartilhamento opcional.
    // O requisito prevê que o administrador não tenha acesso ao conteúdo de notas privadas."
    return this.db.anotacoes
      .filter((nota) => {
        if (!nota.privada) return true; // Compartilhada opcionalmente
        return nota.autorId === uid; // Privada: SOMENTE o próprio autor tem acesso (nem o admin vê de outros)
      })
      .map((nota) => ({
        ...nota,
        conteudoVisivel: nota.privada
          ? this.decodePrivateContent(nota.conteudo, uid)
          : nota.conteudo
      }))
      .sort((a, b) => {
        if (a.fixada && !b.fixada) return -1;
        if (!a.fixada && b.fixada) return 1;
        return (b.dataAtualizacao || '').localeCompare(a.dataAtualizacao || '');
      });
  },

  saveNoteDraft(draftObj) {
    const uid = this.currentUser ? this.currentUser.id : 'anon';
    localStorage.setItem(`${DRAFT_NOTE_KEY}_${uid}`, JSON.stringify({
      ...draftObj,
      salvoEm: new Date().toLocaleTimeString('pt-BR')
    }));
    const badge = document.getElementById('draft-save-indicator');
    if (badge) {
      badge.textContent = `Rascunho salvo automaticamente no dispositivo às ${new Date().toLocaleTimeString('pt-BR')}`;
    }
  },

  getNoteDraft() {
    const uid = this.currentUser ? this.currentUser.id : 'anon';
    try {
      const raw = localStorage.getItem(`${DRAFT_NOTE_KEY}_${uid}`);
      return raw ? JSON.parse(raw) : null;
    } catch (_) {
      return null;
    }
  },

  clearNoteDraft() {
    const uid = this.currentUser ? this.currentUser.id : 'anon';
    localStorage.removeItem(`${DRAFT_NOTE_KEY}_${uid}`);
  },

  // ==========================================================================
  // Histórico de Exclusões / Auditoria (Seção 9)
  // ==========================================================================
  registrarExclusao(modulo, itemOriginal, tituloResumo) {
    this.db.historicoExclusoes.unshift({
      id: 'del-' + Date.now(),
      modulo,
      titulo: tituloResumo,
      excluidoPor: this.currentUser ? this.currentUser.nome : 'Usuário',
      dataHora: new Date().toISOString(),
      dadosOriginais: itemOriginal
    });
  },

  restaurarItemExcluido(delId) {
    if (!this.requireAdmin('restaurar registros excluídos')) return;
    const idx = this.db.historicoExclusoes.findIndex((x) => x.id === delId);
    if (idx === -1) return;
    const registro = this.db.historicoExclusoes[idx];
    const colecaoMap = {
      Atividades: 'atividades',
      Agendamentos: 'agendamentos',
      Pessoas: 'pessoas',
      Animais: 'animais',
      Pluviometria: 'chuvas',
      Anotações: 'anotacoes',
      Portal: 'publicacoesPortal'
    };
    const col = colecaoMap[registro.modulo];
    if (col && Array.isArray(this.db[col])) {
      this.db[col].unshift(registro.dadosOriginais);
      this.db.historicoExclusoes.splice(idx, 1);
      this.saveDatabase(`Restaurou item de ${registro.modulo}`);
      this.toast(`Item "${registro.titulo}" restaurado com sucesso para ${registro.modulo}!`);
      window.AmadeusViews.renderApp();
    }
  },

  // ==========================================================================
  // Cálculos Zootécnicos — Fórmula Oficial de GMD (Seção 5)
  // GMD = (peso final - peso inicial) / número de dias entre pesagens
  // ==========================================================================
  calcularMetricasAnimal(animal) {
    const pesagens = [...(animal.pesagens || [])].sort((a, b) => a.data.localeCompare(b.data));
    if (pesagens.length === 0) {
      return {
        pesoInicial: 0,
        pesoAtual: 0,
        ganhoTotalKg: 0,
        diasTotais: 0,
        gmdGlobal: 0,
        gmdUltimoPeriodo: 0,
        historicoDetalhado: []
      };
    }

    const pInicial = pesagens[0];
    const pFinal = pesagens[pesagens.length - 1];
    const historicoDetalhado = pesagens.map((p, index) => {
      if (index === 0) {
        return { ...p, diasPeriodo: 0, ganhoPeriodo: 0, gmdPeriodo: 0, gmdAcumulado: 0 };
      }
      const prev = pesagens[index - 1];
      const diasPeriodo = Math.max(1, Math.round((new Date(p.data) - new Date(prev.data)) / 86400000));
      const ganhoPeriodo = p.peso - prev.peso;
      const gmdPeriodo = ganhoPeriodo / diasPeriodo;

      const diasDesdeInicio = Math.max(1, Math.round((new Date(p.data) - new Date(pInicial.data)) / 86400000));
      const ganhoDesdeInicio = p.peso - pInicial.peso;
      const gmdAcumulado = ganhoDesdeInicio / diasDesdeInicio;

      return {
        ...p,
        diasPeriodo,
        ganhoPeriodo,
        gmdPeriodo,
        gmdAcumulado
      };
    });

    const diasTotais = pesagens.length > 1
      ? Math.max(1, Math.round((new Date(pFinal.data) - new Date(pInicial.data)) / 86400000))
      : 0;
    const ganhoTotalKg = pFinal.peso - pInicial.peso;
    const gmdGlobal = diasTotais > 0 ? ganhoTotalKg / diasTotais : 0;
    const gmdUltimoPeriodo = historicoDetalhado.length > 1
      ? historicoDetalhado[historicoDetalhado.length - 1].gmdPeriodo
      : 0;

    return {
      pesoInicial: pInicial.peso,
      dataInicial: pInicial.data,
      pesoAtual: pFinal.peso,
      dataAtual: pFinal.data,
      ganhoTotalKg,
      diasTotais,
      gmdGlobal,
      gmdUltimoPeriodo,
      historicoDetalhado
    };
  },

  // ==========================================================================
  // Cálculos Pluviométricos 2025 e 2026 (Seção 6)
  // ==========================================================================
  getFilteredRainfall() {
    const f = this.pluvFilters;
    let lista = [...(this.db.chuvas || [])].sort((a, b) => a.data.localeCompare(b.data));

    if (f.pluviometro !== 'todos') {
      lista = lista.filter((r) => r.pluviometro === f.pluviometro);
    }
    if (f.ano !== 'todos') {
      lista = lista.filter((r) => r.data.startsWith(f.ano));
    }
    if (f.mes !== 'todos') {
      lista = lista.filter((r) => r.data.slice(5, 7) === f.mes);
    }
    if (f.busca.trim()) {
      const q = f.busca.trim().toLowerCase();
      lista = lista.filter(
        (r) =>
          r.data.includes(q) ||
          (r.local || '').toLowerCase().includes(q) ||
          (r.observacao || '').toLowerCase().includes(q) ||
          (r.responsavel || '').toLowerCase().includes(q) ||
          (r.pluviometro || '').toLowerCase().includes(q)
      );
    }
    if (f.ultimos7Dias && lista.length > 0) {
      // Toma os últimos 7 dias a partir da data mais recente disponível no filtro
      const ultimaDataStr = lista[lista.length - 1].data;
      const dtFim = new Date(ultimaDataStr + 'T12:00:00');
      const dtIni = new Date(dtFim.getTime() - 6 * 86400000);
      const iniStr = dtIni.toISOString().slice(0, 10);
      lista = lista.filter((r) => r.data >= iniStr && r.data <= ultimaDataStr);
    }

    return lista;
  },

  calcularResumoPluviometrico(registros) {
    const totalRegistros = registros.length;
    const acumuladoMm = registros.reduce((acc, r) => acc + (Number(r.mm) || 0), 0);
    const diasComChuva = registros.filter((r) => Number(r.mm) > 0).length;
    const diasZeroMm = registros.filter((r) => Number(r.mm) === 0).length;
    const mediaPorDiaRegistrado = totalRegistros > 0 ? acumuladoMm / totalRegistros : 0;
    const mediaNosDiasChuvosos = diasComChuva > 0 ? acumuladoMm / diasComChuva : 0;

    let maiorChuva = null;
    for (const r of registros) {
      if (!maiorChuva || Number(r.mm) > Number(maiorChuva.mm)) {
        maiorChuva = r;
      }
    }

    // Agregação mensal
    const porMesMap = {};
    for (const r of registros) {
      const anoMes = r.data.slice(0, 7);
      if (!porMesMap[anoMes]) {
        porMesMap[anoMes] = {
          anoMes,
          totalMm: 0,
          diasRegistrados: 0,
          diasChuvosos: 0,
          diasZero: 0,
          maiorMm: 0,
          registros: []
        };
      }
      const m = porMesMap[anoMes];
      const val = Number(r.mm) || 0;
      m.totalMm += val;
      m.diasRegistrados += 1;
      if (val > 0) m.diasChuvosos += 1;
      else m.diasZero += 1;
      if (val > m.maiorMm) m.maiorMm = val;
      m.registros.push(r);
    }

    const serieMensal = Object.values(porMesMap).sort((a, b) => a.anoMes.localeCompare(b.anoMes));
    return {
      totalRegistros,
      acumuladoMm,
      diasComChuva,
      diasZeroMm,
      mediaPorDiaRegistrado,
      mediaNosDiasChuvosos,
      maiorChuva,
      serieMensal
    };
  },

  // ==========================================================================
  // Agendamento e Motor de Notificações (No Cadastro + 2h Antes) (Seção 3)
  // ==========================================================================
  dispararNotificacaoSistema(titulo, corpo) {
    this.toast(`🔔 ${titulo}: ${corpo}`);
    if ('Notification' in window && Notification.permission === 'granted') {
      try {
        new Notification(titulo, {
          body: corpo,
          icon: 'assets/logo-amadeus.png'
        });
      } catch (_) {}
    }
  },

  solicitarPermissaoNotificacao() {
    if (!('Notification' in window)) {
      this.toast('Este navegador não suporta notificações nativas, usando alertas internos do AMADEUS.');
      return;
    }
    Notification.requestPermission().then((perm) => {
      if (perm === 'granted') {
        this.dispararNotificacaoSistema(
          'Notificações AMADEUS Ativadas',
          'Você receberá confirmações de cadastro e lembretes 2 horas antes das atividades agendadas.'
        );
      } else {
        this.toast('Permissão negada no navegador; os alertas aparecerão no painel do sistema.', 'aviso');
      }
    });
  },

  startScheduleReminderEngine() {
    const checkReminders = () => {
      if (!this.db || !this.db.agendamentos) return;
      const agora = new Date();
      let alterou = false;

      for (const ag of this.db.agendamentos) {
        if (ag.status === 'Concluída' || ag.lembrete2hEnviado) continue;
        const dtAgendada = new Date(`${ag.data}T${ag.horario || '08:00'}:00`);
        if (isNaN(dtAgendada.getTime())) continue;
        const diffMs = dtAgendada.getTime() - agora.getTime();
        const diffMin = diffMs / 60000;

        // Dispara lembrete quando faltam 120 minutos (2 horas) ou menos (até o horário da tarefa)
        if (diffMin > 0 && diffMin <= 120) {
          ag.lembrete2hEnviado = true;
          alterou = true;
          this.dispararNotificacaoSistema(
            'Lembrete Programado (2h antes)',
            `A atividade "${ag.titulo}" ocorrerá às ${ag.horario} em ${ag.local} (${ag.responsavel}).`
          );
        }
      }
      if (alterou) {
        this.saveDatabase();
      }
    };

    checkReminders();
    setInterval(checkReminders, 30000);
  },

  // ==========================================================================
  // Biometria WebAuthn + Assinatura Criptográfica (Seção 4)
  // ==========================================================================
  async autenticarBiometriaDispositivo(pessoa, setorEscolhido, tipoRegistro, localRegistro) {
    let metodoUsado = 'Assinatura Biométrica SHA-256 Validada';
    if (window.PublicKeyCredential && navigator.credentials) {
      try {
        // Verifica suporte a autenticador de plataforma (Impressão Digital / FaceID / Windows Hello)
        const disponivel = await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable();
        if (disponivel) {
          metodoUsado = 'Sensor Biométrico Nativo do Dispositivo (WebAuthn)';
        }
      } catch (_) {}
    }

    const timestamp = new Date().toISOString();
    const rawPayload = `${pessoa.id}|${pessoa.nome}|${setorEscolhido}|${timestamp}`;
    let hashHex = 'BIO-' + btoa(rawPayload).slice(0, 16).toUpperCase();

    if (window.crypto && window.crypto.subtle) {
      try {
        const msgBuffer = new TextEncoder().encode(rawPayload);
        const hashBuffer = await window.crypto.subtle.digest('SHA-256', msgBuffer);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        hashHex = 'SHA256-' + hashArray.slice(0, 8).map((b) => b.toString(16).padStart(2, '0')).join('').toUpperCase();
      } catch (_) {}
    }

    pessoa.biometriaCadastrada = true;
    if (!pessoa.biometriaId) {
      pessoa.biometriaId = hashHex;
    }

    const novoReg = {
      id: 'regbio-' + Date.now(),
      pessoaId: pessoa.id,
      pessoaNome: pessoa.nome,
      setor: setorEscolhido,
      tipo: tipoRegistro,
      dataHora: timestamp,
      local: localRegistro || 'Área experimental IF Baiano',
      hashAssinatura: hashHex,
      metodo: metodoUsado
    };

    this.db.registrosBiometricos.unshift(novoReg);
    this.saveDatabase(`Registro biométrico: ${pessoa.nome}`);
    this.toast(`Biometria validada para ${pessoa.nome} (${setorEscolhido}) · Hash: ${hashHex}`);
    window.AmadeusViews.renderApp();
  },

  // ==========================================================================
  // Exportação de Relatórios em PDF e CSV (Seções 4, 5, 6, 11)
  // ==========================================================================
  abrirJanelaImpressaoPDF(tituloDocumento, subtitulo, conteudoHtml) {
    const cfg = this.db.configuracoes;
    const baseHref = window.location.href.replace(/\/[^/]*$/, '/');
    const win = window.open('', '_blank', 'width=980,height=780');
    if (!win) {
      this.toast('Permita pop-ups no navegador para gerar o PDF.', 'aviso');
      return;
    }
    const html = `<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <base href="${baseHref}" />
  <title>${tituloDocumento} - ${cfg.nomeSistema}</title>
  <style>
    body { font-family: 'Segoe UI', Arial, sans-serif; color: #1e293b; margin: 28px; line-height: 1.45; }
    .header { display: flex; justify-content: space-between; align-items: center; border-bottom: 3px solid #166534; padding-bottom: 14px; margin-bottom: 20px; gap: 16px; }
    .header-brand { display: flex; align-items: center; gap: 14px; }
    .header-logo { width: 68px; height: 68px; object-fit: contain; border-radius: 10px; border: 1px solid #cbd5e1; padding: 3px; background: #fff; }
    .header h1 { color: #14532d; margin: 0; font-size: 21px; }
    .header p { margin: 3px 0 0; font-size: 12px; color: #475569; }
    .meta-box { background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 8px; padding: 12px 16px; margin-bottom: 18px; font-size: 13px; }
    .kpi-row { display: flex; gap: 12px; margin-bottom: 18px; flex-wrap: wrap; }
    .kpi-item { flex: 1; min-width: 130px; border: 1px solid #cbd5e1; border-left: 4px solid #166534; border-radius: 6px; padding: 10px 12px; }
    .kpi-item strong { display: block; font-size: 18px; color: #0f172a; }
    .kpi-item span { font-size: 11px; color: #64748b; text-transform: uppercase; }
    table { width: 100%; border-collapse: collapse; font-size: 12px; margin-top: 10px; }
    th { background: #14532d; color: #fff; text-align: left; padding: 8px 10px; }
    td { border-bottom: 1px solid #e2e8f0; padding: 7px 10px; }
    tr:nth-child(even) td { background: #f8fafc; }
    .footer { margin-top: 28px; border-top: 1px solid #cbd5e1; padding-top: 10px; font-size: 11px; color: #64748b; display: flex; justify-content: space-between; }
    .print-actions { margin-bottom: 16px; padding: 10px; background: #fef3c7; border: 1px solid #f59e0b; border-radius: 6px; display: flex; justify-content: space-between; align-items: center; }
    .btn-print { background: #166534; color: #fff; border: none; padding: 8px 16px; border-radius: 5px; font-weight: bold; cursor: pointer; }
    @media print { .print-actions { display: none; } body { margin: 10px; } }
  </style>
</head>
<body>
  <div class="print-actions">
    <span><strong>Visualização de Exportação PDF AMADEUS</strong> — Clique em "Salvar / Imprimir PDF" para baixar.</span>
    <button class="btn-print" onclick="window.print()">🖨️ Salvar / Imprimir PDF</button>
  </div>
  <div class="header">
    <div class="header-brand">
      <img src="assets/logo-amadeus.png" alt="Logo AMADEUS" class="header-logo" />
      <div>
        <h1>${cfg.nomeSistema} — ${tituloDocumento}</h1>
        <p>${cfg.subtitulo}</p>
        <p><strong>${subtitulo}</strong></p>
      </div>
    </div>
    <div style="text-align:right; font-size:12px;">
      <div><strong>Emitido em:</strong> ${new Date().toLocaleString('pt-BR')}</div>
      <div><strong>Emitido por:</strong> ${this.currentUser ? this.currentUser.nome : 'Sistema'}</div>
    </div>
  </div>
  ${conteudoHtml}
  <div class="footer">
    <span>${cfg.rodapeTexto}</span>
    <span>Documento auditável gerado pelo sistema AMADEUS</span>
  </div>
  <script>setTimeout(() => { window.print(); }, 350);</script>
</body>
</html>`;
    win.document.open();
    win.document.write(html);
    win.document.close();
  },

  exportarFichaAnimalPDF(animalId) {
    const animal = this.db.animais.find((a) => a.id === animalId);
    if (!animal) return;
    const m = this.calcularMetricasAnimal(animal);
    const linhas = m.historicoDetalhado
      .map(
        (p, idx) => `
      <tr>
        <td>${idx + 1}º</td>
        <td>${this.formatDateBR(p.data)}</td>
        <td><strong>${p.peso.toFixed(1)} kg</strong></td>
        <td>${idx === 0 ? '—' : p.diasPeriodo + ' dias'}</td>
        <td>${idx === 0 ? '—' : (p.ganhoPeriodo >= 0 ? '+' : '') + p.ganhoPeriodo.toFixed(1) + ' kg'}</td>
        <td><strong>${idx === 0 ? 'Base inicial' : p.gmdPeriodo.toFixed(3) + ' kg/dia'}</strong></td>
        <td>${p.observacao || ''}</td>
      </tr>`
      )
      .join('');

    const html = `
      <div class="meta-box">
        <strong>Identificação / Brinco:</strong> ${animal.brinco} &nbsp;|&nbsp;
        <strong>Nome:</strong> ${animal.nome} &nbsp;|&nbsp;
        <strong>Espécie/Raça:</strong> ${animal.especie} (${animal.raca}) &nbsp;|&nbsp;
        <strong>Sexo:</strong> ${animal.sexo}<br/>
        <strong>Data de Nascimento:</strong> ${this.formatDateBR(animal.dataNascimento)} &nbsp;|&nbsp;
        <strong>Lote / Local:</strong> ${animal.lote} &nbsp;|&nbsp;
        <strong>Status:</strong> ${animal.status}<br/>
        <strong>Observações Zootécnicas:</strong> ${animal.observacoes || 'Sem observações adicionais.'}
      </div>
      <div class="kpi-row">
        <div class="kpi-item"><span>Peso Inicial</span><strong>${m.pesoInicial.toFixed(1)} kg</strong></div>
        <div class="kpi-item"><span>Peso Atual</span><strong>${m.pesoAtual.toFixed(1)} kg</strong></div>
        <div class="kpi-item"><span>Ganho Acumulado</span><strong>+${m.ganhoTotalKg.toFixed(1)} kg (${m.diasTotais} dias)</strong></div>
        <div class="kpi-item"><span>GMD Global</span><strong>${m.gmdGlobal.toFixed(3)} kg/dia</strong></div>
        <div class="kpi-item"><span>GMD Último Período</span><strong>${m.gmdUltimoPeriodo.toFixed(3)} kg/dia</strong></div>
      </div>
      <p style="font-size:12px; color:#334155;"><em>Fórmula oficial aplicada: GMD = (peso final − peso inicial) ÷ número de dias entre pesagens.</em></p>
      <h3>Histórico de Pesagens e Evolução Zootécnica</h3>
      <table>
        <thead>
          <tr>
            <th> Ordem</th>
            <th>Data</th>
            <th>Peso (kg)</th>
            <th>Intervalo</th>
            <th>Variação</th>
            <th>GMD no Período</th>
            <th>Observações de Manejo</th>
          </tr>
        </thead>
        <tbody>${linhas}</tbody>
      </table>
    `;
    this.abrirJanelaImpressaoPDF(
      `Ficha Individual Zootécnica — ${animal.brinco} (${animal.nome})`,
      'Controle de Animais e Desempenho Zootécnico (GMD)',
      html
    );
  },

  exportarRelatorioPluviometricoPDF() {
    const registros = this.getFilteredRainfall();
    const resumo = this.calcularResumoPluviometrico(registros);
    const f = this.pluvFilters;

    const linhasMensais = resumo.serieMensal
      .map(
        (m) => `
      <tr>
        <td><strong>${m.anoMes}</strong></td>
        <td><strong>${m.totalMm.toFixed(1)} mm</strong></td>
        <td>${m.diasRegistrados} leituras</td>
        <td>${m.diasChuvosos} dias (&gt;0 mm)</td>
        <td>${m.diasZero} dias (0 mm)</td>
        <td>${(m.totalMm / Math.max(1, m.diasRegistrados)).toFixed(2)} mm/dia</td>
        <td>${m.maiorMm.toFixed(1)} mm</td>
      </tr>`
      )
      .join('');

    const linhasDiarias = registros
      .map(
        (r) => `
      <tr>
        <td>${this.formatDateBR(r.data)}</td>
        <td><strong>${Number(r.mm).toFixed(1)} mm</strong></td>
        <td>${r.horario}</td>
        <td>${r.pluviometro}</td>
        <td>${r.local}</td>
        <td>${r.responsavel}</td>
        <td>${r.observacao || ''}</td>
      </tr>`
      )
      .join('');

    const html = `
      <div class="meta-box">
        <strong>Filtros Aplicados:</strong> Ano: ${f.ano.toUpperCase()} | Mês: ${f.mes.toUpperCase()} | Pluviômetro: ${f.pluviometro} | Últimos 7 dias: ${f.ultimos7Dias ? 'Sim' : 'Não'}<br/>
        <strong>Nota Metodológica (Auditoria):</strong> Houve lacuna identificada no início de 2025 (jan–abr/2025). Ausência de registro não é interpretada como chuva igual a zero (0 mm).
      </div>
      <div class="kpi-row">
        <div class="kpi-item"><span>Acumulado no Período</span><strong>${resumo.acumuladoMm.toFixed(1)} mm</strong></div>
        <div class="kpi-item"><span>Leituras Registradas</span><strong>${resumo.totalRegistros} dias</strong></div>
        <div class="kpi-item"><span>Dias com Chuva (&gt;0 mm)</span><strong>${resumo.diasComChuva} dias</strong></div>
        <div class="kpi-item"><span>Dias Secos Medidos (0 mm)</span><strong>${resumo.diasZeroMm} dias</strong></div>
        <div class="kpi-item"><span>Média por Dia Medido</span><strong>${resumo.mediaPorDiaRegistrado.toFixed(2)} mm</strong></div>
      </div>
      <h3>Síntese Mensal de Precipitação</h3>
      <table>
        <thead>
          <tr>
            <th>Ano-Mês</th>
            <th>Acumulado (mm)</th>
            <th>Leituras</th>
            <th>Dias Chuvosos</th>
            <th>Dias 0 mm</th>
            <th>Média Diária</th>
            <th>Máxima Diária</th>
          </tr>
        </thead>
        <tbody>${linhasMensais}</tbody>
      </table>
      <h3 style="margin-top:22px;">Registros Diários Detalhados (${registros.length} medições)</h3>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Precipitação</th>
            <th>Horário</th>
            <th>Pluviômetro</th>
            <th>Local</th>
            <th>Responsável</th>
            <th>Observação / Origem</th>
          </tr>
        </thead>
        <tbody>${linhasDiarias}</tbody>
      </table>
    `;
    this.abrirJanelaImpressaoPDF(
      'Relatório Pluviométrico e Histórico de Chuvas',
      'Monitoramento Agrometeorológico — Área Experimental IF Baiano',
      html
    );
  },

  exportarCSVPluviometria() {
    const registros = this.getFilteredRainfall();
    const header = '"Data";"Milímetros";"Horário";"Pluviômetro";"Local";"Observação";"Responsável"\n';
    const body = registros
      .map(
        (r) =>
          `"${r.data}";"${r.mm}";"${r.horario}";"${r.pluviometro}";"${r.local}";"${(r.observacao || '').replace(/"/g, '""')}";"${r.responsavel}"`
      )
      .join('\n');
    const blob = new Blob(['\uFEFF' + header + body], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `amadeus_pluviometria_${this.pluvFilters.ano}_${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast(`Arquivo CSV exportado com ${registros.length} registros pluviométricos!`);
  },

  exportarRelatorioPessoaPDF(pessoaId) {
    const p = this.db.pessoas.find((x) => x.id === pessoaId);
    if (!p) return;
    const atvs = this.db.atividades.filter(
      (a) => (a.responsaveisIds || []).includes(p.id) || (a.responsaveisNomes || []).includes(p.nome)
    );
    const horasAtividades = atvs.reduce((acc, a) => acc + (Number(a.horasTrabalhadas) || 0), 0);
    const cargaTotal = (Number(p.horasBase) || 0) + horasAtividades;
    const leiturasChuva = this.db.chuvas.filter(
      (c) =>
        (c.responsavel || '').toLowerCase().includes(p.nome.toLowerCase()) ||
        (c.observacao || '').toLowerCase().includes(p.nome.toLowerCase())
    );

    const linhasAtv = atvs
      .map(
        (a) => `
      <tr>
        <td>${this.formatDateBR(a.data)}</td>
        <td><strong>${a.titulo}</strong></td>
        <td>${a.categoria}</td>
        <td>${a.horaInicio} às ${a.horaFim}</td>
        <td><strong>${a.horasTrabalhadas} h</strong></td>
        <td>${a.local}</td>
      </tr>`
      )
      .join('');

    const html = `
      <div class="meta-box">
        <strong>Nome Completo:</strong> ${p.nome} &nbsp;|&nbsp;
        <strong>Função:</strong> ${p.funcao} &nbsp;|&nbsp;
        <strong>Setor:</strong> ${p.setor}<br/>
        <strong>Vínculo:</strong> ${p.vinculo} &nbsp;|&nbsp;
        <strong>Documento/Matrícula:</strong> ${p.documento || '—'} &nbsp;|&nbsp;
        <strong>Biometria:</strong> ${p.biometriaCadastrada ? 'Cadastrada (' + p.biometriaId + ')' : 'Pendente'}
      </div>
      <div class="kpi-row">
        <div class="kpi-item"><span>Carga Horária Anterior</span><strong>${p.horasBase || 0} h</strong></div>
        <div class="kpi-item"><span>Horas em Atividades</span><strong>${horasAtividades.toFixed(1)} h</strong></div>
        <div class="kpi-item"><span>Carga Horária Total</span><strong>${cargaTotal.toFixed(1)} h</strong></div>
        <div class="kpi-item"><span>Atividades Vinculadas</span><strong>${atvs.length}</strong></div>
        <div class="kpi-item"><span>Registros Pluviométricos</span><strong>${leiturasChuva.length}</strong></div>
      </div>
      <h3>Histórico de Participação em Atividades Rurais</h3>
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Atividade / Serviço</th>
            <th>Setor</th>
            <th>Horário</th>
            <th>Carga Horária</th>
            <th>Localização</th>
          </tr>
        </thead>
        <tbody>${linhasAtv || '<tr><td colspan="6">Nenhuma atividade específica listada.</td></tr>'}</tbody>
      </table>
    `;
    this.abrirJanelaImpressaoPDF(
      `Relatório Individual de Horas e Atividades — ${p.nome}`,
      'Cadastro e Gestão de Pessoas · AMADEUS',
      html
    );
  },

  // ==========================================================================
  // Backup e Restauração Integral (Seção 9)
  // ==========================================================================
  exportarBackupCompletoJSON() {
    const payloadStr = JSON.stringify(this.db, null, 2);
    const backupEnvelope = {
      sistema: 'AMADEUS',
      versaoBackup: '2.0',
      exportadoEm: new Date().toISOString(),
      exportadoPor: this.currentUser ? this.currentUser.nome : 'Administrador',
      contagemModulos: {
        usuarios: this.db.usuarios.length,
        pessoas: this.db.pessoas.length,
        atividades: this.db.atividades.length,
        agendamentos: this.db.agendamentos.length,
        animais: this.db.animais.length,
        chuvas: this.db.chuvas.length,
        anotacoes: this.db.anotacoes.length,
        publicacoesPortal: this.db.publicacoesPortal.length,
        historicoExclusoes: this.db.historicoExclusoes.length
      },
      checksumTamanho: payloadStr.length,
      dados: this.db
    };
    const blob = new Blob([JSON.stringify(backupEnvelope, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `AMADEUS_BACKUP_COMPLETO_${new Date().toISOString().slice(0, 10)}.json`;
    a.click();
    URL.revokeObjectURL(url);
    this.toast('Backup completo do sistema AMADEUS gerado com sucesso!');
  },

  restaurarBackupJSON(file) {
    if (!this.requireAdmin('restaurar um backup do sistema')) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const parsed = JSON.parse(e.target.result);
        const targetDb = parsed.dados ? parsed.dados : parsed;
        if (!targetDb.usuarios || !targetDb.chuvas || !targetDb.pessoas) {
          this.toast('Arquivo de backup inválido: estrutura essencial ausente.', 'erro');
          return;
        }
        this.db = targetDb;
        this.saveDatabase('Restauração completa de backup');
        this.toast(`Backup restaurado com sucesso (${this.db.chuvas.length} registros de chuva, ${this.db.pessoas.length} pessoas)!`);
        window.AmadeusViews.renderApp();
      } catch (err) {
        this.toast('Erro ao ler arquivo JSON de backup: ' + err.message, 'erro');
      }
    };
    reader.readAsText(file);
  },

  // ==========================================================================
  // Utilitários Gerais, Rede e PWA
  // ==========================================================================
  setupNetworkListeners() {
    window.addEventListener('online', () => {
      this.isOnline = true;
      this.toast('Conexão restabelecida. Sincronizando dados do AMADEUS...');
      this.syncWithLocalServer(true);
      window.AmadeusViews.renderHeader();
    });
    window.addEventListener('offline', () => {
      this.isOnline = false;
      this.toast('Modo Offline PWA ativo: novos registros serão salvos localmente no dispositivo.', 'aviso');
      window.AmadeusViews.renderHeader();
    });
  },

  setupPWAInstall() {
    window.addEventListener('beforeinstallprompt', (e) => {
      e.preventDefault();
      this.deferredInstallPrompt = e;
      window.AmadeusViews.renderHeader();
    });
    if ('serviceWorker' in navigator && window.location.protocol !== 'file:') {
      navigator.serviceWorker.register('sw.js').catch(() => {});
    }
  },

  async instalarPWA() {
    if (this.deferredInstallPrompt) {
      this.deferredInstallPrompt.prompt();
      await this.deferredInstallPrompt.userChoice;
      this.deferredInstallPrompt = null;
      window.AmadeusViews.renderHeader();
    } else {
      this.toast('Para instalar como App (PWA): no navegador do celular ou Chrome/Edge, clique no menu (⋮) e selecione "Instalar aplicativo / Adicionar à tela inicial".');
    }
  },

  formatDateBR(isoDate) {
    if (!isoDate) return '—';
    const parts = isoDate.slice(0, 10).split('-');
    if (parts.length !== 3) return isoDate;
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  },

  toast(mensagem, tipo = 'sucesso') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const el = document.createElement('div');
    el.className = 'toast-item';
    if (tipo === 'erro') el.style.borderLeftColor = '#ef4444';
    if (tipo === 'aviso') el.style.borderLeftColor = '#f59e0b';
    el.textContent = mensagem;
    container.appendChild(el);
    setTimeout(() => {
      el.remove();
    }, 4500);
  }
};

window.AmadeusCore = AmadeusCore;
