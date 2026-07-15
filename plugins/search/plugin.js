/* AEL Engineering Academy — Search Plugin v1.0 */

window.AELSearch = {
  version: '1.0.0',

  index: null,

  buildIndex(data, questions) {
    this.index = {
      weeks: data.weeks || [],
      questions: questions || [],
      modules: data.modules || []
    };
  },

  search(query) {
    if (!query || !this.index) return [];
    const q = query.toLowerCase();
    const results = [];

    // Search questions
    this.index.questions.forEach(item => {
      let score = 0;
      if (item.question.toLowerCase().includes(q)) score += 10;
      if (item.answer.toLowerCase().includes(q)) score += 5;
      if ((item.tags || []).some(t => t.toLowerCase().includes(q))) score += 3;
      if ((item.source || '').toLowerCase().includes(q)) score += 2;
      if (score > 0) results.push({ type: 'question', item, score });
    });

    // Search weeks
    this.index.weeks.forEach(week => {
      let score = 0;
      if (week.title.toLowerCase().includes(q)) score += 8;
      if ((week.learningOutcomes || []).some(lo => lo.toLowerCase().includes(q))) score += 4;
      if (score > 0) results.push({ type: 'week', item: week, score });
    });

    // Search modules
    this.index.modules.forEach(mod => {
      let score = 0;
      if (mod.title.toLowerCase().includes(q)) score += 6;
      if (score > 0) results.push({ type: 'module', item: mod, score });
    });

    return results.sort((a, b) => b.score - a.score);
  },

  highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
};
