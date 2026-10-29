// ============================================================================
// AMADEUS - Integração Profissional com Firebase (amadeus-80eeb) e GitHub
// ============================================================================

const CLOUD_CONFIG_KEY = 'AMADEUS_CLOUD_CONFIG_V3';

const DEFAULT_FIREBASE_CONFIG = {
  enabled: true,
  apiKey: 'AIzaSyAXhRzldjIUYZfoRhnN9RingBmCmryM6SA',
  authDomain: 'amadeus-80eeb.firebaseapp.com',
  databaseURL: 'https://amadeus-80eeb-default-rtdb.firebaseio.com',
  projectId: 'amadeus-80eeb',
  storageBucket: 'amadeus-80eeb.firebasestorage.app',
  messagingSenderId: '742306360275',
  appId: '1:742306360275:web:09eddda41dcc79980a9d26',
  measurementId: 'G-4PT4HMYN9J',
  lastSync: null,
  statusMsg: 'Projeto amadeus-80eeb configurado'
};

const AmadeusCloud = {
  config: {
    firebase: { ...DEFAULT_FIREBASE_CONFIG },
    github: {
      enabled: true,
      owner: 'dg4565198-coder',
      repo: 'amadeus',
      branch: 'main',
      token: '',
      lastPush: new Date().toISOString(),
      pagesUrl: 'https://dg4565198-coder.github.io/amadeus/'
    }
  },

  init() {
    try {
      const saved = localStorage.getItem(CLOUD_CONFIG_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        this.config = {
          firebase: { ...DEFAULT_FIREBASE_CONFIG, ...(parsed.firebase || {}) },
          github: { ...this.config.github, ...(parsed.github || {}) }
        };
      }
      // Garante que as credenciais oficiais do projeto amadeus-80eeb estejam preenchidas
      if (!this.config.firebase.projectId || this.config.firebase.projectId === '') {
        this.config.firebase = { ...DEFAULT_FIREBASE_CONFIG };
      }
      this.saveConfig();
    } catch (_) {}

    if (this.config.firebase.enabled) {
      this.pullFromFirebase(true);
    }
  },

  saveConfig() {
    localStorage.setItem(CLOUD_CONFIG_KEY, JSON.stringify(this.config));
  },

  // ==========================================================================
  // 1. INTEGRAÇÃO FIREBASE (Realtime Database + Firestore Fallback + Auth)
  // ==========================================================================
  normalizarDatabaseURL(inputUrl, projectId) {
    let url = (inputUrl || '').trim().replace(/\/+$/, '');
    if (!url && projectId) {
      url = `https://${projectId.trim()}-default-rtdb.firebaseio.com`;
    }
    return url;
  },

  async configurarFirebase(formObj) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('configurar a integração com o Firebase')) return;

    this.config.firebase = {
      ...this.config.firebase,
      enabled: true,
      apiKey: (formObj.apiKey || DEFAULT_FIREBASE_CONFIG.apiKey).trim(),
      authDomain: (formObj.authDomain || DEFAULT_FIREBASE_CONFIG.authDomain).trim(),
      projectId: (formObj.projectId || DEFAULT_FIREBASE_CONFIG.projectId).trim(),
      databaseURL: this.normalizarDatabaseURL(formObj.databaseURL, formObj.projectId || DEFAULT_FIREBASE_CONFIG.projectId)
    };
    this.saveConfig();
    core.toast('Configuração do Firebase (amadeus-80eeb) salva! Sincronizando dados...');
    await this.pushToFirebase(false);
    window.AmadeusViews.renderApp();
  },

  async pushToFirebase(silent = false) {
    const fb = this.config.firebase;
    if (!fb.enabled || !fb.databaseURL) return false;

    try {
      const endpoint = `${fb.databaseURL}/amadeus_db.json${fb.idToken ? `?auth=${fb.idToken}` : ''}`;
      const res = await fetch(endpoint, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(window.AmadeusCore.db)
      });

      if (res.ok) {
        fb.lastSync = new Date().toISOString();
        fb.statusMsg = 'Sincronizado no Realtime Database';
        this.saveConfig();
        if (!silent) {
          window.AmadeusCore.toast('🔥 Dados sincronizados com sucesso no Firebase (amadeus-80eeb)!');
          window.AmadeusViews.renderApp();
        }
        return true;
      }

      // Se Realtime Database ainda não foi criado no painel, tenta Cloud Firestore REST API
      const fsEndpoint = `https://firestore.googleapis.com/v1/projects/${fb.projectId}/databases/(default)/documents/amadeus/estado_global?key=${fb.apiKey}`;
      const fsRes = await fetch(fsEndpoint, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          fields: {
            payloadJson: { stringValue: JSON.stringify(window.AmadeusCore.db) },
            atualizadoEm: { stringValue: new Date().toISOString() }
          }
        })
      });

      if (fsRes.ok) {
        fb.lastSync = new Date().toISOString();
        fb.statusMsg = 'Sincronizado no Cloud Firestore';
        this.saveConfig();
        if (!silent) {
          window.AmadeusCore.toast('🔥 Dados sincronizados com sucesso no Cloud Firestore (amadeus-80eeb)!');
          window.AmadeusViews.renderApp();
        }
        return true;
      }

      throw new Error(`Ative o Realtime Database ou Firestore no console do projeto ${fb.projectId}`);
    } catch (err) {
      if (!silent) {
        window.AmadeusCore.toast(
          'Para concluir a sincronização: no menu esquerdo do Firebase clique em "Bancos de dados" > "Realtime Database" > "Criar banco de dados" (Modo de teste).',
          'aviso'
        );
      }
      return false;
    }
  },

  async pullFromFirebase(silent = false) {
    const fb = this.config.firebase;
    if (!fb.enabled || !fb.databaseURL) return false;
    try {
      const endpoint = `${fb.databaseURL}/amadeus_db.json${fb.idToken ? `?auth=${fb.idToken}` : ''}`;
      const res = await fetch(endpoint);
      if (res.ok) {
        const remoteDb = await res.json();
        if (remoteDb && remoteDb.chuvas && remoteDb.usuarios) {
          window.AmadeusCore.db = remoteDb;
          localStorage.setItem('AMADEUS_DB_V2', JSON.stringify(remoteDb));
          // Atualiza o perfil/status do usuário logado caso o Admin tenha mudado na nuvem
          if (window.AmadeusCore.currentUser) {
            const atualizado = remoteDb.usuarios.find((u) => u.id === window.AmadeusCore.currentUser.id);
            if (atualizado) {
              if (!atualizado.ativo || atualizado.statusAcesso === 'recusado' || atualizado.statusAcesso === 'pendente') {
                window.AmadeusCore.logout();
              } else {
                window.AmadeusCore.currentUser = atualizado;
                localStorage.setItem('AMADEUS_SESSION_V3', JSON.stringify(atualizado));
              }
            }
          }
          fb.lastSync = new Date().toISOString();
          fb.statusMsg = 'Conectado e sincronizado (Realtime DB)';
          this.saveConfig();
          if (!silent) {
            window.AmadeusCore.toast('☁️ Base de dados atualizada a partir do Firebase (amadeus-80eeb)!');
          }
          window.AmadeusViews.renderApp();
          return true;
        } else if (remoteDb === null) {
          // Banco Realtime Database recém-criado e vazio: envia a base inicial do AMADEUS automaticamente!
          await this.pushToFirebase(silent);
          return true;
        }
      }
    } catch (_) {
      if (!silent) {
        window.AmadeusCore.toast('Ative o Realtime Database (em modo de teste) no menu esquerdo do Firebase Console.', 'aviso');
      }
    }
    return false;
  },

  async loginComFirebaseAuth(email, password) {
    const fb = this.config.firebase;
    if (!fb.apiKey) {
      window.AmadeusCore.toast('API Key do Firebase não encontrada.', 'aviso');
      return false;
    }
    try {
      await this.pullFromFirebase(true);
      const core = window.AmadeusCore;
      const user = core.db.usuarios.find((u) => (u.email || '').toLowerCase() === email.toLowerCase());
      if (user && user.statusAcesso === 'pendente') {
        core.toast('⏳ Seu cadastro está aguardando autorização do Administrador.', 'aviso');
        return false;
      }
      if (user && (user.statusAcesso === 'recusado' || !user.ativo)) {
        core.toast('🚫 Seu acesso está bloqueado pelo Administrador.', 'erro');
        return false;
      }

      let res = await fetch(
        `https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${encodeURIComponent(fb.apiKey)}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password, returnSecureToken: true })
        }
      );
      let data = await res.json();

      if (!res.ok) {
        throw new Error(data.error?.message || 'Falha na autenticação Firebase');
      }

      fb.idToken = data.idToken;
      fb.authEmail = data.email;
      this.saveConfig();

      if (!user) {
        core.toast('Conta autenticada no Firebase, mas ainda não autorizada na lista de usuários do AMADEUS. Solicite acesso na aba de Cadastro!', 'aviso');
        return false;
      }
      core.currentUser = user;
      localStorage.setItem('AMADEUS_SESSION_V3', JSON.stringify(user));
      core.toast(`🔥 Autenticado via Firebase Auth (${data.email}) como ${user.nome}!`);
      window.AmadeusViews.renderApp();
      return true;
    } catch (err) {
      window.AmadeusCore.toast(
        `Aviso Firebase Auth (${err.message}): certifique-se de ativar "Authentication > E-mail/senha" no console do Firebase.`,
        'aviso'
      );
      return false;
    }
  },

  // ==========================================================================
  // 2. INTEGRAÇÃO GITHUB (Publicação Direta via API + Backup no Repositório)
  // ==========================================================================
  async salvarConfigGitHub(formObj) {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('configurar a integração com o GitHub')) return;

    this.config.github = {
      ...this.config.github,
      enabled: true,
      owner: (formObj.owner || '').trim(),
      repo: (formObj.repo || 'amadeus-gestao-rural').trim(),
      branch: (formObj.branch || 'main').trim(),
      token: (formObj.token || '').trim(),
      pagesUrl: `https://${(formObj.owner || '').trim()}.github.io/${(formObj.repo || 'amadeus-gestao-rural').trim()}/`
    };
    this.saveConfig();
    core.toast('Configurações do GitHub salvas com sucesso!');
    window.AmadeusViews.renderApp();
  },

  utf8ToBase64(str) {
    return btoa(unescape(encodeURIComponent(str)));
  },

  async enviarArquivoGitHub(path, contentBase64, commitMessage) {
    const gh = this.config.github;
    const apiUrl = `https://api.github.com/repos/${gh.owner}/${gh.repo}/contents/${path}`;
    const headers = {
      Authorization: `Bearer ${gh.token}`,
      Accept: 'application/vnd.github+json',
      'Content-Type': 'application/json'
    };

    let sha = null;
    try {
      const getRes = await fetch(`${apiUrl}?ref=${gh.branch}`, { headers });
      if (getRes.ok) {
        const existing = await getRes.json();
        sha = existing.sha;
      }
    } catch (_) {}

    const body = {
      message: commitMessage,
      content: contentBase64,
      branch: gh.branch
    };
    if (sha) body.sha = sha;

    const putRes = await fetch(apiUrl, {
      method: 'PUT',
      headers,
      body: JSON.stringify(body)
    });
    if (!putRes.ok) {
      const errData = await putRes.json().catch(() => ({}));
      throw new Error(errData.message || `Erro HTTP ${putRes.status} ao enviar ${path}`);
    }
    return true;
  },

  async publicarBackupNoGitHub() {
    const core = window.AmadeusCore;
    if (!core.requireAdmin('publicar no GitHub')) return;
    const gh = this.config.github;
    if (!gh.owner || !gh.repo || !gh.token) {
      core.toast('Preencha Usuário GitHub, Nome do Repositório e Personal Access Token primeiro.', 'aviso');
      return;
    }

    try {
      core.toast('🚀 Conectando à API do GitHub e enviando banco de dados atualizado...');
      const dbJsonStr = JSON.stringify(core.db, null, 2);
      await this.enviarArquivoGitHub(
        'data/amadeus_db.json',
        this.utf8ToBase64(dbJsonStr),
        `chore(backup): atualização automática de dados AMADEUS (${new Date().toLocaleDateString('pt-BR')})`
      );
      gh.lastPush = new Date().toISOString();
      this.saveConfig();
      core.toast('✅ Backup e base de dados publicados no repositório GitHub com sucesso!');
      window.AmadeusViews.renderApp();
    } catch (err) {
      core.toast(`Falha ao publicar no GitHub: ${err.message}`, 'erro');
    }
  }
};

window.AmadeusCloud = AmadeusCloud;
