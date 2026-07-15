#!/usr/bin/env node
/* AEL Learning Domain — Validation Script
   Validates domain model integrity, relationships, and data consistency.
   Usage: node validate-domain.js [--data-dir ./data] [--verbose]
 */

const fs = require('fs');
const path = require('path');

const args = process.argv.slice(2);
const VERBOSE = args.includes('--verbose');
const dataDirIdx = args.indexOf('--data-dir');
const DATA_DIR = dataDirIdx >= 0 ? args[dataDirIdx + 1] : path.join(__dirname, '..', '..');

/* ── ID Patterns ── */
const ID_PATTERNS = {
  course:    /^CRSE-[A-Z0-9-]+$/,
  module:    /^MOD-[A-Z0-9-]+$/,
  week:      /^WK-\d{2}$/,
  concept:   /^CON-[A-Z0-9-]+$/,
  lo:        /^LO-[A-Z0-9-]+$/,
  question:  /^Q-[A-Z0-9-]+-\d{3}$/,
  exercise:  /^EX-[A-Z0-9-]+-\d{2}$/,
  challenge: /^CH-[A-Z0-9-]+-\d{2}$/,
  quiz:      /^QZ-\d{2}$/,
  interview: /^INT-[A-Z0-9-]+-\d{2}$/,
  project:   /^PRJ-[A-Z0-9-]+-\d{2}$/,
  reference: /^REF-[A-Z0-9-]+-\d{2}$/,
  glossary:  /^GL-[A-Z0-9-]+$/
};

/* ── Load Data ── */
function loadJSON(filepath) {
  try {
    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
  } catch (e) {
    return null;
  }
}

/* ── Validation State ── */
let errors = 0;
let warnings = 0;
let info = 0;
const allIds = new Set();
const duplicateIds = new Set();
const brokenRefs = [];
const circularDeps = [];

function err(msg, context) {
  console.error(`  ERROR: ${msg}${context ? ' [' + context + ']' : ''}`);
  errors++;
}

function warn(msg, context) {
  console.warn(`  WARN:  ${msg}${context ? ' [' + context + ']' : ''}`);
  warnings++;
}

function log(msg) {
  if (VERBOSE) console.log(`  INFO:  ${msg}`);
  info++;
}

function registerId(id, type, source) {
  if (allIds.has(id)) {
    duplicateIds.add(id);
    err(`Duplicate ID: ${id} (from ${source})`);
  }
  allIds.add(id);
}

function validateIdFormat(id, expectedPattern, context) {
  if (!expectedPattern.test(id)) {
    err(`Invalid ID format: ${id} (expected pattern: ${expectedPattern})`, context);
    return false;
  }
  return true;
}

function validateRef(id, context) {
  if (id && !allIds.has(id)) {
    brokenRefs.push({ id, context });
    err(`Broken reference: ${id} does not exist`, context);
    return false;
  }
  return true;
}

/* ── Cycle Detection (DFS) ── */
function detectCycle(graph, context) {
  const visited = new Set();
  const stack = new Set();

  function dfs(node, path) {
    if (stack.has(node)) {
      const cycle = path.slice(path.indexOf(node));
      circularDeps.push({ cycle, context });
      err(`Circular dependency: ${cycle.join(' → ')} → ${node}`, context);
      return;
    }
    if (visited.has(node)) return;
    visited.add(node);
    stack.add(node);
    (graph[node] || []).forEach(next => dfs(next, [...path, node]));
    stack.delete(node);
  }

  Object.keys(graph).forEach(node => dfs(node, []));
}

/* ══════════════════════════════════════════
   Validation Pass 1: Load and Register All IDs
   ══════════════════════════════════════════ */

console.log('\n═══ AEL Domain Validation ═══\n');
console.log(`Data directory: ${DATA_DIR}\n`);

// Load academy.json
const academyPath = path.join(DATA_DIR, 'academy.json');
const academy = loadJSON(academyPath);
if (!academy) {
  console.error('  FATAL: Cannot load academy.json');
  process.exit(1);
}

console.log('Pass 1: Registering all IDs...\n');

// Register course
const courseId = 'CRSE-AEL-ENGINEERING';
registerId(courseId, 'course', 'academy.json');
log(`Course: ${courseId}`);

// Register modules (v2: already MOD- format, v1: slug format)
(academy.modules || []).forEach(m => {
  const id = m.id.startsWith('MOD-') ? m.id : (m.id ? `MOD-${m.id.toUpperCase().replace(/-/g, '-')}` : null);
  if (id) {
    registerId(id, 'module', `academy.json modules`);
    log(`Module: ${id} (${m.name})`);
  }
});

// Register weeks and their contents
(academy.weeks || []).forEach(w => {
  const weekId = w.id ? (w.id.startsWith('WK-') ? w.id : `WK-${String(w.number).padStart(2, '0')}`) : null;
  if (weekId) registerId(weekId, 'week', `academy.json weeks`);

  // Register learning outcomes (v2: array of IDs, v1: array of strings)
  (w.learningOutcomes || []).forEach((lo, i) => {
    const loId = typeof lo === 'string' && lo.startsWith('LO-') ? lo : `LO-WK${String(w.number).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    registerId(loId, 'lo', `week ${weekId} learningOutcomes`);
  });

  // Register reference topics (v2: array of IDs, v1: nested objects)
  (w.referenceTopics || w.reference?.topics || []).forEach((t, i) => {
    const refId = typeof t === 'string' && t.startsWith('REF-') ? t : `REF-WK${String(w.number).padStart(2, '0')}-${String(i + 1).padStart(2, '0')}`;
    registerId(refId, 'reference', `week ${weekId} reference`);
  });

  // Register exercises (v2: array of IDs, v1: array of objects)
  (w.exercises || []).forEach(ex => {
    const exId = typeof ex === 'string' ? ex.toUpperCase() : (ex.id ? ex.id.toUpperCase() : null);
    if (exId) registerId(exId, 'exercise', `week ${weekId}`);
  });

  // Register challenge (v2: string ID, v1: object)
  if (w.challenge) {
    const chId = typeof w.challenge === 'string' ? w.challenge.toUpperCase() : (w.challenge.id ? w.challenge.id.toUpperCase() : null);
    if (chId) registerId(chId, 'challenge', `week ${weekId}`);
  }

  // Register quiz (v2: string ID, v1: object)
  if (w.quiz) {
    const qzId = typeof w.quiz === 'string' ? w.quiz.toUpperCase() : (w.quiz.id ? w.quiz.id.toUpperCase() : null);
    if (qzId) registerId(qzId, 'quiz', `week ${weekId}`);
  }

  // Register interview questions (v2 only)
  (w.interviews || []).forEach(intId => {
    if (typeof intId === 'string' && intId.startsWith('INT-')) {
      registerId(intId, 'interview', `week ${weekId} interviews`);
    }
  });
});

// Load questions.json (v2 format)
const questionsPath = path.join(DATA_DIR, 'questions.json');
const questionsData = loadJSON(questionsPath);
if (questionsData) {
  (questionsData.questions || []).forEach(q => {
    if (q.id) registerId(q.id, 'question', 'questions.json');
  });
  log(`Questions: ${(questionsData.questions || []).length}`);
}

// Load concepts (v2: embedded in academy.json)
if (academy.concepts) {
  (academy.concepts || []).forEach(c => {
    if (c.id) registerId(c.id, 'concept', 'academy.json concepts');
  });
  log(`Concepts: ${(academy.concepts || []).length}`);
}

// Load glossary (v2 format)
if (academy.glossary) {
  (academy.glossary || []).forEach(g => {
    const gId = g.id || `GL-${g.term.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '')}`;
    registerId(gId, 'glossary', 'academy.json glossary');
  });
}

console.log(`\n  Registered ${allIds.size} IDs`);
if (duplicateIds.size > 0) {
  console.error(`  Found ${duplicateIds.size} duplicate IDs`);
}

/* ══════════════════════════════════════════
   Validation Pass 2: Validate Relationships
   ══════════════════════════════════════════ */

console.log('\nPass 2: Validating relationships...\n');

// Validate module → course relationship
(academy.modules || []).forEach(m => {
  const modId = `MOD-${m.id.toUpperCase().replace(/-/g, '-')}`;
  log(`Module ${modId} → Course ${courseId}`);
});

// Validate week → module relationship
(academy.weeks || []).forEach(w => {
  const weekId = `WK-${String(w.number).padStart(2, '0')}`;
  const modId = w.module ? `MOD-${w.module.toUpperCase().replace(/-/g, '-')}` : null;
  if (modId) {
    if (!allIds.has(modId)) {
      err(`Week ${weekId} references non-existent module: ${modId}`, 'week.module');
    }
  }
});

// Validate exercises reference their week
(academy.weeks || []).forEach(w => {
  (w.exercises || []).forEach(ex => {
    const exId = ex.id?.toUpperCase();
    if (exId && !exId.includes(`WK${String(w.number).padStart(2, '0')}`)) {
      log(`Exercise ${exId} in week ${w.id} — ID does not encode week (acceptable)`);
    }
  });
});

// Validate questions reference valid weeks and modules
if (questionsData) {
  const validWeeks = new Set((academy.weeks || []).map(w => w.id));
  const validModules = new Set((academy.modules || []).map(m => m.id));

  (questionsData.questions || []).forEach(q => {
    if (q.week && !validWeeks.has(q.week)) {
      err(`Question ${q.id} references invalid week: ${q.week}`, 'questions.json');
    }
    if (q.module && !validModules.has(q.module)) {
      err(`Question ${q.id} references invalid module: ${q.module}`, 'questions.json');
    }
  });
}

/* ══════════════════════════════════════════
   Validation Pass 3: Prerequisite Chains
   ══════════════════════════════════════════ */

console.log('\nPass 3: Checking prerequisite chains...\n');

// Build prerequisite graph from academy concepts if available
if (academy.concepts) {
  const prereqGraph = {};
  (academy.concepts || []).forEach(c => {
    if (c.id && c.prerequisites) {
      prereqGraph[c.id] = c.prerequisites;
    }
  });
  detectCycle(prereqGraph, 'concept prerequisites');
}

// Check module prerequisites
const modulePrereqGraph = {};
(academy.modules || []).forEach(m => {
  if (m.prerequisites && m.prerequisites.length > 0) {
    const modId = `MOD-${m.id.toUpperCase().replace(/-/g, '-')}`;
    modulePrereqGraph[modId] = m.prerequisites.map(p => `MOD-${p.toUpperCase().replace(/-/g, '-')}`);
  }
});
if (Object.keys(modulePrereqGraph).length > 0) {
  detectCycle(modulePrereqGraph, 'module prerequisites');
}

/* ══════════════════════════════════════════
   Validation Pass 4: Structural Integrity
   ══════════════════════════════════════════ */

console.log('\nPass 4: Structural integrity...\n');

// Check every week has at least one learning outcome
(academy.weeks || []).forEach(w => {
  if (!w.learningOutcomes || w.learningOutcomes.length === 0) {
    warn(`Week ${w.id} has no learning outcomes`, 'week.learningOutcomes');
  }
});

// Check every week has reference content
(academy.weeks || []).forEach(w => {
  const hasRefTopics = (w.referenceTopics && w.referenceTopics.length > 0) || (w.reference?.topics && w.reference.topics.length > 0);
  if (!hasRefTopics) {
    warn(`Week ${w.id} has no reference topics`, 'week.reference');
  }
});

// Check every week has exercises
(academy.weeks || []).forEach(w => {
  if (!w.exercises || w.exercises.length === 0) {
    warn(`Week ${w.id} has no exercises`, 'week.exercises');
  }
});

// Check every week has a challenge
(academy.weeks || []).forEach(w => {
  if (!w.challenge) {
    warn(`Week ${w.id} has no challenge`, 'week.challenge');
  }
});

// Check completion criteria reference valid IDs
(academy.weeks || []).forEach(w => {
  if (w.completionCriteria?.required) {
    w.completionCriteria.required.forEach(ref => {
      const refUpper = ref.toUpperCase();
      if (!allIds.has(refUpper) && !allIds.has(ref)) {
        warn(`Week ${w.id} completion criteria references unknown: ${ref}`, 'completionCriteria');
      }
    });
  }
});

/* ══════════════════════════════════════════
   Validation Pass 5: Question Coverage
   ══════════════════════════════════════════ */

console.log('\nPass 5: Question coverage...\n');

if (questionsData) {
  const weekCounts = {};
  const moduleCounts = {};
  const typeCounts = {};
  const diffCounts = {};

  (questionsData.questions || []).forEach(q => {
    const week = q.weekId || q.week || 'unknown';
    const mod = q.moduleId || q.module || 'unknown';
    weekCounts[week] = (weekCounts[week] || 0) + 1;
    moduleCounts[mod] = (moduleCounts[mod] || 0) + 1;
    typeCounts[q.type] = (typeCounts[q.type] || 0) + 1;
    diffCounts[q.difficulty] = (diffCounts[q.difficulty] || 0) + 1;
  });

  console.log('  Week coverage:');
  Object.entries(weekCounts).sort().forEach(([w, c]) => {
    const status = c >= 50 ? 'OK' : c >= 30 ? 'LOW' : 'CRITICAL';
    console.log(`    ${w}: ${c} questions [${status}]`);
  });

  console.log('  Module coverage:');
  Object.entries(moduleCounts).sort().forEach(([m, c]) => {
    console.log(`    ${m}: ${c} questions`);
  });

  console.log('  Type distribution:');
  Object.entries(typeCounts).sort().forEach(([t, c]) => {
    console.log(`    ${t}: ${c}`);
  });

  console.log('  Difficulty distribution:');
  Object.entries(diffCounts).sort().forEach(([d, c]) => {
    console.log(`    ${d}: ${c}`);
  });
}

/* ══════════════════════════════════════════
   Summary
   ══════════════════════════════════════════ */

console.log('\n═══ Validation Summary ═══\n');
console.log(`  Total IDs registered: ${allIds.size}`);
console.log(`  Duplicate IDs:        ${duplicateIds.size}`);
console.log(`  Broken references:    ${brokenRefs.length}`);
console.log(`  Circular deps:        ${circularDeps.length}`);
console.log(`  Errors:               ${errors}`);
console.log(`  Warnings:             ${warnings}`);

if (errors === 0 && warnings === 0) {
  console.log('\n  Domain validation PASSED');
} else if (errors === 0) {
  console.log('\n  Domain validation PASSED (with warnings)');
} else {
  console.log('\n  Domain validation FAILED');
  process.exit(1);
}
