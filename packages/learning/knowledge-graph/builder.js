/* ═══════════════════════════════════════════════════════════════
   AEL Knowledge Graph — Builder
   Construct graph from academy domain data (read-only)
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const MODULE_ORDER = [
  'MOD-FOUNDATIONS',
  'MOD-CORE-TECHNIQUES',
  'MOD-APPLIED-ENGINEERING',
  'MOD-PRODUCTION'
];

function buildGraph(academy, questions) {
  const nodes = new Map();
  const edges = [];
  const adj = new Map();
  const reverseAdj = new Map();

  function ensureNode(id, type, data) {
    if (!id || nodes.has(id)) return;
    nodes.set(id, { id, type, data: data || {} });
    adj.set(id, []);
    reverseAdj.set(id, []);
  }

  function addEdge(from, to, relation) {
    if (!from || !to || !nodes.has(from) || !nodes.has(to)) return;
    const list = adj.get(from);
    if (!list.find(e => e.target === to && e.relation === relation)) {
      list.push({ target: to, relation });
      reverseAdj.get(to).push({ source: from, relation });
      edges.push({ from, to, relation });
    }
  }

  /* ── Register all entities ── */

  (academy.modules || []).forEach(m => ensureNode(m.id, 'module', m));
  (academy.weeks || []).forEach(w => ensureNode(w.id, 'week', w));
  (academy.concepts || []).forEach(c => ensureNode(c.id, 'concept', c));
  (academy.learningOutcomes || []).forEach(lo => ensureNode(lo.id, 'learning-outcome', lo));
  (academy.referenceTopics || []).forEach(r => ensureNode(r.id, 'reference', r));
  (academy.exercises || []).forEach(e => ensureNode(e.id, 'exercise', e));
  (academy.challenges || []).forEach(ch => ensureNode(ch.id, 'challenge', ch));
  (academy.quizzes || []).forEach(qz => ensureNode(qz.id, 'quiz', qz));
  (academy.interviews || []).forEach(iq => ensureNode(iq.id, 'interview', iq));
  (academy.glossary || []).forEach(g => ensureNode(g.id, 'glossary', g));
  (questions.questions || []).forEach(q => ensureNode(q.id, 'question', q));

  /* ── Structural hierarchy ── */

  (academy.modules || []).forEach(m => {
    (m.weeks || []).forEach(wId => addEdge(m.id, wId, 'contains'));
  });

  (academy.weeks || []).forEach(w => {
    (w.concepts || []).forEach(cId => addEdge(w.id, cId, 'teaches'));
    (w.learningOutcomes || []).forEach(loId => addEdge(w.id, loId, 'aims'));
    (w.exercises || []).forEach(exId => addEdge(w.id, exId, 'practices'));
    if (w.challenge) addEdge(w.id, w.challenge, 'challenges');
    if (w.quiz) addEdge(w.id, w.quiz, 'assesses');
    (w.interviews || []).forEach(iqId => addEdge(w.id, iqId, 'prepares'));
    (w.referenceTopics || []).forEach(rId => addEdge(w.id, rId, 'references'));
  });

  /* ── Module ordering (prerequisites between modules) ── */

  for (let i = 1; i < MODULE_ORDER.length; i++) {
    if (nodes.has(MODULE_ORDER[i - 1]) && nodes.has(MODULE_ORDER[i])) {
      addEdge(MODULE_ORDER[i], MODULE_ORDER[i - 1], 'requires');
    }
  }

  /* ── Week ordering within modules ── */

  (academy.modules || []).forEach(m => {
    const weeks = m.weeks || [];
    for (let i = 1; i < weeks.length; i++) {
      if (nodes.has(weeks[i - 1]) && nodes.has(weeks[i])) {
        addEdge(weeks[i], weeks[i - 1], 'requires');
      }
    }
  });

  /* ── Concept explicit relationships ── */

  (academy.concepts || []).forEach(c => {
    (c.prerequisites || []).forEach(prereqId => {
      addEdge(c.id, prereqId, 'prerequisite');
    });
    (c.relatedConcepts || []).forEach(relId => {
      addEdge(c.id, relId, 'related');
    });
    (c.learningOutcomes || []).forEach(loId => {
      addEdge(c.id, loId, 'produces');
    });
  });

  /* ── Questions → concepts ── */

  (questions.questions || []).forEach(q => {
    if (q.conceptId && nodes.has(q.conceptId)) {
      addEdge(q.conceptId, q.id, 'tested-by');
    }
  });

  /* ── Cross-concept related from question tags ── */

  const tagIndex = new Map();
  (questions.questions || []).forEach(q => {
    (q.tags || []).forEach(tag => {
      const t = tag.toLowerCase();
      if (!tagIndex.has(t)) tagIndex.set(t, new Set());
      if (q.conceptId) tagIndex.get(t).add(q.conceptId);
    });
  });

  tagIndex.forEach((conceptIds) => {
    const arr = [...conceptIds].filter(id => id && nodes.has(id));
    for (let i = 0; i < arr.length; i++) {
      for (let j = i + 1; j < arr.length; j++) {
        addEdge(arr[i], arr[j], 'related');
      }
    }
  });

  return { nodes, edges, adj, reverseAdj };
}

module.exports = { buildGraph, MODULE_ORDER };
