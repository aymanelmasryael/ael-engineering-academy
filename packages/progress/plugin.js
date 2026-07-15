/* AEL Academy — Progress Package v1.0 */

window.AELProgress = {
  version: '1.0.0',

  STORAGE_KEY: 'ael-academy-state',

  load() {
    try {
      return JSON.parse(localStorage.getItem(this.STORAGE_KEY) || '{}');
    } catch (e) {
      return {};
    }
  },

  save(state) {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.warn('Could not save state:', e);
    }
  },

  toggleItem(state, itemId) {
    if (!state.progress) state.progress = {};
    if (state.progress[itemId]) {
      delete state.progress[itemId];
    } else {
      state.progress[itemId] = { completed: true, timestamp: Date.now() };
    }
    this.save(state);
  },

  isCompleted(state, itemId) {
    return !!state.progress?.[itemId];
  },

  weekProgress(state, week) {
    const items = [
      ...(week.exercises || []).map(ex => ex.id),
      week.challenge ? week.challenge.id : null,
      week.quiz ? week.quiz.id : null
    ].filter(Boolean);

    const done = items.filter(id => this.isCompleted(state, id)).length;
    return {
      total: items.length,
      done,
      percent: items.length > 0 ? Math.round((done / items.length) * 100) : 0
    };
  },

  moduleProgress(state, moduleWeeks) {
    let total = 0;
    let done = 0;
    moduleWeeks.forEach(w => {
      const p = this.weekProgress(state, w);
      total += p.total;
      done += p.done;
    });
    return {
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  },

  overallProgress(state, allWeeks) {
    let total = 0;
    let done = 0;
    allWeeks.forEach(w => {
      const p = this.weekProgress(state, w);
      total += p.total;
      done += p.done;
    });
    return {
      total,
      done,
      percent: total > 0 ? Math.round((done / total) * 100) : 0
    };
  },

  renderBar(percent, height = 6) {
    const color = percent >= 80 ? 'var(--green)' : percent >= 50 ? 'var(--gold)' : 'var(--blue)';
    return `<div class="progress-bar" style="height:${height}px;background:var(--bg-glass)">
      <div class="progress-fill" style="width:${percent}%;background:${color};height:100%;border-radius:99px"></div>
    </div>`;
  }
};
