/* ═══════════════════════════════════════════════════════════════
   AEL Knowledge Graph — Validator
   Detect orphans, broken refs, circular deps, invalid chains
   ═══════════════════════════════════════════════════════════════ */

'use strict';

function validateGraph(graph) {
  const report = {
    valid: true,
    errors: [],
    warnings: [],
    orphans: [],
    brokenRefs: [],
    circularDeps: [],
    invalidChains: [],
    stats: graph.getStats()
  };

  const allIds = new Set(graph.getNodeIds());

  /* ── Pass 1: Orphan Detection ── */

  graph._graph.nodes.forEach((node, id) => {
    const incoming = graph._graph.reverseAdj.get(id) || [];
    const outgoing = graph._graph.adj.get(id) || [];

    if (incoming.length === 0 && outgoing.length === 0) {
      report.orphans.push({ id, type: node.type });
    }
  });

  /* ── Pass 2: Broken References ── */

  graph._graph.edges.forEach(e => {
    if (!allIds.has(e.from)) {
      report.brokenRefs.push({ from: e.from, to: e.to, relation: e.relation });
    }
    if (!allIds.has(e.to)) {
      report.brokenRefs.push({ from: e.from, to: e.to, relation: e.relation });
    }
  });

  /* ── Pass 3: Circular Dependency Detection ── */

  const WHITE = 0, GRAY = 1, BLACK = 2;
  const color = new Map();
  const parent = new Map();
  graph._graph.nodes.forEach((_, id) => color.set(id, WHITE));

  function dfs(u, path) {
    color.set(u, GRAY);
    path.push(u);

    const neighbors = (graph._graph.adj.get(u) || [])
      .filter(e => e.relation === 'prerequisite' || e.relation === 'requires')
      .map(e => e.target);

    for (const v of neighbors) {
      if (!color.has(v)) continue;
      if (color.get(v) === GRAY) {
        const cycleStart = path.indexOf(v);
        const cycle = path.slice(cycleStart);
        report.circularDeps.push({ cycle: [...cycle, v] });
      } else if (color.get(v) === WHITE) {
        parent.set(v, u);
        dfs(v, path);
      }
    }

    path.pop();
    color.set(u, BLACK);
  }

  graph._graph.nodes.forEach((_, id) => {
    if (color.get(id) === WHITE) dfs(id, []);
  });

  /* ── Pass 4: Invalid Prerequisite Chains ── */

  graph._graph.nodes.forEach((node, id) => {
    if (node.type !== 'concept') return;
    const prereqs = graph.getPrerequisites(id);
    prereqs.forEach(p => {
      if (!allIds.has(p.id)) {
        report.invalidChains.push({ id, missingPrerequisite: p.id });
      }
    });
  });

  /* ── Pass 5: Week-Module Consistency ── */

  graph._graph.nodes.forEach((node, id) => {
    if (node.type !== 'week') return;
    const week = node.data;
    if (week.moduleId) {
      const modNode = graph._graph.nodes.get(week.moduleId);
      if (!modNode) {
        report.brokenRefs.push({ from: id, to: week.moduleId, relation: 'module-ref' });
      }
    }
  });

  /* ── Finalize ── */

  report.errors = [
    ...report.brokenRefs.map(r => `BROKEN_REF: ${r.from} → ${r.to} (${r.relation})`),
    ...report.circularDeps.map(r => `CIRCULAR_DEP: ${r.cycle.join(' → ')}`),
    ...report.invalidChains.map(r => `INVALID_CHAIN: ${r.id} missing ${r.missingPrerequisite}`)
  ];

  report.warnings = report.orphans.map(o => `ORPHAN: ${o.id} (${o.type})`);
  report.valid = report.errors.length === 0;

  return report;
}

module.exports = { validateGraph };
