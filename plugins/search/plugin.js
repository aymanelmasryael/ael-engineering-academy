/* AEL Engineering Academy — Search Plugin v2.0 */

window.AELSearch = {
  version: '2.0.0',

  index: null,

  buildIndex(data, questions) {
    this.index = {
      weeks: data.weeks || [],
      questions: questions || [],
      modules: data.modules || [],
      concepts: data.concepts || [],
      glossary: data.glossary || []
    };
  },

  search(query) {
    if (!query || !this.index) return [];
    const q = query.toLowerCase();
    const results = [];

    this.index.questions.forEach(item => {
      let score = 0;
      if (item.question.toLowerCase().includes(q)) score += 10;
      if (item.answer.toLowerCase().includes(q)) score += 5;
      if ((item.tags || []).some(t => t.toLowerCase().includes(q))) score += 3;
      if ((item.source || '').toLowerCase().includes(q)) score += 2;
      if (score > 0) results.push({ type: 'question', item, score });
    });

    this.index.weeks.forEach(week => {
      let score = 0;
      if (week.title.toLowerCase().includes(q)) score += 8;
      if (week.description?.toLowerCase().includes(q)) score += 3;
      if (score > 0) results.push({ type: 'week', item: week, score });
    });

    this.index.modules.forEach(mod => {
      let score = 0;
      if (mod.name?.toLowerCase().includes(q)) score += 6;
      if (mod.description?.toLowerCase().includes(q)) score += 3;
      if (score > 0) results.push({ type: 'module', item: mod, score });
    });

    this.index.concepts.forEach(concept => {
      let score = 0;
      if (concept.name?.toLowerCase().includes(q)) score += 7;
      if (concept.description?.toLowerCase().includes(q)) score += 3;
      if (score > 0) results.push({ type: 'concept', item: concept, score });
    });

    this.index.glossary.forEach(term => {
      let score = 0;
      if (term.term?.toLowerCase().includes(q)) score += 9;
      if (term.definition?.toLowerCase().includes(q)) score += 4;
      if (score > 0) results.push({ type: 'glossary', item: term, score });
    });

    return results.sort((a, b) => b.score - a.score);
  },

  highlight(text, query) {
    if (!query) return text;
    const regex = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  }
};
