/* ═══════════════════════════════════════════════════════════════
   AEL Engineering Academy — Engine v1.0
   Pure Vanilla JS · No frameworks · Module pattern
   Author: Ayman Elmasry — AEL Digital Studio
   ═══════════════════════════════════════════════════════════════ */

const AELAcademy = {
  data: null,

  state: {
    currentView: 'dashboard',
    currentModule: null,
    currentWeek: null,
    searchQuery: '',
    progress: {},
    favorites: [],
    notes: {},
    quizResults: {},
    expandedItems: {},
    certificates: []
  },

  STORAGE_KEY: 'ael-academy-state',

  /* ─────────────────────────────────────────────
     Initialization
     ───────────────────────────────────────────── */

  async init() {
    this.restoreState();
    await this.loadData();
    this.setupRouting();
    this.setupSearch();
    this.handleHash();
    this.render();
  },

  /* ─────────────────────────────────────────────
     Data Loading
     ───────────────────────────────────────────── */

  async loadData() {
    try {
      const response = await fetch('academy.json');
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      this.data = await response.json();
    } catch (err) {
      console.error('Failed to load academy.json:', err);
      document.getElementById('app').innerHTML = `
        <div style="text-align:center;padding:4rem 2rem;color:var(--red);">
          <h2>Failed to load academy data</h2>
          <p style="color:var(--text-secondary);margin-top:0.5rem;">${err.message}</p>
        </div>`;
    }
  },

  /* ─────────────────────────────────────────────
     State Persistence
     ───────────────────────────────────────────── */

  saveState() {
    try {
      const serializable = {
        progress: this.state.progress,
        favorites: this.state.favorites,
        notes: this.state.notes,
        quizResults: this.state.quizResults,
        expandedItems: this.state.expandedItems,
        certificates: this.state.certificates
      };
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(serializable));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  },

  restoreState() {
    try {
      const raw = localStorage.getItem(this.STORAGE_KEY);
      if (raw) {
        const saved = JSON.parse(raw);
        Object.assign(this.state, saved);
      }
    } catch (e) {
      console.warn('Could not restore state:', e);
    }
  },

  toggleProgress(itemId) {
    if (this.state.progress[itemId]) {
      delete this.state.progress[itemId];
    } else {
      this.state.progress[itemId] = { completed: true, timestamp: Date.now() };
    }
    this.saveState();
    this.render();
  },

  toggleFavorite(itemId) {
    const idx = this.state.favorites.indexOf(itemId);
    if (idx === -1) {
      this.state.favorites.push(itemId);
    } else {
      this.state.favorites.splice(idx, 1);
    }
    this.saveState();
  },

  toggleExpand(itemId) {
    this.state.expandedItems[itemId] = !this.state.expandedItems[itemId];
    this.render();
  },

  isCompleted(itemId) {
    return !!this.state.progress[itemId];
  },

  /* ─────────────────────────────────────────────
     Routing
     ───────────────────────────────────────────── */

  setupRouting() {
    window.addEventListener('hashchange', () => this.handleHash());
  },

  handleHash() {
    const hash = window.location.hash.slice(1);
    if (!hash) {
      this.state.currentView = 'dashboard';
      this.state.currentModule = null;
      this.state.currentWeek = null;
    } else if (hash.startsWith('week-')) {
      const weekId = hash;
      this.state.currentWeek = weekId;
      const week = this.getWeekById(weekId);
      if (week) {
        this.state.currentModule = week.module;
      }
      this.state.currentView = 'week';
    } else if (hash.startsWith('module-')) {
      const moduleId = hash.replace('module-', '');
      this.state.currentModule = moduleId;
      this.state.currentWeek = null;
      this.state.currentView = 'module';
    }
    this.render();
  },

  navigateTo(view, moduleId, weekId) {
    this.state.currentView = view;
    this.state.currentModule = moduleId || null;
    this.state.currentWeek = weekId || null;

    if (weekId) {
      window.location.hash = weekId;
    } else if (moduleId) {
      window.location.hash = 'module-' + moduleId;
    } else {
      window.location.hash = '';
    }
  },

  /* ─────────────────────────────────────────────
     Search Setup
     ───────────────────────────────────────────── */

  setupSearch() {
    document.addEventListener('input', (e) => {
      if (e.target.matches('.search-input')) {
        this.state.searchQuery = e.target.value;
        this.renderMainContent();
      }
    });
  },

  /* ─────────────────────────────────────────────
     Data Helpers
     ───────────────────────────────────────────── */

  getWeekById(weekId) {
    return this.data?.weeks?.find(w => w.id === weekId);
  },

  getModuleById(moduleId) {
    return this.data?.modules?.find(m => m.id === moduleId);
  },

  getModuleWeeks(moduleId) {
    const mod = this.getModuleById(moduleId);
    if (!mod) return [];
    return mod.weeks.map(id => this.getWeekById(id)).filter(Boolean);
  },

  getWeekNumber(weekId) {
    const week = this.getWeekById(weekId);
    return week ? week.number : 0;
  },

  getAllWeeks() {
    return this.data?.weeks || [];
  },

  /* ─────────────────────────────────────────────
     Progress Calculations
     ───────────────────────────────────────────── */

  getWeekProgress(weekId) {
    const week = this.getWeekById(weekId);
    if (!week) return { total: 0, done: 0, percent: 0 };

    const items = [
      ...(week.exercises || []).map(ex => ex.id),
      week.challenge ? week.challenge.id : null,
      week.quiz ? week.quiz.id : null,
      ...(week.interviewQuestions || []).map((_, i) => weekId + '-iq-' + i)
    ].filter(Boolean);

    const done = items.filter(id => this.isCompleted(id)).length;
    return {
      total: items.length,
      done,
      percent: items.length > 0 ? Math.round((done / items.length) * 100) : 0
    };
  },

  getModuleProgress(moduleId) {
    const weeks = this.getModuleWeeks(moduleId);
    if (weeks.length === 0) return { total: 0, done: 0, percent: 0 };

    let total = 0;
    let done = 0;
    weeks.forEach(w => {
      const p = this.getWeekProgress(w.id);
      total += p.total;
      done += p.done;
    });

    return {
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  },

  getOverallProgress() {
    const allWeeks = this.getAllWeeks();
    let total = 0;
    let done = 0;
    allWeeks.forEach(w => {
      const p = this.getWeekProgress(w.id);
      total += p.total;
      done += p.done;
    });
    return {
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  },

  getQuizProgress() {
    const allWeeks = this.getAllWeeks();
    const quizzes = allWeeks.filter(w => w.quiz);
    const completed = quizzes.filter(w => this.state.quizResults[w.quiz.id]);
    return {
      total: quizzes.length,
      done: completed.length,
      percent: quizzes.length > 0 ? Math.round((completed.length / quizzes.length) * 100) : 0
    };
  },

  getProjectProgress() {
    const allWeeks = this.getAllWeeks();
    const challenges = allWeeks.filter(w => w.challenge);
    const completed = challenges.filter(w => this.isCompleted(w.challenge.id));
    return {
      total: challenges.length,
      done: completed.length,
      percent: challenges.length > 0 ? Math.round((completed.length / challenges.length) * 100) : 0
    };
  },

  getLearningTime() {
    const total = Object.keys(this.state.progress).length;
    const hours = Math.floor(total * 0.75);
    if (hours === 0) return '0h';
    if (hours < 24) return hours + 'h';
    const days = Math.floor(hours / 24);
    const rem = hours % 24;
    return rem > 0 ? `${days}d ${rem}h` : `${days}d`;
  },

  getCertificationReadiness() {
    const allWeeks = this.getAllWeeks();
    const eligible = allWeeks.filter(w => {
      if (!w.quiz) return false;
      const result = this.state.quizResults[w.quiz.id];
      return result && result.score >= (w.quiz.passingScore || 80);
    });
    const pct = allWeeks.length > 0
      ? Math.round((eligible.length / allWeeks.length) * 100)
      : 0;
    return {
      total: allWeeks.length,
      done: eligible.length,
      percent: pct
    };
  },

  /* ─────────────────────────────────────────────
     Main Render
     ───────────────────────────────────────────── */

  render() {
    if (!this.data) return;

    const app = document.getElementById('app');
    app.innerHTML = '';

    app.appendChild(this.renderHeader());
    app.appendChild(this.renderModuleNav());

    const layout = document.createElement('div');
    layout.className = 'layout';

    const sidebar = this.renderWeekNav();
    const main = document.createElement('div');
    main.className = 'main-content';
    main.id = 'main-content';

    if (this.state.currentView === 'dashboard') {
      main.appendChild(this.renderDashboard());
    } else if (this.state.currentView === 'week' && this.state.currentWeek) {
      main.appendChild(this.renderWeekContent());
    } else if (this.state.currentView === 'module' && this.state.currentModule) {
      main.appendChild(this.renderModuleContent());
    } else {
      main.appendChild(this.renderDashboard());
    }

    layout.appendChild(sidebar);
    layout.appendChild(main);
    app.appendChild(layout);
  },

  renderMainContent() {
    const main = document.getElementById('main-content');
    if (!main) return this.render();

    main.innerHTML = '';
    if (this.state.currentView === 'dashboard') {
      main.appendChild(this.renderDashboard());
    } else if (this.state.currentView === 'week' && this.state.currentWeek) {
      main.appendChild(this.renderWeekContent());
    } else if (this.state.currentView === 'module' && this.state.currentModule) {
      main.appendChild(this.renderModuleContent());
    } else {
      main.appendChild(this.renderDashboard());
    }
  },

  /* ─────────────────────────────────────────────
     Header
     ───────────────────────────────────────────── */

  renderHeader() {
    const header = document.createElement('header');
    header.className = 'header';

    const brand = document.createElement('div');
    brand.className = 'header-brand';
    brand.style.cursor = 'pointer';
    brand.addEventListener('click', () => this.navigateTo('dashboard'));
    brand.innerHTML = `<h1><span class="accent">AEL</span> Engineering Academy</h1>`;
    header.appendChild(brand);

    const search = document.createElement('div');
    search.className = 'search-container';
    search.innerHTML = `
      <span class="search-icon">&#128269;</span>
      <input
        type="text"
        class="search-input"
        placeholder="Search topics, questions, exercises..."
        value="${this.escapeHtml(this.state.searchQuery)}"
        aria-label="Search"
      />`;
    header.appendChild(search);

    const nav = document.createElement('div');
    nav.className = 'header-nav';

    const overall = this.getOverallProgress();
    const progressPill = document.createElement('div');
    progressPill.className = 'badge badge-blue';
    progressPill.textContent = overall.percent + '% Complete';
    nav.appendChild(progressPill);

    header.appendChild(nav);
    return header;
  },

  /* ─────────────────────────────────────────────
     Module Navigation Tabs
     ───────────────────────────────────────────── */

  renderModuleNav() {
    const tabs = document.createElement('nav');
    tabs.className = 'module-tabs no-print';

    const allBtn = document.createElement('button');
    allBtn.className = 'module-tab' + (!this.state.currentModule ? ' active' : '');
    allBtn.textContent = 'Dashboard';
    allBtn.addEventListener('click', () => this.navigateTo('dashboard'));
    tabs.appendChild(allBtn);

    (this.data.modules || []).forEach(mod => {
      const btn = document.createElement('button');
      btn.className = 'module-tab' + (this.state.currentModule === mod.id ? ' active' : '');
      const prog = this.getModuleProgress(mod.id);
      btn.textContent = mod.name;
      btn.style.setProperty('--tab-color', mod.color);

      if (this.state.currentModule === mod.id) {
        btn.style.background = mod.color;
        btn.style.color = '#0B1220';
      }

      const dot = document.createElement('span');
      dot.style.cssText = `
        display:inline-block;
        width:8px;
        height:8px;
        border-radius:50%;
        background:${mod.color};
        margin-left:6px;
        opacity:${prog.percent > 0 ? 1 : 0.4};
      `;
      btn.appendChild(dot);

      btn.addEventListener('click', () => this.navigateTo('module', mod.id));
      tabs.appendChild(btn);
    });

    return tabs;
  },

  /* ─────────────────────────────────────────────
     Week Sidebar Navigation
     ───────────────────────────────────────────── */

  renderWeekNav() {
    const sidebar = document.createElement('aside');
    sidebar.className = 'sidebar no-print';

    const title = document.createElement('div');
    title.className = 'sidebar-title';
    title.textContent = this.state.currentModule
      ? (this.getModuleById(this.state.currentModule)?.name || 'Weeks')
      : 'All Weeks';
    sidebar.appendChild(title);

    const weekList = document.createElement('ul');
    weekList.className = 'week-list';

    const weeksToShow = this.state.currentModule
      ? this.getModuleWeeks(this.state.currentModule)
      : this.getAllWeeks();

    weeksToShow.forEach(week => {
      const li = document.createElement('li');
      const isActive = this.state.currentWeek === week.id;
      li.className = 'week-item' + (isActive ? ' active' : '');
      li.addEventListener('click', () => this.navigateTo('week', week.module, week.id));

      const num = document.createElement('span');
      num.className = 'week-number';
      num.textContent = week.number;
      li.appendChild(num);

      const label = document.createElement('span');
      label.textContent = week.title;
      li.appendChild(label);

      const prog = this.getWeekProgress(week.id);
      const status = document.createElement('span');
      status.className = 'week-status';
      if (prog.percent === 100) {
        status.classList.add('completed');
      } else if (prog.percent > 0) {
        status.classList.add('in-progress');
      }
      li.appendChild(status);

      weekList.appendChild(li);
    });

    sidebar.appendChild(weekList);
    return sidebar;
  },

  /* ─────────────────────────────────────────────
     Dashboard
     ───────────────────────────────────────────── */

  renderDashboard() {
    const fragment = document.createDocumentFragment();

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerHTML = '<span class="accent">&#9672;</span> Dashboard';
    fragment.appendChild(title);

    const grid = document.createElement('div');
    grid.className = 'dashboard';

    const overall = this.getOverallProgress();
    grid.appendChild(this.createProgressCard('Overall Progress', overall.percent + '%', `${overall.done} of ${overall.total} items`));

    const quizProg = this.getQuizProgress();
    grid.appendChild(this.createProgressCard('Quiz Progress', quizProg.percent + '%', `${quizProg.done} of ${quizProg.total} quizzes passed`));

    const projProg = this.getProjectProgress();
    grid.appendChild(this.createProgressCard('Projects Done', projProg.done + '', `${projProg.done} of ${projProg.total} challenges`));

    const cert = this.getCertificationReadiness();
    grid.appendChild(this.createProgressCard('Certification', cert.percent + '%', `${cert.done} of ${cert.total} weeks eligible`));

    grid.appendChild(this.createProgressCard('Learning Time', this.getLearningTime(), `${Object.keys(this.state.progress).length} items completed`));

    const favCount = this.state.favorites.length;
    grid.appendChild(this.createProgressCard('Favorites', favCount + '', `${favCount} saved items`));

    fragment.appendChild(grid);

    const currentWeek = this.getCurrentWeek();
    if (currentWeek) {
      fragment.appendChild(this.createCurrentWeekCard(currentWeek));
    }

    const moduleCards = this.createModuleOverviewCards();
    if (moduleCards) fragment.appendChild(moduleCards);

    if (this.state.searchQuery) {
      const searchResults = this.renderSearchResults();
      if (searchResults) fragment.appendChild(searchResults);
    }

    return fragment;
  },

  createProgressCard(label, value, subtext) {
    const card = document.createElement('div');
    card.className = 'progress-card';
    card.innerHTML = `
      <div class="label">${label}</div>
      <div class="value">${value}</div>
      <div class="subtext">${subtext}</div>`;
    return card;
  },

  getCurrentWeek() {
    if (this.state.currentWeek) return this.getWeekById(this.state.currentWeek);
    if (this.state.currentModule) {
      const weeks = this.getModuleWeeks(this.state.currentModule);
      return weeks[0] || null;
    }
    const allWeeks = this.getAllWeeks();
    for (const w of allWeeks) {
      const p = this.getWeekProgress(w.id);
      if (p.percent < 100) return w;
    }
    return allWeeks[0] || null;
  },

  createCurrentWeekCard(week) {
    const prog = this.getWeekProgress(week.id);
    const mod = this.getModuleById(week.module);
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <h2><span class="icon">&#9654;</span> Current: Week ${week.number} — ${this.escapeHtml(week.title)}</h2>
        <span class="card-expand-icon">&#9660;</span>
      </div>
      <div class="card-body expanded">
        <p class="text-secondary mb-2">${mod ? this.escapeHtml(mod.description) : ''}</p>
        <div class="progress-label">
          <span class="name">Week Progress</span>
          <span class="percent">${prog.percent}%</span>
        </div>
        <div class="progress-bar mb-2">
          <div class="progress-bar-fill blue" style="width:${prog.percent}%"></div>
        </div>
        <button class="btn btn-primary btn-sm" data-action="start-week" data-week="${week.id}">
          ${prog.percent > 0 ? 'Continue Week' : 'Start Week'}
        </button>
      </div>`;

    card.querySelector('[data-action="start-week"]').addEventListener('click', () => {
      this.navigateTo('week', week.module, week.id);
    });

    const header = card.querySelector('.card-header');
    header.addEventListener('click', () => this.toggleExpand('current-week'));

    return card;
  },

  createModuleOverviewCards() {
    const fragment = document.createDocumentFragment();
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = '<span class="accent">&#9672;</span> Modules';
    fragment.appendChild(sectionTitle);

    (this.data.modules || []).forEach(mod => {
      const prog = this.getModuleProgress(mod.id);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.borderLeft = `3px solid ${mod.color}`;
      card.innerHTML = `
        <div class="card-header">
          <h2><span class="icon" style="color:${mod.color}">&#9632;</span> ${this.escapeHtml(mod.name)}</h2>
          <span class="card-expand-icon">&#9660;</span>
        </div>
        <div class="card-body expanded">
          <p class="text-secondary mb-2">${this.escapeHtml(mod.description)}</p>
          <div class="progress-label">
            <span class="name">${prog.done} of ${prog.total} items</span>
            <span class="percent">${prog.percent}%</span>
          </div>
          <div class="progress-bar mb-2">
            <div class="progress-bar-fill" style="width:${prog.percent}%;background:${mod.color}"></div>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="open-module" data-module="${mod.id}">
            Open Module
          </button>
        </div>`;

      card.querySelector('[data-action="open-module"]').addEventListener('click', () => {
        this.navigateTo('module', mod.id);
      });

      card.querySelector('.card-header').addEventListener('click', () => {
        this.toggleExpand('mod-' + mod.id);
      });

      fragment.appendChild(card);
    });

    return fragment;
  },

  /* ─────────────────────────────────────────────
     Search Results
     ───────────────────────────────────────────── */

  renderSearchResults() {
    const query = this.state.searchQuery.toLowerCase().trim();
    if (!query) return null;

    const results = [];
    (this.data.weeks || []).forEach(week => {
      (week.questions || []).forEach(q => {
        if (q.question.toLowerCase().includes(query) || q.answer.toLowerCase().includes(query)) {
          results.push({ type: 'question', week, item: q });
        }
      });
      (week.exercises || []).forEach(ex => {
        if (ex.title.toLowerCase().includes(query) || ex.description.toLowerCase().includes(query)) {
          results.push({ type: 'exercise', week, item: ex });
        }
      });
      if (week.challenge && (week.challenge.title.toLowerCase().includes(query) || week.challenge.description.toLowerCase().includes(query))) {
        results.push({ type: 'challenge', week, item: week.challenge });
      }
      (week.reference?.topics || []).forEach(topic => {
        if (topic.name.toLowerCase().includes(query) || topic.content.toLowerCase().includes(query)) {
          results.push({ type: 'topic', week, item: topic });
        }
      });
      (week.interviewQuestions || []).forEach(iq => {
        if (iq.question.toLowerCase().includes(query) || iq.expectedAnswer.toLowerCase().includes(query)) {
          results.push({ type: 'interview', week, item: iq });
        }
      });
    });

    if (results.length === 0) return null;

    const fragment = document.createDocumentFragment();
    const title = document.createElement('h3');
    title.className = 'section-title';
    title.innerHTML = `<span class="accent">&#128269;</span> Search Results <span class="badge badge-blue" style="margin-left:8px">${results.length}</span>`;
    fragment.appendChild(title);

    results.slice(0, 15).forEach(r => {
      const card = document.createElement('div');
      card.className = 'card';
      card.style.cursor = 'pointer';

      const typeBadge = {
        question: '<span class="badge badge-blue">Q&A</span>',
        exercise: '<span class="badge badge-beginner">Exercise</span>',
        challenge: '<span class="badge badge-intermediate">Challenge</span>',
        topic: '<span class="badge badge-teal">Topic</span>',
        interview: '<span class="badge badge-purple">Interview</span>'
      }[r.type] || '';

      const heading = r.type === 'question' ? r.item.question
        : r.type === 'interview' ? r.item.question
        : r.item.title || r.item.name || '';

      card.innerHTML = `
        <div class="card-header">
          <h2 style="font-size:0.95rem">${typeBadge} ${this.escapeHtml(heading)}</h2>
        </div>
        <div class="card-body">
          <p class="text-secondary" style="font-size:0.85rem">Week ${r.week.number}: ${this.escapeHtml(r.week.title)}</p>
        </div>`;

      card.querySelector('.card-header').addEventListener('click', () => {
        this.navigateTo('week', r.week.module, r.week.id);
      });

      fragment.appendChild(card);
    });

    return fragment;
  },

  /* ─────────────────────────────────────────────
     Module Content View
     ───────────────────────────────────────────── */

  renderModuleContent() {
    const mod = this.getModuleById(this.state.currentModule);
    if (!mod) return this.renderDashboard();

    const fragment = document.createDocumentFragment();
    const prog = this.getModuleProgress(mod.id);

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerHTML = `<span class="accent" style="color:${mod.color}">&#9632;</span> ${this.escapeHtml(mod.name)}`;
    fragment.appendChild(title);

    const subtitle = document.createElement('p');
    subtitle.className = 'text-secondary mb-2';
    subtitle.textContent = mod.description;
    fragment.appendChild(subtitle);

    const progBar = document.createElement('div');
    progBar.className = 'mb-3';
    progBar.innerHTML = `
      <div class="progress-label">
        <span class="name">Module Progress</span>
        <span class="percent">${prog.done} / ${prog.total} (${prog.percent}%)</span>
      </div>
      <div class="progress-bar">
        <div class="progress-bar-fill" style="width:${prog.percent}%;background:${mod.color}"></div>
      </div>`;
    fragment.appendChild(progBar);

    const weeks = this.getModuleWeeks(mod.id);
    weeks.forEach(week => {
      const wProg = this.getWeekProgress(week.id);
      const card = document.createElement('div');
      card.className = 'card';
      card.style.borderLeft = `3px solid ${mod.color}`;
      card.innerHTML = `
        <div class="card-header">
          <h2><span class="icon" style="color:${mod.color}">&#9654;</span> Week ${week.number}: ${this.escapeHtml(week.title)}</h2>
          <span class="card-expand-icon">&#9660;</span>
        </div>
        <div class="card-body expanded">
          <div class="progress-label mb-1">
            <span class="name">${wProg.done} / ${wProg.total} items</span>
            <span class="percent">${wProg.percent}%</span>
          </div>
          <div class="progress-bar mb-2">
            <div class="progress-bar-fill" style="width:${wProg.percent}%;background:${mod.color}"></div>
          </div>
          <button class="btn btn-secondary btn-sm" data-action="open-week" data-week="${week.id}">
            Open Week
          </button>
        </div>`;

      card.querySelector('[data-action="open-week"]').addEventListener('click', () => {
        this.navigateTo('week', week.module, week.id);
      });

      card.querySelector('.card-header').addEventListener('click', () => {
        this.toggleExpand('week-' + week.id);
      });

      fragment.appendChild(card);
    });

    return fragment;
  },

  /* ─────────────────────────────────────────────
     Week Content View
     ───────────────────────────────────────────── */

  renderWeekContent() {
    const week = this.getWeekById(this.state.currentWeek);
    if (!week) return this.renderDashboard();

    const mod = this.getModuleById(week.module);
    const fragment = document.createDocumentFragment();

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerHTML = `<span class="accent" style="color:${mod?.color || 'var(--blue)'}">&#9654;</span> Week ${week.number}: ${this.escapeHtml(week.title)}`;
    fragment.appendChild(title);

    fragment.appendChild(this.renderLearningOutcomes(week));
    fragment.appendChild(this.renderReferenceSection(week));
    fragment.appendChild(this.renderQuestionsSection(week));
    fragment.appendChild(this.renderExercisesSection(week));
    fragment.appendChild(this.renderChallengeSection(week));
    fragment.appendChild(this.renderQuizSection(week));
    fragment.appendChild(this.renderInterviewSection(week));

    return fragment;
  },

  /* ── Learning Outcomes ── */

  renderLearningOutcomes(week) {
    if (!week.learningOutcomes?.length) return document.createDocumentFragment();

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <h2><span class="icon">&#10003;</span> Learning Outcomes</h2>
        <span class="card-expand-icon">&#9660;</span>
      </div>
      <div class="card-body expanded">
        <ul class="outcomes-list">
          ${week.learningOutcomes.map(o => `<li class="outcome-item">${this.escapeHtml(o)}</li>`).join('')}
        </ul>
      </div>`;

    card.querySelector('.card-header').addEventListener('click', () => {
      this.toggleExpand('lo-' + week.id);
    });

    return card;
  },

  /* ── Reference Section ── */

  renderReferenceSection(week) {
    if (!week.reference?.topics?.length) return document.createDocumentFragment();

    const fragment = document.createDocumentFragment();

    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = '<span class="accent">&#128214;</span> Reference';
    fragment.appendChild(sectionTitle);

    week.reference.topic?.forEach?.((topic, i) => {
      const card = this.createTopicCard(topic, week.id, i);
      fragment.appendChild(card);
    });

    if (week.reference.topics) {
      week.reference.topics.forEach((topic, i) => {
        const card = this.createTopicCard(topic, week.id, i);
        fragment.appendChild(card);
      });
    }

    return fragment;
  },

  createTopicCard(topic, weekId, index) {
    const itemId = weekId + '-topic-' + index;
    const isExpanded = this.state.expandedItems[itemId];

    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = `
      <div class="card-header">
        <h2><span class="icon">&#128196;</span> ${this.escapeHtml(topic.name)}</h2>
        <span class="card-expand-icon">&#9660;</span>
      </div>
      <div class="card-body ${isExpanded ? 'expanded' : 'collapsed'}">
        <p class="text-secondary mb-2" style="line-height:1.8">${this.escapeHtml(topic.content)}</p>
        ${topic.keyPoints?.length ? `
          <h4 class="text-muted mb-1" style="font-size:0.8rem;text-transform:uppercase;letter-spacing:0.05em">Key Points</h4>
          <ul class="outcomes-list">
            ${topic.keyPoints.map(p => `<li class="outcome-item">${this.escapeHtml(p)}</li>`).join('')}
          </ul>` : ''}
      </div>`;

    card.querySelector('.card-header').addEventListener('click', () => {
      this.toggleExpand(itemId);
    });

    return card;
  },

  /* ── Questions Section ── */

  renderQuestionsSection(week) {
    if (!week.questions?.length) return document.createDocumentFragment();

    const fragment = document.createDocumentFragment();
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = '<span class="accent">&#10067;</span> Interview Q&A Practice';
    fragment.appendChild(sectionTitle);

    week.questions.forEach((q, i) => {
      const itemId = q.id;
      const isOpen = this.state.expandedItems[itemId];

      const item = document.createElement('div');
      item.className = 'question-item' + (isOpen ? ' open' : '');

      const header = document.createElement('div');
      header.className = 'question-header';
      header.innerHTML = `
        <span class="question-number">${i + 1}</span>
        <span class="question-text">${this.escapeHtml(q.question)}</span>
        <span class="badge badge-${q.difficulty}">${q.difficulty}</span>
        <span class="question-toggle">&#9660;</span>`;

      const answer = document.createElement('div');
      answer.className = 'question-answer' + (isOpen ? ' style="display:block"' : '');
      answer.innerHTML = `<p>${this.escapeHtml(q.answer)}</p>`;

      header.addEventListener('click', () => {
        this.toggleExpand(itemId);
        item.classList.toggle('open');
        answer.style.display = item.classList.contains('open') ? 'block' : 'none';
      });

      item.appendChild(header);
      item.appendChild(answer);
      fragment.appendChild(item);
    });

    return fragment;
  },

  /* ── Exercises Section ── */

  renderExercisesSection(week) {
    if (!week.exercises?.length) return document.createDocumentFragment();

    const fragment = document.createDocumentFragment();
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = '<span class="accent">&#9997;</span> Exercises';
    fragment.appendChild(sectionTitle);

    const list = document.createElement('div');
    list.className = 'exercise-list';

    week.exercises.forEach((ex, i) => {
      const done = this.isCompleted(ex.id);
      const item = document.createElement('div');
      item.className = 'exercise-item';
      if (done) item.style.opacity = '0.6';

      item.innerHTML = `
        <span class="exercise-number">${i + 1}</span>
        <div style="flex:1">
          <div style="font-weight:600;color:var(--text)">${this.escapeHtml(ex.title)}</div>
          <div class="text-secondary" style="font-size:0.85rem;margin-top:2px">${this.escapeHtml(ex.description).slice(0, 120)}${ex.description.length > 120 ? '...' : ''}</div>
        </div>
        <span class="badge badge-${ex.difficulty === 'basic' ? 'beginner' : ex.difficulty}">${ex.difficulty}</span>
        <span class="text-muted" style="font-size:0.8rem;white-space:nowrap">${ex.expectedTime}</span>
        <div class="requirement-checkbox ${done ? 'checked' : ''}" data-action="toggle" data-item="${ex.id}" title="Mark complete"></div>`;

      item.querySelector('[data-action="toggle"]').addEventListener('click', (e) => {
        e.stopPropagation();
        this.toggleProgress(ex.id);
      });

      list.appendChild(item);
    });

    fragment.appendChild(list);
    return fragment;
  },

  /* ── Challenge Section ── */

  renderChallengeSection(week) {
    if (!week.challenge) return document.createDocumentFragment();

    const ch = week.challenge;
    const done = this.isCompleted(ch.id);

    const card = document.createElement('div');
    card.className = 'challenge-card';
    card.innerHTML = `
      <div class="challenge-title">&#9733; ${this.escapeHtml(ch.title)}</div>
      <div class="challenge-description mb-2">${this.escapeHtml(ch.description)}</div>
      <div class="text-muted mb-1" style="font-size:0.8rem">Expected time: ${ch.expectedTime}</div>
      <ul class="requirements-list mb-2">
        ${(ch.requirements || []).map((r, i) => {
          const reqDone = this.isCompleted(ch.id + '-req-' + i);
          return `<li class="requirement-item ${reqDone ? 'completed' : ''}">
            <div class="requirement-checkbox ${reqDone ? 'checked' : ''}" data-action="toggle-req" data-item="${ch.id}-req-${i}"></div>
            <span>${this.escapeHtml(r)}</span>
          </li>`;
        }).join('')}
      </ul>
      <div class="flex items-center gap-1">
        <button class="btn ${done ? 'btn-success' : 'btn-primary'} btn-sm" data-action="toggle-challenge" data-item="${ch.id}">
          ${done ? '&#10003; Completed' : 'Mark Complete'}
        </button>
      </div>`;

    card.querySelectorAll('[data-action="toggle-req"]').forEach(btn => {
      btn.addEventListener('click', () => {
        this.toggleProgress(btn.dataset.item);
      });
    });

    const toggleBtn = card.querySelector('[data-action="toggle-challenge"]');
    if (toggleBtn) {
      toggleBtn.addEventListener('click', () => {
        this.toggleProgress(ch.id);
      });
    }

    return card;
  },

  /* ── Quiz Section ── */

  renderQuizSection(week) {
    if (!week.quiz) return document.createDocumentFragment();

    const quiz = week.quiz;
    const result = this.state.quizResults[quiz.id];

    const card = document.createElement('div');
    card.className = 'card';

    const headerHtml = `
      <div class="card-header">
        <h2><span class="icon">&#128221;</span> Weekly Quiz</h2>
        <span class="card-expand-icon">&#9660;</span>
      </div>`;

    let bodyHtml = '<div class="card-body expanded">';
    bodyHtml += `<p class="text-secondary mb-1">${quiz.questions} questions · ${quiz.timeLimit} · ${quiz.passingScore}% to pass</p>`;

    if (result) {
      const passed = result.score >= quiz.passingScore;
      bodyHtml += `
        <div class="progress-label mt-1">
          <span class="name">Last Score</span>
          <span class="percent ${passed ? 'text-green' : 'text-red'}">${result.score}%</span>
        </div>
        <div class="progress-bar mb-2">
          <div class="progress-bar-fill ${passed ? 'green' : 'red'}" style="width:${result.score}%"></div>
        </div>
        <button class="btn btn-secondary btn-sm" data-action="retake-quiz" data-quiz="${quiz.id}">Retake Quiz</button>`;
    } else {
      bodyHtml += `<button class="btn btn-primary btn-sm mt-1" data-action="start-quiz" data-quiz="${quiz.id}">Start Quiz</button>`;
    }

    bodyHtml += '</div>';
    card.innerHTML = headerHtml + bodyHtml;

    card.querySelector('.card-header').addEventListener('click', () => {
      this.toggleExpand('quiz-' + week.id);
    });

    const startBtn = card.querySelector('[data-action="start-quiz"]');
    if (startBtn) {
      startBtn.addEventListener('click', () => {
        this.startQuiz(week);
      });
    }

    const retakeBtn = card.querySelector('[data-action="retake-quiz"]');
    if (retakeBtn) {
      retakeBtn.addEventListener('click', () => {
        this.startQuiz(week);
      });
    }

    return card;
  },

  startQuiz(week) {
    if (!week.quiz) return;
    const container = document.getElementById('main-content');
    if (!container) return;

    container.innerHTML = '';

    const title = document.createElement('h2');
    title.className = 'section-title';
    title.innerHTML = `<span class="accent">&#128221;</span> Quiz: Week ${week.number}`;
    container.appendChild(title);

    const quizState = {
      week,
      currentIndex: 0,
      answers: {},
      submitted: false,
      questions: this.generateQuizQuestions(week)
    };

    this.renderQuizQuestion(container, quizState);
  },

  generateQuizQuestions(week) {
    const pool = week.questions || [];
    const shuffled = [...pool].sort(() => Math.random() - 0.5);
    return shuffled.slice(0, Math.min(10, shuffled.length));
  },

  renderQuizQuestion(container, quizState) {
    const qContainer = document.createElement('div');
    qContainer.className = 'quiz-container';

    const q = quizState.questions[quizState.currentIndex];
    if (!q) {
      this.showQuizResults(container, quizState);
      return;
    }

    const questionNum = quizState.currentIndex + 1;
    const total = quizState.questions.length;
    const selected = quizState.answers[q.id];

    const qEl = document.createElement('div');
    qEl.className = 'quiz-question';

    const wrongOptions = quizState.questions
      .filter(x => x.id !== q.id)
      .sort(() => Math.random() - 0.5)
      .slice(0, 3)
      .map(x => x.answer.split('.')[0]);

    const correctShort = q.answer.split('.')[0];
    const options = [...wrongOptions, correctShort].sort(() => Math.random() - 0.5);

    qEl.innerHTML = `
      <div class="quiz-question-header">
        <span class="quiz-question-number">Question ${questionNum} / ${total}</span>
      </div>
      <div class="quiz-question-text mb-2">${this.escapeHtml(q.question)}</div>
      <div class="quiz-options">
        ${options.map((opt, i) => `
          <div class="quiz-option ${selected === opt ? 'selected' : ''}" data-option="${i}">
            <div class="quiz-radio"></div>
            <span>${this.escapeHtml(opt)}</span>
          </div>
        `).join('')}
      </div>
      <div class="quiz-explanation">${this.escapeHtml(q.answer)}</div>`;

    qEl.querySelectorAll('.quiz-option').forEach(optEl => {
      optEl.addEventListener('click', () => {
        const optText = optEl.querySelector('span').textContent;
        quizState.answers[q.id] = optText;

        qEl.querySelectorAll('.quiz-option').forEach(o => o.classList.remove('selected'));
        optEl.classList.add('selected');
      });
    });

    qContainer.appendChild(qEl);

    const navRow = document.createElement('div');
    navRow.className = 'flex justify-between items-center mt-2';

    if (quizState.currentIndex > 0) {
      const prevBtn = document.createElement('button');
      prevBtn.className = 'btn btn-secondary btn-sm';
      prevBtn.textContent = '\u2190 Previous';
      prevBtn.addEventListener('click', () => {
        quizState.currentIndex--;
        container.innerHTML = '';
        container.appendChild(title);
        this.renderQuizQuestion(container, quizState);
      });
      navRow.appendChild(prevBtn);
    } else {
      navRow.appendChild(document.createElement('div'));
    }

    const isLast = quizState.currentIndex === total - 1;
    const nextBtn = document.createElement('button');
    nextBtn.className = 'btn ' + (isLast ? 'btn-success' : 'btn-primary') + ' btn-sm';
    nextBtn.textContent = isLast ? 'Submit Quiz \u2713' : 'Next \u2192';
    nextBtn.addEventListener('click', () => {
      if (isLast) {
        this.submitQuiz(quizState);
      } else {
        quizState.currentIndex++;
        container.innerHTML = '';
        const newTitle = document.createElement('h2');
        newTitle.className = 'section-title';
        newTitle.innerHTML = `<span class="accent">&#128221;</span> Quiz: Week ${quizState.week.number}`;
        container.appendChild(newTitle);
        this.renderQuizQuestion(container, quizState);
      }
    });
    navRow.appendChild(nextBtn);

    qContainer.appendChild(navRow);
    container.appendChild(qContainer);
  },

  submitQuiz(quizState) {
    const { week, answers, questions } = quizState;
    let correct = 0;

    questions.forEach(q => {
      const userAnswer = answers[q.id];
      if (userAnswer) {
        const correctPart = q.answer.split('.')[0].trim().toLowerCase();
        if (userAnswer.trim().toLowerCase() === correctPart) {
          correct++;
        }
      }
    });

    const score = questions.length > 0 ? Math.round((correct / questions.length) * 100) : 0;
    this.state.quizResults[week.quiz.id] = {
      score,
      correct,
      total: questions.length,
      timestamp: Date.now()
    };

    if (score >= (week.quiz.passingScore || 80)) {
      this.toggleProgress(week.quiz.id);
    }

    this.saveState();

    const container = document.getElementById('main-content');
    if (container) {
      container.innerHTML = '';
      const title = document.createElement('h2');
      title.className = 'section-title';
      title.innerHTML = `<span class="accent">&#128221;</span> Quiz Results: Week ${week.number}`;
      container.appendChild(title);

      const passed = score >= (week.quiz.passingScore || 80);
      const resultCard = document.createElement('div');
      resultCard.className = 'card';
      resultCard.innerHTML = `
        <div style="text-align:center;padding:2rem 0">
          <div style="font-size:3rem;font-weight:700;color:${passed ? 'var(--green)' : 'var(--red)'}">${score}%</div>
          <div class="text-secondary mt-1">${correct} of ${questions.length} correct</div>
          <div class="mt-2">
            <span class="badge ${passed ? 'badge-beginner' : 'badge-advanced'}">${passed ? 'PASSED' : 'FAILED'}</span>
          </div>
          <div class="mt-3 flex gap-1" style="justify-content:center">
            <button class="btn btn-primary btn-sm" onclick="location.reload()">Back to Week</button>
            <button class="btn btn-secondary btn-sm" id="quiz-retake">Retake</button>
          </div>
        </div>`;

      resultCard.querySelector('#quiz-retake').addEventListener('click', () => {
        this.startQuiz(week);
      });

      container.appendChild(resultCard);
    }
  },

  showQuizResults(container, quizState) {
    this.submitQuiz(quizState);
  },

  /* ── Interview Section ── */

  renderInterviewSection(week) {
    if (!week.interviewQuestions?.length) return document.createDocumentFragment();

    const fragment = document.createDocumentFragment();
    const sectionTitle = document.createElement('h3');
    sectionTitle.className = 'section-title';
    sectionTitle.innerHTML = '<span class="accent">&#128172;</span> Interview Preparation';
    fragment.appendChild(sectionTitle);

    const list = document.createElement('div');
    list.className = 'interview-list';

    week.interviewQuestions.forEach((iq, i) => {
      const itemId = week.id + '-iq-' + i;
      const isOpen = this.state.expandedItems[itemId];

      const item = document.createElement('div');
      item.className = 'interview-item' + (isOpen ? ' open' : '');

      const q = document.createElement('div');
      q.className = 'interview-question';
      q.textContent = iq.question;

      const a = document.createElement('div');
      a.className = 'interview-answer';
      a.textContent = iq.expectedAnswer;

      q.addEventListener('click', () => {
        this.toggleExpand(itemId);
        item.classList.toggle('open');
      });

      item.appendChild(q);
      item.appendChild(a);
      list.appendChild(item);
    });

    fragment.appendChild(list);
    return fragment;
  },

  /* ─────────────────────────────────────────────
     Utility
     ───────────────────────────────────────────── */

  escapeHtml(str) {
    if (!str) return '';
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
  }
};

/* ── Boot ── */
document.addEventListener('DOMContentLoaded', () => {
  AELAcademy.init();
});
