// ============================================================================
// AMADEUS - Camada de Interface e Módulos Visuais (Views & Interações)
// Login Obrigatório + Aprovação pelo Admin + 3 Modos (Admin, Colaborador, Leitor)
// ============================================================================

const AmadeusViews = {
  authGateTab: 'login', // 'login' | 'cadastro' | 'emergencia'
  viewMode: localStorage.getItem('AMADEUS_VIEW_MODE') || 'auto', // 'auto' | 'mobile' | 'desktop'

  aplicarModoTela() {
    document.body.classList.remove('force-mobile-view', 'force-desktop-view');
    if (this.viewMode === 'mobile') {
      document.body.classList.add('force-mobile-view');
    } else if (this.viewMode === 'desktop') {
      document.body.classList.add('force-desktop-view');
    }
  },

  alterarModoTela(novoModo) {
    this.viewMode = novoModo;
    localStorage.setItem('AMADEUS_VIEW_MODE', novoModo);
    this.aplicarModoTela();
    this.renderApp();
    const label =
      novoModo === 'mobile'
        ? '📱 Visualização Celular ativada!'
        : novoModo === 'desktop'
        ? '💻 Visualização Notebook ativada!'
        : '🔄 Visualização Automática ativada!';
    if (window.AmadeusCore) window.AmadeusCore.toast(label);
  },

  renderApp() {
    this.aplicarModoTela();
    const core = window.AmadeusCore;
    if (core && typeof core.normalizarUsuarios === 'function') {
      core.normalizarUsuarios();
    }
    const headerEl = document.getElementById('app-header');
    const sidebarEl = document.getElementById('app-sidebar');
    const mainEl = document.getElementById('app-main');
    const bottomNavEl = document.getElementById('app-bottom-nav');

    // Bloqueio total antes do login: nada do sistema aparece sem usuário autenticado e aprovado
    if (!core.currentUser) {
      if (headerEl) {
        headerEl.innerHTML = '';
        headerEl.style.display = 'none';
      }
      if (sidebarEl) {
        sidebarEl.innerHTML = '';
        sidebarEl.style.display = 'none';
      }
      if (bottomNavEl) {
        bottomNavEl.innerHTML = '';
        bottomNavEl.style.display = 'none';
      }
      if (mainEl) {
        mainEl.innerHTML = this.viewAuthGate();
      }
      return;
    }

    if (headerEl) headerEl.style.display = '';
    if (sidebarEl) sidebarEl.style.display = '';
    if (bottomNavEl) bottomNavEl.style.display = '';
    this.renderHeader();
    this.renderSidebar();
    this.renderBottomNav();
    this.renderMainContent();
  },

  viewAuthGate() {
    const core = window.AmadeusCore;
    const cfg = core.db.configuracoes || {};
    const aba = this.authGateTab || 'login';
    const fbOn = window.AmadeusCloud && window.AmadeusCloud.config.firebase.enabled;
    const isMob = this.viewMode === 'mobile' || (this.viewMode === 'auto' && window.innerWidth <= 900);

    return `
      <div style="min-height:88vh; display:flex; align-items:center; justify-content:center; padding:0.85rem;">
        <div class="card" style="max-width:520px; width:100%; margin:0; padding:${isMob ? '1.35rem 1.1rem' : '2rem'}; border-top:6px solid var(--green-700); box-shadow:0 20px 45px rgba(15,23,42,0.16);">
          <div style="display:flex; justify-content:center; margin-bottom:0.85rem;">
            <div style="display:inline-flex; background:var(--slate-100); padding:0.2rem; border-radius:999px; border:1px solid var(--slate-200); gap:0.2rem;">
              <button type="button" class="btn btn-sm ${!isMob ? 'btn-primary' : 'btn-secondary'}" style="border-radius:999px; padding:0.25rem 0.7rem; font-size:0.74rem;"
                onclick="AmadeusViews.alterarModoTela('desktop')">
                💻 Versão Notebook
              </button>
              <button type="button" class="btn btn-sm ${isMob ? 'btn-primary' : 'btn-secondary'}" style="border-radius:999px; padding:0.25rem 0.7rem; font-size:0.74rem;"
                onclick="AmadeusViews.alterarModoTela('mobile')">
                📱 Versão Celular
              </button>
            </div>
          </div>

          <div style="text-align:center; margin-bottom:1.25rem;">
            <img src="${cfg.logoUrl || 'assets/logo-amadeus.png'}" alt="Logo AMADEUS" onerror="this.src='assets/logo-amadeus.png'"
              style="width:${isMob ? '96px' : '118px'}; height:${isMob ? '96px' : '118px'}; object-fit:contain; border-radius:20px; background:#fff; padding:6px; box-shadow:0 6px 18px rgba(0,0,0,0.12); margin-bottom:0.65rem;" />
            <h1 style="font-size:${isMob ? '1.4rem' : '1.65rem'}; font-weight:900; color:var(--green-900); margin:0;">${cfg.nomeSistema || 'AMADEUS'}</h1>
            <div style="font-size:0.84rem; font-weight:700; color:var(--green-700); margin-top:0.2rem;">
              ${cfg.subtitulo || 'Ambiente de Aprendizado e Desenvolvimento em SIPA na Bahia'}
            </div>
            <div style="font-size:0.75rem; color:var(--slate-500); margin-top:0.2rem;">
              Acesso Restrito · Identifique-se ou solicite autorização ao Administrador
            </div>
          </div>

          <!-- Abas da Tela de Entrada -->
          <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.5rem; background:var(--slate-100); padding:0.35rem; border-radius:10px; margin-bottom:1.25rem;">
            <button type="button" class="btn ${aba === 'login' ? 'btn-primary' : 'btn-secondary'}" style="justify-content:center;"
              onclick="AmadeusViews.authGateTab='login'; AmadeusViews.renderApp();">
              🔑 Entrar no Sistema
            </button>
            <button type="button" class="btn ${aba === 'cadastro' ? 'btn-primary' : 'btn-secondary'}" style="justify-content:center;"
              onclick="AmadeusViews.authGateTab='cadastro'; AmadeusViews.renderApp();">
              📝 Solicitar Acesso
            </button>
          </div>

          ${
            aba === 'login'
              ? `
            <form onsubmit="AmadeusViews.submeterLoginGate(event)">
              <div class="form-group" style="margin-bottom:0.85rem;">
                <label>Usuário ou E-mail *</label>
                <input type="text" id="gate-user" class="form-control" placeholder="Digite seu login ou e-mail..." required autofocus />
              </div>
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Senha *</label>
                <input type="password" id="gate-pass" class="form-control" placeholder="Digite sua senha..." required />
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem; font-size:0.95rem;">
                🔓 Acessar o AMADEUS
              </button>
            </form>

            <div style="margin-top:1.15rem; padding-top:1rem; border-top:1px solid var(--slate-200); font-size:0.78rem; color:var(--slate-600);">
              <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
                <span>🔥 Banco em Nuvem: <strong>${fbOn ? 'Firebase Conectado' : 'Local'}</strong></span>
                <button type="button" class="btn btn-sm btn-secondary" onclick="AmadeusCloud.pullFromFirebase(false)">
                  🔄 Sincronizar Cadastros da Nuvem
                </button>
              </div>
              <div style="margin-top:0.75rem; background:var(--green-50); padding:0.75rem; border-radius:8px; border:1px solid var(--green-200);">
                <div style="font-size:0.8rem; font-weight:800; color:var(--green-900); margin-bottom:0.4rem;">
                  🔑 Contas Rápidas Autorizadas (Clique para preencher):
                </div>
                <div style="display:flex; flex-direction:column; gap:0.35rem;">
                  <button type="button" class="btn btn-sm btn-secondary" style="background:#fff; justify-content:space-between; font-size:0.76rem; border:1px solid var(--slate-300);"
                    onclick="document.getElementById('gate-user').value='charles'; document.getElementById('gate-pass').value='123'; AmadeusCore.toast('Preenchido: Professor Charles');">
                    <span>👨‍🏫 <strong>Professor Charles Leonel</strong> (Admin)</span>
                    <span style="color:var(--slate-500);">charles / 123</span>
                  </button>
                  <button type="button" class="btn btn-sm btn-secondary" style="background:#fff; justify-content:space-between; font-size:0.76rem; border:1px solid var(--slate-300);"
                    onclick="document.getElementById('gate-user').value='admin'; document.getElementById('gate-pass').value='123'; AmadeusCore.toast('Preenchido: Guilherme Admin');">
                    <span>👑 <strong>Guilherme Dias Pereira</strong> (Admin)</span>
                    <span style="color:var(--slate-500);">admin / 123</span>
                  </button>
                </div>
              </div>

              <div style="margin-top:0.75rem; background:var(--slate-50); padding:0.65rem; border-radius:8px; border:1px solid var(--slate-200);">
                <strong>Perfis de Acesso do Sistema:</strong><br/>
                • <strong>👑 Admin:</strong> Controle total (criar, editar, excluir registros e aprovar usuários)<br/>
                • <strong>🛠️ Colaborador:</strong> Consulta painéis, exporta PDFs e cadastra novos lançamentos<br/>
                • <strong>👁️ Leitor:</strong> Somente leitura de dados, gráficos e exportação de relatórios
              </div>
              <div style="margin-top:0.6rem; text-align:center;">
                <a href="javascript:void(0)" onclick="AmadeusViews.authGateTab='emergencia'; AmadeusViews.renderApp();" style="color:var(--green-800); font-weight:700; text-decoration:none;">
                  🛠️ Recuperação de Administrador de Emergência
                </a>
              </div>
            </div>
          `
              : aba === 'cadastro'
              ? `
            <div class="alert-banner alert-info" style="font-size:0.8rem; margin-bottom:1rem;">
              <div>🛡️</div>
              <div>
                <strong>Solicitação de Cadastro mediante Autorização:</strong><br/>
                Preencha seus dados abaixo. Seu pedido ficará <strong>Pendente</strong> até que o Administrador autorize sua entrada e defina seu modo (<em>Leitor</em>, <em>Colaborador</em> ou <em>Admin</em>).
              </div>
            </div>

            <form onsubmit="AmadeusViews.submeterSolicitacaoCadastro(event)">
              <div class="form-group" style="margin-bottom:0.75rem;">
                <label>Nome Completo *</label>
                <input type="text" id="cad-nome" class="form-control" placeholder="Ex.: Maria Silva" required />
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Nome de Usuário (Login) *</label>
                  <input type="text" id="cad-login" class="form-control" placeholder="Ex.: mariasilva" required />
                </div>
                <div class="form-group">
                  <label>E-mail *</label>
                  <input type="email" id="cad-email" class="form-control" placeholder="maria@email.com" required />
                </div>
              </div>
              <div class="form-grid">
                <div class="form-group">
                  <label>Crie uma Senha *</label>
                  <input type="password" id="cad-senha" class="form-control" placeholder="Mínimo 4 caracteres" required />
                </div>
                <div class="form-group">
                  <label>Cargo / Vínculo / Setor *</label>
                  <input type="text" id="cad-cargo" class="form-control" placeholder="Ex.: Estudante, Técnico, Visitante..." required />
                </div>
              </div>
              <div class="form-group" style="margin-bottom:1rem;">
                <label>Perfil Solicitado (Sujeito à aprovação do Admin) *</label>
                <select id="cad-modo" class="form-control">
                  <option value="leitor">👁️ Leitor (Visualizar painéis, gráficos e baixar PDFs)</option>
                  <option value="colaborador">🛠️ Colaborador (Visualizar + Cadastrar chuvas, pesagens e atividades)</option>
                </select>
              </div>
              <button type="submit" class="btn btn-primary" style="width:100%; justify-content:center; padding:0.75rem;">
                📨 Enviar Solicitação para o Administrador
              </button>
            </form>
          `
              : `
            <div class="alert-banner alert-warning" style="font-size:0.8rem; margin-bottom:1rem;">
              <div>🔑</div>
              <div>
                <strong>Restauração de Administrador:</strong> Insira a chave mestra do projeto AMADEUS para entrar imediatamente como Administrador.
              </div>
            </div>
            <div class="form-group" style="margin-bottom:1rem;">
              <label>Chave Mestra de Segurança</label>
              <input type="password" id="gate-rec-key" class="form-control" placeholder="Digite a chave mestra..." />
            </div>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn btn-secondary" style="flex:1; justify-content:center;" onclick="AmadeusViews.authGateTab='login'; AmadeusViews.renderApp();">
                Voltar
              </button>
              <button type="button" class="btn btn-primary" style="flex:2; justify-content:center;"
                onclick="AmadeusCore.restaurarAcessoAdminEmergencia(document.getElementById('gate-rec-key').value)">
                🛠️ Restaurar e Entrar como Admin
              </button>
            </div>
          `
          }
        </div>
      </div>
    `;
  },

  async submeterLoginGate(e) {
    e.preventDefault();
    const uInput = document.getElementById('gate-user');
    const pInput = document.getElementById('gate-pass');
    const u = uInput ? uInput.value : '';
    const p = pInput ? pInput.value : '';
    await window.AmadeusCore.login(u, p);
  },

  async submeterSolicitacaoCadastro(e) {
    e.preventDefault();
    const ok = await window.AmadeusCore.solicitarCadastro({
      nome: document.getElementById('cad-nome').value,
      login: document.getElementById('cad-login').value,
      email: document.getElementById('cad-email').value,
      senha: document.getElementById('cad-senha').value,
      cargo: document.getElementById('cad-cargo').value,
      modoSolicitado: document.getElementById('cad-modo').value
    });
    if (ok) {
      this.authGateTab = 'login';
      this.renderApp();
    }
  },

  renderHeader() {
    const el = document.getElementById('app-header');
    if (!el) return;
    const core = window.AmadeusCore;
    const cfg = core.db.configuracoes;
    const u = core.currentUser;
    if (!u) return;
    const fbOn = window.AmadeusCloud && window.AmadeusCloud.config.firebase.enabled;
    const pendentes = core.db.usuarios.filter((x) => x.statusAcesso === 'pendente').length;
    const isMobActive = this.viewMode === 'mobile' || (this.viewMode === 'auto' && window.innerWidth <= 900);

    el.innerHTML = `
      <div class="brand-area" onclick="AmadeusViews.navegar('dashboard')">
        <img src="${cfg.logoUrl || 'assets/logo-amadeus.png'}" alt="Logo AMADEUS" class="brand-logo" onerror="this.src='assets/logo-amadeus.png'" />
        <div>
          <div class="brand-title">
            ${cfg.nomeSistema}
            <span class="role-badge ${core.isAdmin() ? 'role-admin' : 'role-comum'}">
              ${core.getRoleLabel(u.perfil)}
            </span>
          </div>
          <div class="brand-subtitle">${cfg.subtitulo || cfg.nomeExpandido}</div>
        </div>
      </div>
      <div class="header-actions">
        <div class="view-mode-switcher" title="Alternar entre visualização Notebook e Celular">
          <button type="button" class="view-mode-btn ${!isMobActive ? 'active' : ''}" onclick="AmadeusViews.alterarModoTela('desktop')">
            💻 Notebook
          </button>
          <button type="button" class="view-mode-btn ${isMobActive ? 'active' : ''}" onclick="AmadeusViews.alterarModoTela('mobile')">
            📱 Celular
          </button>
        </div>
        <span class="status-pill" title="Status de Conexão PWA e Nuvem">
          <span class="status-dot ${core.isOnline ? '' : 'offline'}"></span>
          ${core.isOnline ? 'Online' : 'Offline'}
          ${fbOn ? ' · 🔥 Firebase' : ''}
        </span>
        ${
          core.isAdmin() && pendentes > 0
            ? `
          <button class="btn btn-sm btn-amber" onclick="AmadeusViews.navegar('admin')" title="Solicitações de acesso aguardando sua aprovação">
            🔔 ${pendentes} Pendente(s)
          </button>
        `
            : ''
        }
        <button class="btn btn-sm btn-secondary" onclick="AmadeusCore.instalarPWA()" title="Instalar aplicativo no celular ou computador">
          📲 Instalar App
        </button>
        <span style="font-size:0.78rem; font-weight:700; color:#fff; background:rgba(255,255,255,0.14); padding:0.28rem 0.6rem; border-radius:8px; max-width:160px; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          👤 ${u.nome.split(' ')[0]}
        </span>
        <button class="btn btn-sm btn-danger" onclick="AmadeusCore.logout()" title="Encerrar sessão e voltar para a tela de login">
          🚪 Sair
        </button>
      </div>
    `;
  },

  getMenuModules() {
    const core = window.AmadeusCore;
    const db = core.db;
    const notasVisiveis = core.getVisibleNotesForCurrentUser();
    const pendentes = db.usuarios.filter((x) => x.statusAcesso === 'pendente').length;
    const totalSipa =
      (db.sipa && Array.isArray(db.sipa.plantios) ? db.sipa.plantios.length : 0) +
      (db.sipa && Array.isArray(db.sipa.avaliacoes) ? db.sipa.avaliacoes.length : 0);

    return [
      { id: 'dashboard', icone: '📊', label: 'Painel Geral', badge: '' },
      { id: 'sipa', icone: '🌱', label: 'SIPA', badge: totalSipa || 'SPD' },
      { id: 'pluviometria', icone: '🌧️', label: 'Pluviometria 25/26', badge: db.chuvas.length },
      { id: 'atividades', icone: '🚜', label: 'Atividades Rurais', badge: db.atividades.length },
      { id: 'agendamento', icone: '📅', label: 'Agendamento & Calc', badge: db.agendamentos.length },
      { id: 'pessoas', icone: '👥', label: 'Pessoas & Biometria', badge: db.pessoas.length },
      { id: 'animais', icone: '🐄', label: 'Animais & GMD', badge: db.animais.length },
      { id: 'anotacoes', icone: '📝', label: 'Anotações Privadas', badge: notasVisiveis.length },
      { id: 'producao', icone: '🌾', label: 'Produção & Estoque', badge: db.producaoEstoqueFinanceiro.estoque.length },
      { id: 'relatorios', icone: '📑', label: 'Relatórios & PDFs', badge: 'PDF' },
      { id: 'portal', icone: '🏛️', label: 'Portal Institucional', badge: db.publicacoesPortal.length },
      { id: 'admin', icone: '⚙️', label: 'Admin, Acessos & Nuvem', badge: core.isAdmin() ? (pendentes > 0 ? `🔔 ${pendentes}` : 'Admin') : '🔒' }
    ];
  },

  renderSidebar() {
    const el = document.getElementById('app-sidebar');
    if (!el) return;
    const core = window.AmadeusCore;
    const itens = this.getMenuModules();

    el.innerHTML = `
      <div class="nav-section-label">Módulos AMADEUS</div>
      ${itens
        .map(
          (item) => `
        <button class="nav-btn ${core.activeTab === item.id ? 'active' : ''}" onclick="AmadeusViews.navegar('${item.id}')">
          <span>${item.icone}</span>
          <span>${item.label}</span>
          ${item.badge !== '' ? `<span class="nav-badge">${item.badge}</span>` : ''}
        </button>
      `
        )
        .join('')}
    `;
  },

  renderBottomNav() {
    const el = document.getElementById('app-bottom-nav');
    if (!el) return;
    const core = window.AmadeusCore;
    if (!core.currentUser) {
      el.innerHTML = '';
      return;
    }
    const atv = core.activeTab;
    const Principais = [
      { id: 'dashboard', icone: '📊', label: 'Painel' },
      { id: 'sipa', icone: '🌱', label: 'SIPA' },
      { id: 'pluviometria', icone: '🌧️', label: 'Chuvas' },
      { id: 'atividades', icone: '🚜', label: 'Atividades' }
    ];

    el.innerHTML = `
      ${Principais.map(
        (item) => `
        <button type="button" class="mobile-bottom-btn ${atv === item.id ? 'active' : ''}" onclick="AmadeusViews.navegar('${item.id}')">
          <span class="mb-icon">${item.icone}</span>
          <span>${item.label}</span>
        </button>
      `
      ).join('')}
      <button type="button" class="mobile-bottom-btn ${!Principais.some((p) => p.id === atv) ? 'active' : ''}" onclick="AmadeusViews.abrirMenuMobileModulos()">
        <span class="mb-icon">☰</span>
        <span>Módulos</span>
      </button>
    `;
  },

  abrirMenuMobileModulos() {
    const core = window.AmadeusCore;
    const itens = this.getMenuModules();
    this.abrirModalGenerico(
      '📱 Todos os Módulos do AMADEUS',
      `
        <div style="display:grid; grid-template-columns: repeat(2, 1fr); gap:0.6rem; margin-bottom:1rem;">
          ${itens
            .map(
              (item) => `
            <button type="button" class="btn ${core.activeTab === item.id ? 'btn-primary' : 'btn-secondary'}"
              style="flex-direction:column; padding:0.85rem 0.5rem; gap:0.3rem; height:auto; text-align:center;"
              onclick="AmadeusViews.fecharModal(); AmadeusViews.navegar('${item.id}');">
              <span style="font-size:1.45rem;">${item.icone}</span>
              <span style="font-size:0.8rem; font-weight:700;">${item.label}</span>
              ${item.badge !== '' ? `<span style="font-size:0.7rem; opacity:0.85;">(${item.badge})</span>` : ''}
            </button>
          `
            )
            .join('')}
        </div>
        <div style="display:flex; justify-content:space-between; gap:0.5rem; padding-top:0.75rem; border-top:1px solid var(--slate-200);">
          <button type="button" class="btn btn-sm btn-secondary" onclick="AmadeusViews.fecharModal(); AmadeusViews.alterarModoTela('desktop')">
            💻 Mudar p/ Notebook
          </button>
          <button type="button" class="btn btn-sm btn-danger" onclick="AmadeusViews.fecharModal(); AmadeusCore.logout()">
            🚪 Sair da Conta
          </button>
        </div>
      `
    );
  },

  navegar(tabId) {
    window.AmadeusCore.activeTab = tabId;
    this.renderApp();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  renderMainContent() {
    const el = document.getElementById('app-main');
    if (!el) return;
    const tab = window.AmadeusCore.activeTab;

    switch (tab) {
      case 'dashboard':
        el.innerHTML = this.viewDashboard();
        break;
      case 'sipa':
        el.innerHTML = this.viewSipa();
        if ((this.sipaSubTab || 'mapa') === 'mapa') {
          setTimeout(() => this.inicializarMapaSipa(), 80);
        }
        break;
      case 'pluviometria':
        el.innerHTML = this.viewPluviometria();
        break;
      case 'atividades':
        el.innerHTML = this.viewAtividades();
        break;
      case 'agendamento':
        el.innerHTML = this.viewAgendamento();
        break;
      case 'pessoas':
        el.innerHTML = this.viewPessoas();
        break;
      case 'animais':
        el.innerHTML = this.viewAnimais();
        break;
      case 'anotacoes':
        el.innerHTML = this.viewAnotacoes();
        break;
      case 'producao':
        el.innerHTML = this.viewProducaoEstoqueFinanceiro();
        break;
      case 'relatorios':
        el.innerHTML = this.viewRelatorios();
        break;
      case 'portal':
        el.innerHTML = this.viewPortalInstitucional();
        break;
      case 'admin':
        el.innerHTML = this.viewAdministracao();
        break;
      default:
        el.innerHTML = this.viewDashboard();
    }
  },

  // ==========================================================================
  // 1. PAINEL EXECUTIVO (DASHBOARD)
  // ==========================================================================
  viewDashboard() {
    const core = window.AmadeusCore;
    const db = core.db;
    const ch2025 = db.chuvas.filter((c) => c.data.startsWith('2025'));
    const ch2026 = db.chuvas.filter((c) => c.data.startsWith('2026'));
    const mm2025 = ch2025.reduce((s, r) => s + Number(r.mm), 0);
    const mm2026 = ch2026.reduce((s, r) => s + Number(r.mm), 0);

    const gmds = db.animais.map((a) => core.calcularMetricasAnimal(a).gmdGlobal);
    const gmdMedioRebanho = gmds.length ? gmds.reduce((s, v) => s + v, 0) / gmds.length : 0;

    const totalHorasEquipe = db.pessoas.reduce((s, p) => {
      const hAtv = db.atividades
        .filter((a) => (a.responsaveisIds || []).includes(p.id))
        .reduce((acc, a) => acc + (Number(a.horasTrabalhadas) || 0), 0);
      return s + (Number(p.horasBase) || 0) + hAtv;
    }, 0);

    const pendentes = db.usuarios.filter((u) => u.statusAcesso === 'pendente');
    const descModo = core.isAdmin()
      ? '👑 Modo Administrador: permissão total para cadastrar, editar, excluir registros e autorizar usuários'
      : core.isColaborador()
      ? '🛠️ Modo Colaborador: permissão para consultar, exportar PDFs e cadastrar novos registros (edição e exclusão bloqueadas)'
      : '👁️ Modo Leitor: permissão exclusiva de leitura e exportação de relatórios PDF/CSV (cadastros, edições e exclusões bloqueados)';

    return `
      ${
        core.isAdmin() && pendentes.length > 0
          ? `
        <div class="alert-banner alert-warning" style="justify-content:space-between; align-items:center; flex-wrap:wrap;">
          <div style="display:flex; gap:0.65rem; align-items:center;">
            <span style="font-size:1.3rem;">🔔</span>
            <div>
              <strong>Atenção Administrador: existem ${pendentes.length} solicitação(ões) de cadastro aguardando sua autorização!</strong><br/>
              Usuários pendentes: ${pendentes.map((p) => `<strong>${p.nome}</strong> (${p.email})`).join(', ')}
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="AmadeusViews.navegar('admin')">
            ✅ Revisar e Autorizar na Aba Admin
          </button>
        </div>
      `
          : ''
      }

      <div class="kpi-grid">
        <div class="kpi-card blue" onclick="AmadeusViews.navegar('pluviometria')" style="cursor:pointer;">
          <div class="kpi-label">Chuva Acumulada 2025</div>
          <div class="kpi-value">${mm2025.toFixed(1)} mm</div>
          <div class="kpi-sub">${ch2025.length} leituras (Maio a Dez/2025)</div>
        </div>
        <div class="kpi-card blue" onclick="AmadeusViews.navegar('pluviometria')" style="cursor:pointer;">
          <div class="kpi-label">Chuva Acumulada 2026</div>
          <div class="kpi-value">${mm2026.toFixed(1)} mm</div>
          <div class="kpi-sub">${ch2026.length} leituras (Jan a Ago/2026)</div>
        </div>
        <div class="kpi-card" onclick="AmadeusViews.navegar('animais')" style="cursor:pointer;">
          <div class="kpi-label">GMD Médio do Rebanho</div>
          <div class="kpi-value">+${gmdMedioRebanho.toFixed(3)} kg/d</div>
          <div class="kpi-sub">${db.animais.length} lotes/animais monitorados</div>
        </div>
        <div class="kpi-card amber" onclick="AmadeusViews.navegar('agendamento')" style="cursor:pointer;">
          <div class="kpi-label">Tarefas Agendadas</div>
          <div class="kpi-value">${db.agendamentos.length}</div>
          <div class="kpi-sub">Cartões amarelos e verdes ativos</div>
        </div>
        <div class="kpi-card" onclick="AmadeusViews.navegar('pessoas')" style="cursor:pointer;">
          <div class="kpi-label">Equipe & Carga Horária</div>
          <div class="kpi-value">${totalHorasEquipe.toFixed(0)} h</div>
          <div class="kpi-sub">${db.pessoas.length} colaboradores vinculados</div>
        </div>
      </div>

      <div class="responsive-grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📅 Próximos Agendamentos (Cartões Coloridos)</div>
            <button class="btn btn-sm btn-primary" onclick="AmadeusViews.navegar('agendamento')">Ver Agenda</button>
          </div>
          <div class="schedule-cards-grid">
            ${db.agendamentos
              .slice(0, 3)
              .map(
                (ag) => `
              <div class="schedule-card card-${ag.corCartao}">
                <div style="display:flex; justify-content:space-between; font-size:0.76rem; font-weight:700; margin-bottom:0.35rem;">
                  <span>⏰ ${core.formatDateBR(ag.data)} às ${ag.horario}</span>
                  <span>${ag.corCartao === 'verde' ? '🟢 Confirmada' : '🟡 Programada'}</span>
                </div>
                <div style="font-weight:800; font-size:0.96rem; margin-bottom:0.25rem;">${ag.titulo}</div>
                <div style="font-size:0.8rem;">📍 ${ag.local} · 👤 ${ag.responsavel}</div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">🌧️ Destaques Pluviométricos 2025–2026</div>
            <button class="btn btn-sm btn-primary" onclick="AmadeusViews.navegar('pluviometria')">Abrir Painel de Chuvas</button>
          </div>
          <p style="font-size:0.86rem; color:var(--slate-600); margin-bottom:0.85rem;">
            Total consolidado na Área Experimental: <strong>${(mm2025 + mm2026).toFixed(1)} mm</strong> em <strong>${db.chuvas.length} dias monitorados</strong>.
          </p>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ano</th>
                  <th>Período Medido</th>
                  <th>Leituras</th>
                  <th>Acumulado</th>
                  <th>Pico Diário</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><strong>2025</strong></td>
                  <td>06/05/2025 a 30/12/2025</td>
                  <td>${ch2025.length} dias</td>
                  <td><strong>${mm2025.toFixed(1)} mm</strong></td>
                  <td>86,0 mm (05/12/2025)</td>
                </tr>
                <tr>
                  <td><strong>2026</strong></td>
                  <td>02/01/2026 a 27/08/2026</td>
                  <td>${ch2026.length} dias</td>
                  <td><strong>${mm2026.toFixed(1)} mm</strong></td>
                  <td>150,0 mm (02/03/2026)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // 2. CONTROLE PLUVIOMÉTRICO E HISTÓRICO DE CHUVAS (Seção 6)
  // ==========================================================================
  viewPluviometria() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const f = core.pluvFilters;
    if (!['combo', 'linha', 'mensal', 'comparativo', 'pluviometros'].includes(f.modoGrafico)) {
      f.modoGrafico = 'combo';
    }
    const registros = core.getFilteredRainfall();
    const resumo = core.calcularResumoPluviometrico(registros);
    const pluviometrosUnicos = Array.from(new Set(core.db.chuvas.map((c) => c.pluviometro)));
    const isFullscreen = core.chartFullscreenId === 'pluv-chart';

    // A barra amarela de aviso metodológico de 2025 SÓ aparece quando a pessoa seleciona 2025 ou compara 2025 e 2026
    const mostrarAviso2025 = f.ano === '2025' || f.ano === 'todos' || f.modoGrafico === 'comparativo';
    const st = resumo.statusHidrico;

    return `
      ${
        mostrarAviso2025
          ? `
      <div class="alert-banner alert-warning">
        <div>⚠️</div>
        <div>
          <strong>Limitação de Dados e Nota Metodológica (Início de 2025):</strong>
          Houve uma lacuna de registros identificada entre <strong>janeiro e abril de 2025</strong> (as medições importadas de 2025 iniciam em <strong>06/05/2025</strong>).
          No AMADEUS, <strong>ausência de registro nunca é interpretada como chuva igual a zero (0 mm)</strong>. Dias secos efetivamente lidos constam explicitamente com <code>0 mm</code>.
        </div>
      </div>
      `
          : ''
      }

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🌧️ Monitoramento Pluviométrico & Apoio à Tomada de Decisão</div>
            <div style="font-size:0.8rem; color:var(--slate-500);">
              Análise de precipitação diária, soma progressiva acumulada, balanço hídrico e recomendações técnicas para manejo SIPA
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalChuva()">➕ Registrar Chuva (mm)</button>`
                : `<span class="status-pill" title="Modo Leitor: apenas consulta e exportação">👁️ Modo Leitor</span>`
            }
            <button class="btn btn-sm btn-secondary" onclick="AmadeusCore.exportarCSVPluviometria()">📥 Exportar CSV</button>
            <button class="btn btn-sm btn-secondary" onclick="AmadeusCore.exportarRelatorioPluviometricoPDF()">📄 Relatório em PDF</button>
            ${
              isAdmin
                ? `
              <label class="btn btn-sm btn-secondary" style="margin:0;">
                📤 Importar CSV
                <input type="file" accept=".csv,.txt" style="display:none;" onchange="AmadeusViews.importarArquivoCSVChuva(this.files[0])" />
              </label>
            `
                : ''
            }
          </div>
        </div>

        <!-- Barra de Filtros -->
        <div class="form-grid" style="background:var(--slate-50); padding:0.9rem; border-radius:var(--radius-md); border:1px solid var(--slate-200);">
          <div class="form-group">
            <label>Filtrar por Ano</label>
            <select class="form-control" onchange="AmadeusViews.setPluvFilter('ano', this.value)">
              <option value="2026" ${f.ano === '2026' ? 'selected' : ''}>2026 (Janeiro a Agosto)</option>
              <option value="2025" ${f.ano === '2025' ? 'selected' : ''}>2025 (Maio a Dezembro)</option>
              <option value="todos" ${f.ano === 'todos' ? 'selected' : ''}>Comparar 2025 e 2026 (Todos)</option>
            </select>
          </div>
          <div class="form-group">
            <label>Filtrar por Mês</label>
            <select class="form-control" onchange="AmadeusViews.setPluvFilter('mes', this.value)">
              <option value="todos" ${f.mes === 'todos' ? 'selected' : ''}>Todos os meses</option>
              <option value="01" ${f.mes === '01' ? 'selected' : ''}>01 - Janeiro</option>
              <option value="02" ${f.mes === '02' ? 'selected' : ''}>02 - Fevereiro</option>
              <option value="03" ${f.mes === '03' ? 'selected' : ''}>03 - Março</option>
              <option value="04" ${f.mes === '04' ? 'selected' : ''}>04 - Abril</option>
              <option value="05" ${f.mes === '05' ? 'selected' : ''}>05 - Maio</option>
              <option value="06" ${f.mes === '06' ? 'selected' : ''}>06 - Junho</option>
              <option value="07" ${f.mes === '07' ? 'selected' : ''}>07 - Julho</option>
              <option value="08" ${f.mes === '08' ? 'selected' : ''}>08 - Agosto</option>
              <option value="09" ${f.mes === '09' ? 'selected' : ''}>09 - Setembro</option>
              <option value="10" ${f.mes === '10' ? 'selected' : ''}>10 - Outubro</option>
              <option value="11" ${f.mes === '11' ? 'selected' : ''}>11 - Novembro</option>
              <option value="12" ${f.mes === '12' ? 'selected' : ''}>12 - Dezembro</option>
            </select>
          </div>
          <div class="form-group">
            <label>Pluviômetro / Ponto</label>
            <select class="form-control" onchange="AmadeusViews.setPluvFilter('pluviometro', this.value)">
              <option value="todos" ${f.pluviometro === 'todos' ? 'selected' : ''}>Todos os Pluviômetros</option>
              ${pluviometrosUnicos
                .map((p) => `<option value="${p}" ${f.pluviometro === p ? 'selected' : ''}>${p}</option>`)
                .join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Pesquisar (Data, Responsável, Local)</label>
            <input type="text" class="form-control" placeholder="Ex.: Felipe Zeca, Alisson, 2026-03..."
              value="${f.busca}" oninput="AmadeusViews.setPluvFilter('busca', this.value)" />
          </div>
          <div class="form-group" style="justify-content:flex-end;">
            <label>Atalhos de Período</label>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              <button class="btn btn-sm ${f.ultimos7Dias ? 'btn-primary' : 'btn-secondary'}"
                onclick="AmadeusViews.setPluvFilter('ultimos7Dias', ${!f.ultimos7Dias})">
                🗓️ Últimos 7 Dias
              </button>
              <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.limparFiltrosPluv()">
                🔄 Padrão (2026)
              </button>
            </div>
          </div>
        </div>

        <!-- KPIs Principais e Indicadores de Tomada de Decisão -->
        <div class="kpi-grid">
          <div class="kpi-card blue">
            <div class="kpi-label">Acumulado no Período</div>
            <div class="kpi-value">${resumo.acumuladoMm.toFixed(1)} mm</div>
            <div class="kpi-sub">Últimos 30d: <strong>${resumo.acum30d.toFixed(1)} mm</strong> · 15d: <strong>${resumo.acum15d.toFixed(1)} mm</strong></div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Média por Dia Chuvoso</div>
            <div class="kpi-value">${resumo.mediaNosDiasChuvosos.toFixed(1)} mm</div>
            <div class="kpi-sub">Média geral (com secos): ${resumo.mediaPorDiaRegistrado.toFixed(1)} mm/leitura</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Chuvas Úteis (&ge; 5 mm)</div>
            <div class="kpi-value">${resumo.chuvasUteisCount} eventos</div>
            <div class="kpi-sub">${resumo.chuvasUteisMm.toFixed(1)} mm efetivos p/ solo e pastagem</div>
          </div>
          <div class="kpi-card amber">
            <div class="kpi-label">Regularidade &amp; Veranico</div>
            <div class="kpi-value">${resumo.frequenciaChuvaPct.toFixed(0)}% chuvoso</div>
            <div class="kpi-sub">${resumo.diasComChuva} chuvosos · ${resumo.diasZeroMm} secos (Máx. ${resumo.maiorVeranicoLeituras} leituras s/ chuva útil)</div>
          </div>
          <div class="kpi-card blue">
            <div class="kpi-label">Pico Diário &amp; Intensidade</div>
            <div class="kpi-value">${resumo.maiorChuva ? Number(resumo.maiorChuva.mm).toFixed(1) + ' mm' : '0 mm'}</div>
            <div class="kpi-sub">${resumo.maiorChuva ? core.formatDateBR(resumo.maiorChuva.data) : '—'} · ${resumo.eventosExtremos} evento(s) &ge; 50 mm</div>
          </div>
        </div>

        <!-- Painel Gráfico Moderno de Telemetria Agroclimática -->
        <div class="chart-container ${isFullscreen ? 'fullscreen' : ''}" id="pluv-chart-box"
          style="padding:1.35rem; border-radius:16px; background:linear-gradient(180deg, #ffffff 0%, #f8fafc 100%); border:1px solid #e2e8f0; box-shadow:0 10px 25px -5px rgba(15, 23, 42, 0.06);">
          <div class="card-header" style="margin-bottom:0.85rem; border-bottom:1px solid #e2e8f0; padding-bottom:0.85rem;">
            <div>
              <div style="display:inline-flex; align-items:center; gap:0.4rem; background:#dcfce7; color:#166534; padding:0.2rem 0.65rem; border-radius:999px; font-size:0.7rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.35rem;">
                <span>📡 TELEMETRIA PLUVIOMÉTRICA SIPA</span>
                <span>•</span>
                <span>${f.somenteChuvosos ? 'SOMENTE DIAS CHUVOSOS' : 'SÉRIE COMPLETA'}</span>
              </div>
              <div style="font-size:1.28rem; font-weight:800; color:#0f172a; letter-spacing:-0.01em; line-height:1.25;">
                ${
                  f.modoGrafico === 'combo'
                    ? 'Hidrograma Interativo: Precipitação Diária & Curva Acumulada'
                    : f.modoGrafico === 'linha'
                    ? 'Dinâmica Hídrica: Curva Suavizada, Média Móvel (7d) & Zonas de Decisão'
                    : f.modoGrafico === 'mensal'
                    ? 'Balanço Mensal Consolidado & Frequência de Dias Chuvosos'
                    : f.modoGrafico === 'comparativo'
                    ? 'Análise Comparativa Multi-Anual (2025 × 2026)'
                    : 'Distribuição por Pluviômetro / Unidade Experimental'
                }
              </div>
              <div style="font-size:0.8rem; color:#64748b; margin-top:0.2rem;">
                Passe o mouse (ou deslize o dedo no celular) sobre o gráfico para inspecionar cada leitura em tempo real.
              </div>
            </div>

            <div style="display:flex; gap:0.35rem; flex-wrap:wrap; align-items:center;">
              <div style="display:inline-flex; background:#f1f5f9; padding:0.22rem; border-radius:10px; border:1px solid #cbd5e1; gap:0.2rem; flex-wrap:wrap;">
                <button class="btn btn-sm ${f.modoGrafico === 'combo' ? 'btn-primary' : ''}"
                  style="${f.modoGrafico === 'combo' ? 'border-radius:8px;' : 'background:transparent; color:#334155; border:none; border-radius:8px;'}"
                  onclick="AmadeusViews.setPluvFilter('modoGrafico', 'combo')">📊 Hidrograma + Acumulado</button>
                <button class="btn btn-sm ${f.modoGrafico === 'linha' ? 'btn-primary' : ''}"
                  style="${f.modoGrafico === 'linha' ? 'border-radius:8px;' : 'background:transparent; color:#334155; border:none; border-radius:8px;'}"
                  onclick="AmadeusViews.setPluvFilter('modoGrafico', 'linha')">📈 Curva de Linha &amp; Tendência</button>
                <button class="btn btn-sm ${f.modoGrafico === 'mensal' ? 'btn-primary' : ''}"
                  style="${f.modoGrafico === 'mensal' ? 'border-radius:8px;' : 'background:transparent; color:#334155; border:none; border-radius:8px;'}"
                  onclick="AmadeusViews.setPluvFilter('modoGrafico', 'mensal')">📅 Mensal</button>
                <button class="btn btn-sm ${f.modoGrafico === 'comparativo' ? 'btn-primary' : ''}"
                  style="${f.modoGrafico === 'comparativo' ? 'border-radius:8px;' : 'background:transparent; color:#334155; border:none; border-radius:8px;'}"
                  onclick="AmadeusViews.setPluvFilter('modoGrafico', 'comparativo')">⚖️ 2025 × 2026</button>
              </div>

              ${
                f.modoGrafico === 'combo' || f.modoGrafico === 'linha'
                  ? `
                <button class="btn btn-sm ${f.somenteChuvosos ? 'btn-amber' : 'btn-secondary'}"
                  style="border-radius:8px;"
                  onclick="AmadeusViews.setPluvFilter('somenteChuvosos', ${!f.somenteChuvosos})"
                  title="Alternar entre todos os dias monitorados ou apenas os dias em que choveu (> 0 mm)">
                  ${f.somenteChuvosos ? '🌧️ Mostrando Só Dias c/ Chuva' : '🔎 Filtrar Só Dias c/ Chuva'}
                </button>
              `
                  : ''
              }

              <button class="btn btn-sm btn-secondary" style="border-radius:8px;" onclick="AmadeusViews.toggleChartFullscreen('pluv-chart')">
                ${isFullscreen ? '🗗 Sair' : '⛶ Tela cheia'}
              </button>
            </div>
          </div>

          ${this.renderGraficoPluviometrico(registros, resumo)}
        </div>

        <!-- Painel Técnico de Apoio à Tomada de Decisão Agronômica (SIPA) -->
        <div style="background:linear-gradient(145deg, #f8fafc 0%, #f0fdf4 100%); border:1px solid var(--green-200); border-radius:var(--radius-lg); padding:1.15rem; margin-bottom:1.25rem;">
          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-bottom:0.9rem;">
            <div>
              <div style="font-size:0.72rem; font-weight:800; text-transform:uppercase; letter-spacing:0.08em; color:var(--green-800);">
                🧭 INTELIGÊNCIA CLIMÁTICA · APOIO À TOMADA DE DECISÃO NO CAMPO
              </div>
              <div style="font-size:1.05rem; font-weight:800; color:var(--slate-900);">
                Diagnóstico Hídrico e Recomendações de Manejo (SIPA / Pastagem / Solo)
              </div>
            </div>
            <span style="background:${st.bg}; color:${st.cor}; border:1px solid ${st.borda}; padding:0.35rem 0.8rem; border-radius:999px; font-size:0.8rem; font-weight:800;">
              ${st.icone} ${st.titulo}
            </span>
          </div>

          <div class="responsive-grid-2" style="margin-bottom:0;">
            <div style="background:#ffffff; border:1px solid var(--slate-200); border-left:4px solid #0284c7; border-radius:10px; padding:0.85rem;">
              <div style="font-size:0.82rem; font-weight:800; color:#0369a1; margin-bottom:0.3rem;">
                🌱 1. Janela de Adubação, Semeadura e Manejo Cultural
              </div>
              <p style="font-size:0.81rem; color:var(--slate-700); margin-bottom:0.45rem;">
                ${resumo.recomendacaoAdubacao}
              </p>
              <div style="font-size:0.75rem; color:var(--slate-500); display:flex; gap:0.75rem; flex-wrap:wrap;">
                <span>• Chuvas úteis (&ge; 5 mm): <strong>${resumo.chuvasUteisCount} dias</strong></span>
                <span>• Chuvas moderadas (10–30 mm): <strong>${resumo.eventosModerados} dias</strong></span>
              </div>
            </div>

            <div style="background:#ffffff; border:1px solid var(--slate-200); border-left:4px solid #16a34a; border-radius:10px; padding:0.85rem;">
              <div style="font-size:0.82rem; font-weight:800; color:#15803d; margin-bottom:0.3rem;">
                🐄 2. Manejo de Pastagem, Lotação Animal e Conservação do Solo
              </div>
              <p style="font-size:0.81rem; color:var(--slate-700); margin-bottom:0.45rem;">
                ${resumo.recomendacaoPastagem}
              </p>
              <div style="font-size:0.75rem; color:var(--slate-600);">
                🛡️ <strong>Solo &amp; Erosão:</strong> ${resumo.recomendacaoSolo}
              </div>
            </div>
          </div>
        </div>

        <!-- Tabela Histórica de Registros -->
        <div class="card-header" style="margin-top:0.5rem;">
          <div class="card-title">📋 Registros Diários Consultados (${registros.length} medições exibidas)</div>
          <span style="font-size:0.78rem; color:var(--slate-500);">
            ${isAdmin ? '👑 Modo Admin: você pode editar ou excluir qualquer leitura já lançada.' : '🔒 Edição e exclusão de leituras lançadas restritas ao Administrador.'}
          </span>
        </div>
        <div class="table-responsive" style="max-height:480px; overflow-y:auto;">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Precipitação</th>
                <th>Acumulado Prog.</th>
                <th>Classificação Agronômica</th>
                <th>Pluviômetro / Local</th>
                <th>Responsável</th>
                <th>Observação</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${resumo.serieDiariaAcumulada
                .slice()
                .reverse()
                .map((r) => {
                  const mm = Number(r.mm) || 0;
                  const classeAgro =
                    mm === 0
                      ? '<span style="color:#64748b; font-size:0.75rem;">☀️ Dia seco (0 mm)</span>'
                      : mm < 5
                      ? '<span style="color:#d97706; font-size:0.75rem; font-weight:600;">🌦️ Leve (&lt; 5 mm)</span>'
                      : mm < 30
                      ? '<span style="color:#15803d; font-size:0.75rem; font-weight:700;">🌱 Chuva Útil (5–30 mm)</span>'
                      : mm < 50
                      ? '<span style="color:#0284c7; font-size:0.75rem; font-weight:700;">🌧️ Forte (30–50 mm)</span>'
                      : '<span style="color:#dc2626; font-size:0.75rem; font-weight:800;">⚠️ Extrema (&ge; 50 mm)</span>';
                  return `
                <tr>
                  <td><strong>${core.formatDateBR(r.data)}</strong></td>
                  <td>
                    <span style="font-weight:800; color:${mm > 0 ? '#0284c7' : '#64748b'};">
                      ${mm.toFixed(1)} mm
                    </span>
                  </td>
                  <td><strong style="color:var(--green-800);">${r.acumulado.toFixed(1)} mm</strong></td>
                  <td>${classeAgro}</td>
                  <td>${r.pluviometro}<br/><span style="font-size:0.72rem; color:var(--slate-500);">${r.local}</span></td>
                  <td>${r.responsavel}</td>
                  <td style="font-size:0.78rem; color:var(--slate-600);">${r.observacao || '—'}</td>
                  <td>
                    <div style="display:flex; gap:0.25rem;">
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.inspecionarDiaChuva('${r.id}')" title="Ver detalhes">🔍</button>
                      ${
                        isAdmin
                          ? `
                        <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalChuva('${r.id}')" title="Editar leitura (Admin)">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirRegistroChuva('${r.id}')" title="Excluir leitura (Admin)">🗑️</button>
                      `
                          : ''
                      }
                    </div>
                  </td>
                </tr>
              `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  // Gera curva Bezier cúbica suave (monotone-safe) a partir de [{x, y}]
  gerarCurvaSuaveSVG(pts, baseY = null) {
    if (!pts || pts.length === 0) return { path: '', area: '' };
    if (pts.length === 1) {
      const p = pts[0];
      return {
        path: `M ${p.x.toFixed(1)},${p.y.toFixed(1)}`,
        area: baseY !== null ? `M ${p.x.toFixed(1)},${baseY.toFixed(1)} L ${p.x.toFixed(1)},${p.y.toFixed(1)} L ${p.x.toFixed(1)},${baseY.toFixed(1)} Z` : ''
      };
    }
    let d = `M ${pts[0].x.toFixed(1)},${pts[0].y.toFixed(1)}`;
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[i];
      const p1 = pts[i + 1];
      const dx = (p1.x - p0.x) * 0.42;
      const cx1 = p0.x + dx;
      const cy1 = p0.y;
      const cx2 = p1.x - dx;
      const cy2 = p1.y;
      d += ` C ${cx1.toFixed(1)},${cy1.toFixed(1)} ${cx2.toFixed(1)},${cy2.toFixed(1)} ${p1.x.toFixed(1)},${p1.y.toFixed(1)}`;
    }
    const area =
      baseY !== null
        ? `${d} L ${pts[pts.length - 1].x.toFixed(1)},${baseY.toFixed(1)} L ${pts[0].x.toFixed(1)},${baseY.toFixed(1)} Z`
        : '';
    return { path: d, area };
  },

  destacarPontoPluv(idx) {
    const lista = this._ultimaSerieGraficoPluv;
    if (!lista || !lista[idx]) return;
    const item = lista[idx];
    const core = window.AmadeusCore;

    const elData = document.getElementById('hud-pluv-data');
    const elResp = document.getElementById('hud-pluv-resp');
    const elDia = document.getElementById('hud-pluv-dia');
    const elBadge = document.getElementById('hud-pluv-badge');
    const elAcum = document.getElementById('hud-pluv-acum');
    const elPct = document.getElementById('hud-pluv-pct');
    const elMM7 = document.getElementById('hud-pluv-mm7');
    const elRec = document.getElementById('hud-pluv-rec');

    if (elData) elData.textContent = core.formatDateBR(item.data);
    if (elResp) elResp.textContent = `${item.pluviometro} · Resp.: ${item.responsavel}`;
    if (elDia) elDia.textContent = `${item.mm.toFixed(1)} mm`;
    if (elBadge) {
      if (item.mm === 0) {
        elBadge.textContent = '☀️ Dia Seco (0 mm)';
        elBadge.style.background = '#f1f5f9';
        elBadge.style.color = '#475569';
      } else if (item.mm < 5) {
        elBadge.textContent = '🌦️ Chuva Leve (< 5 mm)';
        elBadge.style.background = '#fef3c7';
        elBadge.style.color = '#b45309';
      } else if (item.mm < 50) {
        elBadge.textContent = '🌱 Chuva Útil (Infiltração Ideal)';
        elBadge.style.background = '#dcfce7';
        elBadge.style.color = '#15803d';
      } else {
        elBadge.textContent = '⚠️ Evento Extremo (>= 50 mm)';
        elBadge.style.background = '#fee2e2';
        elBadge.style.color = '#b91c1c';
      }
    }
    const totalPer = lista[lista.length - 1].acumulado || 1;
    const pct = Math.min(100, (item.acumulado / totalPer) * 100);
    if (elAcum) elAcum.textContent = `${item.acumulado.toFixed(1)} mm`;
    if (elPct) elPct.textContent = `${pct.toFixed(1)}% do volume acumulado no período`;
    if (elMM7) elMM7.textContent = `${item.mediaMovel7.toFixed(1)} mm`;
    if (elRec) {
      elRec.textContent =
        item.mm >= 50
          ? 'Alerta de enxurrada: vistoriar terraços e drenagem'
          : item.mm >= 10
          ? 'Umidade ótima p/ adubação e rebrota do pasto'
          : item.mm >= 5
          ? 'Chuva útil p/ manutenção da umidade superficial'
          : 'Sem recarga hídrica significativa neste dia';
    }

    const line = document.getElementById('pluv-crosshair-line');
    const dotA = document.getElementById('pluv-active-dot-acum');
    const dotD = document.getElementById('pluv-active-dot-dia');
    if (line && item._cx !== undefined) {
      line.setAttribute('x1', item._cx);
      line.setAttribute('x2', item._cx);
      line.style.opacity = '1';
    }
    if (dotA && item._cx !== undefined && item._cyAcum !== undefined) {
      dotA.setAttribute('cx', item._cx);
      dotA.setAttribute('cy', item._cyAcum);
      dotA.style.opacity = '1';
    }
    if (dotD && item._cx !== undefined && item._cyDia !== undefined) {
      dotD.setAttribute('cx', item._cx);
      dotD.setAttribute('cy', item._cyDia);
      dotD.style.opacity = '1';
    }
  },

  renderGraficoPluviometrico(registros, resumo) {
    const core = window.AmadeusCore;
    const f = core.pluvFilters;
    const modo = f.modoGrafico || 'combo';
    const serieCompleta = resumo.serieDiariaAcumulada || [];
    const serie = f.somenteChuvosos ? serieCompleta.filter((d) => d.mm > 0) : serieCompleta;
    this._ultimaSerieGraficoPluv = serie;

    // Barra Interativa de Telemetria em Tempo Real (HUD Superior)
    const ult = serie.length > 0 ? serie[serie.length - 1] : null;
    const hudHtml = ult
      ? `
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(min(100%, 200px), 1fr)); gap:0.65rem; margin-bottom:0.95rem; background:#f8fafc; padding:0.75rem; border-radius:12px; border:1px solid #e2e8f0;">
        <div style="background:#ffffff; padding:0.6rem 0.8rem; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #334155;">
          <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:#64748b;">📅 Leitura em Foco</div>
          <div id="hud-pluv-data" style="font-size:1.05rem; font-weight:800; color:#0f172a;">${core.formatDateBR(ult.data)}</div>
          <div id="hud-pluv-resp" style="font-size:0.72rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${ult.pluviometro} · Resp.: ${ult.responsavel}</div>
        </div>
        <div style="background:#ffffff; padding:0.6rem 0.8rem; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #0284c7;">
          <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:#64748b;">🌧️ Precipitação Diária</div>
          <div style="display:flex; align-items:center; gap:0.45rem; flex-wrap:wrap;">
            <span id="hud-pluv-dia" style="font-size:1.1rem; font-weight:800; color:#0284c7;">${ult.mm.toFixed(1)} mm</span>
            <span id="hud-pluv-badge" style="font-size:0.68rem; font-weight:700; padding:0.12rem 0.45rem; border-radius:999px; background:#dcfce7; color:#15803d;">
              ${ult.mm === 0 ? '☀️ Dia Seco' : ult.mm >= 5 ? '🌱 Chuva Útil' : '🌦️ Chuva Leve'}
            </span>
          </div>
          <div style="font-size:0.71rem; color:#64748b;">Média chuvosa: <strong>${resumo.mediaNosDiasChuvosos.toFixed(1)} mm</strong></div>
        </div>
        <div style="background:#ffffff; padding:0.6rem 0.8rem; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #10b981;">
          <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:#64748b;">📈 Acumulado Progressivo</div>
          <div id="hud-pluv-acum" style="font-size:1.1rem; font-weight:800; color:#065f46;">${ult.acumulado.toFixed(1)} mm</div>
          <div id="hud-pluv-pct" style="font-size:0.71rem; color:#64748b;">100% do volume acumulado no período</div>
        </div>
        <div style="background:#ffffff; padding:0.6rem 0.8rem; border-radius:10px; border:1px solid #e2e8f0; border-left:4px solid #8b5cf6;">
          <div style="font-size:0.68rem; font-weight:700; text-transform:uppercase; color:#64748b;">〰️ Média Móvel (7d) &amp; Manejo</div>
          <div id="hud-pluv-mm7" style="font-size:1.05rem; font-weight:800; color:#6d28d9;">${ult.mediaMovel7.toFixed(1)} mm</div>
          <div id="hud-pluv-rec" style="font-size:0.71rem; color:#64748b; white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">Passe o cursor no gráfico p/ diagnóstico</div>
        </div>
      </div>
    `
      : '';

    // ========================================================================
    // MODO 1: HIDROGRAMA MODERNO (Colunas por Intensidade + Curva Bezier Acumulada)
    // ========================================================================
    if (modo === 'combo') {
      if (serie.length === 0) {
        return `<p style="padding:1rem; color:var(--slate-500);">Nenhum registro para o filtro selecionado.</p>`;
      }

      const W = 1000;
      const H = 380;
      const padL = 56;
      const padR = 64;
      const padT = 40;
      const padB = 46;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const maxDiaRaw = Math.max(25, ...serie.map((d) => d.mm));
      const scaleDiaMax = Math.ceil((maxDiaRaw * 1.18) / 25) * 25;

      const maxAcumRaw = Math.max(50, serie[serie.length - 1].acumulado);
      const stepAcum = maxAcumRaw <= 200 ? 50 : maxAcumRaw <= 500 ? 100 : maxAcumRaw <= 1000 ? 200 : 400;
      const scaleAcumMax = Math.ceil((maxAcumRaw * 1.1) / stepAcum) * stepAcum;

      const n = serie.length;
      const stepX = plotW / Math.max(1, n);
      const barW = Math.max(5, Math.min(24, stepX * 0.66));

      const yDia = (val) => padT + plotH - (Math.min(val, scaleDiaMax) / scaleDiaMax) * plotH;
      const yAcum = (val) => padT + plotH - (Math.min(val, scaleAcumMax) / scaleAcumMax) * plotH;
      const xPos = (i) => padL + i * stepX + stepX / 2;

      const ticks = [0, 0.25, 0.5, 0.75, 1];
      const gridLines = ticks
        .map((t) => {
          const y = padT + plotH * (1 - t);
          const vDia = Math.round(scaleDiaMax * t);
          const vAcum = Math.round(scaleAcumMax * t);
          return `
            <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"
              stroke="${t === 0 ? '#cbd5e1' : '#f1f5f9'}" stroke-width="${t === 0 ? '1.8' : '1.2'}" />
            <text x="${padL - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="#0284c7">${vDia}</text>
            <text x="${W - padR + 10}" y="${(y + 4).toFixed(1)}" text-anchor="start" font-size="11" font-weight="700" fill="#059669">${vAcum}</text>
          `;
        })
        .join('');

      // Linha de Média por Dia Chuvoso com Badge moderno na direita (sem colidir com barras!)
      const mediaChuv = resumo.mediaNosDiasChuvosos || 0;
      const yMedia = yDia(mediaChuv);
      const linhaMedia =
        mediaChuv > 0
          ? `
          <line x1="${padL}" y1="${yMedia.toFixed(1)}" x2="${W - padR}" y2="${yMedia.toFixed(1)}"
            stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="6,4" opacity="0.85" />
          <rect x="${W - padR - 178}" y="${Math.max(padT + 4, yMedia - 18).toFixed(1)}" width="172" height="19" rx="9.5"
            fill="#fffbeb" stroke="#fcd34d" stroke-width="1" />
          <text x="${W - padR - 92}" y="${Math.max(padT + 17, yMedia - 5).toFixed(1)}" text-anchor="middle"
            font-size="10.5" font-weight="800" fill="#b45309">
            Média chuvosa: ${mediaChuv.toFixed(1)} mm
          </text>
        `
          : '';

      // Coordenadas e curva Bezier suave para o Acumulado
      const ptsAcum = serie.map((d, i) => {
        const cx = xPos(i);
        const cyA = yAcum(d.acumulado);
        const cyD = yDia(d.mm);
        d._cx = cx;
        d._cyAcum = cyA;
        d._cyDia = cyD;
        return { x: cx, y: cyA };
      });
      const curvaAcum = this.gerarCurvaSuaveSVG(ptsAcum, padT + plotH);

      // Identifica os 3 maiores picos para destacar com Callout Badges limpos
      const topIds = new Set(
        [...serie]
          .filter((d) => d.mm >= 25)
          .sort((a, b) => b.mm - a.mm)
          .slice(0, 3)
          .map((d) => d.id)
      );

      // Colunas de Chuva Diária codificadas por intensidade + zona invisível de hover amplo
      const colunasSvg = serie
        .map((d, i) => {
          const cx = xPos(i);
          const bx = cx - barW / 2;
          const hBar = d.mm > 0 ? Math.max(5, (d.mm / scaleDiaMax) * plotH) : 0;
          const by = padT + plotH - hBar;
          const rx = Math.min(5, barW / 2);
          const gradId = d.mm >= 50 ? 'url(#barAlertGrad)' : d.mm >= 10 ? 'url(#barOceanGrad)' : 'url(#barSkyGrad)';
          const isTop = topIds.has(d.id);
          const mostrarValorBarra = isTop || (f.somenteChuvosos && n <= 35 && d.mm > 0);

          return `
            <g style="cursor:pointer;"
              onmouseenter="AmadeusViews.destacarPontoPluv(${i})"
              ontouchstart="AmadeusViews.destacarPontoPluv(${i})"
              onclick="AmadeusViews.inspecionarDiaChuva('${d.id}')">
              <!-- Faixa invisível para facilitar hover/toque em qualquer altura da coluna -->
              <rect x="${(cx - stepX / 2).toFixed(1)}" y="${padT}" width="${stepX.toFixed(1)}" height="${plotH}" fill="transparent" />
              ${
                d.mm > 0
                  ? `<rect x="${bx.toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${hBar.toFixed(1)}"
                      rx="${rx.toFixed(1)}" fill="${gradId}" filter="url(#softShadow)" />`
                  : `<circle cx="${cx.toFixed(1)}" cy="${(padT + plotH - 2).toFixed(1)}" r="1.5" fill="#cbd5e1" />`
              }
              ${
                mostrarValorBarra
                  ? `
                  <rect x="${(cx - 22).toFixed(1)}" y="${Math.max(padT + 2, by - 20).toFixed(1)}" width="44" height="16" rx="6"
                    fill="${d.mm >= 50 ? '#fef2f2' : '#f0f9ff'}" stroke="${d.mm >= 50 ? '#fca5a5' : '#bae6fd'}" stroke-width="1" />
                  <text x="${cx.toFixed(1)}" y="${Math.max(padT + 13, by - 9).toFixed(1)}" text-anchor="middle"
                    font-size="9.5" font-weight="800" fill="${d.mm >= 50 ? '#dc2626' : '#0369a1'}">
                    ${d.mm.toFixed(0)} mm
                  </text>
                `
                  : ''
              }
            </g>
          `;
        })
        .join('');

      // Marcadores elegantes na curva de acumulado APENAS nos dias com chuva significativa (>= 10 mm) e início/fim
      const pontosChaveSvg = serie
        .map((d, i) => {
          if (d.mm < 10 && i !== 0 && i !== n - 1) return '';
          return `
            <circle cx="${d._cx.toFixed(1)}" cy="${d._cyAcum.toFixed(1)}" r="${i === n - 1 ? '5' : '3.6'}"
              fill="#ffffff" stroke="#059669" stroke-width="2.5" style="pointer-events:none;" />
          `;
        })
        .join('');

      // Rótulos do eixo X
      const qtdLabels = Math.min(n, 8);
      const labelsX = [];
      for (let k = 0; k < qtdLabels; k++) {
        const idx = qtdLabels === 1 ? 0 : Math.round((k * (n - 1)) / (qtdLabels - 1));
        const d = serie[idx];
        const cx = xPos(idx);
        const label =
          f.ano === 'todos'
            ? `${d.data.slice(8, 10)}/${d.data.slice(5, 7)}/${d.data.slice(2, 4)}`
            : `${d.data.slice(8, 10)}/${d.data.slice(5, 7)}`;
        labelsX.push(
          `<text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b">${label}</text>`
        );
      }

      const ultPt = serie[n - 1];

      return `
        ${hudHtml}
        <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; padding:0.5rem;">
          <svg viewBox="0 0 ${W} ${H}" style="width:100%; min-width:560px; height:auto; display:block; user-select:none;">
            <defs>
              <linearGradient id="barSkyGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#38bdf8" />
                <stop offset="100%" stop-color="#0284c7" />
              </linearGradient>
              <linearGradient id="barOceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284c7" />
                <stop offset="100%" stop-color="#1d4ed8" />
              </linearGradient>
              <linearGradient id="barAlertGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#f97316" />
                <stop offset="100%" stop-color="#dc2626" />
              </linearGradient>
              <linearGradient id="acumModernArea" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#10b981" stop-opacity="0.28" />
                <stop offset="65%" stop-color="#10b981" stop-opacity="0.08" />
                <stop offset="100%" stop-color="#10b981" stop-opacity="0.0" />
              </linearGradient>
              <filter id="softShadow" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="#0f172a" flood-opacity="0.12" />
              </filter>
              <filter id="glowLine" x="-10%" y="-10%" width="120%" height="120%">
                <feDropShadow dx="0" dy="3" stdDeviation="3" flood-color="#059669" flood-opacity="0.25" />
              </filter>
            </defs>

            <!-- Títulos dos Eixos Y -->
            <text x="${padL}" y="22" text-anchor="start" font-size="11" font-weight="800" letter-spacing="0.06em" fill="#0284c7">
              ▊ CHUVA DIÁRIA (mm)
            </text>
            <text x="${W - padR}" y="22" text-anchor="end" font-size="11" font-weight="800" letter-spacing="0.06em" fill="#059669">
              〰️ SOMA ACUMULADA (mm)
            </text>

            ${gridLines}

            <!-- Área Sombreada e Curva Suave Bezier do Acumulado -->
            <path d="${curvaAcum.area}" fill="url(#acumModernArea)" />
            <path d="${curvaAcum.path}" fill="none" stroke="#059669" stroke-width="3.4" stroke-linecap="round" filter="url(#glowLine)" />

            ${linhaMedia}

            <!-- Linha Guia Crosshair Interativa -->
            <line id="pluv-crosshair-line" x1="${ultPt._cx.toFixed(1)}" y1="${padT}" x2="${ultPt._cx.toFixed(1)}" y2="${padT + plotH}"
              stroke="#64748b" stroke-width="1.3" stroke-dasharray="4,4" style="opacity:0; pointer-events:none; transition:opacity 0.15s;" />

            <!-- Colunas Diárias Interativas -->
            ${colunasSvg}

            <!-- Marcadores Chave da Curva Acumulada -->
            ${pontosChaveSvg}

            <!-- Ponto Ativo no Hover -->
            <circle id="pluv-active-dot-acum" cx="${ultPt._cx.toFixed(1)}" cy="${ultPt._cyAcum.toFixed(1)}" r="6.5"
              fill="#10b981" stroke="#ffffff" stroke-width="3" filter="url(#softShadow)" style="opacity:0; pointer-events:none;" />

            <!-- Datas Eixo X -->
            ${labelsX.join('')}
          </svg>
        </div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem; margin-top:0.75rem; font-size:0.77rem; color:#475569;">
          <div style="display:flex; gap:0.9rem; flex-wrap:wrap; align-items:center;">
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:11px; height:11px; border-radius:3px; background:#38bdf8; display:inline-block;"></span> Leve (&lt; 10 mm)</span>
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:11px; height:11px; border-radius:3px; background:#0284c7; display:inline-block;"></span> Chuva Útil (10–49 mm)</span>
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:11px; height:11px; border-radius:3px; background:#ef4444; display:inline-block;"></span> Extrema (&ge; 50 mm)</span>
            <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:16px; height:3.5px; border-radius:2px; background:#059669; display:inline-block;"></span> Curva Acumulada (${resumo.acumuladoMm.toFixed(1)} mm)</span>
          </div>
          <span style="color:#64748b; font-weight:600;">💡 Passe o cursor para telemetria ao vivo ou clique para abrir o laudo</span>
        </div>
      `;
    }

    // ========================================================================
    // MODO 2: GRÁFICO DE LINHA MODERNO (Curva Suavizada + Média Móvel 7d + Zonas SIPA)
    // ========================================================================
    if (modo === 'linha') {
      if (serie.length === 0) {
        return `<p style="padding:1rem; color:var(--slate-500);">Nenhum registro para o filtro selecionado.</p>`;
      }

      const W = 1000;
      const H = 380;
      const padL = 56;
      const padR = 46;
      const padT = 40;
      const padB = 46;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const maxDiaRaw = Math.max(30, ...serie.map((d) => d.mm));
      const scaleMax = Math.ceil((maxDiaRaw * 1.15) / 25) * 25;
      const n = serie.length;
      const stepX = plotW / Math.max(1, n - 1);
      const xPos = (i) => (n === 1 ? padL + plotW / 2 : padL + i * stepX);
      const yVal = (val) => padT + plotH - (Math.min(val, scaleMax) / scaleMax) * plotH;

      const ticks = [0, 0.25, 0.5, 0.75, 1];
      const gridLines = ticks
        .map((t) => {
          const y = padT + plotH * (1 - t);
          const v = Math.round(scaleMax * t);
          return `
            <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}"
              stroke="${t === 0 ? '#cbd5e1' : '#f1f5f9'}" stroke-width="${t === 0 ? '1.8' : '1.2'}" />
            <text x="${padL - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="#0284c7">${v} mm</text>
          `;
        })
        .join('');

      const y5 = yVal(5);
      const y50 = scaleMax >= 50 ? yVal(50) : padT;

      const ptsDia = serie.map((d, i) => {
        const cx = xPos(i);
        const cy = yVal(d.mm);
        d._cx = cx;
        d._cyDia = cy;
        d._cyAcum = yVal(d.mediaMovel7);
        return { x: cx, y: cy };
      });
      const ptsMM7 = serie.map((d, i) => ({ x: xPos(i), y: yVal(d.mediaMovel7) }));

      const curvaDia = this.gerarCurvaSuaveSVG(ptsDia, padT + plotH);
      const curvaMM7 = this.gerarCurvaSuaveSVG(ptsMM7, null);

      const zonasFundo = `
        <!-- Zona Ideal de Infiltração (5 a 50 mm) -->
        <rect x="${padL}" y="${y50.toFixed(1)}" width="${plotW}" height="${Math.max(0, y5 - y50).toFixed(1)}"
          fill="#dcfce7" opacity="0.28" />
        <line x1="${padL}" y1="${y5.toFixed(1)}" x2="${W - padR}" y2="${y5.toFixed(1)}"
          stroke="#10b981" stroke-width="1.3" stroke-dasharray="5,4" />
        <text x="${W - padR - 8}" y="${(y5 - 5).toFixed(1)}" text-anchor="end" font-size="10" font-weight="800" fill="#059669">
          🌱 Limiar Chuva Útil (5 mm)
        </text>
        ${
          scaleMax >= 50
            ? `
          <line x1="${padL}" y1="${y50.toFixed(1)}" x2="${W - padR}" y2="${y50.toFixed(1)}"
            stroke="#ef4444" stroke-width="1.3" stroke-dasharray="6,4" />
          <text x="${W - padR - 8}" y="${(y50 - 5).toFixed(1)}" text-anchor="end" font-size="10" font-weight="800" fill="#dc2626">
            ⚠️ Limiar de Escoamento / Erosão (50 mm)
          </text>
        `
            : ''
        }
      `;

      const faixasHover = serie
        .map((d, i) => {
          const cx = xPos(i);
          const wFaixa = Math.max(8, plotW / Math.max(1, n));
          const isPico = resumo.maiorChuva && d.id === resumo.maiorChuva.id && d.mm > 0;
          return `
            <g style="cursor:pointer;"
              onmouseenter="AmadeusViews.destacarPontoPluv(${i})"
              ontouchstart="AmadeusViews.destacarPontoPluv(${i})"
              onclick="AmadeusViews.inspecionarDiaChuva('${d.id}')">
              <rect x="${(cx - wFaixa / 2).toFixed(1)}" y="${padT}" width="${wFaixa.toFixed(1)}" height="${plotH}" fill="transparent" />
              ${
                d.mm > 0
                  ? `<circle cx="${cx.toFixed(1)}" cy="${d._cyDia.toFixed(1)}" r="${isPico ? '6' : '3.8'}"
                      fill="${d.mm >= 50 ? '#ef4444' : '#ffffff'}" stroke="${d.mm >= 50 ? '#b91c1c' : '#0284c7'}" stroke-width="2.4" />`
                  : ''
              }
              ${
                isPico
                  ? `
                  <rect x="${(cx - 58).toFixed(1)}" y="${Math.max(4, d._cyDia - 26).toFixed(1)}" width="116" height="18" rx="9"
                    fill="#fef2f2" stroke="#fca5a5" stroke-width="1" />
                  <text x="${cx.toFixed(1)}" y="${Math.max(16, d._cyDia - 14).toFixed(1)}" text-anchor="middle" font-size="10" font-weight="800" fill="#dc2626">
                    ⚡ Pico: ${d.mm.toFixed(1)} mm (${d.data.slice(8, 10)}/${d.data.slice(5, 7)})
                  </text>
                `
                  : ''
              }
            </g>
          `;
        })
        .join('');

      const qtdLabels = Math.min(n, 8);
      const labelsX = [];
      for (let k = 0; k < qtdLabels; k++) {
        const idx = qtdLabels === 1 ? 0 : Math.round((k * (n - 1)) / (qtdLabels - 1));
        const d = serie[idx];
        const cx = xPos(idx);
        labelsX.push(
          `<text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#64748b">${d.data.slice(8, 10)}/${d.data.slice(5, 7)}</text>`
        );
      }

      const ultPt = serie[n - 1];

      return `
        ${hudHtml}
        <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; padding:0.5rem;">
          <svg viewBox="0 0 ${W} ${H}" style="width:100%; min-width:560px; height:auto; display:block; user-select:none;">
            <defs>
              <linearGradient id="lineBlueModern" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0284c7" stop-opacity="0.30" />
                <stop offset="100%" stop-color="#0284c7" stop-opacity="0.0" />
              </linearGradient>
            </defs>

            <text x="${padL}" y="22" text-anchor="start" font-size="11" font-weight="800" letter-spacing="0.06em" fill="#0284c7">
              📈 CURVA DE PRECIPITAÇÃO DIÁRIA (mm) &amp; TENDÊNCIA DE UMIDADE (MÉDIA MÓVEL 7 LEITURAS)
            </text>

            ${gridLines}
            ${zonasFundo}

            <!-- Área e Curva Suave da Precipitação Diária -->
            <path d="${curvaDia.area}" fill="url(#lineBlueModern)" />
            <path d="${curvaDia.path}" fill="none" stroke="#0284c7" stroke-width="2.8" stroke-linecap="round" />

            <!-- Curva Suave da Média Móvel de 7 Leituras (Roxa/Esmeralda) -->
            <path d="${curvaMM7.path}" fill="none" stroke="#7c3aed" stroke-width="3.2" stroke-dasharray="7,4" stroke-linecap="round" />

            <!-- Crosshair -->
            <line id="pluv-crosshair-line" x1="${ultPt._cx.toFixed(1)}" y1="${padT}" x2="${ultPt._cx.toFixed(1)}" y2="${padT + plotH}"
              stroke="#64748b" stroke-width="1.3" stroke-dasharray="4,4" style="opacity:0; pointer-events:none;" />

            ${faixasHover}

            <circle id="pluv-active-dot-dia" cx="${ultPt._cx.toFixed(1)}" cy="${ultPt._cyDia.toFixed(1)}" r="6.5"
              fill="#0284c7" stroke="#ffffff" stroke-width="3" style="opacity:0; pointer-events:none;" />
            <circle id="pluv-active-dot-acum" cx="${ultPt._cx.toFixed(1)}" cy="${ultPt._cyAcum.toFixed(1)}" r="5.5"
              fill="#7c3aed" stroke="#ffffff" stroke-width="2.5" style="opacity:0; pointer-events:none;" />

            ${labelsX.join('')}
          </svg>
        </div>

        <div style="display:flex; gap:1rem; flex-wrap:wrap; margin-top:0.75rem; font-size:0.77rem; color:#475569;">
          <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:16px; height:3px; background:#0284c7; display:inline-block;"></span> <strong>Curva Azul:</strong> Precipitação diária (mm)</span>
          <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:16px; height:3px; border-top:3px dashed #7c3aed; display:inline-block;"></span> <strong>Curva Roxa:</strong> Média Móvel (7 leituras — tendência hídrica)</span>
          <span style="display:inline-flex; align-items:center; gap:0.35rem;"><span style="width:12px; height:12px; border-radius:3px; background:#dcfce7; border:1px solid #10b981; display:inline-block;"></span> <strong>Faixa Verde (5–50 mm):</strong> Zona ideal de infiltração sem erosão</span>
        </div>
      `;
    }

    // ========================================================================
    // MODO 3: MENSAL EXECUTIVO (SVG: Colunas Arredondadas + Curva de Dias Chuvosos)
    // ========================================================================
    if (modo === 'mensal') {
      const sm = resumo.serieMensal || [];
      if (sm.length === 0) {
        return `<p style="padding:1rem; color:var(--slate-500);">Nenhum registro para o filtro selecionado.</p>`;
      }

      const W = 960;
      const H = 340;
      const padL = 56;
      const padR = 56;
      const padT = 38;
      const padB = 46;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;

      const maxMm = Math.ceil((Math.max(40, ...sm.map((m) => m.totalMm)) * 1.18) / 20) * 20;
      const maxDias = Math.max(5, ...sm.map((m) => m.diasChuvosos)) + 2;
      const n = sm.length;
      const stepX = plotW / Math.max(1, n);
      const barW = Math.min(58, stepX * 0.55);

      const xPos = (i) => padL + i * stepX + stepX / 2;
      const yMm = (v) => padT + plotH - (v / maxMm) * plotH;
      const yDias = (v) => padT + plotH - (v / maxDias) * plotH;

      const ptsDias = sm.map((m, i) => ({ x: xPos(i), y: yDias(m.diasChuvosos) }));
      const curvaDias = this.gerarCurvaSuaveSVG(ptsDias, null);

      const ticks = [0, 0.25, 0.5, 0.75, 1];
      const gridSvg = ticks
        .map((t) => {
          const y = padT + plotH * (1 - t);
          return `
            <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="${t === 0 ? '#cbd5e1' : '#f1f5f9'}" stroke-width="1.3" />
            <text x="${padL - 10}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="#0284c7">${Math.round(maxMm * t)}</text>
            <text x="${W - padR + 10}" y="${(y + 4).toFixed(1)}" text-anchor="start" font-size="11" font-weight="700" fill="#d97706">${Math.round(maxDias * t)}d</text>
          `;
        })
        .join('');

      const barrasMensais = sm
        .map((m, i) => {
          const cx = xPos(i);
          const hBar = Math.max(4, (m.totalMm / maxMm) * plotH);
          const by = padT + plotH - hBar;
          return `
            <g style="cursor:pointer;" onclick="AmadeusViews.inspecionarMesChuva('${m.anoMes}')">
              <rect x="${(cx - barW / 2).toFixed(1)}" y="${by.toFixed(1)}" width="${barW.toFixed(1)}" height="${hBar.toFixed(1)}"
                rx="8" fill="url(#barOceanGrad)" />
              <text x="${cx.toFixed(1)}" y="${(by - 8).toFixed(1)}" text-anchor="middle" font-size="11" font-weight="800" fill="#0f172a">
                ${m.totalMm.toFixed(1)} mm
              </text>
              <text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="11.5" font-weight="700" fill="#475569">
                ${m.anoMes}
              </text>
            </g>
          `;
        })
        .join('');

      const pontosDias = sm
        .map((m, i) => {
          const cx = xPos(i);
          const cy = yDias(m.diasChuvosos);
          return `
            <g style="pointer-events:none;">
              <circle cx="${cx.toFixed(1)}" cy="${cy.toFixed(1)}" r="5" fill="#ffffff" stroke="#d97706" stroke-width="3" />
              <rect x="${(cx - 18).toFixed(1)}" y="${(cy + 8).toFixed(1)}" width="36" height="15" rx="6" fill="#fffbeb" stroke="#fcd34d" />
              <text x="${cx.toFixed(1)}" y="${(cy + 19).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#b45309">${m.diasChuvosos}d</text>
            </g>
          `;
        })
        .join('');

      return `
        <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; padding:0.5rem;">
          <svg viewBox="0 0 ${W} ${H}" style="width:100%; min-width:540px; height:auto; display:block;">
            <defs>
              <linearGradient id="barOceanGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stop-color="#0ea5e9" />
                <stop offset="100%" stop-color="#0369a1" />
              </linearGradient>
            </defs>
            <text x="${padL}" y="22" text-anchor="start" font-size="11" font-weight="800" fill="#0284c7">▊ VOLUME MENSAL (mm)</text>
            <text x="${W - padR}" y="22" text-anchor="end" font-size="11" font-weight="800" fill="#d97706">〰️ DIAS CHUVOSOS NO MÊS</text>
            ${gridSvg}
            ${barrasMensais}
            <path d="${curvaDias.path}" fill="none" stroke="#f59e0b" stroke-width="3" stroke-linecap="round" />
            ${pontosDias}
          </svg>
        </div>
      `;
    }

    // ========================================================================
    // MODO 4: COMPARATIVO 2025 × 2026 (SVG Moderno Lado a Lado)
    // ========================================================================
    if (modo === 'comparativo') {
      const mesesNomes = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
      const todos = core.db.chuvas;
      const comp = mesesNomes.map((nome, idx) => {
        const mesNum = String(idx + 1).padStart(2, '0');
        const r25 = todos.filter((c) => c.data.startsWith(`2025-${mesNum}`));
        const r26 = todos.filter((c) => c.data.startsWith(`2026-${mesNum}`));
        return {
          mesNum,
          nome,
          mm25: r25.reduce((s, x) => s + Number(x.mm), 0),
          cnt25: r25.length,
          mm26: r26.reduce((s, x) => s + Number(x.mm), 0),
          cnt26: r26.length
        };
      });
      const maxComp = Math.ceil((Math.max(40, ...comp.map((c) => Math.max(c.mm25, c.mm26))) * 1.15) / 25) * 25;

      const W = 960;
      const H = 330;
      const padL = 52;
      const padR = 32;
      const padT = 36;
      const padB = 44;
      const plotW = W - padL - padR;
      const plotH = H - padT - padB;
      const stepX = plotW / 12;

      return `
        <div style="display:flex; gap:1.25rem; font-size:0.8rem; margin-bottom:0.6rem; flex-wrap:wrap;">
          <span style="display:inline-flex; align-items:center; gap:0.4rem;"><span style="width:12px; height:12px; border-radius:3px; background:#0284c7; display:inline-block;"></span> <strong>2025 (Maio–Dez: 635,5 mm)</strong></span>
          <span style="display:inline-flex; align-items:center; gap:0.4rem;"><span style="width:12px; height:12px; border-radius:3px; background:#10b981; display:inline-block;"></span> <strong>2026 (Jan–Ago: 705,0 mm)</strong></span>
        </div>
        <div style="width:100%; overflow-x:auto; -webkit-overflow-scrolling:touch; border-radius:14px; border:1px solid #e2e8f0; background:#ffffff; padding:0.5rem;">
          <svg viewBox="0 0 ${W} ${H}" style="width:100%; min-width:560px; height:auto; display:block;">
            ${[0, 0.25, 0.5, 0.75, 1]
              .map((t) => {
                const y = padT + plotH * (1 - t);
                return `
                  <line x1="${padL}" y1="${y.toFixed(1)}" x2="${W - padR}" y2="${y.toFixed(1)}" stroke="${t === 0 ? '#cbd5e1' : '#f1f5f9'}" stroke-width="1.2" />
                  <text x="${padL - 8}" y="${(y + 4).toFixed(1)}" text-anchor="end" font-size="11" font-weight="700" fill="#64748b">${Math.round(maxComp * t)}</text>
                `;
              })
              .join('')}
            ${comp
              .map((c, i) => {
                const cx = padL + i * stepX + stepX / 2;
                const h25 = (c.mm25 / maxComp) * plotH;
                const h26 = (c.mm26 / maxComp) * plotH;
                const y25 = padT + plotH - h25;
                const y26 = padT + plotH - h26;
                return `
                  <g style="cursor:pointer;" onclick="AmadeusViews.mostrarComparativoMesModal('${c.mesNum}', '${c.nome}', ${c.mm25}, ${c.cnt25}, ${c.mm26}, ${c.cnt26})">
                    <rect x="${(cx - 20).toFixed(1)}" y="${y25.toFixed(1)}" width="18" height="${Math.max(2, h25).toFixed(1)}" rx="4" fill="#0284c7" />
                    <rect x="${(cx + 2).toFixed(1)}" y="${y26.toFixed(1)}" width="18" height="${Math.max(2, h26).toFixed(1)}" rx="4" fill="#10b981" />
                    ${c.mm25 > 0 ? `<text x="${(cx - 11).toFixed(1)}" y="${(y25 - 5).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#0369a1">${c.mm25.toFixed(0)}</text>` : ''}
                    ${c.mm26 > 0 ? `<text x="${(cx + 11).toFixed(1)}" y="${(y26 - 5).toFixed(1)}" text-anchor="middle" font-size="9.5" font-weight="800" fill="#059669">${c.mm26.toFixed(0)}</text>` : ''}
                    <text x="${cx.toFixed(1)}" y="${H - 14}" text-anchor="middle" font-size="11" font-weight="700" fill="#475569">${c.nome}</text>
                  </g>
                `;
              })
              .join('')}
          </svg>
        </div>
      `;
    }

    const grupos = {};
    for (const r of core.db.chuvas) {
      const chave = `${r.pluviometro} · ${r.local}`;
      if (!grupos[chave]) grupos[chave] = { chave, totalMm: 0, leituras: 0 };
      grupos[chave].totalMm += Number(r.mm) || 0;
      grupos[chave].leituras += 1;
    }
    const listaGrupos = Object.values(grupos);
    const maxG = Math.max(10, ...listaGrupos.map((g) => g.totalMm));

    return `
      <div class="chart-bars-wrap">
        ${listaGrupos
          .map((g) => {
            const hPct = Math.max(8, Math.round((g.totalMm / maxG) * 100));
            return `
              <div class="chart-bar-col" onclick="AmadeusCore.toast('${g.chave}: ${g.totalMm.toFixed(1)} mm em ${g.leituras} leituras')">
                <div class="chart-bar-val">${g.totalMm.toFixed(1)} mm (${g.leituras} leituras)</div>
                <div class="chart-bar-fill green-bar" style="height:${hPct}%; max-width:90px;"></div>
                <div class="chart-bar-label" style="transform:none;">${g.chave}</div>
              </div>
            `;
          })
          .join('')}
      </div>
    `;
  },

  setPluvFilter(campo, valor) {
    window.AmadeusCore.pluvFilters[campo] = valor;
    this.renderMainContent();
  },

  limparFiltrosPluv() {
    window.AmadeusCore.pluvFilters = {
      ano: '2026',
      mes: 'todos',
      pluviometro: 'todos',
      ultimos7Dias: false,
      somenteChuvosos: false,
      busca: '',
      modoGrafico: 'combo'
    };
    this.renderMainContent();
  },

  toggleChartFullscreen(chartId) {
    const core = window.AmadeusCore;
    core.chartFullscreenId = core.chartFullscreenId === chartId ? null : chartId;
    this.renderMainContent();
  },

  inspecionarDiaChuva(id) {
    const core = window.AmadeusCore;
    const r = core.db.chuvas.find((x) => x.id === id);
    if (!r) return;
    this.abrirModalGenerico(
      `🌧️ Detalhes da Leitura Pluviométrica — ${core.formatDateBR(r.data)}`,
      `
        <div class="kpi-grid">
          <div class="kpi-card blue">
            <div class="kpi-label">Precipitação Registrada</div>
            <div class="kpi-value">${Number(r.mm).toFixed(1)} mm</div>
            <div class="kpi-sub">${Number(r.mm) > 0 ? 'Dia com chuva' : 'Dia seco medido (0 mm)'}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">Horário da Coleta</div>
            <div class="kpi-value">${r.horario}</div>
            <div class="kpi-sub">${r.pluviometro}</div>
          </div>
        </div>
        <p><strong>Local:</strong> ${r.local}</p>
        <p><strong>Responsável no Sistema:</strong> ${r.responsavel}</p>
        <p><strong>Observação / Rastreabilidade:</strong> ${r.observacao || 'Sem observações adicionais.'}</p>
        ${
          core.isAdmin()
            ? `
          <div style="margin-top:1rem; display:flex; justify-content:flex-end; gap:0.5rem;">
            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalChuva('${r.id}')">✏️ Editar Leitura</button>
            <button class="btn btn-sm btn-danger" onclick="AmadeusViews.fecharModal(); AmadeusViews.excluirRegistroChuva('${r.id}')">🗑️ Excluir Leitura</button>
          </div>
        `
            : ''
        }
      `
    );
  },

  inspecionarMesChuva(anoMes) {
    const core = window.AmadeusCore;
    const regs = core.db.chuvas.filter((r) => r.data.startsWith(anoMes));
    const total = regs.reduce((s, r) => s + Number(r.mm), 0);
    const chuvosos = regs.filter((r) => Number(r.mm) > 0).length;

    this.abrirModalGenerico(
      `📅 Detalhamento Mensal — ${anoMes}`,
      `
        <p style="margin-bottom:0.75rem;">
          <strong>Acumulado no mês:</strong> ${total.toFixed(1)} mm &nbsp;|&nbsp;
          <strong>Leituras:</strong> ${regs.length} dias &nbsp;|&nbsp;
          <strong>Dias com chuva:</strong> ${chuvosos}
        </p>
        <div class="table-responsive" style="max-height:320px; overflow-y:auto;">
          <table class="data-table">
            <thead>
              <tr><th>Data</th><th>mm</th><th>Horário</th><th>Responsável</th><th>Observação</th></tr>
            </thead>
            <tbody>
              ${regs
                .map(
                  (r) => `
                <tr>
                  <td>${core.formatDateBR(r.data)}</td>
                  <td><strong>${Number(r.mm).toFixed(1)} mm</strong></td>
                  <td>${r.horario}</td>
                  <td>${r.responsavel}</td>
                  <td>${r.observacao || ''}</td>
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      `
    );
  },

  mostrarComparativoMesModal(mesNum, nomeMes, mm25, cnt25, mm26, cnt26) {
    const diff = mm26 - mm25;
    this.abrirModalGenerico(
      `📊 Comparação Temporal — Mês de ${nomeMes} (2025 × 2026)`,
      `
        <div class="kpi-grid">
          <div class="kpi-card blue">
            <div class="kpi-label">${nomeMes} / 2025</div>
            <div class="kpi-value">${cnt25 ? mm25.toFixed(1) + ' mm' : 'Sem registro'}</div>
            <div class="kpi-sub">${cnt25 ? cnt25 + ' leituras registradas' : 'Período de lacuna (Jan–Abr/2025)'}</div>
          </div>
          <div class="kpi-card">
            <div class="kpi-label">${nomeMes} / 2026</div>
            <div class="kpi-value">${cnt26 ? mm26.toFixed(1) + ' mm' : 'Sem registro'}</div>
            <div class="kpi-sub">${cnt26 ? cnt26 + ' leituras registradas' : 'Mês sem medições importadas'}</div>
          </div>
        </div>
        <p><strong>Diferença Absoluta (2026 − 2025):</strong> ${cnt25 && cnt26 ? (diff >= 0 ? '+' : '') + diff.toFixed(1) + ' mm' : 'Comparação parcial devido à disponibilidade de leituras no mês.'}</p>
      `
    );
  },

  abrirModalChuva(chuvaId = null) {
    const core = window.AmadeusCore;
    if (chuvaId && !core.requireAdmin('editar um registro pluviométrico já lançado')) return;
    if (!chuvaId && !core.requireCreate('registrar uma nova leitura de chuva')) return;
    const existente = chuvaId ? core.db.chuvas.find((c) => c.id === chuvaId) : null;
    const item = existente || {
      data: new Date().toISOString().slice(0, 10),
      mm: 0,
      horario: new Date().toTimeString().slice(0, 5),
      pluviometro: 'Pluviômetro 1',
      local: 'Área experimental IF Baiano',
      responsavel: core.currentUser.nome,
      observacao: ''
    };

    this.abrirModalGenerico(
      existente ? '✏️ Editar Leitura Pluviométrica (Admin)' : '➕ Registrar Precipitação Diária (mm)',
      `
        <form onsubmit="AmadeusViews.salvarChuva(event, '${existente ? existente.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Data da Medição *</label>
              <input type="date" id="ch-data" class="form-control" value="${item.data}" required />
            </div>
            <div class="form-group">
              <label>Precipitação (mm) * (Use 0 para dia sem chuva)</label>
              <input type="number" step="0.1" min="0" id="ch-mm" class="form-control" value="${item.mm}" required />
            </div>
            <div class="form-group">
              <label>Horário da Leitura *</label>
              <input type="time" id="ch-hora" class="form-control" value="${item.horario || '08:00'}" required />
            </div>
            <div class="form-group">
              <label>Pluviômetro *</label>
              <input type="text" id="ch-pluv" class="form-control" value="${item.pluviometro}" required />
            </div>
            <div class="form-group">
              <label>Local *</label>
              <input type="text" id="ch-local" class="form-control" value="${item.local}" required />
            </div>
            <div class="form-group">
              <label>Responsável *</label>
              <input type="text" id="ch-resp" class="form-control" value="${item.responsavel}" required />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Observação</label>
            <input type="text" id="ch-obs" class="form-control" value="${item.observacao || ''}" placeholder="Ex.: Coleta matinal, chuva intensa à noite..." />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Leitura Pluviométrica</button>
          </div>
        </form>
      `
    );
  },

  salvarChuva(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin('editar um registro pluviométrico')) return;
    if (!idExistente && !core.requireCreate('registrar leitura de chuva')) return;

    const dados = {
      id: idExistente || 'pluv-' + Date.now(),
      data: document.getElementById('ch-data').value,
      mm: parseFloat(document.getElementById('ch-mm').value) || 0,
      horario: document.getElementById('ch-hora').value,
      pluviometro: document.getElementById('ch-pluv').value.trim(),
      local: document.getElementById('ch-local').value.trim(),
      responsavel: document.getElementById('ch-resp').value.trim(),
      observacao: document.getElementById('ch-obs').value.trim(),
      origem: idExistente ? 'Editado por Admin' : 'Cadastro Direto AMADEUS'
    };

    if (idExistente) {
      const idx = core.db.chuvas.findIndex((c) => c.id === idExistente);
      if (idx !== -1) core.db.chuvas[idx] = dados;
    } else {
      core.db.chuvas.push(dados);
    }

    core.saveDatabase(`Salvou chuva: ${dados.data} (${dados.mm} mm)`);
    this.fecharModal();
    core.toast(`Leitura de ${dados.mm} mm (${core.formatDateBR(dados.data)}) salva com sucesso!`);
    this.renderApp();
  },

  excluirRegistroChuva(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir uma leitura pluviométrica já lançada')) return;
    const idx = core.db.chuvas.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const item = core.db.chuvas[idx];
    core.registrarExclusao('Pluviometria', item, `Chuva ${item.data} (${item.mm} mm)`);
    core.db.chuvas.splice(idx, 1);
    core.saveDatabase();
    core.toast('Registro pluviométrico excluído e arquivado no Histórico de Exclusões.');
    this.renderApp();
  },

  importarArquivoCSVChuva(file) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('importar lotes CSV')) return;
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const novos = window.AMADEUS_SEED.parseAmadeusCSV(e.target.result, 'imp-' + Date.now());
      if (!novos.length) {
        core.toast('Nenhum registro válido encontrado no CSV.', 'erro');
        return;
      }
      let adicionados = 0;
      for (const n of novos) {
        const existe = core.db.chuvas.some(
          (c) => c.data === n.data && c.pluviometro === n.pluviometro && Number(c.mm) === Number(n.mm)
        );
        if (!existe) {
          core.db.chuvas.push(n);
          adicionados++;
        }
      }
      core.saveDatabase(`Importação CSV (${adicionados} novos)`);
      core.toast(`Importação concluída: ${adicionados} novos registros adicionados (${novos.length} lidos).`);
      this.renderApp();
    };
    reader.readAsText(file);
  },

  // ==========================================================================
  // 3. GESTÃO DE ATIVIDADES RURAIS (Seção 2)
  // ==========================================================================
  viewAtividades() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const f = core.atvFilters;
    let lista = [...core.db.atividades].sort((a, b) => b.data.localeCompare(a.data));

    if (f.categoria !== 'todas') {
      lista = lista.filter((a) => a.categoria === f.categoria);
    }
    if (f.busca.trim()) {
      const q = f.busca.toLowerCase();
      lista = lista.filter(
        (a) =>
          a.titulo.toLowerCase().includes(q) ||
          (a.descricao || '').toLowerCase().includes(q) ||
          (a.local || '').toLowerCase().includes(q) ||
          (a.responsaveisNomes || []).join(' ').toLowerCase().includes(q)
      );
    }

    const totalHoras = lista.reduce((s, a) => s + (Number(a.horasTrabalhadas) || 0), 0);
    const totalAnexos = lista.reduce((s, a) => s + ((a.anexos && a.anexos.length) || 0), 0);
    const mapaPart = {};
    lista.forEach((a) => {
      const h = Number(a.horasTrabalhadas) || 0;
      (a.responsaveisNomes || []).forEach((n) => {
        if (!mapaPart[n]) mapaPart[n] = 0;
        mapaPart[n] += h;
      });
    });
    const rankingPart = Object.entries(mapaPart).sort((a, b) => b[1] - a[1]);

    return `
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Atividades</div>
          <div class="kpi-value">${lista.length}</div>
          <div class="kpi-sub">Registros consolidados no Diário de Campo</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Horas Registradas</div>
          <div class="kpi-value">${String(Number(totalHoras.toFixed(1))).replace('.', ',')} h</div>
          <div class="kpi-sub">Soma das atividades executadas</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Participantes</div>
          <div class="kpi-value">${rankingPart.length}</div>
          <div class="kpi-sub">Membros vinculados às atividades</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Anexos</div>
          <div class="kpi-value">${totalAnexos}</div>
          <div class="kpi-sub">Arquivos e registros anexados</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🚜 Diário de Campo — Relatório Consolidado de Atividades</div>
            <div style="font-size:0.78rem; color:var(--slate-500);">
              ${isAdmin ? '👑 Modo Admin: edição e exclusão liberadas para qualquer atividade lançada.' : canCreate ? '🛠️ Modo Colaborador: você pode cadastrar novas atividades; edição/exclusão restrita ao Admin.' : '👁️ Modo Leitor: visualização e exportação PDF das atividades executadas.'}
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-secondary" onclick="AmadeusCore.exportarRelatorioAtividadesConsolidadoPDF()">
              📄 Emitir PDF de Atividades
            </button>
            ${
              canCreate
                ? `<button class="btn btn-primary" onclick="AmadeusViews.abrirModalAtividade()">➕ Nova Atividade Rural</button>`
                : `<span class="status-pill">👁️ Somente Leitura</span>`
            }
          </div>
        </div>

        <div class="form-grid" style="background:var(--slate-50); padding:0.85rem; border-radius:var(--radius-md); border:1px solid var(--slate-200);">
          <div class="form-group">
            <label>Pesquisar Atividade / Local / Participante</label>
            <input type="text" class="form-control" placeholder="Buscar por serviço, descrição, local ou participante..."
              value="${f.busca}" oninput="AmadeusCore.atvFilters.busca=this.value; AmadeusViews.renderMainContent();" />
          </div>
          <div class="form-group">
            <label>Setor / Categoria</label>
            <select class="form-control" onchange="AmadeusCore.atvFilters.categoria=this.value; AmadeusViews.renderMainContent();">
              <option value="todas" ${f.categoria === 'todas' ? 'selected' : ''}>Todas as Categorias</option>
              <option value="Agricultura" ${f.categoria === 'Agricultura' ? 'selected' : ''}>Agricultura</option>
              <option value="Pecuária" ${f.categoria === 'Pecuária' ? 'selected' : ''}>Pecuária</option>
              <option value="Manutenção" ${f.categoria === 'Manutenção' ? 'selected' : ''}>Manutenção & Infraestrutura</option>
              <option value="Pesquisa" ${f.categoria === 'Pesquisa' ? 'selected' : ''}>Pesquisa & Experimentação</option>
            </select>
          </div>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data</th>
                <th>Atividade</th>
                <th>Localização</th>
                <th>Participantes</th>
                <th>Horas</th>
                <th>Registrado Por</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${lista
                .map(
                  (a) => `
                <tr>
                  <td style="white-space:nowrap;">
                    <strong>${core.formatDateBR(a.data)}</strong><br/>
                    <span style="font-size:0.74rem; color:var(--slate-500);">${a.categoria}</span>
                  </td>
                  <td>
                    <strong>${a.titulo}</strong>
                    <div style="font-size:0.8rem; color:var(--slate-600); max-width:410px;">${a.descricao}</div>
                  </td>
                  <td style="font-size:0.82rem;">📍 ${a.local}</td>
                  <td style="font-size:0.82rem;">👥 ${(a.responsaveisNomes || []).join(', ')}</td>
                  <td style="white-space:nowrap;"><strong>${String(a.horasTrabalhadas).replace('.', ',')} h</strong></td>
                  <td style="font-size:0.82rem;">${a.registradoPor || 'Guilherme Dias Pereira'}</td>
                  <td>
                    ${
                      isAdmin
                        ? `
                      <div style="display:flex; gap:0.25rem;">
                        <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalAtividade('${a.id}')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirAtividade('${a.id}')">🗑️</button>
                      </div>
                    `
                        : `<span style="font-size:0.75rem; color:var(--slate-500);">🔒 Admin</span>`
                    }
                  </td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">⏱️ Carga Horária por Participante (${rankingPart.length} participantes)</div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Participante</th>
                <th>Total no Período</th>
              </tr>
            </thead>
            <tbody>
              ${rankingPart
                .map(
                  ([nome, horas]) => `
                <tr>
                  <td><strong>${nome}</strong></td>
                  <td><strong style="color:var(--green-800);">${String(Number(horas.toFixed(1))).replace('.', ',')} h</strong></td>
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  abrirModalAtividade(atvId = null, prefill = null) {
    const core = window.AmadeusCore;
    if (atvId && !core.requireAdmin('editar uma atividade já lançada')) return;
    if (!atvId && !core.requireCreate('cadastrar uma nova atividade rural')) return;
    const existente = atvId ? core.db.atividades.find((a) => a.id === atvId) : null;
    const item = existente || prefill || {
      titulo: '',
      categoria: 'Agricultura',
      data: new Date().toISOString().slice(0, 10),
      horaInicio: '07:30',
      horaFim: '11:30',
      horasTrabalhadas: 4,
      local: 'Área experimental IF Baiano',
      status: 'Concluída',
      responsaveisIds: [core.db.pessoas[0].id],
      descricao: ''
    };

    this.abrirModalGenerico(
      existente ? '✏️ Editar Atividade Rural (Admin)' : '➕ Cadastrar Nova Atividade Rural',
      `
        <form onsubmit="AmadeusViews.salvarAtividade(event, '${existente ? existente.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Título da Atividade / Serviço *</label>
              <input type="text" id="atv-titulo" class="form-control" value="${item.titulo}" required />
            </div>
            <div class="form-group">
              <label>Setor / Categoria *</label>
              <select id="atv-cat" class="form-control">
                <option value="Agricultura" ${item.categoria === 'Agricultura' ? 'selected' : ''}>Agricultura</option>
                <option value="Pecuária" ${item.categoria === 'Pecuária' ? 'selected' : ''}>Pecuária</option>
                <option value="Manutenção" ${item.categoria === 'Manutenção' ? 'selected' : ''}>Manutenção</option>
                <option value="Pesquisa" ${item.categoria === 'Pesquisa' ? 'selected' : ''}>Pesquisa</option>
              </select>
            </div>
            <div class="form-group">
              <label>Data *</label>
              <input type="date" id="atv-data" class="form-control" value="${item.data}" required />
            </div>
            <div class="form-group">
              <label>Carga Horária (horas) *</label>
              <input type="number" step="0.5" min="0.5" id="atv-horas" class="form-control" value="${item.horasTrabalhadas || 4}" required />
            </div>
            <div class="form-group">
              <label>Hora Início</label>
              <input type="time" id="atv-ini" class="form-control" value="${item.horaInicio || '07:30'}" />
            </div>
            <div class="form-group">
              <label>Hora Término</label>
              <input type="time" id="atv-fim" class="form-control" value="${item.horaFim || '11:30'}" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0.85rem;">
            <label>Localização (Setor / Talhão / Coordenadas GPS)</label>
            <div style="display:flex; gap:0.5rem;">
              <input type="text" id="atv-local" class="form-control" style="flex:1;" value="${item.local || ''}" required />
              <button type="button" class="btn btn-secondary" onclick="AmadeusViews.capturarGPS('atv-local')">📍 Capturar GPS</button>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0.85rem;">
            <label>Associar Pessoas / Trabalhadores (Soma horas automaticamente no perfil de cada pessoa)</label>
            <div style="display:grid; grid-template-columns: repeat(auto-fill, minmax(190px, 1fr)); gap:0.35rem; background:var(--slate-50); padding:0.65rem; border-radius:var(--radius-sm); border:1px solid var(--slate-200);">
              ${core.db.pessoas
                .map(
                  (p) => `
                <label style="font-size:0.8rem; display:flex; align-items:center; gap:0.35rem; font-weight:500;">
                  <input type="checkbox" name="atv-pessoas" value="${p.id}" ${(item.responsaveisIds || []).includes(p.id) ? 'checked' : ''} />
                  ${p.nome}
                </label>
              `
                )
                .join('')}
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0.85rem;">
            <label>Descrição Detalhada do Serviço Executado *</label>
            <textarea id="atv-desc" class="form-control" rows="3" required>${item.descricao || ''}</textarea>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label>Anexar Fotografias ou Documentos</label>
            <input type="file" id="atv-anexo" class="form-control" multiple accept="image/*,.pdf,.doc,.docx" />
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Atividade</button>
          </div>
        </form>
      `
    );
  },

  capturarGPS(inputId) {
    const el = document.getElementById(inputId);
    if (!navigator.geolocation) {
      window.AmadeusCore.toast('Geolocalização não disponível neste navegador.', 'aviso');
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const coords = `${pos.coords.latitude.toFixed(5)}, ${pos.coords.longitude.toFixed(5)}`;
        if (el) el.value = `${el.value ? el.value + ' · ' : ''}GPS (${coords})`;
        window.AmadeusCore.toast(`Localização capturada: ${coords}`);
      },
      () => {
        if (el && !el.value.includes('GPS')) {
          el.value = `${el.value} · GPS (-14.22510, -41.45620)`;
        }
        window.AmadeusCore.toast('Coordenada de referência da Área Experimental inserida.');
      }
    );
  },

  async salvarAtividade(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin('editar uma atividade já lançada')) return;
    if (!idExistente && !core.requireCreate('cadastrar atividade rural')) return;

    const checks = Array.from(document.querySelectorAll('input[name="atv-pessoas"]:checked')).map((c) => c.value);
    const nomes = core.db.pessoas.filter((p) => checks.includes(p.id)).map((p) => p.nome);
    const fileInput = document.getElementById('atv-anexo');
    const anexosLidos = [];

    if (fileInput && fileInput.files.length > 0) {
      for (const f of fileInput.files) {
        anexosLidos.push({ nome: f.name, tipo: f.type, tamanho: f.size });
      }
    }

    const dados = {
      id: idExistente || 'atv-' + Date.now(),
      titulo: document.getElementById('atv-titulo').value.trim(),
      categoria: document.getElementById('atv-cat').value,
      data: document.getElementById('atv-data').value,
      horasTrabalhadas: parseFloat(document.getElementById('atv-horas').value) || 1,
      horaInicio: document.getElementById('atv-ini').value,
      horaFim: document.getElementById('atv-fim').value,
      local: document.getElementById('atv-local').value.trim(),
      responsaveisIds: checks,
      responsaveisNomes: nomes,
      descricao: document.getElementById('atv-desc').value.trim(),
      status: 'Concluída',
      anexos: anexosLidos
    };

    if (idExistente) {
      const idx = core.db.atividades.findIndex((a) => a.id === idExistente);
      if (idx !== -1) {
        dados.anexos = [...(core.db.atividades[idx].anexos || []), ...anexosLidos];
        core.db.atividades[idx] = dados;
      }
    } else {
      core.db.atividades.unshift(dados);
    }

    core.saveDatabase(`Salvou atividade: ${dados.titulo}`);
    this.fecharModal();
    core.toast('Atividade rural salva e vinculada à carga horária da equipe!');
    this.renderApp();
  },

  excluirAtividade(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir uma atividade rural já lançada')) return;
    const idx = core.db.atividades.findIndex((a) => a.id === id);
    if (idx === -1) return;
    const item = core.db.atividades[idx];
    core.registrarExclusao('Atividades', item, item.titulo);
    core.db.atividades.splice(idx, 1);
    core.saveDatabase();
    core.toast('Atividade excluída e arquivada no Histórico de Exclusões.');
    this.renderApp();
  },

  // ==========================================================================
  // 4. AGENDAMENTO, CARTÕES AMARELOS/VERDES, NOTIFICAÇÕES E CALCULADORA (Seção 3)
  // ==========================================================================
  viewAgendamento() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const lista = [...core.db.agendamentos].sort((a, b) => `${a.data} ${a.horario}`.localeCompare(`${b.data} ${b.horario}`));

    return `
      <div class="agendamento-layout-grid">
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">📅 Agendamento de Atividades e Lembretes Automáticos</div>
              <div style="font-size:0.8rem; color:var(--slate-500);">
                Cartões <strong>Amarelos</strong> (Programados/Pendentes) e <strong>Verdes</strong> (Confirmados/Concluídos) · Notificação no cadastro e lembrete 2h antes.
              </div>
            </div>
            <div style="display:flex; gap:0.4rem; flex-wrap:wrap;">
              <button class="btn btn-sm btn-secondary" onclick="AmadeusCore.solicitarPermissaoNotificacao()">🔔 Ativar Notificações</button>
              <button class="btn btn-sm btn-amber" onclick="AmadeusViews.testarDisparoLembrete2h()">⚡ Testar Lembrete 2h</button>
            </div>
          </div>

          ${
            canCreate
              ? `
          <!-- Formulário Rápido de Agendamento -->
          <form onsubmit="AmadeusViews.salvarAgendamento(event)" style="background:var(--slate-50); padding:1rem; border-radius:var(--radius-md); border:1px solid var(--slate-200); margin-bottom:1.25rem;">
            <div class="form-grid">
              <div class="form-group">
                <label>Tarefa Futura / Atividade *</label>
                <input type="text" id="ag-titulo" class="form-control" placeholder="Ex.: Vacinação do lote, Adubação de cobertura..." required />
              </div>
              <div class="form-group">
                <label>Data *</label>
                <input type="date" id="ag-data" class="form-control" value="${new Date().toISOString().slice(0, 10)}" required />
              </div>
              <div class="form-group">
                <label>Horário *</label>
                <input type="time" id="ag-hora" class="form-control" value="09:00" required />
              </div>
              <div class="form-group">
                <label>Responsável *</label>
                <select id="ag-resp" class="form-control">
                  ${core.db.pessoas.map((p) => `<option value="${p.nome}">${p.nome}</option>`).join('')}
                </select>
              </div>
              <div class="form-group">
                <label>Local / Setor *</label>
                <input type="text" id="ag-local" class="form-control" value="Área experimental IF Baiano" required />
              </div>
              <div class="form-group">
                <label>Cor do Cartão *</label>
                <select id="ag-cor" class="form-control">
                  <option value="amarelo">🟡 Cartão Amarelo (Programada / Atenção)</option>
                  <option value="verde">🟢 Cartão Verde (Confirmada / Em Dia)</option>
                </select>
              </div>
            </div>
            <div style="display:flex; gap:0.5rem; align-items:center; justify-content:space-between; flex-wrap:wrap;">
              <input type="text" id="ag-obs" class="form-control" style="flex:1;" placeholder="Observações e insumos necessários..." />
              <button type="submit" class="btn btn-primary">🔔 Agendar e Enviar Notificação</button>
            </div>
          </form>
          `
              : `
          <div class="alert-banner alert-info" style="margin-bottom:1rem;">
            <div>👁️</div>
            <div><strong>Modo Leitor:</strong> Você pode consultar os agendamentos e utilizar a calculadora ao lado. O cadastro de novos agendamentos é exclusivo para Colaboradores e Administradores.</div>
          </div>
          `
          }

          <!-- Exibição dos Cartões Coloridos (Amarelo e Verde) -->
          <div class="schedule-cards-grid">
            ${lista
              .map(
                (ag) => `
              <div class="schedule-card card-${ag.corCartao}">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.4rem;">
                  <span style="font-size:0.78rem; font-weight:800;">
                    📅 ${core.formatDateBR(ag.data)} às ${ag.horario}
                  </span>
                  <span class="role-badge" style="background:rgba(255,255,255,0.7);">
                    ${ag.corCartao === 'verde' ? '🟢 Verde · ' + ag.status : '🟡 Amarelo · ' + ag.status}
                  </span>
                </div>
                <div style="font-size:1.02rem; font-weight:800; margin-bottom:0.35rem;">${ag.titulo}</div>
                <div style="font-size:0.82rem; margin-bottom:0.35rem;">
                  📍 <strong>Local:</strong> ${ag.local}<br/>
                  👤 <strong>Responsável:</strong> ${ag.responsavel}
                </div>
                <div style="font-size:0.78rem; opacity:0.9; margin-bottom:0.65rem;">
                  ${ag.observacoes || 'Sem observações.'}
                </div>
                <div style="display:flex; justify-content:space-between; align-items:center; gap:0.4rem; border-top:1px solid rgba(0,0,0,0.1); padding-top:0.5rem;">
                  <span style="font-size:0.7rem;">
                    🔔 Cadastro: OK · ⏰ 2h: ${ag.lembrete2hEnviado ? 'Enviado' : 'Ativo'}
                  </span>
                  <div style="display:flex; gap:0.25rem;">
                    ${
                      isAdmin
                        ? `
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.alternarCorCartao('${ag.id}')" title="Alternar entre Amarelo e Verde">🎨</button>
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalEditarAgendamento('${ag.id}')" title="Editar agendamento (Admin)">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirAgendamento('${ag.id}')" title="Excluir agendamento (Admin)">🗑️</button>
                    `
                        : `<span style="font-size:0.7rem;">🔒 Admin</span>`
                    }
                  </div>
                </div>
              </div>
            `
              )
              .join('')}
          </div>
        </div>

        <!-- Calculadora Rural Integrada na Área de Agendamento (Requisito Seção 3) -->
        <div class="calc-box">
          <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem;">
            <strong style="font-size:0.92rem;">🧮 Calculadora de Agendamento</strong>
            <span style="font-size:0.72rem; color:var(--green-400);">Insumos / Área / Ração</span>
          </div>
          <div class="calc-display" id="calc-screen">${core.calcExpression}</div>
          <div class="calc-keys">
            <button class="calc-key op" onclick="AmadeusViews.calcInput('C')">C</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput('(')">(</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput(')')">)</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput('/')">÷</button>

            <button class="calc-key" onclick="AmadeusViews.calcInput('7')">7</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('8')">8</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('9')">9</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput('*')">×</button>

            <button class="calc-key" onclick="AmadeusViews.calcInput('4')">4</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('5')">5</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('6')">6</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput('-')">−</button>

            <button class="calc-key" onclick="AmadeusViews.calcInput('1')">1</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('2')">2</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('3')">3</button>
            <button class="calc-key op" onclick="AmadeusViews.calcInput('+')">+</button>

            <button class="calc-key" onclick="AmadeusViews.calcInput('0')">0</button>
            <button class="calc-key" onclick="AmadeusViews.calcInput('.')">.</button>
            <button class="calc-key eq" onclick="AmadeusViews.calcInput('=')">=</button>
          </div>
          <div style="margin-top:0.75rem; font-size:0.75rem; color:var(--slate-300);">
            <strong>Histórico de cálculos:</strong>
            <div id="calc-history" style="max-height:90px; overflow-y:auto; margin-top:0.25rem;">
              ${core.calcHistory.length ? core.calcHistory.map((h) => `<div>• ${h}</div>`).join('') : '<div>Nenhum cálculo recente.</div>'}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  abrirModalEditarAgendamento(agId) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('editar um agendamento já lançado')) return;
    const ag = core.db.agendamentos.find((x) => x.id === agId);
    if (!ag) return;

    this.abrirModalGenerico(
      '✏️ Editar Agendamento (Admin)',
      `
        <form onsubmit="AmadeusViews.salvarEdicaoAgendamento(event, '${ag.id}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Título da Tarefa *</label>
              <input type="text" id="ed-ag-titulo" class="form-control" value="${ag.titulo}" required />
            </div>
            <div class="form-group">
              <label>Data *</label>
              <input type="date" id="ed-ag-data" class="form-control" value="${ag.data}" required />
            </div>
            <div class="form-group">
              <label>Horário *</label>
              <input type="time" id="ed-ag-hora" class="form-control" value="${ag.horario}" required />
            </div>
            <div class="form-group">
              <label>Responsável *</label>
              <input type="text" id="ed-ag-resp" class="form-control" value="${ag.responsavel}" required />
            </div>
            <div class="form-group">
              <label>Local *</label>
              <input type="text" id="ed-ag-local" class="form-control" value="${ag.local}" required />
            </div>
            <div class="form-group">
              <label>Cor do Cartão *</label>
              <select id="ed-ag-cor" class="form-control">
                <option value="amarelo" ${ag.corCartao === 'amarelo' ? 'selected' : ''}>🟡 Cartão Amarelo</option>
                <option value="verde" ${ag.corCartao === 'verde' ? 'selected' : ''}>🟢 Cartão Verde</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Observações</label>
            <input type="text" id="ed-ag-obs" class="form-control" value="${ag.observacoes || ''}" />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Alterações</button>
          </div>
        </form>
      `
    );
  },

  salvarEdicaoAgendamento(e, agId) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const ag = core.db.agendamentos.find((x) => x.id === agId);
    if (!ag) return;
    ag.titulo = document.getElementById('ed-ag-titulo').value.trim();
    ag.data = document.getElementById('ed-ag-data').value;
    ag.horario = document.getElementById('ed-ag-hora').value;
    ag.responsavel = document.getElementById('ed-ag-resp').value.trim();
    ag.local = document.getElementById('ed-ag-local').value.trim();
    ag.corCartao = document.getElementById('ed-ag-cor').value;
    ag.status = ag.corCartao === 'verde' ? 'Confirmada' : 'Agendada';
    ag.observacoes = document.getElementById('ed-ag-obs').value.trim();
    core.saveDatabase(`Editou agendamento: ${ag.titulo}`);
    this.fecharModal();
    core.toast('Agendamento atualizado com sucesso!');
    this.renderApp();
  },

  calcInput(tecla) {
    const core = window.AmadeusCore;
    if (tecla === 'C') {
      core.calcExpression = '0';
    } else if (tecla === '=') {
      try {
        const limpo = core.calcExpression.replace(/[^0-9+\-*/().]/g, '');
        const resultado = Function(`"use strict"; return (${limpo})`)();
        const formatado = Number.isFinite(resultado) ? Number(resultado.toFixed(4)).toString() : 'Erro';
        core.calcHistory.unshift(`${core.calcExpression} = ${formatado}`);
        core.calcExpression = formatado;
      } catch (_) {
        core.calcExpression = 'Erro';
      }
    } else {
      if (core.calcExpression === '0' || core.calcExpression === 'Erro') {
        core.calcExpression = tecla;
      } else {
        core.calcExpression += tecla;
      }
    }
    const screen = document.getElementById('calc-screen');
    if (screen) screen.textContent = core.calcExpression;
    const hist = document.getElementById('calc-history');
    if (hist) {
      hist.innerHTML = core.calcHistory.map((h) => `<div>• ${h}</div>`).join('');
    }
  },

  salvarAgendamento(e) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireCreate('criar um novo agendamento')) return;
    const novo = {
      id: 'agd-' + Date.now(),
      titulo: document.getElementById('ag-titulo').value.trim(),
      data: document.getElementById('ag-data').value,
      horario: document.getElementById('ag-hora').value,
      responsavel: document.getElementById('ag-resp').value,
      local: document.getElementById('ag-local').value.trim(),
      corCartao: document.getElementById('ag-cor').value,
      status: document.getElementById('ag-cor').value === 'verde' ? 'Confirmada' : 'Agendada',
      notificadoCadastro: true,
      lembrete2hEnviado: false,
      observacoes: document.getElementById('ag-obs').value.trim()
    };
    core.db.agendamentos.push(novo);
    core.saveDatabase(`Agendou: ${novo.titulo}`);
    core.dispararNotificacaoSistema(
      'Novo Agendamento Registrado (AMADEUS)',
      `"${novo.titulo}" agendado para ${core.formatDateBR(novo.data)} às ${novo.horario} (${novo.responsavel}). Lembrete automático programado para 2h antes.`
    );
    this.renderApp();
  },

  alternarCorCartao(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('alterar o status de cartões agendados')) return;
    const ag = core.db.agendamentos.find((x) => x.id === id);
    if (!ag) return;
    ag.corCartao = ag.corCartao === 'amarelo' ? 'verde' : 'amarelo';
    ag.status = ag.corCartao === 'verde' ? 'Confirmada / Concluída' : 'Agendada';
    core.saveDatabase();
    this.renderApp();
  },

  testarDisparoLembrete2h() {
    const core = window.AmadeusCore;
    const prox = core.db.agendamentos[0];
    if (!prox) {
      core.toast('Nenhuma atividade agendada para testar.', 'aviso');
      return;
    }
    core.dispararNotificacaoSistema(
      '⏰ Lembrete Programado (2 Horas Antes)',
      `Atenção ${prox.responsavel}: "${prox.titulo}" está programada para ${prox.horario} em ${prox.local}.`
    );
  },

  excluirAgendamento(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir agendamentos já lançados')) return;
    const idx = core.db.agendamentos.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const item = core.db.agendamentos[idx];
    core.registrarExclusao('Agendamentos', item, item.titulo);
    core.db.agendamentos.splice(idx, 1);
    core.saveDatabase();
    core.toast('Agendamento movido para o Histórico de Exclusões.');
    this.renderApp();
  },

  // ==========================================================================
  // 5. CADASTRO E GESTÃO DE PESSOAS + BIOMETRIA (Seção 4)
  // ==========================================================================
  viewPessoas() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const db = core.db;

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">👥 Cadastro e Gestão de Pessoas & Ponto Biométrico (Agricultura e Pecuária)</div>
            <div style="font-size:0.8rem; color:var(--slate-500);">
              Acompanhamento individual de carga horária, vínculo com atividades rurais, relatórios em PDF e validação biométrica.
            </div>
          </div>
          ${
            canCreate
              ? `<button class="btn btn-primary" onclick="AmadeusViews.abrirModalPessoa()">➕ Cadastrar Pessoa</button>`
              : `<span class="status-pill">👁️ Somente Leitura</span>`
          }
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome / Trabalhador</th>
                <th>Função & Vínculo</th>
                <th>Setor</th>
                <th>Atividades</th>
                <th>Leituras Chuva</th>
                <th>Carga Horária Total</th>
                <th>Status Biométrico</th>
                <th>Ações & Relatórios</th>
              </tr>
            </thead>
            <tbody>
              ${db.pessoas
                .map((p) => {
                  const atvs = db.atividades.filter((a) => (a.responsaveisIds || []).includes(p.id));
                  const hAtv = atvs.reduce((s, a) => s + (Number(a.horasTrabalhadas) || 0), 0);
                  const hTotal = (Number(p.horasBase) || 0) + hAtv;
                  const chuvasCnt = db.chuvas.filter(
                    (c) =>
                      (c.responsavel || '').toLowerCase().includes(p.nome.toLowerCase()) ||
                      (c.observacao || '').toLowerCase().includes(p.nome.toLowerCase())
                  ).length;

                  return `
                    <tr>
                      <td>
                        <strong>${p.nome}</strong>
                        <div style="font-size:0.75rem; color:var(--slate-500);">${p.documento || ''}</div>
                      </td>
                      <td>${p.funcao}<br/><span style="font-size:0.75rem; color:var(--slate-500);">${p.vinculo}</span></td>
                      <td><span class="role-badge role-comum">${p.setor}</span></td>
                      <td>${atvs.length} serviço(s)</td>
                      <td>${chuvasCnt} leitura(s)</td>
                      <td><strong style="color:var(--green-800); font-size:0.95rem;">${hTotal.toFixed(1)} h</strong></td>
                      <td>
                        ${
                          p.biometriaCadastrada
                            ? `<span style="color:var(--green-700); font-weight:700; font-size:0.78rem;">✅ Ativa (${p.biometriaId})</span>`
                            : `<span style="color:var(--amber-600); font-weight:600; font-size:0.78rem;">⚠️ Não capturada</span>`
                        }
                      </td>
                      <td>
                        <div style="display:flex; gap:0.25rem; flex-wrap:wrap;">
                          ${
                            canCreate
                              ? `
                            <button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalBiometria('${p.id}')" title="Registrar Ponto Biométrico">
                              🖐️ Biometria
                            </button>
                          `
                              : ''
                          }
                          <button class="btn btn-sm btn-secondary" onclick="AmadeusCore.exportarRelatorioPessoaPDF('${p.id}')" title="Gerar Relatório de Horas em PDF">
                            📄 PDF
                          </button>
                          ${
                            isAdmin
                              ? `
                            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalPessoa('${p.id}')" title="Editar cadastro (Admin)">✏️</button>
                            <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirPessoa('${p.id}')" title="Excluir pessoa (Admin)">🗑️</button>
                          `
                              : ''
                          }
                        </div>
                      </td>
                    </tr>
                  `;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Log de Registros Biométricos de Agricultura e Pecuária -->
      <div class="card">
        <div class="card-header">
          <div class="card-title">🖐️ Histórico de Registros Biométricos (Agricultura e Pecuária)</div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data e Hora</th>
                <th>Trabalhador / Pessoa</th>
                <th>Setor Validado</th>
                <th>Operação</th>
                <th>Local</th>
                <th>Assinatura / Hash Biométrico</th>
                <th>Método</th>
                ${isAdmin ? '<th>Ação</th>' : ''}
              </tr>
            </thead>
            <tbody>
              ${db.registrosBiometricos
                .map(
                  (rb) => `
                <tr>
                  <td>${new Date(rb.dataHora).toLocaleString('pt-BR')}</td>
                  <td><strong>${rb.pessoaNome}</strong></td>
                  <td><span class="role-badge role-comum">${rb.setor}</span></td>
                  <td>${rb.tipo}</td>
                  <td>${rb.local}</td>
                  <td><code>${rb.hashAssinatura}</code></td>
                  <td style="font-size:0.78rem;">${rb.metodo}</td>
                  ${
                    isAdmin
                      ? `<td><button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirRegistroBiometrico('${rb.id}')">🗑️</button></td>`
                      : ''
                  }
                </tr>
              `
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  abrirModalBiometria(pessoaId) {
    const core = window.AmadeusCore;
    if (!core.requireCreate('registrar ponto biométrico')) return;
    const p = core.db.pessoas.find((x) => x.id === pessoaId);
    if (!p) return;

    this.abrirModalGenerico(
      `🖐️ Captura e Registro Biométrico — ${p.nome}`,
      `
        <div class="alert-banner alert-info">
          <div>🖐️</div>
          <div>
            <strong>Módulo Biométrico para Agricultura e Pecuária:</strong><br/>
            Valida a identidade do colaborador via autenticador biométrico do dispositivo (WebAuthn / Impressão Digital / PIN) e gera um hash criptográfico SHA-256 auditável vinculado ao registro rural.
          </div>
        </div>
        <form onsubmit="AmadeusViews.confirmarBiometriaModal(event, '${p.id}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Modalidade / Setor *</label>
              <select id="bio-setor" class="form-control">
                <option value="Agricultura">🌱 Agricultura (Campo / Irrigação / Cultivo)</option>
                <option value="Pecuária">🐄 Pecuária (Manejo / Pesagem / Trato Animal)</option>
                <option value="Agricultura e Pecuária">🚜 Agricultura e Pecuária (Integrado)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Tipo de Registro *</label>
              <select id="bio-tipo" class="form-control">
                <option value="Início de Turno / Presença no Campo">Início de Turno / Presença no Campo</option>
                <option value="Conclusão de Manejo / Pesagem">Conclusão de Manejo / Pesagem</option>
                <option value="Coleta Pluviométrica Auditada">Coleta Pluviométrica Auditada</option>
                <option value="Cadastro / Renovação de Digital Biométrica">Cadastro / Renovação de Digital Biométrica</option>
              </select>
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Local da Captura</label>
            <input type="text" id="bio-local" class="form-control" value="Área experimental IF Baiano" required />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">🖐️ Validar Biometria Agora</button>
          </div>
        </form>
      `
    );
  },

  confirmarBiometriaModal(e, pessoaId) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireCreate('registrar ponto biométrico')) return;
    const p = core.db.pessoas.find((x) => x.id === pessoaId);
    if (!p) return;
    const setor = document.getElementById('bio-setor').value;
    const tipo = document.getElementById('bio-tipo').value;
    const local = document.getElementById('bio-local').value;
    this.fecharModal();
    core.autenticarBiometriaDispositivo(p, setor, tipo, local);
  },

  abrirModalPessoa(pessoaId = null) {
    const core = window.AmadeusCore;
    if (pessoaId && !core.requireAdmin('editar o cadastro de uma pessoa')) return;
    if (!pessoaId && !core.requireCreate('cadastrar uma nova pessoa')) return;
    const existente = pessoaId ? core.db.pessoas.find((p) => p.id === pessoaId) : null;
    const item = existente || {
      nome: '',
      funcao: '',
      setor: 'Agricultura e Pecuária',
      vinculo: 'Colaborador',
      documento: '',
      horasBase: 0
    };

    this.abrirModalGenerico(
      existente ? `✏️ Editar Cadastro — ${item.nome} (Admin)` : '➕ Cadastrar Pessoa / Trabalhador na Propriedade',
      `
        <form onsubmit="AmadeusViews.salvarPessoa(event, '${existente ? existente.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Nome Completo *</label>
              <input type="text" id="pes-nome" class="form-control" value="${item.nome}" required />
            </div>
            <div class="form-group">
              <label>Função / Cargo *</label>
              <input type="text" id="pes-funcao" class="form-control" value="${item.funcao}" placeholder="Ex.: Técnico Agrícola, Bolsista..." required />
            </div>
            <div class="form-group">
              <label>Setor de Atuação *</label>
              <select id="pes-setor" class="form-control">
                <option value="Agricultura e Pecuária" ${item.setor === 'Agricultura e Pecuária' ? 'selected' : ''}>Agricultura e Pecuária</option>
                <option value="Agricultura" ${item.setor === 'Agricultura' ? 'selected' : ''}>Agricultura</option>
                <option value="Pecuária" ${item.setor === 'Pecuária' ? 'selected' : ''}>Pecuária</option>
                <option value="Pesquisa e Ensino" ${item.setor === 'Pesquisa e Ensino' ? 'selected' : ''}>Pesquisa e Ensino</option>
              </select>
            </div>
            <div class="form-group">
              <label>Vínculo *</label>
              <input type="text" id="pes-vinculo" class="form-control" value="${item.vinculo}" required />
            </div>
            <div class="form-group">
              <label>Matrícula / Documento</label>
              <input type="text" id="pes-doc" class="form-control" value="${item.documento || ''}" />
            </div>
            <div class="form-group">
              <label>Carga Horária Base Acumulada (h)</label>
              <input type="number" step="0.5" min="0" id="pes-horas" class="form-control" value="${item.horasBase || 0}" />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Pessoa</button>
          </div>
        </form>
      `
    );
  },

  salvarPessoa(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin('editar pessoa')) return;
    if (!idExistente && !core.requireCreate('cadastrar pessoa')) return;

    if (idExistente) {
      const p = core.db.pessoas.find((x) => x.id === idExistente);
      if (p) {
        p.nome = document.getElementById('pes-nome').value.trim();
        p.funcao = document.getElementById('pes-funcao').value.trim();
        p.setor = document.getElementById('pes-setor').value;
        p.vinculo = document.getElementById('pes-vinculo').value.trim();
        p.documento = document.getElementById('pes-doc').value.trim();
        p.horasBase = parseFloat(document.getElementById('pes-horas').value) || 0;
      }
    } else {
      core.db.pessoas.push({
        id: 'pes-' + Date.now(),
        nome: document.getElementById('pes-nome').value.trim(),
        funcao: document.getElementById('pes-funcao').value.trim(),
        setor: document.getElementById('pes-setor').value,
        vinculo: document.getElementById('pes-vinculo').value.trim(),
        documento: document.getElementById('pes-doc').value.trim(),
        horasBase: parseFloat(document.getElementById('pes-horas').value) || 0,
        biometriaCadastrada: false,
        biometriaId: ''
      });
    }
    core.saveDatabase('Salvou cadastro de pessoa');
    this.fecharModal();
    core.toast('Cadastro de pessoa salvo com sucesso!');
    this.renderApp();
  },

  excluirPessoa(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir uma pessoa cadastrada')) return;
    const idx = core.db.pessoas.findIndex((p) => p.id === id);
    if (idx === -1) return;
    const item = core.db.pessoas[idx];
    core.registrarExclusao('Pessoas', item, item.nome);
    core.db.pessoas.splice(idx, 1);
    core.saveDatabase();
    core.toast('Pessoa removida e enviada ao Histórico de Exclusões.');
    this.renderApp();
  },

  excluirRegistroBiometrico(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir registros biométricos')) return;
    const idx = core.db.registrosBiometricos.findIndex((r) => r.id === id);
    if (idx === -1) return;
    core.db.registrosBiometricos.splice(idx, 1);
    core.saveDatabase();
    core.toast('Registro biométrico excluído pelo Admin.');
    this.renderApp();
  },

  // ==========================================================================
  // 6. CONTROLE DE ANIMAIS E DESEMPENHO ZOOTÉCNICO (GMD) (Seção 5)
  // ==========================================================================
  viewAnimais() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const animais = core.db.animais;
    const selecionado = animais.find((a) => a.id === core.animalSelecionadoId) || animais[0];
    const m = selecionado ? core.calcularMetricasAnimal(selecionado) : null;
    const isFullscreen = core.chartFullscreenId === 'gmd-chart';

    return `
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🐄 Controle de Animais e Desempenho Zootécnico (GMD)</div>
            <div style="font-size:0.8rem; color:var(--slate-600);">
              Fórmula oficial aplicada: <strong>GMD = (peso final − peso inicial) ÷ número de dias entre pesagens</strong> (expresso em <code>kg/dia</code>).
            </div>
          </div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalAnimal()">➕ Cadastrar Animal</button>`
                : `<span class="status-pill">👁️ Somente Leitura</span>`
            }
            ${
              selecionado
                ? `
              ${
                canCreate
                  ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalPesagem('${selecionado.id}')">⚖️ Registrar Pesagem</button>`
                  : ''
              }
              <button class="btn btn-sm btn-amber" onclick="AmadeusCore.exportarFichaAnimalPDF('${selecionado.id}')">📄 Ficha Individual PDF</button>
              ${
                isAdmin
                  ? `
                <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalAnimal('${selecionado.id}')">✏️ Editar Animal</button>
                <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirAnimal('${selecionado.id}')">🗑️ Excluir Animal</button>
              `
                  : ''
              }
            `
                : ''
            }
          </div>
        </div>

        <!-- Seletor de Animais do Rebanho -->
        <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.1rem;">
          ${animais
            .map((a) => {
              const met = core.calcularMetricasAnimal(a);
              const ativo = selecionado && selecionado.id === a.id;
              return `
                <button class="btn ${ativo ? 'btn-primary' : 'btn-secondary'}"
                  onclick="AmadeusCore.animalSelecionadoId='${a.id}'; AmadeusViews.renderMainContent();">
                  🏷️ <strong>${a.brinco}</strong> · ${a.nome} (${a.especie}) — GMD: +${met.gmdGlobal.toFixed(3)} kg/d
                </button>
              `;
            })
            .join('')}
        </div>

        ${
          selecionado && m
            ? `
          <div class="kpi-grid">
            <div class="kpi-card">
              <div class="kpi-label">Animal Selecionado</div>
              <div class="kpi-value">${selecionado.brinco} · ${selecionado.nome}</div>
              <div class="kpi-sub">${selecionado.especie} (${selecionado.raca}) · ${selecionado.lote}</div>
            </div>
            <div class="kpi-card blue">
              <div class="kpi-label">Peso Inicial → Atual</div>
              <div class="kpi-value">${m.pesoInicial.toFixed(1)} → ${m.pesoAtual.toFixed(1)} kg</div>
              <div class="kpi-sub">Ganho acumulado: +${m.ganhoTotalKg.toFixed(1)} kg em ${m.diasTotais} dias</div>
            </div>
            <div class="kpi-card">
              <div class="kpi-label">GMD Global (Período Total)</div>
              <div class="kpi-value">+${m.gmdGlobal.toFixed(3)} kg/dia</div>
              <div class="kpi-sub">(${m.pesoAtual.toFixed(1)} − ${m.pesoInicial.toFixed(1)}) ÷ ${m.diasTotais} dias</div>
            </div>
            <div class="kpi-card amber">
              <div class="kpi-label">GMD Última Pesagem</div>
              <div class="kpi-value">+${m.gmdUltimoPeriodo.toFixed(3)} kg/dia</div>
              <div class="kpi-sub">Desempenho recente do lote</div>
            </div>
          </div>

          <!-- Gráfico de Evolução de Peso e GMD -->
          <div class="chart-container ${isFullscreen ? 'fullscreen' : ''}">
            <div class="card-header">
              <div class="card-title">📈 Curva de Evolução de Peso (kg) e GMD — ${selecionado.brinco} (${selecionado.nome})</div>
              <button class="btn btn-sm btn-amber" onclick="AmadeusViews.toggleChartFullscreen('gmd-chart')">
                ${isFullscreen ? '🗗 Sair da Tela Cheia' : '⛶ Expandir Gráfico'}
              </button>
            </div>
            <div class="chart-bars-wrap">
              ${m.historicoDetalhado
                .map((p, i) => {
                  const maxPeso = Math.max(50, ...m.historicoDetalhado.map((x) => x.peso));
                  const hPct = Math.max(15, Math.round((p.peso / maxPeso) * 100));
                  return `
                    <div class="chart-bar-col" onclick="AmadeusCore.toast('${core.formatDateBR(p.data)}: ${p.peso.toFixed(1)} kg | GMD: +${p.gmdPeriodo.toFixed(3)} kg/dia')">
                      <div class="chart-bar-val">${p.peso.toFixed(1)} kg ${i > 0 ? `(GMD: +${p.gmdPeriodo.toFixed(3)})` : '(Inicial)'}</div>
                      <div class="chart-bar-fill green-bar" style="height:${hPct}%; max-width:65px;"></div>
                      <div class="chart-bar-label" style="transform:none;">${core.formatDateBR(p.data)}</div>
                    </div>
                  `;
                })
                .join('')}
            </div>
          </div>

          <!-- Tabela de Pesagens do Animal -->
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Ordem</th>
                  <th>Data da Pesagem</th>
                  <th>Peso (kg)</th>
                  <th>Dias entre Pesagens</th>
                  <th>Ganho no Intervalo</th>
                  <th>GMD no Período (kg/dia)</th>
                  <th>GMD Acumulado (kg/dia)</th>
                  <th>Observação de Manejo</th>
                  ${isAdmin ? '<th>Ações (Admin)</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${m.historicoDetalhado
                  .map(
                    (p, idx) => `
                  <tr>
                    <td>${idx + 1}ª pesagem</td>
                    <td><strong>${core.formatDateBR(p.data)}</strong></td>
                    <td><strong>${p.peso.toFixed(1)} kg</strong></td>
                    <td>${idx === 0 ? '—' : p.diasPeriodo + ' dias'}</td>
                    <td>${idx === 0 ? '—' : '+' + p.ganhoPeriodo.toFixed(1) + ' kg'}</td>
                    <td><strong style="color:var(--green-800);">${idx === 0 ? 'Base inicial' : p.gmdPeriodo.toFixed(3) + ' kg/dia'}</strong></td>
                    <td>${idx === 0 ? '—' : p.gmdAcumulado.toFixed(3) + ' kg/dia'}</td>
                    <td>${p.observacao || ''}</td>
                    ${
                      isAdmin
                        ? `
                      <td>
                        <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalPesagem('${selecionado.id}', '${p.id}')" title="Editar pesagem">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirPesagem('${selecionado.id}', '${p.id}')" title="Excluir pesagem">🗑️</button>
                      </td>
                    `
                        : ''
                    }
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
            : ''
        }
      </div>
    `;
  },

  abrirModalAnimal(animalId = null) {
    const core = window.AmadeusCore;
    if (animalId && !core.requireAdmin('editar os dados de um animal já cadastrado')) return;
    if (!animalId && !core.requireCreate('cadastrar um novo animal')) return;
    const existente = animalId ? core.db.animais.find((a) => a.id === animalId) : null;
    const hoje = new Date().toISOString().slice(0, 10);
    const item = existente || {
      brinco: '',
      nome: '',
      especie: 'Bovino',
      raca: 'Nelore / Mestiço',
      sexo: 'Macho',
      lote: 'Lote Experimental 01',
      observacoes: ''
    };

    this.abrirModalGenerico(
      existente ? `✏️ Editar Animal — ${item.brinco} (Admin)` : '➕ Cadastrar Animal no Controle Zootécnico',
      `
        <form onsubmit="AmadeusViews.salvarAnimal(event, '${existente ? existente.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Brinco / Identificação *</label>
              <input type="text" id="ani-brinco" class="form-control" value="${item.brinco}" placeholder="Ex.: BR-105" required />
            </div>
            <div class="form-group">
              <label>Nome do Animal *</label>
              <input type="text" id="ani-nome" class="form-control" value="${item.nome}" required />
            </div>
            <div class="form-group">
              <label>Espécie *</label>
              <select id="ani-esp" class="form-control">
                <option value="Bovino" ${item.especie === 'Bovino' ? 'selected' : ''}>Bovino</option>
                <option value="Ovino" ${item.especie === 'Ovino' ? 'selected' : ''}>Ovino</option>
                <option value="Caprino" ${item.especie === 'Caprino' ? 'selected' : ''}>Caprino</option>
                <option value="Suíno" ${item.especie === 'Suíno' ? 'selected' : ''}>Suíno</option>
              </select>
            </div>
            <div class="form-group">
              <label>Raça *</label>
              <input type="text" id="ani-raca" class="form-control" value="${item.raca}" required />
            </div>
            <div class="form-group">
              <label>Sexo</label>
              <select id="ani-sexo" class="form-control">
                <option value="Macho" ${item.sexo === 'Macho' ? 'selected' : ''}>Macho</option>
                <option value="Fêmea" ${item.sexo === 'Fêmea' ? 'selected' : ''}>Fêmea</option>
              </select>
            </div>
            <div class="form-group">
              <label>Lote / Piquete *</label>
              <input type="text" id="ani-lote" class="form-control" value="${item.lote}" required />
            </div>
            ${
              !existente
                ? `
              <div class="form-group">
                <label>Data da 1ª Pesagem *</label>
                <input type="date" id="ani-dtpeso" class="form-control" value="${hoje}" required />
              </div>
              <div class="form-group">
                <label>Peso Inicial (kg) *</label>
                <input type="number" step="0.1" min="1" id="ani-peso" class="form-control" value="250" required />
              </div>
            `
                : ''
            }
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Animal</button>
          </div>
        </form>
      `
    );
  },

  salvarAnimal(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin('editar animal')) return;
    if (!idExistente && !core.requireCreate('cadastrar animal')) return;

    if (idExistente) {
      const a = core.db.animais.find((x) => x.id === idExistente);
      if (a) {
        a.brinco = document.getElementById('ani-brinco').value.trim();
        a.nome = document.getElementById('ani-nome').value.trim();
        a.especie = document.getElementById('ani-esp').value;
        a.raca = document.getElementById('ani-raca').value.trim();
        a.sexo = document.getElementById('ani-sexo').value;
        a.lote = document.getElementById('ani-lote').value.trim();
      }
    } else {
      const id = 'ani-' + Date.now();
      core.db.animais.push({
        id,
        brinco: document.getElementById('ani-brinco').value.trim(),
        nome: document.getElementById('ani-nome').value.trim(),
        especie: document.getElementById('ani-esp').value,
        raca: document.getElementById('ani-raca').value.trim(),
        sexo: document.getElementById('ani-sexo').value,
        dataNascimento: '2025-01-10',
        lote: document.getElementById('ani-lote').value.trim(),
        status: 'Ativo',
        observacoes: 'Cadastrado no AMADEUS',
        pesagens: [
          {
            id: 'p-' + Date.now(),
            data: document.getElementById('ani-dtpeso').value,
            peso: parseFloat(document.getElementById('ani-peso').value) || 100,
            observacao: 'Pesagem inicial de entrada'
          }
        ]
      });
      core.animalSelecionadoId = id;
    }

    core.saveDatabase('Salvou animal');
    this.fecharModal();
    core.toast('Dados do animal salvos com sucesso!');
    this.renderApp();
  },

  excluirAnimal(animalId) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir um animal do rebanho')) return;
    const idx = core.db.animais.findIndex((a) => a.id === animalId);
    if (idx === -1) return;
    const item = core.db.animais[idx];
    core.registrarExclusao('Animais', item, `${item.brinco} (${item.nome})`);
    core.db.animais.splice(idx, 1);
    core.animalSelecionadoId = core.db.animais[0]?.id || null;
    core.saveDatabase();
    core.toast('Animal excluído e enviado ao Histórico de Exclusões.');
    this.renderApp();
  },

  abrirModalPesagem(animalId, pesagemId = null) {
    const core = window.AmadeusCore;
    if (pesagemId && !core.requireAdmin('editar uma pesagem já lançada')) return;
    if (!pesagemId && !core.requireCreate('registrar uma nova pesagem')) return;
    const animal = core.db.animais.find((a) => a.id === animalId);
    if (!animal) return;
    const existente = pesagemId ? animal.pesagens.find((p) => p.id === pesagemId) : null;
    const item = existente || {
      data: new Date().toISOString().slice(0, 10),
      peso: '',
      observacao: ''
    };

    this.abrirModalGenerico(
      existente
        ? `✏️ Editar Pesagem — ${animal.brinco} (${animal.nome})`
        : `⚖️ Registrar Nova Pesagem — ${animal.brinco} (${animal.nome})`,
      `
        <form onsubmit="AmadeusViews.salvarPesagem(event, '${animal.id}', '${existente ? existente.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Data da Pesagem *</label>
              <input type="date" id="pesag-data" class="form-control" value="${item.data}" required />
            </div>
            <div class="form-group">
              <label>Peso Medido (kg) *</label>
              <input type="number" step="0.1" min="1" id="pesag-peso" class="form-control" value="${item.peso}" required />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Observação Nutricional / Sanitária</label>
            <input type="text" id="pesag-obs" class="form-control" value="${item.observacao || ''}" placeholder="Ex.: Suplementação mineral, vermifugação..." />
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">⚖️ Salvar Pesagem e Recalcular GMD</button>
          </div>
        </form>
      `
    );
  },

  salvarPesagem(e, animalId, pesagemId) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (pesagemId && !core.requireAdmin('editar pesagem')) return;
    if (!pesagemId && !core.requireCreate('registrar pesagem')) return;
    const animal = core.db.animais.find((a) => a.id === animalId);
    if (!animal) return;

    if (pesagemId) {
      const p = animal.pesagens.find((x) => x.id === pesagemId);
      if (p) {
        p.data = document.getElementById('pesag-data').value;
        p.peso = parseFloat(document.getElementById('pesag-peso').value) || 0;
        p.observacao = document.getElementById('pesag-obs').value.trim();
      }
    } else {
      animal.pesagens.push({
        id: 'p-' + Date.now(),
        data: document.getElementById('pesag-data').value,
        peso: parseFloat(document.getElementById('pesag-peso').value) || 0,
        observacao: document.getElementById('pesag-obs').value.trim()
      });
    }
    core.saveDatabase(`Pesagem animal ${animal.brinco}`);
    this.fecharModal();
    const m = core.calcularMetricasAnimal(animal);
    core.toast(`Pesagem salva! GMD Global atualizado: +${m.gmdGlobal.toFixed(3)} kg/dia.`);
    this.renderApp();
  },

  excluirPesagem(animalId, pesagemId) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir uma pesagem já lançada')) return;
    const animal = core.db.animais.find((a) => a.id === animalId);
    if (!animal) return;
    animal.pesagens = animal.pesagens.filter((p) => p.id !== pesagemId);
    core.saveDatabase();
    core.toast('Pesagem excluída e GMD recalculado.');
    this.renderApp();
  },

  // ==========================================================================
  // 7. MÓDULO DE ANOTAÇÕES COM ISOLAMENTO DE PRIVACIDADE (Seção 7)
  // ==========================================================================
  viewAnotacoes() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const rascunho = core.getNoteDraft() || {
      titulo: '',
      categoria: 'Campo',
      conteudo: '',
      localizacao: 'Área experimental IF Baiano',
      privada: true,
      fixada: false
    };
    let notas = core.getVisibleNotesForCurrentUser();
    const q = core.noteFilters.busca.toLowerCase().trim();
    if (q) {
      notas = notas.filter(
        (n) =>
          n.titulo.toLowerCase().includes(q) ||
          (n.conteudoVisivel || '').toLowerCase().includes(q) ||
          (n.categoria || '').toLowerCase().includes(q)
      );
    }

    return `
      <div class="alert-banner alert-info">
        <div>🔒</div>
        <div>
          <strong>Privacidade Auditada e Salvamento Automático de Rascunho:</strong>
          Suas anotações são <strong>privadas por padrão</strong> e armazenadas com isolamento por autor — <strong>nem mesmo o perfil Administrador tem acesso às notas privadas de outros usuários</strong>. Somente notas marcadas como "Compartilhada" ficam visíveis para a equipe.
        </div>
      </div>

      ${
        canCreate
          ? `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📝 Criar Nova Anotação (Rascunho Automático Ativo)</div>
          <span id="draft-save-indicator" style="font-size:0.76rem; color:var(--green-700); font-weight:600;">
            ${rascunho.salvoEm ? `Rascunho recuperado automaticamente (${rascunho.salvoEm})` : 'Salvamento automático no dispositivo ativado'}
          </span>
        </div>

        <form onsubmit="AmadeusViews.salvarAnotacao(event)">
          <div class="form-grid">
            <div class="form-group">
              <label>Título da Anotação *</label>
              <input type="text" id="not-titulo" class="form-control" value="${rascunho.titulo || ''}"
                oninput="AmadeusViews.atualizarRascunhoNota()" placeholder="Ex.: Observação de praga no talhão, lembrete rápido..." required />
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <select id="not-cat" class="form-control" onchange="AmadeusViews.atualizarRascunhoNota()">
                <option value="Campo" ${rascunho.categoria === 'Campo' ? 'selected' : ''}>Campo</option>
                <option value="Pesquisa" ${rascunho.categoria === 'Pesquisa' ? 'selected' : ''}>Pesquisa</option>
                <option value="Pecuária" ${rascunho.categoria === 'Pecuária' ? 'selected' : ''}>Pecuária</option>
                <option value="Agricultura" ${rascunho.categoria === 'Agricultura' ? 'selected' : ''}>Agricultura</option>
                <option value="Urgente" ${rascunho.categoria === 'Urgente' ? 'selected' : ''}>Urgente</option>
              </select>
            </div>
            <div class="form-group">
              <label>Localização</label>
              <div style="display:flex; gap:0.4rem;">
                <input type="text" id="not-local" class="form-control" value="${rascunho.localizacao || ''}"
                  oninput="AmadeusViews.atualizarRascunhoNota()" />
                <button type="button" class="btn btn-sm btn-secondary" onclick="AmadeusViews.capturarGPS('not-local')">📍</button>
              </div>
            </div>
            <div class="form-group">
              <label>Privacidade / Compartilhamento</label>
              <select id="not-priv" class="form-control" onchange="AmadeusViews.atualizarRascunhoNota()">
                <option value="privada" ${rascunho.privada !== false ? 'selected' : ''}>🔒 Privada (Padrão · Somente Eu)</option>
                <option value="compartilhada" ${rascunho.privada === false ? 'selected' : ''}>🌐 Compartilhada Opcionalmente com Equipe</option>
              </select>
            </div>
          </div>

          <div class="form-group" style="margin-bottom:0.75rem;">
            <label>Conteúdo da Nota *</label>
            <textarea id="not-conteudo" class="form-control" rows="3"
              oninput="AmadeusViews.atualizarRascunhoNota()" placeholder="Digite sua anotação (salva automaticamente enquanto você digita no celular)..." required>${rascunho.conteudo || ''}</textarea>
          </div>

          <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.5rem;">
            <label style="font-size:0.84rem; display:flex; align-items:center; gap:0.4rem;">
              <input type="checkbox" id="not-fixada" ${rascunho.fixada ? 'checked' : ''} onchange="AmadeusViews.atualizarRascunhoNota()" />
              📌 Fixar esta nota no topo como importante
            </label>
            <div style="display:flex; gap:0.5rem;">
              <button type="button" class="btn btn-secondary" onclick="AmadeusCore.clearNoteDraft(); AmadeusViews.renderMainContent();">Limpar Rascunho</button>
              <button type="submit" class="btn btn-primary">💾 Salvar Anotação</button>
            </div>
          </div>
        </form>
      </div>
      `
          : ''
      }

      <div class="card">
        <div class="card-header">
          <div class="card-title">🗂️ Suas Anotações e Notas Compartilhadas (${notas.length})</div>
          <input type="text" class="form-control" style="max-width:280px;" placeholder="Pesquisar anotações..."
            value="${core.noteFilters.busca}" oninput="AmadeusCore.noteFilters.busca=this.value; AmadeusViews.renderMainContent();" />
        </div>

        <div class="schedule-cards-grid">
          ${notas
            .map((n) => {
              const podeGerenciar = isAdmin || (canCreate && n.autorId === core.currentUser.id);
              return `
                <div class="card" style="margin-bottom:0; border-left:5px solid ${n.fixada ? '#f59e0b' : '#166534'};">
                  <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.35rem;">
                    <span>
                      ${n.fixada ? '📌 <strong>FIXADA</strong> · ' : ''}
                      <span class="role-badge role-comum">${n.categoria}</span>
                    </span>
                    <span>${n.privada ? '🔒 Privada (' + n.autorNome + ')' : '🌐 Compartilhada (' + n.autorNome + ')'}</span>
                  </div>
                  <div style="font-weight:800; font-size:1rem; margin-bottom:0.35rem;">${n.titulo}</div>
                  <p style="font-size:0.86rem; color:var(--slate-700); margin-bottom:0.65rem; white-space:pre-wrap;">${n.conteudoVisivel}</p>
                  <div style="font-size:0.75rem; color:var(--slate-500); margin-bottom:0.65rem;">
                    📍 ${n.localizacao || 'Sem local'}
                  </div>
                  <div style="display:flex; gap:0.35rem; flex-wrap:wrap; border-top:1px solid var(--slate-200); padding-top:0.55rem;">
                    ${
                      canCreate
                        ? `
                      <button class="btn btn-sm btn-primary" onclick="AmadeusViews.converterNotaEmAtividade('${n.id}')">
                        🚜 Converter em Atividade
                      </button>
                    `
                        : ''
                    }
                    ${
                      podeGerenciar
                        ? `
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalEditarNota('${n.id}')">✏️ Editar</button>
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.alternarFixarNota('${n.id}')">📌</button>
                      <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirNota('${n.id}')">🗑️</button>
                    `
                        : ''
                    }
                  </div>
                </div>
              `;
            })
            .join('')}
        </div>
      </div>
    `;
  },

  abrirModalEditarNota(notaId) {
    const core = window.AmadeusCore;
    const visiveis = core.getVisibleNotesForCurrentUser();
    const n = visiveis.find((x) => x.id === notaId);
    if (!n) return;
    if (n.autorId !== core.currentUser.id && !core.requireAdmin('editar anotação compartilhada')) return;

    this.abrirModalGenerico(
      '✏️ Editar Anotação',
      `
        <form onsubmit="AmadeusViews.salvarEdicaoNota(event, '${n.id}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Título *</label>
              <input type="text" id="ed-not-titulo" class="form-control" value="${n.titulo}" required />
            </div>
            <div class="form-group">
              <label>Categoria</label>
              <input type="text" id="ed-not-cat" class="form-control" value="${n.categoria}" required />
            </div>
            <div class="form-group">
              <label>Localização</label>
              <input type="text" id="ed-not-local" class="form-control" value="${n.localizacao || ''}" />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Conteúdo *</label>
            <textarea id="ed-not-conteudo" class="form-control" rows="4" required>${n.conteudoVisivel}</textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Alterações</button>
          </div>
        </form>
      `
    );
  },

  salvarEdicaoNota(e, notaId) {
    e.preventDefault();
    const core = window.AmadeusCore;
    const n = core.db.anotacoes.find((x) => x.id === notaId);
    if (!n) return;
    const novoTexto = document.getElementById('ed-not-conteudo').value.trim();
    n.titulo = document.getElementById('ed-not-titulo').value.trim();
    n.categoria = document.getElementById('ed-not-cat').value.trim();
    n.localizacao = document.getElementById('ed-not-local').value.trim();
    n.conteudo = n.privada ? core.encodePrivateContent(novoTexto, n.autorId) : novoTexto;
    n.dataAtualizacao = new Date().toISOString();
    core.saveDatabase('Editou anotação');
    this.fecharModal();
    core.toast('Anotação atualizada!');
    this.renderApp();
  },

  atualizarRascunhoNota() {
    window.AmadeusCore.saveNoteDraft({
      titulo: document.getElementById('not-titulo')?.value || '',
      categoria: document.getElementById('not-cat')?.value || 'Campo',
      localizacao: document.getElementById('not-local')?.value || '',
      privada: document.getElementById('not-priv')?.value !== 'compartilhada',
      conteudo: document.getElementById('not-conteudo')?.value || '',
      fixada: Boolean(document.getElementById('not-fixada')?.checked)
    });
  },

  salvarAnotacao(e) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireCreate('criar uma anotação')) return;
    const isPrivada = document.getElementById('not-priv').value === 'privada';
    const rawConteudo = document.getElementById('not-conteudo').value.trim();
    const uid = core.currentUser.id;

    const nova = {
      id: 'not-' + Date.now(),
      titulo: document.getElementById('not-titulo').value.trim(),
      categoria: document.getElementById('not-cat').value,
      localizacao: document.getElementById('not-local').value.trim(),
      privada: isPrivada,
      fixada: document.getElementById('not-fixada').checked,
      autorId: uid,
      autorNome: core.currentUser.nome,
      conteudo: isPrivada ? core.encodePrivateContent(rawConteudo, uid) : rawConteudo,
      dataCriacao: new Date().toISOString(),
      dataAtualizacao: new Date().toISOString(),
      anexos: []
    };

    core.db.anotacoes.unshift(nova);
    core.clearNoteDraft();
    core.saveDatabase('Criou anotação');
    core.toast(isPrivada ? 'Anotação privada salva com isolamento criptográfico!' : 'Anotação compartilhada salva!');
    this.renderApp();
  },

  converterNotaEmAtividade(notaId) {
    const core = window.AmadeusCore;
    if (!core.requireCreate('converter nota em atividade')) return;
    const notas = core.getVisibleNotesForCurrentUser();
    const n = notas.find((x) => x.id === notaId);
    if (!n) return;
    core.activeTab = 'atividades';
    this.renderApp();
    this.abrirModalAtividade(null, {
      titulo: n.titulo,
      categoria: n.categoria === 'Pecuária' ? 'Pecuária' : 'Agricultura',
      data: new Date().toISOString().slice(0, 10),
      horasTrabalhadas: 2,
      local: n.localizacao || 'Área experimental IF Baiano',
      responsaveisIds: [core.db.pessoas[0].id],
      descricao: `[Convertida da Anotação] ${n.conteudoVisivel}`
    });
  },

  alternarFixarNota(notaId) {
    const core = window.AmadeusCore;
    const n = core.db.anotacoes.find((x) => x.id === notaId);
    if (!n) return;
    n.fixada = !n.fixada;
    core.saveDatabase();
    this.renderApp();
  },

  excluirNota(notaId) {
    const core = window.AmadeusCore;
    const idx = core.db.anotacoes.findIndex((x) => x.id === notaId);
    if (idx === -1) return;
    const item = core.db.anotacoes[idx];
    if (item.autorId !== core.currentUser.id && !core.requireAdmin('excluir anotação')) return;
    core.registrarExclusao('Anotações', item, item.titulo);
    core.db.anotacoes.splice(idx, 1);
    core.saveDatabase();
    core.toast('Anotação movida para o Histórico de Exclusões.');
    this.renderApp();
  },

  // ==========================================================================
  // 8. PRODUÇÃO RURAL, ESTOQUE E FINANCEIRO (Seção 14)
  // ==========================================================================
  viewProducaoEstoqueFinanceiro() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const pef = core.db.producaoEstoqueFinanceiro;
    const receitas = pef.financeiro.filter((f) => f.tipo === 'Receita').reduce((s, f) => s + Number(f.valor), 0);
    const despesas = pef.financeiro.filter((f) => f.tipo === 'Despesa').reduce((s, f) => s + Number(f.valor), 0);
    const saldo = receitas - despesas;

    return `
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Receitas Registradas</div>
          <div class="kpi-value">R$ ${receitas.toFixed(2)}</div>
          <div class="kpi-sub">Entradas e repasses de projetos</div>
        </div>
        <div class="kpi-card red">
          <div class="kpi-label">Despesas e Custos</div>
          <div class="kpi-value">R$ ${despesas.toFixed(2)}</div>
          <div class="kpi-sub">Insumos, manutenção e manejo</div>
        </div>
        <div class="kpi-card blue">
          <div class="kpi-label">Saldo Operacional</div>
          <div class="kpi-value">R$ ${saldo.toFixed(2)}</div>
          <div class="kpi-sub">Balanço financeiro da unidade</div>
        </div>
        <div class="kpi-card amber">
          <div class="kpi-label">Itens em Estoque</div>
          <div class="kpi-value">${pef.estoque.length} insumos</div>
          <div class="kpi-sub">${pef.producao.length} safras/culturas ativas</div>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">🌾 Produção Rural e Experimentos de Safra</div>
          ${
            canCreate
              ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalProducao()">➕ Registrar Produção</button>`
              : `<span class="status-pill">👁️ Somente Leitura</span>`
          }
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr><th>Cultura / Produção</th><th>Área</th><th>Safra</th><th>Volume / Estimativa</th><th>Status</th><th>Responsável</th>${isAdmin ? '<th>Ações (Admin)</th>' : ''}</tr>
            </thead>
            <tbody>
              ${pef.producao
                .map(
                  (p) => `
                <tr>
                  <td><strong>${p.cultura}</strong></td>
                  <td>${p.area}</td>
                  <td>${p.safra}</td>
                  <td><strong>${p.quantidade}</strong></td>
                  <td><span class="role-badge role-comum">${p.status}</span></td>
                  <td>${p.responsavel}</td>
                  ${
                    isAdmin
                      ? `
                    <td>
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalProducao('${p.id}')">✏️</button>
                      <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirProducao('${p.id}')">🗑️</button>
                    </td>
                  `
                      : ''
                  }
                </tr>`
                )
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <div class="responsive-grid-2">
        <div class="card">
          <div class="card-header">
            <div class="card-title">📦 Controle de Estoque de Insumos</div>
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalEstoque()">➕ Novo Item</button>`
                : ''
            }
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Insumo</th><th>Categoria</th><th>Saldo</th><th>Local</th>${isAdmin ? '<th>Ações</th>' : ''}</tr>
              </thead>
              <tbody>
                ${pef.estoque
                  .map(
                    (e) => `
                  <tr>
                    <td><strong>${e.item}</strong></td>
                    <td>${e.categoria}</td>
                    <td><strong>${e.quantidade} ${e.unidade}</strong></td>
                    <td>${e.local}</td>
                    ${
                      isAdmin
                        ? `
                      <td>
                        <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalEstoque('${e.id}')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirEstoque('${e.id}')">🗑️</button>
                      </td>
                    `
                        : ''
                    }
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>

        <div class="card">
          <div class="card-header">
            <div class="card-title">💰 Despesas e Receitas Rurais</div>
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalFinanceiro()">➕ Lançar Valor</button>`
                : ''
            }
          </div>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr><th>Data</th><th>Tipo</th><th>Descrição</th><th>Valor</th>${isAdmin ? '<th>Ações</th>' : ''}</tr>
              </thead>
              <tbody>
                ${pef.financeiro
                  .map(
                    (f) => `
                  <tr>
                    <td>${core.formatDateBR(f.data)}</td>
                    <td><span class="role-badge ${f.tipo === 'Receita' ? 'role-comum' : 'role-admin'}">${f.tipo}</span></td>
                    <td>${f.descricao}</td>
                    <td><strong>R$ ${Number(f.valor).toFixed(2)}</strong></td>
                    ${
                      isAdmin
                        ? `
                      <td>
                        <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalFinanceiro('${f.id}')">✏️</button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirFinanceiro('${f.id}')">🗑️</button>
                      </td>
                    `
                        : ''
                    }
                  </tr>`
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    `;
  },

  abrirModalProducao(id = null) {
    const core = window.AmadeusCore;
    if (id && !core.requireAdmin('editar produção já lançada')) return;
    if (!id && !core.requireCreate('registrar produção rural')) return;
    const ex = id ? core.db.producaoEstoqueFinanceiro.producao.find((x) => x.id === id) : null;
    const item = ex || { cultura: '', area: '', safra: '2026', quantidade: '', status: 'Em andamento' };
    this.abrirModalGenerico(
      ex ? '✏️ Editar Produção Rural (Admin)' : '➕ Registrar Produção Rural / Safra',
      `
        <form onsubmit="AmadeusViews.salvarProducao(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group"><label>Cultura / Produto *</label><input type="text" id="pr-cult" class="form-control" value="${item.cultura}" required /></div>
            <div class="form-group"><label>Área Plantada *</label><input type="text" id="pr-area" class="form-control" value="${item.area}" placeholder="Ex.: 1,5 ha" required /></div>
            <div class="form-group"><label>Safra *</label><input type="text" id="pr-safra" class="form-control" value="${item.safra}" required /></div>
            <div class="form-group"><label>Quantidade / Rendimento *</label><input type="text" id="pr-qtd" class="form-control" value="${item.quantidade}" required /></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar</button>
          </div>
        </form>
      `
    );
  },

  salvarProducao(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin()) return;
    if (!idExistente && !core.requireCreate()) return;
    const lista = core.db.producaoEstoqueFinanceiro.producao;
    if (idExistente) {
      const p = lista.find((x) => x.id === idExistente);
      if (p) {
        p.cultura = document.getElementById('pr-cult').value.trim();
        p.area = document.getElementById('pr-area').value.trim();
        p.safra = document.getElementById('pr-safra').value.trim();
        p.quantidade = document.getElementById('pr-qtd').value.trim();
      }
    } else {
      lista.push({
        id: 'prod-' + Date.now(),
        cultura: document.getElementById('pr-cult').value.trim(),
        area: document.getElementById('pr-area').value.trim(),
        safra: document.getElementById('pr-safra').value.trim(),
        quantidade: document.getElementById('pr-qtd').value.trim(),
        status: 'Em andamento',
        responsavel: core.currentUser.nome
      });
    }
    core.saveDatabase();
    this.fecharModal();
    this.renderApp();
  },

  excluirProducao(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir produção lançada')) return;
    core.db.producaoEstoqueFinanceiro.producao = core.db.producaoEstoqueFinanceiro.producao.filter((x) => x.id !== id);
    core.saveDatabase();
    core.toast('Registro de produção excluído.');
    this.renderApp();
  },

  abrirModalEstoque(id = null) {
    const core = window.AmadeusCore;
    if (id && !core.requireAdmin('editar item de estoque')) return;
    if (!id && !core.requireCreate('adicionar item ao estoque')) return;
    const ex = id ? core.db.producaoEstoqueFinanceiro.estoque.find((x) => x.id === id) : null;
    const item = ex || { item: '', categoria: 'Insumos', quantidade: 1, unidade: 'kg' };
    this.abrirModalGenerico(
      ex ? '✏️ Editar Item de Estoque (Admin)' : '➕ Adicionar Item ao Estoque',
      `
        <form onsubmit="AmadeusViews.salvarEstoque(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group"><label>Item / Insumo *</label><input type="text" id="es-item" class="form-control" value="${item.item}" required /></div>
            <div class="form-group"><label>Categoria *</label><input type="text" id="es-cat" class="form-control" value="${item.categoria}" required /></div>
            <div class="form-group"><label>Quantidade *</label><input type="number" step="0.1" id="es-qtd" class="form-control" value="${item.quantidade}" required /></div>
            <div class="form-group"><label>Unidade *</label><input type="text" id="es-und" class="form-control" value="${item.unidade}" required /></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar</button>
          </div>
        </form>
      `
    );
  },

  salvarEstoque(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin()) return;
    if (!idExistente && !core.requireCreate()) return;
    const lista = core.db.producaoEstoqueFinanceiro.estoque;
    if (idExistente) {
      const it = lista.find((x) => x.id === idExistente);
      if (it) {
        it.item = document.getElementById('es-item').value.trim();
        it.categoria = document.getElementById('es-cat').value.trim();
        it.quantidade = parseFloat(document.getElementById('es-qtd').value) || 0;
        it.unidade = document.getElementById('es-und').value.trim();
      }
    } else {
      lista.push({
        id: 'est-' + Date.now(),
        item: document.getElementById('es-item').value.trim(),
        categoria: document.getElementById('es-cat').value.trim(),
        quantidade: parseFloat(document.getElementById('es-qtd').value) || 0,
        unidade: document.getElementById('es-und').value.trim(),
        estoqueMinimo: 5,
        local: 'Almoxarifado'
      });
    }
    core.saveDatabase();
    this.fecharModal();
    this.renderApp();
  },

  excluirEstoque(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir item de estoque')) return;
    core.db.producaoEstoqueFinanceiro.estoque = core.db.producaoEstoqueFinanceiro.estoque.filter((x) => x.id !== id);
    core.saveDatabase();
    core.toast('Item removido do estoque.');
    this.renderApp();
  },

  abrirModalFinanceiro(id = null) {
    const core = window.AmadeusCore;
    if (id && !core.requireAdmin('editar lançamento financeiro')) return;
    if (!id && !core.requireCreate('registrar lançamento financeiro')) return;
    const ex = id ? core.db.producaoEstoqueFinanceiro.financeiro.find((x) => x.id === id) : null;
    const item = ex || { data: new Date().toISOString().slice(0, 10), tipo: 'Despesa', valor: '', descricao: '' };
    this.abrirModalGenerico(
      ex ? '✏️ Editar Lançamento Financeiro (Admin)' : '➕ Lançar Receita ou Despesa',
      `
        <form onsubmit="AmadeusViews.salvarFinanceiro(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group"><label>Data *</label><input type="date" id="fn-data" class="form-control" value="${item.data}" required /></div>
            <div class="form-group">
              <label>Tipo *</label>
              <select id="fn-tipo" class="form-control">
                <option value="Despesa" ${item.tipo === 'Despesa' ? 'selected' : ''}>Despesa</option>
                <option value="Receita" ${item.tipo === 'Receita' ? 'selected' : ''}>Receita</option>
              </select>
            </div>
            <div class="form-group"><label>Valor (R$) *</label><input type="number" step="0.01" id="fn-valor" class="form-control" value="${item.valor}" required /></div>
            <div class="form-group"><label>Descrição *</label><input type="text" id="fn-desc" class="form-control" value="${item.descricao}" required /></div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar</button>
          </div>
        </form>
      `
    );
  },

  salvarFinanceiro(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (idExistente && !core.requireAdmin()) return;
    if (!idExistente && !core.requireCreate()) return;
    const lista = core.db.producaoEstoqueFinanceiro.financeiro;
    if (idExistente) {
      const fn = lista.find((x) => x.id === idExistente);
      if (fn) {
        fn.data = document.getElementById('fn-data').value;
        fn.tipo = document.getElementById('fn-tipo').value;
        fn.valor = parseFloat(document.getElementById('fn-valor').value) || 0;
        fn.descricao = document.getElementById('fn-desc').value.trim();
      }
    } else {
      lista.unshift({
        id: 'fin-' + Date.now(),
        data: document.getElementById('fn-data').value,
        tipo: document.getElementById('fn-tipo').value,
        categoria: 'Operacional',
        descricao: document.getElementById('fn-desc').value.trim(),
        valor: parseFloat(document.getElementById('fn-valor').value) || 0,
        responsavel: core.currentUser.nome
      });
    }
    core.saveDatabase();
    this.fecharModal();
    this.renderApp();
  },

  excluirFinanceiro(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir lançamento financeiro')) return;
    core.db.producaoEstoqueFinanceiro.financeiro = core.db.producaoEstoqueFinanceiro.financeiro.filter((x) => x.id !== id);
    core.saveDatabase();
    core.toast('Lançamento financeiro excluído.');
    this.renderApp();
  },

  // ==========================================================================
  // 9. CENTRAL DE RELATÓRIOS E EXPORTAÇÕES (Seção 11)
  // ==========================================================================
  viewRelatorios() {
    const core = window.AmadeusCore;
    return `
      <div class="card">
        <div class="card-header">
          <div class="card-title">📑 Central de Relatórios e Exportação para Tomada de Decisão</div>
        </div>
        <p style="font-size:0.88rem; color:var(--slate-600); margin-bottom:1.25rem;">
          Exporte relatórios formatados em PDF (com a logo oficial do AMADEUS) e planilhas CSV consolidando os registros de chuva, carga horária por trabalhador e fichas zootécnicas individuais.
        </p>

        <div class="schedule-cards-grid">
          <div class="card" style="margin:0;">
            <div class="card-title" style="margin-bottom:0.5rem;">🚜 Relatório de Atividades (Diário de Campo)</div>
            <p style="font-size:0.83rem; color:var(--slate-600); margin-bottom:1rem;">
              Relatório consolidado com todas as ${core.db.atividades.length} atividades, carga horária total (${String(Number(core.db.atividades.reduce((s, a) => s + (Number(a.horasTrabalhadas) || 0), 0).toFixed(1))).replace('.', ',')} h) e tabela de horas por participante.
            </p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="AmadeusCore.exportarRelatorioAtividadesConsolidadoPDF()">📄 Baixar PDF de Atividades</button>
            </div>
          </div>

          <div class="card" style="margin:0;">
            <div class="card-title" style="margin-bottom:0.5rem;">🌧️ Relatórios Pluviométricos (2025 & 2026)</div>
            <p style="font-size:0.83rem; color:var(--slate-600); margin-bottom:1rem;">
              Inclui síntese mensal, acumulados, dias chuvosos vs. 0 mm, nota técnica da lacuna de início de 2025 e todas as leituras diárias.
            </p>
            <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
              <button class="btn btn-primary" onclick="AmadeusCore.exportarRelatorioPluviometricoPDF()">📄 Baixar PDF Pluviométrico</button>
              <button class="btn btn-secondary" onclick="AmadeusCore.exportarCSVPluviometria()">📥 Exportar CSV</button>
            </div>
          </div>

          <div class="card" style="margin:0;">
            <div class="card-title" style="margin-bottom:0.5rem;">🐄 Fichas Individuais de Animais em PDF</div>
            <p style="font-size:0.83rem; color:var(--slate-600); margin-bottom:0.75rem;">
              Selecione o animal para emitir sua ficha completa com histórico de pesagens e cálculo de GMD:
            </p>
            <div style="display:flex; flex-direction:column; gap:0.4rem;">
              ${core.db.animais
                .map(
                  (a) => `
                <button class="btn btn-secondary" style="justify-content:space-between;" onclick="AmadeusCore.exportarFichaAnimalPDF('${a.id}')">
                  <span>🏷️ ${a.brinco} — ${a.nome} (${a.especie})</span>
                  <span>📄 Gerar PDF</span>
                </button>`
                )
                .join('')}
            </div>
          </div>

          <div class="card" style="margin:0;">
            <div class="card-title" style="margin-bottom:0.5rem;">👥 Relatórios de Carga Horária por Trabalhador</div>
            <p style="font-size:0.83rem; color:var(--slate-600); margin-bottom:0.75rem;">
              Emita o demonstrativo individual de horas, atividades executadas e status biométrico:
            </p>
            <div style="display:flex; flex-direction:column; gap:0.4rem; max-height:190px; overflow-y:auto;">
              ${core.db.pessoas
                .map(
                  (p) => `
                <button class="btn btn-secondary btn-sm" style="justify-content:space-between;" onclick="AmadeusCore.exportarRelatorioPessoaPDF('${p.id}')">
                  <span>👤 ${p.nome}</span>
                  <span>📄 PDF Horas</span>
                </button>`
                )
                .join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  },

  // ==========================================================================
  // 10. PORTAL INSTITUCIONAL AMADEUS (Seção 10)
  // ==========================================================================
  viewPortalInstitucional() {
    const core = window.AmadeusCore;
    const cfg = core.db.configuracoes;
    const isAdmin = core.isAdmin();
    const pubs = core.db.publicacoesPortal.filter((p) => isAdmin || p.status === 'Publicado');

    return `
      <div class="portal-hero">
        <div style="display:flex; align-items:center; gap:1.35rem; flex-wrap:wrap;">
          <img src="${cfg.logoUrl || 'assets/logo-amadeus.png'}" alt="Logo AMADEUS" onerror="this.src='assets/logo-amadeus.png'" style="width:110px; height:110px; border-radius:18px; background:#ffffff; padding:6px; object-fit:contain; box-shadow:0 4px 14px rgba(0,0,0,0.25);" />
          <div>
            <div style="font-size:0.8rem; text-transform:uppercase; letter-spacing:0.08em; color:var(--green-200); font-weight:700;">
              Portal Institucional & Vitrine Científica
            </div>
            <h1 style="font-size:2rem; font-weight:900; margin:0.15rem 0;">${cfg.nomeSistema}</h1>
            <div style="font-size:1rem; color:#e2e8f0; max-width:680px;">${cfg.subtitulo}</div>
            <div style="font-size:0.82rem; color:var(--green-200); margin-top:0.25rem;">Administração, Manejo e Apoio à Decisão em Empreendimentos e Unidades Rurais Sustentáveis</div>
          </div>
        </div>
        ${
          isAdmin
            ? `
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-amber" onclick="AmadeusViews.abrirModalEditarPortal()">✏️ Editar Identidade e Textos</button>
            <button class="btn btn-secondary" onclick="AmadeusViews.abrirModalPublicacao()">➕ Nova Publicação / Notícia</button>
          </div>
        `
            : `<span class="status-pill">🔒 Edição restrita a Administradores</span>`
        }
      </div>

      <div class="card">
        <div class="card-title" style="margin-bottom:0.5rem;">🌿 Apresentação Institucional</div>
        <p style="font-size:0.95rem; color:var(--slate-700);">${cfg.textoSobre}</p>
      </div>

      <div class="pillars-grid">
        <div class="pillar-card">
          <h3 style="color:var(--green-800); margin-bottom:0.4rem;">🔬 Pesquisa</h3>
          <p style="font-size:0.86rem; color:var(--slate-600);">${cfg.textoPesquisa}</p>
        </div>
        <div class="pillar-card">
          <h3 style="color:var(--green-800); margin-bottom:0.4rem;">🎓 Ensino</h3>
          <p style="font-size:0.86rem; color:var(--slate-600);">${cfg.textoEnsino}</p>
        </div>
        <div class="pillar-card">
          <h3 style="color:var(--green-800); margin-bottom:0.4rem;">🤝 Extensão</h3>
          <p style="font-size:0.86rem; color:var(--slate-600);">${cfg.textoExtensao}</p>
        </div>
        <div class="pillar-card">
          <h3 style="color:var(--green-800); margin-bottom:0.4rem;">♻️ Sustentabilidade</h3>
          <p style="font-size:0.86rem; color:var(--slate-600);">${cfg.textoSustentabilidade}</p>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">📰 Publicações, Notícias, Eventos e Projetos</div>
        </div>
        <div class="schedule-cards-grid">
          ${pubs
            .map(
              (p) => `
            <div class="card" style="margin:0; border-top:4px solid ${p.status === 'Publicado' ? '#166534' : '#f59e0b'};">
              <div style="display:flex; justify-content:space-between; font-size:0.75rem; margin-bottom:0.4rem;">
                <span class="role-badge role-comum">${p.tipo}</span>
                <span class="role-badge ${p.status === 'Publicado' ? 'role-comum' : 'role-admin'}">${p.status} · ${core.formatDateBR(p.data)}</span>
              </div>
              ${p.imagemUrl ? `<img src="${p.imagemUrl}" alt="${p.titulo}" style="width:100%; height:150px; object-fit:cover; border-radius:8px; margin-bottom:0.6rem;" />` : ''}
              <h3 style="font-size:1.02rem; color:var(--green-900); margin-bottom:0.35rem;">${p.titulo}</h3>
              <p style="font-size:0.84rem; font-weight:600; color:var(--slate-700); margin-bottom:0.4rem;">${p.resumo}</p>
              <p style="font-size:0.82rem; color:var(--slate-600); margin-bottom:0.65rem;">${p.conteudo}</p>
              <div style="font-size:0.75rem; color:var(--slate-500); margin-bottom:0.5rem;">Por: ${p.autor}</div>
              ${
                isAdmin
                  ? `
                <div style="display:flex; gap:0.35rem; border-top:1px solid var(--slate-200); padding-top:0.5rem;">
                  <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalPublicacao('${p.id}')">✏️ Editar</button>
                  <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.alternarStatusPublicacao('${p.id}')">
                    ${p.status === 'Publicado' ? '📝 Rascunho' : '✅ Publicar'}
                  </button>
                  <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirPublicacaoPortal('${p.id}')">🗑️</button>
                </div>
              `
                  : ''
              }
            </div>
          `
            )
            .join('')}
        </div>
      </div>

      <div class="card" style="background:var(--green-900); color:#fff;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem;">
          <div>
            <h3 style="color:var(--green-400); margin-bottom:0.25rem;">📱 Contatos & Redes Sociais</h3>
            <div style="font-size:0.88rem;">
              📸 <strong>Instagram:</strong> <a href="https://instagram.com/${(cfg.instagram || '').replace('@', '')}" target="_blank" style="color:#86efac;">${cfg.instagram}</a> &nbsp;|&nbsp;
              ✉️ <strong>E-mail:</strong> ${cfg.emailContato} &nbsp;|&nbsp;
              📞 <strong>Telefone:</strong> ${cfg.telefoneContato}
            </div>
          </div>
          <div style="font-size:0.8rem; color:var(--green-200); text-align:right;">
            ${cfg.rodapeTexto}
          </div>
        </div>
      </div>
    `;
  },

  abrirModalEditarPortal() {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('editar o Portal Institucional')) return;
    const cfg = core.db.configuracoes;

    this.abrirModalGenerico(
      '✏️ Editar Identidade Visual, Textos e Rodapé do Portal AMADEUS',
      `
        <form onsubmit="AmadeusViews.salvarConfigPortal(event)">
          <div class="form-grid">
            <div class="form-group"><label>Nome do Sistema *</label><input type="text" id="pt-nome" class="form-control" value="${cfg.nomeSistema}" required /></div>
            <div class="form-group"><label>Subtítulo *</label><input type="text" id="pt-sub" class="form-control" value="${cfg.subtitulo}" required /></div>
            <div class="form-group"><label>Instagram *</label><input type="text" id="pt-insta" class="form-control" value="${cfg.instagram}" /></div>
            <div class="form-group"><label>E-mail de Contato</label><input type="text" id="pt-email" class="form-control" value="${cfg.emailContato}" /></div>
          </div>
          <div class="form-group" style="margin-bottom:0.65rem;"><label>Texto Institucional Principal</label><textarea id="pt-sobre" class="form-control" rows="2">${cfg.textoSobre}</textarea></div>
          <div class="form-grid">
            <div class="form-group"><label>Eixo Pesquisa</label><textarea id="pt-pesq" class="form-control" rows="2">${cfg.textoPesquisa}</textarea></div>
            <div class="form-group"><label>Eixo Ensino</label><textarea id="pt-ens" class="form-control" rows="2">${cfg.textoEnsino}</textarea></div>
            <div class="form-group"><label>Eixo Extensão</label><textarea id="pt-ext" class="form-control" rows="2">${cfg.textoExtensao}</textarea></div>
            <div class="form-group"><label>Eixo Sustentabilidade</label><textarea id="pt-sust" class="form-control" rows="2">${cfg.textoSustentabilidade}</textarea></div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;"><label>Texto do Rodapé</label><input type="text" id="pt-rodape" class="form-control" value="${cfg.rodapeTexto}" /></div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Alterações do Portal</button>
          </div>
        </form>
      `
    );
  },

  salvarConfigPortal(e) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const cfg = core.db.configuracoes;
    cfg.nomeSistema = document.getElementById('pt-nome').value.trim();
    cfg.subtitulo = document.getElementById('pt-sub').value.trim();
    cfg.instagram = document.getElementById('pt-insta').value.trim();
    cfg.emailContato = document.getElementById('pt-email').value.trim();
    cfg.textoSobre = document.getElementById('pt-sobre').value.trim();
    cfg.textoPesquisa = document.getElementById('pt-pesq').value.trim();
    cfg.textoEnsino = document.getElementById('pt-ens').value.trim();
    cfg.textoExtensao = document.getElementById('pt-ext').value.trim();
    cfg.textoSustentabilidade = document.getElementById('pt-sust').value.trim();
    cfg.rodapeTexto = document.getElementById('pt-rodape').value.trim();
    core.saveDatabase('Atualizou Portal Institucional');
    this.fecharModal();
    core.toast('Portal Institucional atualizado com sucesso!');
    this.renderApp();
  },

  abrirModalPublicacao(pubId = null) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('gerenciar publicações no portal')) return;
    const ex = pubId ? core.db.publicacoesPortal.find((x) => x.id === pubId) : null;
    const item = ex || { titulo: '', tipo: 'Notícia', status: 'Publicado', resumo: '', conteudo: '' };

    this.abrirModalGenerico(
      ex ? '✏️ Editar Publicação do Portal (Admin)' : '➕ Nova Publicação no Portal Institucional',
      `
        <form onsubmit="AmadeusViews.salvarPublicacaoPortal(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group"><label>Título *</label><input type="text" id="pub-titulo" class="form-control" value="${item.titulo}" required /></div>
            <div class="form-group">
              <label>Categoria *</label>
              <select id="pub-tipo" class="form-control">
                <option value="Notícia" ${item.tipo === 'Notícia' ? 'selected' : ''}>Notícia</option>
                <option value="Pesquisa" ${item.tipo === 'Pesquisa' ? 'selected' : ''}>Pesquisa</option>
                <option value="Ensino" ${item.tipo === 'Ensino' ? 'selected' : ''}>Ensino</option>
                <option value="Extensão" ${item.tipo === 'Extensão' ? 'selected' : ''}>Extensão</option>
                <option value="Evento" ${item.tipo === 'Evento' ? 'selected' : ''}>Evento</option>
                <option value="Sustentabilidade" ${item.tipo === 'Sustentabilidade' ? 'selected' : ''}>Sustentabilidade</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status *</label>
              <select id="pub-status" class="form-control">
                <option value="Publicado" ${item.status === 'Publicado' ? 'selected' : ''}>Publicado (Visível no Portal)</option>
                <option value="Rascunho" ${item.status === 'Rascunho' ? 'selected' : ''}>Rascunho (Apenas Admin)</option>
              </select>
            </div>
            <div class="form-group"><label>Imagem (Opcional)</label><input type="file" id="pub-img" class="form-control" accept="image/*" /></div>
          </div>
          <div class="form-group" style="margin-bottom:0.65rem;"><label>Resumo *</label><input type="text" id="pub-resumo" class="form-control" value="${item.resumo}" required /></div>
          <div class="form-group" style="margin-bottom:1rem;"><label>Conteúdo Completo *</label><textarea id="pub-conteudo" class="form-control" rows="3" required>${item.conteudo}</textarea></div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Publicação</button>
          </div>
        </form>
      `
    );
  },

  salvarPublicacaoPortal(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const fileInput = document.getElementById('pub-img');

    const finalizar = (imgDataUrl) => {
      if (idExistente) {
        const p = core.db.publicacoesPortal.find((x) => x.id === idExistente);
        if (p) {
          p.titulo = document.getElementById('pub-titulo').value.trim();
          p.tipo = document.getElementById('pub-tipo').value;
          p.status = document.getElementById('pub-status').value;
          p.resumo = document.getElementById('pub-resumo').value.trim();
          p.conteudo = document.getElementById('pub-conteudo').value.trim();
          if (imgDataUrl) p.imagemUrl = imgDataUrl;
        }
      } else {
        core.db.publicacoesPortal.unshift({
          id: 'pub-' + Date.now(),
          titulo: document.getElementById('pub-titulo').value.trim(),
          tipo: document.getElementById('pub-tipo').value,
          status: document.getElementById('pub-status').value,
          resumo: document.getElementById('pub-resumo').value.trim(),
          conteudo: document.getElementById('pub-conteudo').value.trim(),
          data: new Date().toISOString().slice(0, 10),
          autor: core.currentUser.nome,
          imagemUrl: imgDataUrl || ''
        });
      }
      core.saveDatabase('Salvou publicação no Portal');
      this.fecharModal();
      core.toast('Publicação salva no Portal Institucional!');
      this.renderApp();
    };

    if (fileInput && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => finalizar(ev.target.result);
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finalizar('');
    }
  },

  alternarStatusPublicacao(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const p = core.db.publicacoesPortal.find((x) => x.id === id);
    if (!p) return;
    p.status = p.status === 'Publicado' ? 'Rascunho' : 'Publicado';
    core.saveDatabase();
    this.renderApp();
  },

  excluirPublicacaoPortal(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const idx = core.db.publicacoesPortal.findIndex((x) => x.id === id);
    if (idx === -1) return;
    const item = core.db.publicacoesPortal[idx];
    core.registrarExclusao('Portal', item, item.titulo);
    core.db.publicacoesPortal.splice(idx, 1);
    core.saveDatabase();
    core.toast('Publicação arquivada no Histórico de Exclusões.');
    this.renderApp();
  },

  // ==========================================================================
  // 11. ADMINISTRAÇÃO, AUTORIZAÇÃO DE USUÁRIOS (3 MODOS), FIREBASE E GITHUB
  // ==========================================================================
  viewAdministracao() {
    const core = window.AmadeusCore;
    if (!core.isAdmin()) {
      return `
        <div class="card">
          <div class="alert-banner alert-warning">
            <div>🔒</div>
            <div>
              <strong>Área Administrativa Restrita:</strong>
              Você está conectado como <strong>${core.currentUser.nome} (${core.getRoleLabel(core.currentUser.perfil)})</strong>.
              Somente Administradores podem autorizar novos cadastros, alterar os 3 modos de acesso (<em>Admin</em>, <em>Colaborador</em> e <em>Leitor</em>), editar/excluir registros lançados e configurar Firebase/GitHub.
            </div>
          </div>
        </div>
      `;
    }

    const db = core.db;
    const fb = window.AmadeusCloud ? window.AmadeusCloud.config.firebase : {};
    const gh = window.AmadeusCloud ? window.AmadeusCloud.config.github : {};
    const pendentes = db.usuarios.filter((u) => u.statusAcesso === 'pendente');

    return `
      <!-- Card Prioritário: Aprovação de Solicitações de Acesso (Cadastro via Link) -->
      <div class="card" style="border-top:5px solid ${pendentes.length > 0 ? '#f59e0b' : '#166534'};">
        <div class="card-header">
          <div>
            <div class="card-title">🔔 Solicitações de Acesso Pendentes (${pendentes.length})</div>
            <div style="font-size:0.8rem; color:var(--slate-600);">
              Quando você envia o link do AMADEUS para uma pessoa e ela preenche <strong>"Solicitar Acesso"</strong> na tela de login, o pedido aparece aqui para você autorizar ou recusar e escolher o modo dela (<strong>Admin</strong>, <strong>Colaborador</strong> ou <strong>Leitor</strong>).
            </div>
          </div>
          <button class="btn btn-sm btn-secondary" onclick="AmadeusCloud.pullFromFirebase(false)">
            🔄 Buscar Novas Solicitações na Nuvem
          </button>
        </div>

        ${
          pendentes.length > 0
            ? `
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Solicitante</th>
                  <th>Login & E-mail</th>
                  <th>Cargo / Vínculo</th>
                  <th>Data do Pedido</th>
                  <th>Definir Modo de Acesso</th>
                  <th>Decisão do Admin</th>
                </tr>
              </thead>
              <tbody>
                ${pendentes
                  .map(
                    (p) => `
                  <tr style="background:#fffbeb;">
                    <td><strong>${p.nome}</strong></td>
                    <td><code>${p.login}</code><br/><span style="font-size:0.76rem; color:var(--slate-500);">${p.email}</span></td>
                    <td>${p.cargo}</td>
                    <td>${p.dataSolicitacao ? new Date(p.dataSolicitacao).toLocaleString('pt-BR') : 'Recente'}</td>
                    <td>
                      <select id="aprov-modo-${p.id}" class="form-control" style="min-width:170px;">
                        <option value="leitor" ${p.perfil === 'leitor' ? 'selected' : ''}>👁️ Leitor (Só Visualiza/PDF)</option>
                        <option value="colaborador" ${p.perfil === 'colaborador' ? 'selected' : ''}>🛠️ Colaborador (Cadastra)</option>
                        <option value="admin" ${p.perfil === 'admin' ? 'selected' : ''}>👑 Admin (Controle Total)</option>
                      </select>
                    </td>
                    <td>
                      <div style="display:flex; gap:0.35rem; flex-wrap:wrap;">
                        <button class="btn btn-sm btn-primary" onclick="AmadeusCore.aprovarSolicitacaoUsuario('${p.id}', document.getElementById('aprov-modo-${p.id}').value)">
                          ✅ Autorizar Acesso
                        </button>
                        <button class="btn btn-sm btn-danger" onclick="AmadeusCore.recusarOuBloquearUsuario('${p.id}')">
                          🚫 Recusar / Bloquear
                        </button>
                      </div>
                    </td>
                  </tr>
                `
                  )
                  .join('')}
              </tbody>
            </table>
          </div>
        `
            : `
          <div style="background:var(--slate-50); padding:0.9rem 1rem; border-radius:8px; border:1px solid var(--slate-200); font-size:0.85rem; color:var(--slate-600);">
            ✅ Nenhuma solicitação pendente no momento. Todas as contas cadastradas já foram avaliadas.
          </div>
        `
        }
      </div>

      <!-- Controle de Usuários e dos 3 Modos (Admin, Colaborador, Leitor) -->
      <div class="card">
        <div class="card-header">
          <div>
            <div class="card-title">🔐 Controle de Usuários, Autorizações e 3 Modos de Acesso</div>
            <div style="font-size:0.8rem; color:var(--slate-500);">
              Altere a qualquer momento o modo de cada pessoa entre <strong>👑 Admin</strong>, <strong>🛠️ Colaborador</strong> e <strong>👁️ Leitor</strong>, ou bloqueie/libere o acesso ao sistema.
            </div>
          </div>
          <button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalUsuario()">➕ Cadastrar Usuário Diretamente</button>
        </div>

        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Nome</th>
                <th>Login / E-mail</th>
                <th>Cargo</th>
                <th>Modo de Acesso (Definido pelo Admin)</th>
                <th>Status de Autorização</th>
                <th>Ações (Admin)</th>
              </tr>
            </thead>
            <tbody>
              ${db.usuarios
                .map((u) => {
                  const st = u.statusAcesso || (u.ativo === false ? 'bloqueado' : 'aprovado');
                  const badgeSt =
                    st === 'aprovado'
                      ? '<span style="color:var(--green-700); font-weight:700;">✅ Autorizado</span>'
                      : st === 'pendente'
                      ? '<span style="color:var(--amber-600); font-weight:700;">⏳ Pendente</span>'
                      : '<span style="color:#dc2626; font-weight:700;">🚫 Bloqueado</span>';

                  return `
                <tr>
                  <td><strong>${u.nome}</strong></td>
                  <td><code>${u.login}</code><br/><span style="font-size:0.75rem; color:var(--slate-500);">${u.email}</span></td>
                  <td>${u.cargo}</td>
                  <td>
                    <select class="form-control" style="padding:0.3rem 0.5rem; font-size:0.82rem; font-weight:700; min-width:165px;"
                      onchange="AmadeusCore.alterarModoUsuario('${u.id}', this.value)">
                      <option value="admin" ${u.perfil === 'admin' ? 'selected' : ''}>👑 Admin (Total)</option>
                      <option value="colaborador" ${u.perfil === 'colaborador' ? 'selected' : ''}>🛠️ Colaborador (Registra)</option>
                      <option value="leitor" ${u.perfil === 'leitor' ? 'selected' : ''}>👁️ Leitor (Visualiza)</option>
                    </select>
                  </td>
                  <td>${badgeSt}</td>
                  <td>
                    <div style="display:flex; gap:0.3rem; flex-wrap:wrap;">
                      ${
                        st !== 'aprovado'
                          ? `<button class="btn btn-sm btn-primary" onclick="AmadeusCore.aprovarSolicitacaoUsuario('${u.id}', '${u.perfil}')">✅ Autorizar</button>`
                          : `<button class="btn btn-sm btn-amber" onclick="AmadeusCore.recusarOuBloquearUsuario('${u.id}')" title="Bloquear acesso deste usuário">🚫 Bloquear</button>`
                      }
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalUsuario('${u.id}')">✏️ Editar</button>
                      <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirUsuario('${u.id}')">🗑️</button>
                    </div>
                  </td>
                </tr>`;
                })
                .join('')}
            </tbody>
          </table>
        </div>
      </div>

      <!-- Painel Profissional de Integração Firebase & GitHub -->
      <div class="responsive-grid-2" style="margin-bottom:1.25rem;">
        <!-- Card Firebase -->
        <div class="card" style="margin:0; border-top:4px solid #f59e0b;">
          <div class="card-header">
            <div class="card-title">🔥 Integração Firebase (Banco em Nuvem + Auth)</div>
            <span class="role-badge ${fb.enabled ? 'role-comum' : 'role-admin'}">
              ${fb.enabled ? '🟢 Conectado' : '⚪ Aguardando Config'}
            </span>
          </div>
          <p style="font-size:0.82rem; color:var(--slate-600); margin-bottom:0.85rem;">
            Conecte seu projeto do <strong>Firebase Console</strong> para sincronizar todas as chuvas, animais, pesagens, usuários e solicitações de acesso em tempo real na nuvem.
          </p>
          <div style="background:var(--amber-50); border:1px solid #fcd34d; border-radius:8px; padding:0.65rem; margin-bottom:0.85rem;">
            <label style="font-size:0.78rem; font-weight:700; color:#78350f; display:block; margin-bottom:0.3rem;">
              ⚡ Atalho Rápido: Cole aqui o bloco <code>firebaseConfig</code> copiado do Firebase Console:
            </label>
            <div style="display:flex; gap:0.4rem;">
              <textarea id="fb-raw-paste" class="form-control" rows="2" style="font-size:0.76rem; flex:1;" placeholder="Cole aqui o texto const firebaseConfig = { apiKey: '...', projectId: '...' }"></textarea>
              <button type="button" class="btn btn-sm btn-amber" onclick="AmadeusViews.extrairBlocoFirebaseConfig()">
                Preencher Auto
              </button>
            </div>
          </div>
          <form onsubmit="AmadeusViews.salvarFormFirebase(event)">
            <div class="form-grid">
              <div class="form-group">
                <label>Firebase Project ID *</label>
                <input type="text" id="fb-proj" class="form-control" value="${fb.projectId || ''}" placeholder="Ex.: amadeus-80eeb" required />
              </div>
              <div class="form-group">
                <label>Firebase Web API Key</label>
                <input type="text" id="fb-key" class="form-control" value="${fb.apiKey || ''}" placeholder="AIzaSy..." />
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0.85rem;">
              <label>Realtime Database URL *</label>
              <input type="url" id="fb-url" class="form-control" value="${fb.databaseURL || ''}" placeholder="https://amadeus-80eeb-default-rtdb.firebaseio.com" required />
            </div>
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap; justify-content:space-between; align-items:center;">
              <span style="font-size:0.74rem; color:var(--slate-500);">
                ${fb.lastSync ? 'Última sinc.: ' + new Date(fb.lastSync).toLocaleString('pt-BR') : 'Ainda não sincronizado'}
              </span>
              <div style="display:flex; gap:0.4rem;">
                <button type="button" class="btn btn-sm btn-secondary" onclick="AmadeusCloud.pullFromFirebase(false)">⬇️ Baixar da Nuvem</button>
                <button type="submit" class="btn btn-sm btn-primary">🔥 Salvar e Sincronizar Firebase</button>
              </div>
            </div>
          </form>
        </div>

        <!-- Card GitHub -->
        <div class="card" style="margin:0; border-top:4px solid #0f172a;">
          <div class="card-header">
            <div class="card-title">🐙 Integração GitHub & GitHub Pages</div>
            <span class="role-badge ${gh.enabled ? 'role-comum' : 'role-admin'}">
              ${gh.enabled ? '🟢 Configurado' : '⚪ Aguardando Config'}
            </span>
          </div>
          <p style="font-size:0.82rem; color:var(--slate-600); margin-bottom:0.85rem;">
            Publique e salve backups versionados diretamente no seu repositório do <strong>GitHub</strong> via API REST.
          </p>
          <form onsubmit="AmadeusViews.salvarFormGitHub(event)">
            <div class="form-grid">
              <div class="form-group">
                <label>Usuário / Organização GitHub *</label>
                <input type="text" id="gh-owner" class="form-control" value="${gh.owner || ''}" placeholder="Ex.: dg4565198-coder" required />
              </div>
              <div class="form-group">
                <label>Nome do Repositório *</label>
                <input type="text" id="gh-repo" class="form-control" value="${gh.repo || 'amadeus'}" required />
              </div>
            </div>
            <div class="form-group" style="margin-bottom:0.85rem;">
              <label>GitHub Personal Access Token (Permissão repo) *</label>
              <input type="password" id="gh-token" class="form-control" value="${gh.token || ''}" placeholder="ghp_..." required />
            </div>
            <div style="display:flex; gap:0.45rem; flex-wrap:wrap; justify-content:space-between; align-items:center;">
              <span style="font-size:0.74rem; color:var(--slate-500);">
                ${gh.lastPush ? 'Último push: ' + new Date(gh.lastPush).toLocaleString('pt-BR') : 'Workflow GitHub Pages pronto na pasta .github'}
              </span>
              <div style="display:flex; gap:0.4rem;">
                <button type="submit" class="btn btn-sm btn-secondary">💾 Salvar Config</button>
                <button type="button" class="btn btn-sm btn-primary" onclick="AmadeusCloud.publicarBackupNoGitHub()">🚀 Enviar Dados ao GitHub</button>
              </div>
            </div>
          </form>
        </div>
      </div>

      <div class="card">
        <div class="card-header">
          <div class="card-title">⚙️ Backup Completo (.JSON) e Histórico de Exclusões</div>
          <div style="display:flex; gap:0.5rem; flex-wrap:wrap;">
            <button class="btn btn-primary" onclick="AmadeusCore.exportarBackupCompletoJSON()">💾 Criar Backup Completo (.JSON)</button>
            <label class="btn btn-amber" style="margin:0;">
              📂 Restaurar Backup
              <input type="file" accept=".json" style="display:none;" onchange="AmadeusCore.restaurarBackupJSON(this.files[0])" />
            </label>
          </div>
        </div>

        <!-- Histórico de Exclusões (Lixeira Auditável) -->
        <div class="card-header">
          <div class="card-title">🗑️ Histórico de Exclusões e Restauração de Registros</div>
        </div>
        <div class="table-responsive">
          <table class="data-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Módulo</th>
                <th>Item Excluído</th>
                <th>Excluído Por</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              ${
                db.historicoExclusoes.length
                  ? db.historicoExclusoes
                      .map(
                        (del) => `
                    <tr>
                      <td>${new Date(del.dataHora).toLocaleString('pt-BR')}</td>
                      <td><span class="role-badge role-comum">${del.modulo}</span></td>
                      <td><strong>${del.titulo}</strong></td>
                      <td>${del.excluidoPor}</td>
                      <td>
                        <button class="btn btn-sm btn-primary" onclick="AmadeusCore.restaurarItemExcluido('${del.id}')">
                          ♻️ Restaurar Registro
                        </button>
                      </td>
                    </tr>`
                      )
                      .join('')
                  : `<tr><td colspan="5" style="text-align:center; color:var(--slate-500);">Nenhuma exclusão registrada até o momento.</td></tr>`
              }
            </tbody>
          </table>
        </div>
      </div>
    `;
  },

  extrairBlocoFirebaseConfig() {
    const raw = (document.getElementById('fb-raw-paste')?.value || '').trim();
    if (!raw) {
      window.AmadeusCore.toast('Cole o código firebaseConfig primeiro.', 'aviso');
      return;
    }
    const extract = (key) => {
      const m = raw.match(new RegExp(key + '\\s*:\\s*["\']([^"\']+)["\']'));
      return m ? m[1].trim() : '';
    };
    const proj = extract('projectId');
    const apiKey = extract('apiKey');
    let dbUrl = extract('databaseURL');
    if (!dbUrl && proj) {
      dbUrl = `https://${proj}-default-rtdb.firebaseio.com`;
    }
    if (proj) document.getElementById('fb-proj').value = proj;
    if (apiKey) document.getElementById('fb-key').value = apiKey;
    if (dbUrl) document.getElementById('fb-url').value = dbUrl;
    window.AmadeusCore.toast('Campos do Firebase extraídos automaticamente! Clique em "Salvar e Sincronizar Firebase".');
  },

  salvarFormFirebase(e) {
    e.preventDefault();
    window.AmadeusCloud.configurarFirebase({
      projectId: document.getElementById('fb-proj').value,
      apiKey: document.getElementById('fb-key').value,
      databaseURL: document.getElementById('fb-url').value
    });
  },

  salvarFormGitHub(e) {
    e.preventDefault();
    window.AmadeusCloud.salvarConfigGitHub({
      owner: document.getElementById('gh-owner').value,
      repo: document.getElementById('gh-repo').value,
      token: document.getElementById('gh-token').value,
      branch: 'main'
    });
  },

  abrirModalUsuario(usrId = null) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const ex = usrId ? core.db.usuarios.find((u) => u.id === usrId) : null;
    const item = ex || {
      nome: '',
      login: '',
      email: '',
      senhaHash: '123456',
      cargo: 'Colaborador Rural',
      perfil: 'colaborador',
      statusAcesso: 'aprovado'
    };

    this.abrirModalGenerico(
      ex ? `✏️ Editar Usuário — ${item.nome}` : '➕ Cadastrar Usuário do Sistema',
      `
        <form onsubmit="AmadeusViews.salvarUsuario(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group"><label>Nome Completo *</label><input type="text" id="usr-nome" class="form-control" value="${item.nome}" required /></div>
            <div class="form-group"><label>Login *</label><input type="text" id="usr-login" class="form-control" value="${item.login}" required /></div>
            <div class="form-group"><label>E-mail *</label><input type="email" id="usr-email" class="form-control" value="${item.email}" required /></div>
            <div class="form-group"><label>Senha *</label><input type="text" id="usr-senha" class="form-control" value="${item.senhaHash}" required /></div>
            <div class="form-group"><label>Cargo / Setor</label><input type="text" id="usr-cargo" class="form-control" value="${item.cargo}" /></div>
            <div class="form-group">
              <label>Modo de Acesso *</label>
              <select id="usr-perfil" class="form-control">
                <option value="leitor" ${item.perfil === 'leitor' ? 'selected' : ''}>👁️ Leitor (Somente Visualização e PDF)</option>
                <option value="colaborador" ${item.perfil === 'colaborador' ? 'selected' : ''}>🛠️ Colaborador (Visualiza e Cadastra)</option>
                <option value="admin" ${item.perfil === 'admin' ? 'selected' : ''}>👑 Admin (Controle Total)</option>
              </select>
            </div>
            <div class="form-group">
              <label>Status de Autorização *</label>
              <select id="usr-status" class="form-control">
                <option value="aprovado" ${item.statusAcesso === 'aprovado' ? 'selected' : ''}>✅ Autorizado (Pode entrar)</option>
                <option value="pendente" ${item.statusAcesso === 'pendente' ? 'selected' : ''}>⏳ Pendente (Aguardando aprovação)</option>
                <option value="bloqueado" ${item.statusAcesso === 'bloqueado' ? 'selected' : ''}>🚫 Bloqueado (Sem acesso)</option>
              </select>
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Usuário</button>
          </div>
        </form>
      `
    );
  },

  salvarUsuario(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.requireAdmin()) return;
    const modo = document.getElementById('usr-perfil').value;
    const statusAcesso = document.getElementById('usr-status').value;
    const permissoes =
      modo === 'admin'
        ? ['total']
        : modo === 'colaborador'
        ? ['consultar', 'registrar', 'exportar']
        : ['consultar', 'exportar'];

    if (idExistente) {
      const u = core.db.usuarios.find((x) => x.id === idExistente);
      if (u) {
        u.nome = document.getElementById('usr-nome').value.trim();
        u.login = document.getElementById('usr-login').value.trim();
        u.email = document.getElementById('usr-email').value.trim();
        u.senhaHash = document.getElementById('usr-senha').value;
        u.cargo = document.getElementById('usr-cargo').value.trim();
        u.perfil = modo;
        u.statusAcesso = statusAcesso;
        u.ativo = statusAcesso === 'aprovado';
        u.permissoes = permissoes;
      }
    } else {
      core.db.usuarios.push({
        id: 'usr-' + Date.now(),
        nome: document.getElementById('usr-nome').value.trim(),
        login: document.getElementById('usr-login').value.trim(),
        email: document.getElementById('usr-email').value.trim(),
        senhaHash: document.getElementById('usr-senha').value,
        cargo: document.getElementById('usr-cargo').value.trim(),
        perfil: modo,
        statusAcesso,
        ativo: statusAcesso === 'aprovado',
        permissoes
      });
    }
    core.saveDatabase('Salvou usuário');
    this.fecharModal();
    core.toast('Usuário salvo com sucesso!');
    this.renderApp();
  },

  excluirUsuario(userId) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir usuários')) return;
    if (core.db.usuarios.length <= 1) {
      core.toast('Não é possível excluir o único usuário do sistema.', 'aviso');
      return;
    }
    core.db.usuarios = core.db.usuarios.filter((u) => u.id !== userId);
    core.saveDatabase('Excluiu usuário');
    core.toast('Usuário removido.');
    this.renderApp();
  },

  // ==========================================================================
  // MÓDULO SIPA — Sistema de Plantio Direto (SPD) & Integração no Campus
  // ==========================================================================
  sipaSubTab: 'mapa', // 'mapa' | 'plantios' | 'avaliacoes' | 'ferramentas'

  setSipaSubTab(aba) {
    this.sipaSubTab = aba;
    this.renderMainContent();
    if (aba === 'mapa') {
      setTimeout(() => this.inicializarMapaSipa(), 80);
    }
  },

  viewSipa() {
    const core = window.AmadeusCore;
    const isAdmin = core.isAdmin();
    const canCreate = core.canCreate();
    const sipa = core.db.sipa || { plantios: [], avaliacoes: [], registrosCampo: [] };
    const plantios = sipa.plantios || [];
    const avaliacoes = sipa.avaliacoes || [];
    const sub = this.sipaSubTab || 'mapa';

    const areaTotalHa = plantios.reduce((s, p) => s + (Number(p.areaHa) || 0), 0);
    const mediaPalhada =
      avaliacoes.length > 0
        ? avaliacoes.reduce((s, a) => s + (Number(a.massaSecaTha) || 0), 0) / avaliacoes.length
        : plantios.length > 0
        ? plantios.reduce((s, p) => s + (Number(p.palhadaInicialTha) || 0), 0) / plantios.length
        : 0;
    const mediaCobertura =
      avaliacoes.length > 0
        ? avaliacoes.reduce((s, a) => s + (Number(a.coberturaSoloPct) || 0), 0) / avaliacoes.length
        : 0;

    return `
      <!-- Cabeçalho Institucional do Módulo SIPA -->
      <div class="card" style="background:linear-gradient(135deg, #0f291a 0%, #166534 65%, #15803d 100%); color:#ffffff; border:none; margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
          <div>
            <div style="display:inline-flex; align-items:center; gap:0.4rem; background:rgba(255,255,255,0.16); padding:0.22rem 0.7rem; border-radius:999px; font-size:0.72rem; font-weight:800; letter-spacing:0.08em; text-transform:uppercase; margin-bottom:0.45rem;">
              🌱 MÓDULO SIPA · SISTEMA DE PLANTIO DIRETO NO CAMPUS (IF BAIANO)
            </div>
            <h2 style="font-size:1.45rem; font-weight:800; margin-bottom:0.25rem; line-height:1.2;">
              SIPA — Sistema de Plantio Direto (SPD) &amp; Manejo Integrado
            </h2>
            <p style="font-size:0.84rem; color:#dcfce7; max-width:780px;">
              Central de registros de plantio, acompanhamento de glebas, avaliação de palhada/cobertura do solo, consórcios forrageiros e ferramentas técnicas de apoio ao projeto SIPA no campus.
            </p>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            ${
              canCreate
                ? `
              <button class="btn btn-sm btn-amber" onclick="AmadeusViews.abrirModalPlantioSipa()">
                ➕ Novo Plantio / Gleba SPD
              </button>
              <button class="btn btn-sm btn-secondary" style="background:#ffffff; color:#14532d; border:none;" onclick="AmadeusViews.abrirModalAvaliacaoSipa()">
                📋 Registrar Avaliação de Campo
              </button>
            `
                : `<span class="status-pill">👁️ Modo Leitor</span>`
            }
          </div>
        </div>
      </div>

      <!-- KPIs do Projeto SIPA & Plantio Direto -->
      <div class="kpi-grid">
        <div class="kpi-card">
          <div class="kpi-label">Plantios / Glebas SPD</div>
          <div class="kpi-value">${plantios.length}</div>
          <div class="kpi-sub">Área total monitorada: <strong>${areaTotalHa.toFixed(2)} ha</strong></div>
        </div>
        <div class="kpi-card blue">
          <div class="kpi-label">Massa Seca / Palhada</div>
          <div class="kpi-value">${mediaPalhada.toFixed(1)} t/ha</div>
          <div class="kpi-sub">Referência ideal SPD: &ge; 6,0 t/ha</div>
        </div>
        <div class="kpi-card amber">
          <div class="kpi-label">Taxa de Cobertura do Solo</div>
          <div class="kpi-value">${mediaCobertura > 0 ? mediaCobertura.toFixed(0) + '%' : '—'}</div>
          <div class="kpi-sub">${avaliacoes.length} avaliação(ões) técnica(s) registrada(s)</div>
        </div>
        <div class="kpi-card">
          <div class="kpi-label">Integração Clima × Plantio</div>
          <div class="kpi-value">${core.db.chuvas.filter((c) => c.data.startsWith('2026')).reduce((s, r) => s + Number(r.mm), 0).toFixed(0)} mm</div>
          <div class="kpi-sub">Acumulado 2026 na área experimental</div>
        </div>
      </div>

      <!-- Sub-navegação Interna do Módulo SIPA -->
      <div style="display:flex; gap:0.45rem; flex-wrap:wrap; margin-bottom:1.15rem; background:#ffffff; padding:0.5rem; border-radius:12px; border:1px solid var(--slate-200);">
        <button class="btn btn-sm ${sub === 'mapa' ? 'btn-primary' : 'btn-secondary'}"
          onclick="AmadeusViews.setSipaSubTab('mapa')">
          🗺️ Mapa &amp; Área no Campus (Satélite / Fotos)
        </button>
        <button class="btn btn-sm ${sub === 'plantios' ? 'btn-primary' : 'btn-secondary'}"
          onclick="AmadeusViews.setSipaSubTab('plantios')">
          🌾 Plantios, Culturas &amp; Glebas (${plantios.length})
        </button>
        <button class="btn btn-sm ${sub === 'avaliacoes' ? 'btn-primary' : 'btn-secondary'}"
          onclick="AmadeusViews.setSipaSubTab('avaliacoes')">
          🍂 Avaliações de Palhada, Solo &amp; Dados (${avaliacoes.length})
        </button>
        <button class="btn btn-sm ${sub === 'ferramentas' ? 'btn-primary' : 'btn-secondary'}"
          onclick="AmadeusViews.setSipaSubTab('ferramentas')">
          🧮 Calculadoras &amp; Ferramentas SPD
        </button>
      </div>

      ${
        sub === 'mapa'
          ? this.renderSubTabMapaAreaSipa()
          : sub === 'plantios'
          ? `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">🌾 Registros de Plantio Direto (SPD) e Consórcios no Campus</div>
              <div style="font-size:0.8rem; color:var(--slate-500);">
                Controle de semeadura, culturas solteiras ou consorciadas, espaçamento, população de plantas, palhada inicial e adubação
              </div>
            </div>
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalPlantioSipa()">➕ Cadastrar Plantio</button>`
                : ''
            }
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Data Plantio</th>
                  <th>Gleba / Local no Campus</th>
                  <th>Cultura / Consórcio</th>
                  <th>Sistema &amp; Espaçamento</th>
                  <th>População &amp; Palhada</th>
                  <th>Adubação / Manejo</th>
                  <th>Status</th>
                  <th>Responsável</th>
                  ${isAdmin ? '<th>Ações</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${
                  plantios.length === 0
                    ? `<tr><td colspan="9" style="text-align:center; padding:1.5rem; color:var(--slate-500);">Nenhum plantio cadastrado ainda. Clique em "➕ Cadastrar Plantio" para iniciar.</td></tr>`
                    : plantios
                        .map(
                          (p) => `
                  <tr>
                    <td><strong>${core.formatDateBR(p.dataPlantio)}</strong></td>
                    <td><strong>${p.gleba}</strong><br/><span style="font-size:0.74rem; color:var(--slate-500);">Área: ${Number(p.areaHa).toFixed(2)} ha</span></td>
                    <td><strong style="color:var(--green-800);">${p.cultura}</strong></td>
                    <td>${p.sistema || 'Plantio Direto'}<br/><span style="font-size:0.74rem; color:var(--slate-500);">Espaç.: ${p.espacamentoCm} cm</span></td>
                    <td><strong>${Number(p.populacaoHa || 0).toLocaleString('pt-BR')} pl/ha</strong><br/><span style="font-size:0.74rem; color:#0369a1;">Palhada: ${Number(p.palhadaInicialTha || 0).toFixed(1)} t/ha</span></td>
                    <td style="font-size:0.78rem;">${p.adubacaoBase || '—'}<br/><span style="color:var(--slate-500);">${p.observacoes || ''}</span></td>
                    <td><span class="role-badge role-comum">${p.status || 'Ativo'}</span></td>
                    <td>${p.responsavel}</td>
                    ${
                      isAdmin
                        ? `
                      <td>
                        <div style="display:flex; gap:0.25rem;">
                          <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalPlantioSipa('${p.id}')" title="Editar">✏️</button>
                          <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirPlantioSipa('${p.id}')" title="Excluir">🗑️</button>
                        </div>
                      </td>
                    `
                        : ''
                    }
                  </tr>
                `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `
          : sub === 'avaliacoes'
          ? `
        <div class="card">
          <div class="card-header">
            <div>
              <div class="card-title">🍂 Monitoramento de Palhada, Cobertura de Solo e Desenvolvimento Vegetativo</div>
              <div style="font-size:0.8rem; color:var(--slate-500);">
                Acompanhamento técnico de biomassa residual (t/ha), porcentagem de cobertura do solo, altura de dossel e conservação de umidade
              </div>
            </div>
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalAvaliacaoSipa()">➕ Nova Avaliação de Campo</button>`
                : ''
            }
          </div>

          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Data</th>
                  <th>Gleba / Talhão</th>
                  <th>Tipo de Avaliação</th>
                  <th>Cobertura do Solo (%)</th>
                  <th>Massa Seca (t/ha)</th>
                  <th>Altura de Planta (cm)</th>
                  <th>Umidade do Solo</th>
                  <th>Responsável</th>
                  ${isAdmin ? '<th>Ações</th>' : ''}
                </tr>
              </thead>
              <tbody>
                ${
                  avaliacoes.length === 0
                    ? `<tr><td colspan="9" style="text-align:center; padding:1.5rem; color:var(--slate-500);">Nenhuma avaliação registrada ainda.</td></tr>`
                    : avaliacoes
                        .map(
                          (a) => `
                  <tr>
                    <td><strong>${core.formatDateBR(a.data)}</strong></td>
                    <td><strong>${a.gleba}</strong></td>
                    <td>${a.tipoAvaliacao}</td>
                    <td><strong style="color:var(--green-700);">${Number(a.coberturaSoloPct || 0).toFixed(0)}%</strong></td>
                    <td><strong style="color:#0284c7;">${Number(a.massaSecaTha || 0).toFixed(2)} t/ha</strong></td>
                    <td>${a.alturaPlantaCm ? a.alturaPlantaCm + ' cm' : '—'}</td>
                    <td>${a.umidadeSoloStatus || '—'}<br/><span style="font-size:0.74rem; color:var(--slate-500);">${a.observacoes || ''}</span></td>
                    <td>${a.responsavel}</td>
                    ${
                      isAdmin
                        ? `
                      <td>
                        <div style="display:flex; gap:0.25rem;">
                          <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalAvaliacaoSipa('${a.id}')" title="Editar">✏️</button>
                          <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirAvaliacaoSipa('${a.id}')" title="Excluir">🗑️</button>
                        </div>
                      </td>
                    `
                        : ''
                    }
                  </tr>
                `
                        )
                        .join('')
                }
              </tbody>
            </table>
          </div>
        </div>
      `
          : `
        <div class="responsive-grid-2">
          <!-- Calculadora 1: Regulagem de Semeadora e População de Plantas no SPD -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">🚜 Calculadora de Semeadura &amp; Estande no Plantio Direto (SPD)</div>
            </div>
            <p style="font-size:0.82rem; color:var(--slate-600); margin-bottom:0.85rem;">
              Calcule o número de sementes por metro linear e a necessidade total de sementes corrigida pelo poder germinativo/pureza para o plantio no campus.
            </p>
            <div class="form-grid">
              <div class="form-group">
                <label>População Desejada (plantas/ha)</label>
                <input type="number" id="spd-pop" class="form-control" value="60000" oninput="AmadeusViews.calcularRegulagemPlantioSPD()" />
              </div>
              <div class="form-group">
                <label>Espaçamento entre Linhas (cm)</label>
                <input type="number" id="spd-esp" class="form-control" value="50" oninput="AmadeusViews.calcularRegulagemPlantioSPD()" />
              </div>
              <div class="form-group">
                <label>Germinação / Sobrevivência no SPD (%)</label>
                <input type="number" id="spd-germ" class="form-control" value="90" oninput="AmadeusViews.calcularRegulagemPlantioSPD()" />
              </div>
              <div class="form-group">
                <label>Área da Gleba no Campus (ha)</label>
                <input type="number" step="0.1" id="spd-area" class="form-control" value="1.5" oninput="AmadeusViews.calcularRegulagemPlantioSPD()" />
              </div>
            </div>
            <div id="spd-calc-res" style="background:var(--green-50); border:1px solid var(--green-200); border-radius:10px; padding:0.9rem; font-size:0.86rem; color:var(--green-900);">
              <strong>Resultado para Regulagem:</strong><br/>
              • Metros lineares por hectare: <strong>20.000 m/ha</strong><br/>
              • Plantas finais por metro: <strong>3,00 plantas/m</strong><br/>
              • Regulagem da semeadora (corrigida p/ 90%): <strong>3,33 sementes/metro linear</strong><br/>
              • Total de sementes para 1,50 ha: <strong>100.000 sementes</strong>
            </div>
          </div>

          <!-- Calculadora 2: Estimativa de Massa Seca de Palhada / Forragem por Quadro Amostral -->
          <div class="card" style="margin-bottom:0;">
            <div class="card-header">
              <div class="card-title">🍂 Calculadora de Massa Seca de Palhada / Forragem (t/ha)</div>
            </div>
            <p style="font-size:0.82rem; color:var(--slate-600); margin-bottom:0.85rem;">
              Converta o peso coletado no quadro amostral de campo (0,25 m², 0,50 m² ou 1,00 m²) diretamente em toneladas de matéria seca por hectare (t MS/ha).
            </p>
            <div class="form-grid">
              <div class="form-group">
                <label>Área do Quadro Amostral (m²)</label>
                <select id="spd-quadro" class="form-control" onchange="AmadeusViews.calcularMassaSecaSPD()">
                  <option value="0.25">0,25 m² (Quadro 0,5 m × 0,5 m)</option>
                  <option value="0.5">0,50 m² (Quadro 1,0 m × 0,5 m)</option>
                  <option value="1" selected>1,00 m² (Quadro 1,0 m × 1,0 m)</option>
                </select>
              </div>
              <div class="form-group">
                <label>Peso Verde Coletado no Quadro (g)</label>
                <input type="number" id="spd-pverde" class="form-control" value="2200" oninput="AmadeusViews.calcularMassaSecaSPD()" />
              </div>
              <div class="form-group">
                <label>Teor de Matéria Seca — MS (%)</label>
                <input type="number" id="spd-ms" class="form-control" value="30" oninput="AmadeusViews.calcularMassaSecaSPD()" />
              </div>
            </div>
            <div id="spd-ms-res" style="background:#f0f9ff; border:1px solid #bae6fd; border-radius:10px; padding:0.9rem; font-size:0.86rem; color:#0c4a6e;">
              <strong>Estimativa de Produção por Hectare:</strong><br/>
              • Massa Verde Estimada: <strong>22,00 t MV/ha</strong> (22.000 kg/ha)<br/>
              • Massa Seca de Palhada / Forragem: <strong>6,60 t MS/ha</strong> (6.600 kg MS/ha)<br/>
              • Status SPD: <strong>✅ Acima do patamar recomendado (&ge; 6,0 t MS/ha) para proteção do solo!</strong>
            </div>
          </div>
        </div>
      `
      }
    `;
  },

  renderSubTabMapaAreaSipa() {
    const core = window.AmadeusCore;
    const canCreate = core.canCreate();
    const isAdmin = core.isAdmin();
    const mapaArea = core.db.sipa?.mapaArea || {
      nomeArea: 'Área Experimental SIPA & Plantio Direto · Campus IF Baiano',
      descricao: 'Gleba destinada ao projeto de Sistema de Plantio Direto (SPD) e consórcios forrageiros (Milho + Brachiaria / Integração Lavoura-Pecuária).',
      lat: -14.2885,
      lng: -39.8142,
      zoom: 17,
      areaHa: 1.5,
      perimetroM: 520,
      linkGoogleMaps: 'https://maps.google.com/?q=-14.2885,-39.8142',
      linkGoogleEarth: 'https://earth.google.com/web/search/-14.2885,-39.8142',
      imagensCroqui: [],
      pontosMarcados: []
    };

    const imagens = mapaArea.imagensCroqui || [];
    const filtro = this._sipaGaleriaFiltro || 'todos';
    const imagensFiltradas =
      filtro === 'todos'
        ? imagens
        : imagens.filter((img) => (img.categoria || '').toLowerCase().includes(filtro.toLowerCase()));

    const pontos = mapaArea.pontosMarcados || [];

    return `
      <!-- Barra Superior de Ações do Módulo de Mapa / Área -->
      <div class="card" style="margin-bottom:1.25rem;">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.75rem;">
          <div>
            <div style="font-size:0.78rem; font-weight:800; color:var(--green-700); text-transform:uppercase; letter-spacing:0.05em;">
              📍 Georreferenciamento &amp; Reconhecimento Espacial no Campus
            </div>
            <h3 style="font-size:1.18rem; font-weight:800; margin:0.15rem 0 0.25rem 0; color:var(--slate-900);">
              ${mapaArea.nomeArea}
            </h3>
            <p style="font-size:0.84rem; color:var(--slate-600); margin:0;">
              ${mapaArea.descricao || 'Área experimental destinada ao Sistema de Plantio Direto e ILP no Campus IF Baiano.'}
            </p>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap;">
            <a href="${mapaArea.linkGoogleMaps}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-primary" style="display:inline-flex; align-items:center; gap:0.35rem; text-decoration:none;">
              🌍 Abrir no Google Maps
            </a>
            <a href="${mapaArea.linkGoogleEarth}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary" style="display:inline-flex; align-items:center; gap:0.35rem; text-decoration:none;">
              🛰️ Abrir no Google Earth
            </a>
            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.capturarGpsAreaSipa()" title="Capturar coordenadas atuais pelo GPS do aparelho">
              📍 Capturar GPS pelo Aparelho
            </button>
            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.copiarCoordenadasAreaSipa()" title="Copiar coordenadas e link para compartilhar no WhatsApp">
              📋 Compartilhar Link &amp; GPS
            </button>
            ${
              canCreate
                ? `
              <button class="btn btn-sm btn-amber" onclick="AmadeusViews.abrirModalImagemAreaSipa()">
                📸 Adicionar Foto / Croqui
              </button>
              <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalEditarAreaSipa()">
                ✏️ Editar Dados da Área
              </button>
            `
                : ''
            }
          </div>
        </div>
      </div>

      <!-- MAPA INTERATIVO SATÉLITE LEAFLET -->
      <div class="sipa-map-wrapper">
        <div class="sipa-map-toolbar">
          <div style="display:flex; align-items:center; gap:0.5rem;">
            <span style="font-size:1.2rem;">🛰️</span>
            <div>
              <strong style="font-size:0.92rem;">Mapeamento por Satélite em Alta Resolução (Campus IF Baiano)</strong>
              <div style="font-size:0.75rem; color:var(--slate-500);">
                Alterne entre Imagem de Satélite Esri HD e Terreno/Ruas no menu superior direito do mapa
              </div>
            </div>
          </div>
          <div style="display:flex; gap:0.35rem; align-items:center;">
            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.recentralizarMapaSipa()" title="Recentralizar mapa na gleba">
              🎯 Centralizar Área
            </button>
            ${
              canCreate
                ? `
              <button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalPontoMapaSipa()" title="Marcar novo ponto GPS no mapa">
                📌 Adicionar Ponto / Marco
              </button>
            `
                : ''
            }
          </div>
        </div>

        <div id="sipa-mapa-leaf" class="sipa-map-container"></div>

        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:0.6rem; padding:0.6rem 1rem; background:var(--slate-50); border-top:1px solid var(--slate-200); font-size:0.78rem; color:var(--slate-600);">
          <div>
            📍 <strong>Coordenadas Centrais:</strong> Lat <code>${mapaArea.lat.toFixed(6)}</code> | Lng <code>${mapaArea.lng.toFixed(6)}</code>
          </div>
          <div>
            📐 <strong>Área Total:</strong> ${Number(mapaArea.areaHa || 1.5).toFixed(2)} ha (${Math.round((mapaArea.areaHa || 1.5) * 10000).toLocaleString('pt-BR')} m²) &nbsp;|&nbsp; 
            📏 <strong>Perímetro:</strong> ~${mapaArea.perimetroM || 520} m
          </div>
          <div>
            📌 <strong>Pontos Mapeados:</strong> ${pontos.length} ponto(s) de interesse
          </div>
        </div>
      </div>

      <!-- Ficha Técnica Agronômica em 3 Colunas -->
      <div class="responsive-grid-2" style="grid-template-columns: repeat(auto-fit, minmax(290px, 1fr)); margin-bottom:1.25rem;">
        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <div class="card-title">📍 Coordenadas &amp; Acesso Geoespacial</div>
          </div>
          <div style="font-size:0.84rem; line-height:1.6; color:var(--slate-700);">
            • <strong>Campus / Município:</strong> IF Baiano — Setor de Agricultura<br/>
            • <strong>Latitude:</strong> ${mapaArea.lat.toFixed(6)}° S<br/>
            • <strong>Longitude:</strong> ${mapaArea.lng.toFixed(6)}° W<br/>
            • <strong>Dimensão:</strong> ${Number(mapaArea.areaHa || 1.5).toFixed(2)} hectares (15.000 m²)<br/>
            • <strong>Perímetro da Gleba:</strong> ~${mapaArea.perimetroM || 520} metros lineares<br/>
            <div style="margin-top:0.65rem; display:flex; gap:0.5rem; flex-wrap:wrap;">
              <a href="${mapaArea.linkGoogleMaps}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">Google Maps ↗</a>
              <a href="${mapaArea.linkGoogleEarth}" target="_blank" rel="noopener noreferrer" class="btn btn-sm btn-secondary">Google Earth 3D ↗</a>
            </div>
          </div>
        </div>

        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <div class="card-title">🌱 Sistema de Manejo &amp; Solo</div>
          </div>
          <div style="font-size:0.84rem; line-height:1.6; color:var(--slate-700);">
            • <strong>Sistema:</strong> Sistema de Plantio Direto (SPD) na Palhada<br/>
            • <strong>Consórcio Primário:</strong> Milho Grão + Brachiaria ruziziensis<br/>
            • <strong>Manejo Integrado:</strong> Integração Lavoura-Pecuária (ILP)<br/>
            • <strong>Solo:</strong> Latossolo Vermelho-Amarelo (relevo suave-ondulado)<br/>
            • <strong>Objetivo:</strong> Cobertura permanente, ciclagem de nutrientes e retenção de água<br/>
            • <strong>Meta de Palhada:</strong> &ge; 6,0 toneladas de matéria seca por hectare
          </div>
        </div>

        <div class="card" style="margin-bottom:0;">
          <div class="card-header">
            <div class="card-title">📌 Pontos de Interesse &amp; Equipamentos</div>
          </div>
          <div style="font-size:0.84rem; line-height:1.5;">
            ${
              pontos.length === 0
                ? `<p style="color:var(--slate-500);">Nenhum ponto marcado ainda.</p>`
                : pontos
                    .map(
                      (pt) => `
                <div style="display:flex; justify-content:space-between; align-items:center; padding:0.4rem 0; border-bottom:1px solid var(--slate-100);">
                  <div>
                    <strong>${pt.tipo === 'pluviometro' ? '🌧️' : pt.tipo === 'pastejo' ? '🐂' : '🌾'} ${pt.rotulo}</strong><br/>
                    <small style="color:var(--slate-500);">${pt.obs || ''} (${pt.lat.toFixed(5)}, ${pt.lng.toFixed(5)})</small>
                  </div>
                  ${
                    isAdmin
                      ? `
                    <button class="btn btn-sm btn-danger" style="padding:0.15rem 0.4rem; font-size:0.7rem;" onclick="AmadeusViews.excluirPontoMapaSipa('${pt.id}')" title="Excluir ponto">🗑️</button>
                  `
                      : ''
                  }
                </div>
              `
                    )
                    .join('')
            }
          </div>
        </div>
      </div>

      <!-- GALERIA DE CROQUIS E FOTOS DA ÁREA -->
      <div class="card">
        <div class="card-header" style="flex-wrap:wrap; gap:0.6rem;">
          <div>
            <div class="card-title">📸 Imagens, Croquis Técnicos &amp; Fotos da Área Experimental</div>
            <div style="font-size:0.8rem; color:var(--slate-500);">
              Croquis de zoneamento dos talhões, fotos aéreas de drone, evolução da palhada e fotos de campo antes e depois do plantio
            </div>
          </div>
          <div style="display:flex; gap:0.45rem; flex-wrap:wrap; align-items:center;">
            <div style="display:flex; gap:0.25rem; flex-wrap:wrap;">
              <button class="btn btn-sm ${filtro === 'todos' ? 'btn-primary' : 'btn-secondary'}" onclick="AmadeusViews.filtrarGaleriaSipa('todos')">Todas (${imagens.length})</button>
              <button class="btn btn-sm ${filtro === 'croqui' ? 'btn-primary' : 'btn-secondary'}" onclick="AmadeusViews.filtrarGaleriaSipa('croqui')">📐 Croquis</button>
              <button class="btn btn-sm ${filtro === 'campo' || filtro === 'foto' ? 'btn-primary' : 'btn-secondary'}" onclick="AmadeusViews.filtrarGaleriaSipa('campo')">📸 Fotos do Campo</button>
              <button class="btn btn-sm ${filtro === 'drone' ? 'btn-primary' : 'btn-secondary'}" onclick="AmadeusViews.filtrarGaleriaSipa('drone')">🛰️ Fotos de Drone</button>
            </div>
            ${
              canCreate
                ? `
              <button class="btn btn-sm btn-amber" onclick="AmadeusViews.abrirModalImagemAreaSipa()">
                ➕ Adicionar Foto / Croqui
              </button>
            `
                : ''
            }
          </div>
        </div>

        ${
          imagensFiltradas.length === 0
            ? `
          <div style="text-align:center; padding:2.5rem 1rem; color:var(--slate-500); background:var(--slate-50); border-radius:10px; border:1px dashed var(--slate-300);">
            <div style="font-size:2rem; margin-bottom:0.4rem;">📷</div>
            <h4 style="font-size:1rem; font-weight:700; color:var(--slate-700); margin-bottom:0.25rem;">Nenhuma imagem nesta categoria</h4>
            <p style="font-size:0.84rem; max-width:480px; margin:0 auto 1rem auto;">
              Você pode tirar fotos pelo celular durante o dia de campo no campus, carregar croquis desenhados ou fotos de drone para documentar o projeto SIPA.
            </p>
            ${
              canCreate
                ? `<button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalImagemAreaSipa()">📸 Adicionar Primeira Foto / Croqui</button>`
                : ''
            }
          </div>
        `
            : `
          <div class="sipa-gallery-grid">
            ${imagensFiltradas
              .map((img) => {
                const tagCor = img.categoria?.toLowerCase().includes('croqui')
                  ? '#166534'
                  : img.categoria?.toLowerCase().includes('drone')
                  ? '#7c3aed'
                  : img.categoria?.toLowerCase().includes('antes')
                  ? '#d97706'
                  : '#0284c7';

                return `
                <div class="sipa-img-card">
                  <div class="sipa-img-thumb-wrap" onclick="AmadeusViews.abrirModalVisualizarImagem('${img.id}')" title="Clique para ampliar">
                    <img src="${img.url}" alt="${img.titulo}" class="sipa-img-thumb" loading="lazy" />
                    <span class="sipa-img-tag" style="background:${tagCor};">
                      ${img.categoria || 'Registro'}
                    </span>
                  </div>
                  <div class="sipa-img-content">
                    <div style="font-weight:700; font-size:0.92rem; color:var(--slate-900); margin-bottom:0.25rem; line-height:1.3;">
                      ${img.titulo}
                    </div>
                    <div style="font-size:0.75rem; color:var(--slate-500); margin-bottom:0.5rem;">
                      📅 ${core.formatDateBR(img.data)} &nbsp;·&nbsp; 👤 ${img.autor || 'Equipe SIPA'}
                    </div>
                    <p style="font-size:0.8rem; color:var(--slate-600); margin:0 0 0.75rem 0; line-height:1.4; flex:1;">
                      ${img.descricao || 'Sem observações adicionais.'}
                    </p>
                    <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--slate-100); padding-top:0.6rem;">
                      <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.abrirModalVisualizarImagem('${img.id}')">
                        🔍 Ampliar
                      </button>
                      <div style="display:flex; gap:0.25rem;">
                        <a href="${img.url}" download="${(img.titulo || 'sipa-imagem').replace(/[^a-zA-Z0-9]/g, '_')}.png" class="btn btn-sm btn-secondary" title="Baixar imagem">
                          ⬇️
                        </a>
                        ${
                          isAdmin
                            ? `
                          <button class="btn btn-sm btn-danger" onclick="AmadeusViews.excluirImagemAreaSipa('${img.id}')" title="Excluir imagem">
                            🗑️
                          </button>
                        `
                            : ''
                        }
                      </div>
                    </div>
                  </div>
                </div>
              `;
              })
              .join('')}
          </div>
        `
        }
      </div>
    `;
  },

  inicializarMapaSipa() {
    const container = document.getElementById('sipa-mapa-leaf');
    if (!container) return;
    if (typeof L === 'undefined') {
      container.innerHTML = `
        <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; color:var(--slate-500); padding:2rem; text-align:center;">
          <div style="font-size:2rem; margin-bottom:0.5rem;">🛰️</div>
          <div>Carregando recursos de satélite Leaflet...</div>
        </div>
      `;
      return;
    }

    if (this._sipaLeafletMap) {
      try {
        this._sipaLeafletMap.remove();
      } catch (err) {
        console.warn('Erro ao resetar mapa:', err);
      }
      this._sipaLeafletMap = null;
    }

    const core = window.AmadeusCore;
    const mapaArea = core.db.sipa?.mapaArea || {
      lat: -14.2885,
      lng: -39.8142,
      zoom: 17,
      nomeArea: 'Área Experimental SIPA & Plantio Direto · Campus IF Baiano',
      pontosMarcados: []
    };

    const map = L.map('sipa-mapa-leaf', {
      center: [mapaArea.lat, mapaArea.lng],
      zoom: mapaArea.zoom || 17,
      zoomControl: true,
      attributionControl: true
    });
    this._sipaLeafletMap = map;

    // Satélite Esri World Imagery (HD Satellite tiles)
    const sateliteEsri = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Tiles &copy; Esri, Maxar, Earthstar Geographics',
      maxZoom: 19
    });

    // OpenStreetMap Standard
    const mapaOSM = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 19
    });

    sateliteEsri.addTo(map);

    const baseLayers = {
      "🛰️ Satélite Esri HD (Recomendado)": sateliteEsri,
      "🗺️ Mapa Rodoviário / Ruas (OSM)": mapaOSM
    };
    L.control.layers(baseLayers, null, { position: 'topright' }).addTo(map);

    // Custom Icon Generator
    const criarIcone = (emoji, bg) => L.divIcon({
      className: 'custom-leaflet-marker',
      html: `<div style="background:${bg}; color:#ffffff; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:18px; box-shadow:0 3px 8px rgba(0,0,0,0.35); border:2.5px solid #ffffff;">${emoji}</div>`,
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -20]
    });

    // Marcador Central da Gleba Experimental
    const markerSede = L.marker([mapaArea.lat, mapaArea.lng], {
      icon: criarIcone('🌱', '#166534')
    }).addTo(map);

    markerSede.bindPopup(`
      <div style="font-size:0.86rem; line-height:1.45; min-width:210px;">
        <strong style="color:#14532d; font-size:0.95rem;">🌱 ${mapaArea.nomeArea}</strong><br/>
        <span style="font-size:0.8rem; color:#475569;">${mapaArea.descricao || 'Área destinada ao Sistema de Plantio Direto e ILP'}</span>
        <hr style="margin:0.4rem 0; border:0; border-top:1px solid #e2e8f0;"/>
        📐 <strong>Área:</strong> ${mapaArea.areaHa || 1.5} ha (${mapaArea.perimetroM || 520} m perímetro)<br/>
        📍 <strong>GPS:</strong> ${mapaArea.lat.toFixed(6)}, ${mapaArea.lng.toFixed(6)}<br/>
        <div style="margin-top:0.45rem;">
          <a href="${mapaArea.linkGoogleMaps}" target="_blank" rel="noopener noreferrer" style="color:#0284c7; font-weight:700; text-decoration:none;">
            🌍 Abrir no Google Maps &rarr;
          </a>
        </div>
      </div>
    `).openPopup();

    // Raio visual circular aproximado da gleba experimental (70 metros de raio ~ 1.5 ha)
    L.circle([mapaArea.lat, mapaArea.lng], {
      color: '#16a34a',
      fillColor: '#22c55e',
      fillOpacity: 0.16,
      weight: 2.5,
      dashArray: '6, 6',
      radius: 68
    }).addTo(map);

    // Marcadores adicionais (Pluviômetro, Piquetes, etc.)
    if (Array.isArray(mapaArea.pontosMarcados)) {
      mapaArea.pontosMarcados.forEach((pt) => {
        let emoji = '📌';
        let bg = '#0284c7';
        if (pt.tipo === 'pluviometro') { emoji = '🌧️'; bg = '#2563eb'; }
        else if (pt.tipo === 'pastejo') { emoji = '🐂'; bg = '#d97706'; }
        else if (pt.tipo === 'talhao') { emoji = '🌾'; bg = '#15803d'; }

        const m = L.marker([pt.lat, pt.lng], { icon: criarIcone(emoji, bg) }).addTo(map);
        m.bindPopup(`
          <div style="font-size:0.84rem; line-height:1.4;">
            <strong style="font-size:0.9rem;">${emoji} ${pt.rotulo}</strong><br/>
            <span>${pt.obs || ''}</span><br/>
            <small style="color:#64748b;">GPS: ${pt.lat.toFixed(6)}, ${pt.lng.toFixed(6)}</small>
          </div>
        `);
      });
    }

    // Clique no mapa para capturar coordenadas
    map.on('click', (e) => {
      const lat = e.latlng.lat.toFixed(6);
      const lng = e.latlng.lng.toFixed(6);
      L.popup()
        .setLatLng(e.latlng)
        .setContent(`
          <div style="font-size:0.82rem;">
            <strong>📍 Ponto Clicado no Campus:</strong><br/>
            Lat: <code>${lat}</code><br/>
            Lng: <code>${lng}</code><br/>
            <div style="margin-top:0.35rem;">
              <button class="btn btn-sm btn-primary" onclick="AmadeusViews.abrirModalPontoMapaSipa(null, ${lat}, ${lng})">
                📌 Salvar como Novo Marco
              </button>
            </div>
          </div>
        `)
        .openOn(map);
    });

    setTimeout(() => {
      map.invalidateSize();
    }, 150);
  },

  recentralizarMapaSipa() {
    if (!this._sipaLeafletMap) {
      this.inicializarMapaSipa();
      return;
    }
    const core = window.AmadeusCore;
    const mapaArea = core.db.sipa?.mapaArea || { lat: -14.2885, lng: -39.8142, zoom: 17 };
    this._sipaLeafletMap.setView([mapaArea.lat, mapaArea.lng], mapaArea.zoom || 17);
    this._sipaLeafletMap.invalidateSize();
    core.toast('🎯 Mapa centralizado na Área Experimental SIPA.');
  },

  capturarGpsAreaSipa() {
    const core = window.AmadeusCore;
    if (!navigator.geolocation) {
      core.toast('⚠️ Geolocalização não suportada neste navegador.', 'error');
      return;
    }

    core.toast('🛰️ Obtendo coordenadas GPS do dispositivo...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const precisao = Math.round(pos.coords.accuracy || 0);

        if (!core.db.sipa.mapaArea) {
          core.db.sipa.mapaArea = {
            nomeArea: 'Área Experimental SIPA & Plantio Direto · Campus IF Baiano',
            lat: -14.2885,
            lng: -39.8142,
            areaHa: 1.5,
            perimetroM: 520,
            imagensCroqui: [],
            pontosMarcados: []
          };
        }

        core.db.sipa.mapaArea.lat = lat;
        core.db.sipa.mapaArea.lng = lng;
        core.db.sipa.mapaArea.linkGoogleMaps = `https://maps.google.com/?q=${lat},${lng}`;
        core.db.sipa.mapaArea.linkGoogleEarth = `https://earth.google.com/web/search/${lat},${lng}`;

        core.saveDatabase(`Atualizou GPS da Área Experimental SIPA: ${lat}, ${lng}`);
        core.toast(`📍 GPS atualizado com sucesso! Precisão: ±${precisao}m`);

        if (this._sipaLeafletMap) {
          this._sipaLeafletMap.setView([lat, lng], 17);
        }
        this.renderMainContent();
      },
      (err) => {
        let msg = 'Não foi possível capturar o GPS.';
        if (err.code === 1) msg = 'Permissão de localização negada pelo usuário.';
        else if (err.code === 2) msg = 'Sinal de GPS indisponível.';
        else if (err.code === 3) msg = 'Tempo limite de busca do GPS esgotado.';
        core.toast(`⚠️ ${msg}`, 'error');
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 0 }
    );
  },

  copiarCoordenadasAreaSipa() {
    const core = window.AmadeusCore;
    const m = core.db.sipa?.mapaArea || { lat: -14.2885, lng: -39.8142 };
    const texto = `🌱 *AMADEUS — Área Experimental SIPA & Plantio Direto (Campus IF Baiano)*\n` +
      `📍 Coordenadas: ${m.lat.toFixed(6)}, ${m.lng.toFixed(6)}\n` +
      `📐 Dimensão: ${m.areaHa || 1.5} ha | Perímetro: ${m.perimetroM || 520} m\n` +
      `🌍 Google Maps: ${m.linkGoogleMaps || `https://maps.google.com/?q=${m.lat},${m.lng}`}\n` +
      `🛰️ Google Earth: ${m.linkGoogleEarth || `https://earth.google.com/web/search/${m.lat},${m.lng}`}\n` +
      `🌾 Sistema: Plantio Direto na Palhada (Milho + Brachiaria / ILP)`;

    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(texto).then(() => {
        core.toast('📋 Coordenadas e links copiados para a área de transferência!');
      }).catch(() => {
        prompt('Copie as coordenadas e links abaixo:', texto);
      });
    } else {
      prompt('Copie as coordenadas e links abaixo:', texto);
    }
  },

  filtrarGaleriaSipa(filtro) {
    this._sipaGaleriaFiltro = filtro;
    this.renderMainContent();
  },

  abrirModalVisualizarImagem(id) {
    const core = window.AmadeusCore;
    const lista = core.db.sipa?.mapaArea?.imagensCroqui || [];
    const img = lista.find((x) => x.id === id);
    if (!img) return;

    this.abrirModalGenerico(
      `🖼️ ${img.titulo}`,
      `
        <div style="text-align:center;">
          <div style="background:#0f172a; border-radius:10px; overflow:hidden; max-height:68vh; display:flex; align-items:center; justify-content:center; margin-bottom:1rem;">
            <img src="${img.url}" alt="${img.titulo}" style="max-width:100%; max-height:68vh; object-fit:contain;" />
          </div>
          <div style="text-align:left; background:var(--slate-50); padding:0.9rem; border-radius:8px; border:1px solid var(--slate-200); font-size:0.86rem; color:var(--slate-700);">
            <div style="display:flex; justify-content:space-between; flex-wrap:wrap; margin-bottom:0.4rem;">
              <span><strong>Categoria:</strong> ${img.categoria}</span>
              <span><strong>Data:</strong> ${core.formatDateBR(img.data)} &nbsp;·&nbsp; <strong>Autor:</strong> ${img.autor || 'Equipe SIPA'}</span>
            </div>
            <div><strong>Descrição:</strong> ${img.descricao || 'Sem descrição.'}</div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
            <a href="${img.url}" download="${(img.titulo || 'sipa-imagem').replace(/[^a-zA-Z0-9]/g, '_')}.png" class="btn btn-primary">
              ⬇️ Baixar Imagem em Alta Resolução
            </a>
            <button class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Fechar</button>
          </div>
        </div>
      `
    );
  },

  abrirModalImagemAreaSipa() {
    const core = window.AmadeusCore;
    if (!core.requireCreate('adicionar foto ou croqui da área')) return;
    const autorPadrao = core.currentUser?.nome || 'Equipe SIPA · IF Baiano';
    const hoje = new Date().toISOString().slice(0, 10);

    this.abrirModalGenerico(
      '📸 Adicionar Foto, Croqui ou Imagem da Área Experimental',
      `
        <form onsubmit="AmadeusViews.salvarImagemAreaSipa(event)">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1;">
              <label>Título da Imagem / Croqui *</label>
              <input type="text" id="sipa-img-titulo" class="form-control" placeholder="Ex: Vista Aérea da Gleba 01 em Plantio Direto" required />
            </div>
            <div class="form-group">
              <label>Categoria do Registro *</label>
              <select id="sipa-img-categoria" class="form-control" required>
                <option value="Croqui Técnico">📐 Croqui / Mapa Esquemático</option>
                <option value="Foto do Campo" selected>📸 Foto Atual do Campo</option>
                <option value="Antes do Plantio">⏳ Área Antes do Plantio</option>
                <option value="Foto de Drone">🛰️ Foto Aérea / Drone</option>
                <option value="Solo / Raízes">🔬 Perfil de Solo / Raízes / Palhada</option>
              </select>
            </div>
            <div class="form-group">
              <label>Data da Foto / Registro *</label>
              <input type="date" id="sipa-img-data" class="form-control" value="${hoje}" required />
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Autor / Fotógrafo / Responsável *</label>
              <input type="text" id="sipa-img-autor" class="form-control" value="${autorPadrao}" required />
            </div>
          </div>

          <div style="background:var(--slate-50); border:1px solid var(--slate-200); border-radius:10px; padding:0.9rem; margin-bottom:1rem;">
            <label style="font-weight:700; font-size:0.86rem; color:var(--slate-800); display:block; margin-bottom:0.4rem;">
              Carregar Arquivo de Imagem (Câmera ou Galeria do Celular/PC)
            </label>
            <input type="file" id="sipa-img-file" class="form-control" accept="image/*" onchange="AmadeusViews.processarUploadImagemArea(this)" />
            <input type="hidden" id="sipa-img-base64" />
            <div style="margin-top:0.5rem; font-size:0.75rem; color:var(--slate-500);">
              💡 <em>Dica:</em> As fotos do celular são otimizadas e comprimidas automaticamente para carregar com rapidez mesmo sem internet no campo.
            </div>

            <div style="margin:0.75rem 0; font-size:0.8rem; font-weight:700; color:var(--slate-400); text-align:center;">— OU INSERIR LINK EXTERNO —</div>

            <label style="font-size:0.82rem; font-weight:600; color:var(--slate-700); display:block; margin-bottom:0.25rem;">
              Link Direto / URL da Imagem (opcional)
            </label>
            <input type="url" id="sipa-img-url" class="form-control" placeholder="https://exemplo.com/imagem.jpg" oninput="if(this.value){document.getElementById('sipa-img-preview').src=this.value; document.getElementById('sipa-img-preview').style.display='block';}" />

            <div style="margin-top:0.75rem; text-align:center;">
              <img id="sipa-img-preview" src="" alt="Pré-visualização" style="display:none; max-width:100%; max-height:220px; border-radius:8px; border:1px solid var(--slate-300); margin:0 auto; object-fit:contain;" />
            </div>
          </div>

          <div class="form-group" style="margin-bottom:1rem;">
            <label>Descrição / Observações Técnicas</label>
            <textarea id="sipa-img-desc" class="form-control" rows="2" placeholder="Ex: Avaliação de palhada aos 45 dias após dessecação da forrageira..."></textarea>
          </div>

          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar na Galeria</button>
          </div>
        </form>
      `
    );
  },

  processarUploadImagemArea(input) {
    if (!input.files || !input.files[0]) return;
    const file = input.files[0];
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const maxWidth = 1280;
        const maxHeight = 960;
        let width = img.width;
        let height = img.height;

        if (width > maxWidth || height > maxHeight) {
          if (width / height > maxWidth / maxHeight) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          } else {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.8);

        const preview = document.getElementById('sipa-img-preview');
        const hiddenInput = document.getElementById('sipa-img-base64');
        if (preview) {
          preview.src = dataUrl;
          preview.style.display = 'block';
        }
        if (hiddenInput) {
          hiddenInput.value = dataUrl;
        }
      };
      img.src = e.target.result;
    };
    reader.readAsDataURL(file);
  },

  salvarImagemAreaSipa(e) {
    e.preventDefault();
    const core = window.AmadeusCore;
    const base64 = document.getElementById('sipa-img-base64')?.value;
    const url = document.getElementById('sipa-img-url')?.value.trim();
    const finalUrl = base64 || url;

    if (!finalUrl) {
      core.toast('⚠️ Por favor, selecione uma foto pelo arquivo ou insira uma URL válida.', 'error');
      return;
    }

    if (!core.db.sipa.mapaArea) {
      core.db.sipa.mapaArea = { imagensCroqui: [], pontosMarcados: [] };
    }
    if (!Array.isArray(core.db.sipa.mapaArea.imagensCroqui)) {
      core.db.sipa.mapaArea.imagensCroqui = [];
    }

    const novaImagem = {
      id: 'sipa-img-' + Date.now(),
      titulo: document.getElementById('sipa-img-titulo').value.trim(),
      categoria: document.getElementById('sipa-img-categoria').value,
      data: document.getElementById('sipa-img-data').value,
      autor: document.getElementById('sipa-img-autor').value.trim(),
      url: finalUrl,
      descricao: document.getElementById('sipa-img-desc').value.trim()
    };

    core.db.sipa.mapaArea.imagensCroqui.unshift(novaImagem);
    core.saveDatabase(`Adicionou imagem da área SIPA: ${novaImagem.titulo}`);
    core.toast('📸 Foto / Croqui adicionado com sucesso à galeria!');
    this.fecharModal();
    this.renderMainContent();
  },

  excluirImagemAreaSipa(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir fotos da área')) return;
    if (!confirm('Tem certeza que deseja excluir esta foto/croqui da galeria?')) return;

    if (core.db.sipa?.mapaArea?.imagensCroqui) {
      core.db.sipa.mapaArea.imagensCroqui = core.db.sipa.mapaArea.imagensCroqui.filter((x) => x.id !== id);
      core.saveDatabase('Excluiu imagem da área SIPA');
      core.toast('Imagem removida da galeria.');
      this.renderMainContent();
    }
  },

  abrirModalEditarAreaSipa() {
    const core = window.AmadeusCore;
    if (!core.requireCreate('editar configurações da área experimental')) return;
    const m = core.db.sipa?.mapaArea || {
      nomeArea: 'Área Experimental SIPA & Plantio Direto · Campus IF Baiano',
      descricao: 'Gleba destinada ao projeto de Sistema de Plantio Direto (SPD) e consórcios forrageiros (Milho + Brachiaria / Integração Lavoura-Pecuária).',
      lat: -14.2885,
      lng: -39.8142,
      zoom: 17,
      areaHa: 1.5,
      perimetroM: 520,
      linkGoogleMaps: 'https://maps.google.com/?q=-14.2885,-39.8142',
      linkGoogleEarth: 'https://earth.google.com/web/search/-14.2885,-39.8142'
    };

    this.abrirModalGenerico(
      '✏️ Configurar Dados, Coordenadas e Links da Área Experimental',
      `
        <form onsubmit="AmadeusViews.salvarDadosAreaSipa(event)">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1;">
              <label>Nome / Identificação da Área *</label>
              <input type="text" id="sipa-cfg-nome" class="form-control" value="${m.nomeArea}" required />
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Descrição e Finalidade Técnica</label>
              <textarea id="sipa-cfg-desc" class="form-control" rows="2">${m.descricao || ''}</textarea>
            </div>
            <div class="form-group">
              <label>Latitude Central (graus decimais) *</label>
              <input type="number" step="0.000001" id="sipa-cfg-lat" class="form-control" value="${m.lat}" required />
            </div>
            <div class="form-group">
              <label>Longitude Central (graus decimais) *</label>
              <input type="number" step="0.000001" id="sipa-cfg-lng" class="form-control" value="${m.lng}" required />
            </div>
            <div class="form-group">
              <label>Área Total (Hectares - ha) *</label>
              <input type="number" step="0.01" id="sipa-cfg-ha" class="form-control" value="${m.areaHa || 1.5}" required />
            </div>
            <div class="form-group">
              <label>Perímetro Linear Estimado (Metros - m)</label>
              <input type="number" step="1" id="sipa-cfg-perim" class="form-control" value="${m.perimetroM || 520}" />
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Link Direto Google Maps</label>
              <input type="url" id="sipa-cfg-maps" class="form-control" value="${m.linkGoogleMaps || ''}" />
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Link Direto Google Earth</label>
              <input type="url" id="sipa-cfg-earth" class="form-control" value="${m.linkGoogleEarth || ''}" />
            </div>
          </div>
          <div style="margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
            <button type="button" class="btn btn-sm btn-secondary" onclick="AmadeusViews.preencherGpsNoFormulario()">
              📍 Preencher com GPS Atual do Aparelho
            </button>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Configurações da Área</button>
          </div>
        </form>
      `
    );
  },

  preencherGpsNoFormulario() {
    const core = window.AmadeusCore;
    if (!navigator.geolocation) {
      core.toast('⚠️ Geolocalização não suportada.', 'error');
      return;
    }
    core.toast('🛰️ Capturando coordenadas...');
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        const latEl = document.getElementById('sipa-cfg-lat');
        const lngEl = document.getElementById('sipa-cfg-lng');
        const mapsEl = document.getElementById('sipa-cfg-maps');
        const earthEl = document.getElementById('sipa-cfg-earth');
        if (latEl) latEl.value = lat;
        if (lngEl) lngEl.value = lng;
        if (mapsEl) mapsEl.value = `https://maps.google.com/?q=${lat},${lng}`;
        if (earthEl) earthEl.value = `https://earth.google.com/web/search/${lat},${lng}`;
        core.toast('📍 Coordenadas preenchidas no formulário!');
      },
      () => {
        core.toast('⚠️ Erro ao capturar sinal de GPS.', 'error');
      },
      { enableHighAccuracy: true }
    );
  },

  salvarDadosAreaSipa(e) {
    e.preventDefault();
    const core = window.AmadeusCore;
    const lat = parseFloat(document.getElementById('sipa-cfg-lat').value);
    const lng = parseFloat(document.getElementById('sipa-cfg-lng').value);

    if (!core.db.sipa.mapaArea) {
      core.db.sipa.mapaArea = { imagensCroqui: [], pontosMarcados: [] };
    }

    core.db.sipa.mapaArea.nomeArea = document.getElementById('sipa-cfg-nome').value.trim();
    core.db.sipa.mapaArea.descricao = document.getElementById('sipa-cfg-desc').value.trim();
    core.db.sipa.mapaArea.lat = lat;
    core.db.sipa.mapaArea.lng = lng;
    core.db.sipa.mapaArea.areaHa = parseFloat(document.getElementById('sipa-cfg-ha').value) || 1.5;
    core.db.sipa.mapaArea.perimetroM = parseFloat(document.getElementById('sipa-cfg-perim').value) || 520;
    core.db.sipa.mapaArea.linkGoogleMaps =
      document.getElementById('sipa-cfg-maps').value.trim() || `https://maps.google.com/?q=${lat},${lng}`;
    core.db.sipa.mapaArea.linkGoogleEarth =
      document.getElementById('sipa-cfg-earth').value.trim() || `https://earth.google.com/web/search/${lat},${lng}`;

    core.saveDatabase('Atualizou configurações e links da Área Experimental SIPA');
    core.toast('✅ Informações e links da Área SIPA atualizados com sucesso!');
    this.fecharModal();
    this.renderMainContent();
  },

  abrirModalPontoMapaSipa(idExistente = null, latSugerida = null, lngSugerida = null) {
    const core = window.AmadeusCore;
    if (!core.requireCreate('marcar ponto no mapa')) return;
    const pontos = core.db.sipa?.mapaArea?.pontosMarcados || [];
    const ex = idExistente ? pontos.find((p) => p.id === idExistente) : null;
    const latDef = latSugerida || (ex ? ex.lat : core.db.sipa?.mapaArea?.lat || -14.2885);
    const lngDef = lngSugerida || (ex ? ex.lng : core.db.sipa?.mapaArea?.lng || -39.8142);

    this.abrirModalGenerico(
      '📌 Adicionar / Editar Ponto no Mapa SIPA',
      `
        <form onsubmit="AmadeusViews.salvarPontoMapaSipa(event, '${idExistente || ''}')">
          <div class="form-grid">
            <div class="form-group" style="grid-column:1/-1;">
              <label>Nome / Rótulo do Ponto *</label>
              <input type="text" id="sipa-pt-rotulo" class="form-control" value="${ex ? ex.rotulo : ''}" placeholder="Ex: Pluviômetro Gleba 01, Trincheira Solo..." required />
            </div>
            <div class="form-group">
              <label>Tipo de Marco *</label>
              <select id="sipa-pt-tipo" class="form-control" required>
                <option value="talhao" ${ex && ex.tipo === 'talhao' ? 'selected' : ''}>🌾 Talhão / Gleba SPD</option>
                <option value="pluviometro" ${ex && ex.tipo === 'pluviometro' ? 'selected' : ''}>🌧️ Pluviômetro</option>
                <option value="pastejo" ${ex && ex.tipo === 'pastejo' ? 'selected' : ''}>🐂 Piquete / Pastejo</option>
                <option value="solo" ${ex && ex.tipo === 'solo' ? 'selected' : ''}>🔬 Coleta de Solo / Trincheira</option>
                <option value="infra" ${ex && ex.tipo === 'infra' ? 'selected' : ''}>🚜 Acesso / Equipamento</option>
              </select>
            </div>
            <div class="form-group">
              <label>Latitude *</label>
              <input type="number" step="0.000001" id="sipa-pt-lat" class="form-control" value="${latDef}" required />
            </div>
            <div class="form-group">
              <label>Longitude *</label>
              <input type="number" step="0.000001" id="sipa-pt-lng" class="form-control" value="${lngDef}" required />
            </div>
            <div class="form-group" style="grid-column:1/-1;">
              <label>Observação / Descrição</label>
              <input type="text" id="sipa-pt-obs" class="form-control" value="${ex ? ex.obs : ''}" placeholder="Ex: Leituras diárias, profundidade 0-20 cm..." />
            </div>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem; margin-top:1rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Ponto no Mapa</button>
          </div>
        </form>
      `
    );
  },

  salvarPontoMapaSipa(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.db.sipa.mapaArea) {
      core.db.sipa.mapaArea = { imagensCroqui: [], pontosMarcados: [] };
    }
    if (!Array.isArray(core.db.sipa.mapaArea.pontosMarcados)) {
      core.db.sipa.mapaArea.pontosMarcados = [];
    }

    const novo = {
      id: idExistente || 'sipa-pt-' + Date.now(),
      rotulo: document.getElementById('sipa-pt-rotulo').value.trim(),
      tipo: document.getElementById('sipa-pt-tipo').value,
      lat: parseFloat(document.getElementById('sipa-pt-lat').value),
      lng: parseFloat(document.getElementById('sipa-pt-lng').value),
      obs: document.getElementById('sipa-pt-obs').value.trim()
    };

    if (idExistente) {
      const idx = core.db.sipa.mapaArea.pontosMarcados.findIndex((x) => x.id === idExistente);
      if (idx !== -1) core.db.sipa.mapaArea.pontosMarcados[idx] = novo;
    } else {
      core.db.sipa.mapaArea.pontosMarcados.push(novo);
    }

    core.saveDatabase(`Salvou ponto no mapa SIPA: ${novo.rotulo}`);
    core.toast('📌 Ponto marcado no mapa com sucesso!');
    this.fecharModal();
    this.renderMainContent();
  },

  excluirPontoMapaSipa(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir ponto do mapa')) return;
    if (!confirm('Deseja excluir este marco do mapa?')) return;

    if (core.db.sipa?.mapaArea?.pontosMarcados) {
      core.db.sipa.mapaArea.pontosMarcados = core.db.sipa.mapaArea.pontosMarcados.filter((x) => x.id !== id);
      core.saveDatabase('Excluiu ponto no mapa SIPA');
      core.toast('Ponto removido do mapa.');
      this.renderMainContent();
    }
  },

  calcularRegulagemPlantioSPD() {
    const pop = parseFloat(document.getElementById('spd-pop')?.value) || 0;
    const espCm = parseFloat(document.getElementById('spd-esp')?.value) || 50;
    const germ = parseFloat(document.getElementById('spd-germ')?.value) || 90;
    const area = parseFloat(document.getElementById('spd-area')?.value) || 1;
    const el = document.getElementById('spd-calc-res');
    if (!el) return;

    const metrosLinearesHa = espCm > 0 ? 10000 / (espCm / 100) : 0;
    const plantasPorMetro = metrosLinearesHa > 0 ? pop / metrosLinearesHa : 0;
    const sementesPorMetro = germ > 0 ? plantasPorMetro / (germ / 100) : plantasPorMetro;
    const totalSementesArea = (germ > 0 ? pop / (germ / 100) : pop) * area;

    el.innerHTML = `
      <strong>Resultado para Regulagem:</strong><br/>
      • Metros lineares por hectare: <strong>${metrosLinearesHa.toFixed(0)} m/ha</strong><br/>
      • Plantas finais por metro: <strong>${plantasPorMetro.toFixed(2)} plantas/m</strong><br/>
      • Regulagem da semeadora (corrigida p/ ${germ}%): <strong>${sementesPorMetro.toFixed(2)} sementes/metro linear</strong><br/>
      • Total de sementes para ${area.toFixed(2)} ha: <strong>${Math.round(totalSementesArea).toLocaleString('pt-BR')} sementes</strong>
    `;
  },

  calcularMassaSecaSPD() {
    const areaQ = parseFloat(document.getElementById('spd-quadro')?.value) || 1;
    const pesoVerdeG = parseFloat(document.getElementById('spd-pverde')?.value) || 0;
    const teorMs = parseFloat(document.getElementById('spd-ms')?.value) || 30;
    const el = document.getElementById('spd-ms-res');
    if (!el) return;

    const mvKgHa = areaQ > 0 ? (pesoVerdeG / 1000 / areaQ) * 10000 : 0;
    const mvTha = mvKgHa / 1000;
    const msTha = mvTha * (teorMs / 100);
    const msKgHa = mvKgHa * (teorMs / 100);

    el.innerHTML = `
      <strong>Estimativa de Produção por Hectare:</strong><br/>
      • Massa Verde Estimada: <strong>${mvTha.toFixed(2)} t MV/ha</strong> (${Math.round(mvKgHa).toLocaleString('pt-BR')} kg/ha)<br/>
      • Massa Seca de Palhada / Forragem: <strong>${msTha.toFixed(2)} t MS/ha</strong> (${Math.round(msKgHa).toLocaleString('pt-BR')} kg MS/ha)<br/>
      • Status SPD: <strong>${
        msTha >= 6
          ? '✅ Acima do patamar recomendado (&ge; 6,0 t MS/ha) para proteção do solo!'
          : '⚠️ Abaixo de 6,0 t MS/ha — reforçar produção de palhada/consorciação.'
      }</strong>
    `;
  },

  abrirModalPlantioSipa(id = null) {
    const core = window.AmadeusCore;
    if (id && !core.requireAdmin('editar plantio SIPA já lançado')) return;
    if (!id && !core.requireCreate('cadastrar novo plantio no módulo SIPA')) return;
    const lista = core.db.sipa?.plantios || [];
    const ex = id ? lista.find((x) => x.id === id) : null;
    const item = ex || {
      gleba: 'Área Experimental SIPA · Campus IF Baiano',
      cultura: '',
      sistema: 'Sistema de Plantio Direto (SPD) na Palhada',
      dataPlantio: new Date().toISOString().slice(0, 10),
      areaHa: 1.0,
      espacamentoCm: 50,
      populacaoHa: 60000,
      palhadaInicialTha: 6.0,
      adubacaoBase: '',
      responsavel: core.currentUser ? core.currentUser.nome : 'Guilherme Dias Pereira',
      status: 'Em Desenvolvimento',
      observacoes: ''
    };

    this.abrirModalGenerico(
      ex ? '✏️ Editar Registro de Plantio SIPA / SPD' : '🌱 Novo Registro de Plantio Direto (SPD) no Campus',
      `
        <form onsubmit="AmadeusViews.salvarPlantioSipa(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Gleba / Talhão no Campus *</label>
              <input type="text" id="sipa-pl-gleba" class="form-control" value="${item.gleba}" required />
            </div>
            <div class="form-group">
              <label>Cultura ou Consórcio *</label>
              <input type="text" id="sipa-pl-cultura" class="form-control" placeholder="Ex.: Milho + Brachiaria ruziziensis, Sorgo, Feijão..." value="${item.cultura}" required />
            </div>
            <div class="form-group">
              <label>Sistema de Manejo *</label>
              <select id="sipa-pl-sistema" class="form-control">
                <option value="Sistema de Plantio Direto (SPD) na Palhada" ${item.sistema.includes('Direto') ? 'selected' : ''}>Sistema de Plantio Direto (SPD) na Palhada</option>
                <option value="Integração Lavoura-Pecuária (ILP / SIPA)" ${item.sistema.includes('ILP') ? 'selected' : ''}>Integração Lavoura-Pecuária (ILP / SIPA)</option>
                <option value="Cultivo de Cobertura / Adubação Verde" ${item.sistema.includes('Cobertura') ? 'selected' : ''}>Cultivo de Cobertura / Adubação Verde</option>
                <option value="Renovação de Pastagem em SPD" ${item.sistema.includes('Pastagem') ? 'selected' : ''}>Renovação de Pastagem em SPD</option>
              </select>
            </div>
            <div class="form-group">
              <label>Data do Plantio *</label>
              <input type="date" id="sipa-pl-data" class="form-control" value="${item.dataPlantio}" required />
            </div>
            <div class="form-group">
              <label>Área Plantada (ha) *</label>
              <input type="number" step="0.01" id="sipa-pl-area" class="form-control" value="${item.areaHa}" required />
            </div>
            <div class="form-group">
              <label>Espaçamento entre Linhas (cm)</label>
              <input type="number" step="1" id="sipa-pl-esp" class="form-control" value="${item.espacamentoCm}" />
            </div>
            <div class="form-group">
              <label>População Alvo (plantas/ha)</label>
              <input type="number" step="100" id="sipa-pl-pop" class="form-control" value="${item.populacaoHa}" />
            </div>
            <div class="form-group">
              <label>Palhada Inicial sobre o Solo (t MS/ha)</label>
              <input type="number" step="0.1" id="sipa-pl-palhada" class="form-control" value="${item.palhadaInicialTha}" />
            </div>
            <div class="form-group">
              <label>Adubação de Base / Cobertura</label>
              <input type="text" id="sipa-pl-adub" class="form-control" placeholder="Ex.: NPK 08-28-16 (300 kg/ha) + Ureia..." value="${item.adubacaoBase}" />
            </div>
            <div class="form-group">
              <label>Status do Plantio</label>
              <select id="sipa-pl-status" class="form-control">
                <option value="Planejado" ${item.status === 'Planejado' ? 'selected' : ''}>Planejado</option>
                <option value="Em Desenvolvimento" ${item.status === 'Em Desenvolvimento' ? 'selected' : ''}>Em Desenvolvimento</option>
                <option value="Em Pastejo / Avaliação" ${item.status === 'Em Pastejo / Avaliação' ? 'selected' : ''}>Em Pastejo / Avaliação</option>
                <option value="Colhido / Concluído" ${item.status === 'Colhido / Concluído' ? 'selected' : ''}>Colhido / Concluído</option>
              </select>
            </div>
            <div class="form-group">
              <label>Responsável Técnico *</label>
              <input type="text" id="sipa-pl-resp" class="form-control" value="${item.responsavel}" required />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Observações Técnicas e Orientações do Professor</label>
            <textarea id="sipa-pl-obs" class="form-control" rows="2">${item.observacoes || ''}</textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Plantio SIPA</button>
          </div>
        </form>
      `
    );
  },

  salvarPlantioSipa(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.db.sipa) core.db.sipa = { plantios: [], avaliacoes: [], registrosCampo: [] };
    const novo = {
      id: idExistente || 'sipa-pl-' + Date.now(),
      gleba: document.getElementById('sipa-pl-gleba').value.trim(),
      cultura: document.getElementById('sipa-pl-cultura').value.trim(),
      sistema: document.getElementById('sipa-pl-sistema').value,
      dataPlantio: document.getElementById('sipa-pl-data').value,
      areaHa: parseFloat(document.getElementById('sipa-pl-area').value) || 0,
      espacamentoCm: parseFloat(document.getElementById('sipa-pl-esp').value) || 0,
      populacaoHa: parseFloat(document.getElementById('sipa-pl-pop').value) || 0,
      palhadaInicialTha: parseFloat(document.getElementById('sipa-pl-palhada').value) || 0,
      adubacaoBase: document.getElementById('sipa-pl-adub').value.trim(),
      status: document.getElementById('sipa-pl-status').value,
      responsavel: document.getElementById('sipa-pl-resp').value.trim(),
      observacoes: document.getElementById('sipa-pl-obs').value.trim()
    };

    if (idExistente) {
      const idx = core.db.sipa.plantios.findIndex((x) => x.id === idExistente);
      if (idx !== -1) core.db.sipa.plantios[idx] = novo;
    } else {
      core.db.sipa.plantios.unshift(novo);
    }

    core.saveDatabase(`Salvou plantio SIPA: ${novo.cultura}`);
    core.toast('🌱 Registro de plantio SIPA salvo com sucesso!');
    this.fecharModal();
    this.renderApp();
  },

  excluirPlantioSipa(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir registro de plantio SIPA')) return;
    core.db.sipa.plantios = (core.db.sipa.plantios || []).filter((x) => x.id !== id);
    core.saveDatabase('Excluiu plantio SIPA');
    core.toast('Registro de plantio removido.');
    this.renderApp();
  },

  abrirModalAvaliacaoSipa(id = null) {
    const core = window.AmadeusCore;
    if (id && !core.requireAdmin('editar avaliação SIPA')) return;
    if (!id && !core.requireCreate('registrar avaliação SIPA')) return;
    const lista = core.db.sipa?.avaliacoes || [];
    const ex = id ? lista.find((x) => x.id === id) : null;
    const item = ex || {
      data: new Date().toISOString().slice(0, 10),
      gleba: 'Área Experimental SIPA · Campus IF Baiano',
      tipoAvaliacao: 'Cobertura de Solo e Massa Seca de Palhada (SPD)',
      coberturaSoloPct: 85,
      massaSecaTha: 6.0,
      alturaPlantaCm: 90,
      umidadeSoloStatus: 'Adequada',
      responsavel: core.currentUser ? core.currentUser.nome : 'Guilherme Dias Pereira',
      observacoes: ''
    };

    this.abrirModalGenerico(
      ex ? '✏️ Editar Avaliação SIPA' : '🍂 Registrar Avaliação de Palhada, Solo e Cultura (SIPA)',
      `
        <form onsubmit="AmadeusViews.salvarAvaliacaoSipa(event, '${ex ? ex.id : ''}')">
          <div class="form-grid">
            <div class="form-group">
              <label>Data da Avaliação *</label>
              <input type="date" id="sipa-av-data" class="form-control" value="${item.data}" required />
            </div>
            <div class="form-group">
              <label>Gleba / Talhão *</label>
              <input type="text" id="sipa-av-gleba" class="form-control" value="${item.gleba}" required />
            </div>
            <div class="form-group">
              <label>Tipo de Avaliação *</label>
              <input type="text" id="sipa-av-tipo" class="form-control" value="${item.tipoAvaliacao}" required />
            </div>
            <div class="form-group">
              <label>Taxa de Cobertura do Solo (%)</label>
              <input type="number" step="1" max="100" id="sipa-av-cob" class="form-control" value="${item.coberturaSoloPct}" />
            </div>
            <div class="form-group">
              <label>Massa Seca de Palhada / Forragem (t/ha)</label>
              <input type="number" step="0.1" id="sipa-av-ms" class="form-control" value="${item.massaSecaTha}" />
            </div>
            <div class="form-group">
              <label>Altura Média de Plantas / Dossel (cm)</label>
              <input type="number" step="1" id="sipa-av-alt" class="form-control" value="${item.alturaPlantaCm}" />
            </div>
            <div class="form-group">
              <label>Condição de Umidade / Solo</label>
              <input type="text" id="sipa-av-umid" class="form-control" value="${item.umidadeSoloStatus}" />
            </div>
            <div class="form-group">
              <label>Responsável *</label>
              <input type="text" id="sipa-av-resp" class="form-control" value="${item.responsavel}" required />
            </div>
          </div>
          <div class="form-group" style="margin-bottom:1rem;">
            <label>Observações e Dados Coletados</label>
            <textarea id="sipa-av-obs" class="form-control" rows="2">${item.observacoes || ''}</textarea>
          </div>
          <div style="display:flex; justify-content:flex-end; gap:0.5rem;">
            <button type="button" class="btn btn-secondary" onclick="AmadeusViews.fecharModal()">Cancelar</button>
            <button type="submit" class="btn btn-primary">💾 Salvar Avaliação</button>
          </div>
        </form>
      `
    );
  },

  salvarAvaliacaoSipa(e, idExistente) {
    e.preventDefault();
    const core = window.AmadeusCore;
    if (!core.db.sipa) core.db.sipa = { plantios: [], avaliacoes: [], registrosCampo: [] };
    const novo = {
      id: idExistente || 'sipa-av-' + Date.now(),
      data: document.getElementById('sipa-av-data').value,
      gleba: document.getElementById('sipa-av-gleba').value.trim(),
      tipoAvaliacao: document.getElementById('sipa-av-tipo').value.trim(),
      coberturaSoloPct: parseFloat(document.getElementById('sipa-av-cob').value) || 0,
      massaSecaTha: parseFloat(document.getElementById('sipa-av-ms').value) || 0,
      alturaPlantaCm: parseFloat(document.getElementById('sipa-av-alt').value) || 0,
      umidadeSoloStatus: document.getElementById('sipa-av-umid').value.trim(),
      responsavel: document.getElementById('sipa-av-resp').value.trim(),
      observacoes: document.getElementById('sipa-av-obs').value.trim()
    };

    if (idExistente) {
      const idx = core.db.sipa.avaliacoes.findIndex((x) => x.id === idExistente);
      if (idx !== -1) core.db.sipa.avaliacoes[idx] = novo;
    } else {
      core.db.sipa.avaliacoes.unshift(novo);
    }

    core.saveDatabase(`Salvou avaliação SIPA: ${novo.tipoAvaliacao}`);
    core.toast('🍂 Avaliação de campo SIPA registrada com sucesso!');
    this.fecharModal();
    this.renderApp();
  },

  excluirAvaliacaoSipa(id) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('excluir avaliação SIPA')) return;
    core.db.sipa.avaliacoes = (core.db.sipa.avaliacoes || []).filter((x) => x.id !== id);
    core.saveDatabase('Excluiu avaliação SIPA');
    core.toast('Avaliação SIPA removida.');
    this.renderApp();
  },

  // ==========================================================================
  // Utilitários de Modal
  // ==========================================================================
  abrirModalGenerico(titulo, htmlCorpo) {
    const root = document.getElementById('modal-root');
    if (!root) return;
    root.innerHTML = `
      <div class="modal-backdrop" onclick="if(event.target===this) AmadeusViews.fecharModal()">
        <div class="modal-card">
          <div class="card-header" style="border-bottom:1px solid var(--slate-200); padding-bottom:0.75rem;">
            <div class="card-title">${titulo}</div>
            <button class="btn btn-sm btn-secondary" onclick="AmadeusViews.fecharModal()">✖</button>
          </div>
          <div>${htmlCorpo}</div>
        </div>
      </div>
    `;
  },

  fecharModal() {
    const root = document.getElementById('modal-root');
    if (root) root.innerHTML = '';
  }
};

window.AmadeusViews = AmadeusViews;
