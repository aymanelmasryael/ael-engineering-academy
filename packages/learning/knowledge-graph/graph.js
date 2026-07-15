/* ═══════════════════════════════════════════════════════════════
   AEL Knowledge Graph — Public API
   Minimal stable interface over pre-built graph
   ═══════════════════════════════════════════════════════════════ */

'use strict';

const { buildGraph } = require('./builder');

class KnowledgeGraph {
  constructor(academy, questions) {
    this._graph = buildGraph(academy, questions);
    this._nodeCount = this._graph.nodes.size;
    this._edgeCount = this._graph.edges.length;
  }

  /* ─────────────────────────────────────────
     Node Lookup
     ───────────────────────────────────────── */

  getConcept(id) {
    const node = this._graph.nodes.get(id);
    if (!node || node.type !== 'concept') return null;
    return node;
  }

  getNode(id) {
    return this._graph.nodes.get(id) || null;
  }

  getNodeIds() {
    return [...this._graph.nodes.keys()];
  }

  getNodesByType(type) {
    const result = [];
    this._graph.nodes.forEach(n => { if (n.type === type) result.push(n); });
    return result;
  }

  /* ─────────────────────────────────────────
     Relationship Resolution
     ───────────────────────────────────────── */

  getPrerequisites(id) {
    const outgoing = this._graph.adj.get(id) || [];
    return outgoing
      .filter(e => e.relation === 'prerequisite' || e.relation === 'requires')
      .map(e => this._graph.nodes.get(e.target))
      .filter(Boolean);
  }

  getDependents(id) {
    const incoming = this._graph.reverseAdj.get(id) || [];
    return incoming
      .filter(e => e.relation === 'prerequisite' || e.relation === 'requires')
      .map(e => this._graph.nodes.get(e.source))
      .filter(Boolean);
  }

  getRelated(id) {
    const outgoing = this._graph.adj.get(id) || [];
    const incoming = this._graph.reverseAdj.get(id) || [];
    const seen = new Set();
    const result = [];

    outgoing.forEach(e => {
      if (e.relation === 'related' && !seen.has(e.target)) {
        seen.add(e.target);
        const node = this._graph.nodes.get(e.target);
        if (node) result.push(node);
      }
    });
    incoming.forEach(e => {
      if (e.relation === 'related' && !seen.has(e.source)) {
        seen.add(e.source);
        const node = this._graph.nodes.get(e.source);
        if (node) result.push(node);
      }
    });

    return result;
  }

  getEdges(id) {
    const outgoing = (this._graph.adj.get(id) || []).map(e => ({
      source: id, target: e.target, relation: e.relation
    }));
    const incoming = (this._graph.reverseAdj.get(id) || []).map(e => ({
      source: e.source, target: id, relation: e.relation
    }));
    return [...outgoing, ...incoming];
  }

  getNeighbors(id) {
    const outgoing = (this._graph.adj.get(id) || []).map(e => ({
      node: this._graph.nodes.get(e.target), relation: e.relation
    })).filter(n => n.node);
    const incoming = (this._graph.reverseAdj.get(id) || []).map(e => ({
      node: this._graph.nodes.get(e.source), relation: e.relation
    })).filter(n => n.node);
    return [...outgoing, ...incoming];
  }

  /* ─────────────────────────────────────────
     Path Finding (BFS)
     ───────────────────────────────────────── */

  findPath(from, to) {
    if (from === to) return [from];
    if (!this._graph.nodes.has(from) || !this._graph.nodes.has(to)) return null;

    const visited = new Set([from]);
    const queue = [[from]];

    const allNeighbors = new Map();
    this._graph.adj.forEach((targets, source) => {
      targets.forEach(e => {
        if (!allNeighbors.has(source)) allNeighbors.set(source, new Set());
        allNeighbors.get(source).add(e.target);
      });
    });
    this._graph.reverseAdj.forEach((sources, target) => {
      sources.forEach(e => {
        if (!allNeighbors.has(target)) allNeighbors.set(target, new Set());
        allNeighbors.get(target).add(e.source);
      });
    });

    while (queue.length > 0) {
      const path = queue.shift();
      const current = path[path.length - 1];
      const neighbors = allNeighbors.get(current) || new Set();

      for (const next of neighbors) {
        if (next === to) return [...path, next];
        if (!visited.has(next)) {
          visited.add(next);
          queue.push([...path, next]);
        }
      }
    }

    return null;
  }

  /* ─────────────────────────────────────────
     Search
     ───────────────────────────────────────── */

  search(query) {
    if (!query) return [];
    const q = query.toLowerCase().trim();
    const results = [];

    this._graph.nodes.forEach((node, id) => {
      if (id.toLowerCase().includes(q)) {
        results.push(node);
        return;
      }
      const d = node.data;
      if (d.name && d.name.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.title && d.title.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.question && d.question.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.statement && d.statement.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.term && d.term.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.description && d.description.toLowerCase().includes(q)) { results.push(node); return; }
      if (d.tags && d.tags.some(t => t.toLowerCase().includes(q))) { results.push(node); }
    });

    return results;
  }

  /* ─────────────────────────────────────────
     Stats
     ───────────────────────────────────────── */

  getStats() {
    const types = {};
    this._graph.nodes.forEach(n => { types[n.type] = (types[n.type] || 0) + 1; });
    const relations = {};
    this._graph.edges.forEach(e => { relations[e.relation] = (relations[e.relation] || 0) + 1; });
    return {
      nodes: this._nodeCount,
      edges: this._edgeCount,
      byType: types,
      byRelation: relations
    };
  }

  /* ─────────────────────────────────────────
     Validation (delegates to validator.js)
     ───────────────────────────────────────── */

  validate() {
    const { validateGraph } = require('./validator');
    return validateGraph(this);
  }
}

/* ── Factory ── */

KnowledgeGraph.fromData = function(academy, questions) {
  return new KnowledgeGraph(academy, questions);
};

module.exports = KnowledgeGraph;
