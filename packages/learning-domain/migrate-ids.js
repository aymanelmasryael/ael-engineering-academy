#!/usr/bin/env node
/* ═══════════════════════════════════════════════════════════════
   AEL Learning Domain — ID Migration Script v2.5
   Migrates legacy IDs to stable domain IDs.
   
   Usage: node migrate-ids.js
   Output: academy.v2.json, questions.v2.json, migration-map.json
   ═══════════════════════════════════════════════════════════════ */

const fs = require('fs');
const path = require('path');

const startTime = Date.now();
const ROOT = path.join(__dirname, '..', '..');

/* ── ID Mappings ── */
const MODULE_MAP = {
  'foundations':        'MOD-FOUNDATIONS',
  'core-techniques':   'MOD-CORE-TECHNIQUES',
  'applied-engineering': 'MOD-APPLIED-ENGINEERING',
  'production':        'MOD-PRODUCTION'
};

const MODULE_SHORT = {
  'foundations':        'FOU',
  'core-techniques':   'COR',
  'applied-engineering': 'APL',
  'production':        'PRD'
};

/* ── Load Data ── */
console.log('\n═══ AEL ID Migration v2.5 ═══\n');
console.log('Loading data...');

const academy = JSON.parse(fs.readFileSync(path.join(ROOT, 'academy.json'), 'utf8'));
const questionsData = JSON.parse(fs.readFileSync(path.join(ROOT, 'questions.json'), 'utf8'));

/* ── Migration Map ── */
const map = {
  meta: {
    version: '2.5.0',
    migratedAt: new Date().toISOString(),
    source: { academy: 'academy.json', questions: 'questions.json' },
    target: { academy: 'academy.v2.json', questions: 'questions.v2.json' }
  },
  modules: {},
  weeks: {},
  concepts: {},
  learningOutcomes: {},
  questions: {},
  exercises: {},
  challenges: {},
  quizzes: {},
  interviews: {},
  references: {},
  glossary: {},
  projects: {}
};

const stats = {
  modules: 0, weeks: 0, concepts: 0, learningOutcomes: 0,
  questions: 0, exercises: 0, challenges: 0, quizzes: 0,
  interviews: 0, references: 0, glossary: 0, projects: 0,
  relationships: 0
};

/* ── Counters (sequential per module) ── */
const moduleCounters = { FOU: 0, COR: 0, APL: 0, PRD: 0 };
const moduleExerciseCounters = { FOU: 0, COR: 0, APL: 0, PRD: 0 };
const moduleChallengeCounters = { FOU: 0, COR: 0, APL: 0, PRD: 0 };
const moduleInterviewCounters = { FOU: 0, COR: 0, APL: 0, PRD: 0 };

function pad2(n) { return String(n).padStart(2, '0'); }
function pad3(n) { return String(n).padStart(3, '0'); }
function slugToModule(slug) { return MODULE_MAP[slug] || `MOD-${slug.toUpperCase().replace(/-/g, '-')}`; }

/* ══════════════════════════════════════════
   Migrate Modules
   ══════════════════════════════════════════ */

console.log('Migrating modules...');

const migratedModules = academy.modules.map((m, i) => {
  const newId = slugToModule(m.id);
  map.modules[m.id] = newId;
  stats.modules++;

  return {
    ...m,
    id: newId,
    number: i + 1,
    weeks: m.weeks.map(w => `WK-${pad2(academy.weeks.findIndex(ww => ww.id === w) + 1)}`)
  };
});

/* ══════════════════════════════════════════
   Migrate Weeks + Sub-Entities
   ══════════════════════════════════════════ */

console.log('Migrating weeks and sub-entities...');

let conceptCounter = {};
const migratedConcepts = [];

const migratedWeeks = academy.weeks.map((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  map.weeks[w.id] = weekId;
  stats.weeks++;

  const modId = slugToModule(w.module);
  const modShort = MODULE_SHORT[w.module] || w.module.toUpperCase().slice(0, 3);

  // Create concepts from reference topics
  const conceptIds = [];
  (w.reference?.topics || []).forEach((topic, ti) => {
    conceptCounter[w.module] = (conceptCounter[w.module] || 0) + 1;
    const cId = `CON-${modShort}-${pad3(conceptCounter[w.module])}`;
    conceptIds.push(cId);
    map.concepts[`${w.id}:ref:${topic.name}`] = cId;

    migratedConcepts.push({
      id: cId, weekId, moduleId: modId,
      name: topic.name, description: topic.content,
      type: 'concept', difficulty: 'intermediate',
      prerequisites: [], relatedConcepts: [],
      learningOutcomes: [], questions: [],
      referenceContent: topic.content, keyPoints: topic.keyPoints || [],
      tags: [], glossaryTerms: []
    });
    stats.concepts++;
  });

  // Migrate learning outcomes
  const loIds = [];
  (w.learningOutcomes || []).forEach((lo, li) => {
    const loId = `LO-WK${pad2(weekNum)}-${pad2(li + 1)}`;
    map.learningOutcomes[`${w.id}:lo:${li}`] = loId;
    loIds.push(loId);
    stats.learningOutcomes++;

    // Link LO to concept (cycle through concepts)
    if (conceptIds.length > 0) {
      const targetConcept = migratedConcepts.find(c => c.id === conceptIds[li % conceptIds.length]);
      if (targetConcept) targetConcept.learningOutcomes.push(loId);
    }
  });

  // Migrate reference topics
  const refIds = [];
  (w.reference?.topics || []).forEach((topic, ri) => {
    const refId = `REF-WK${pad2(weekNum)}-${pad2(ri + 1)}`;
    map.references[`${w.id}:ref:${ri}`] = refId;
    refIds.push(refId);
    stats.references++;
  });

  // Migrate exercises (unique per week)
  const exIds = [];
  (w.exercises || []).forEach((ex, ei) => {
    const exId = `EX-${modShort}-${pad2(weekNum)}-${pad2(ei + 1)}`;
    map.exercises[ex.id] = exId;
    exIds.push(exId);
    stats.exercises++;
  });

  // Migrate challenge (unique per week)
  let chId = null;
  if (w.challenge?.id) {
    moduleChallengeCounters[modShort] = (moduleChallengeCounters[modShort] || 0) + 1;
    chId = `CH-${modShort}-${pad2(moduleChallengeCounters[modShort])}`;
    map.challenges[w.challenge.id] = chId;
    stats.challenges++;
  }

  // Migrate quiz
  let qzId = null;
  if (w.quiz?.id) {
    qzId = `QZ-${pad2(weekNum)}`;
    map.quizzes[w.quiz.id] = qzId;
    stats.quizzes++;
  }

  // Migrate interview questions (unique per week)
  const intIds = [];
  (w.interviewQuestions || []).forEach((iq, ii) => {
    const intId = `INT-${modShort}-${pad2(weekNum)}-${pad2(ii + 1)}`;
    map.interviews[`${w.id}:interview:${ii}`] = intId;
    intIds.push(intId);
    stats.interviews++;
  });

  // Update completion criteria
  const completionCriteria = w.completionCriteria ? {
    required: (w.completionCriteria.required || []).map(ref => {
      if (ref.startsWith('ex')) return map.exercises[ref] || ref;
      if (ref.startsWith('ch')) return map.challenges[ref] || ref;
      if (ref.startsWith('quiz')) return map.quizzes[ref] || ref;
      return ref;
    }),
    minimumQuizScore: w.completionCriteria.minimumQuizScore
  } : undefined;

  return {
    id: weekId, moduleId: modId, number: weekNum, title: w.title,
    description: w.description || '', concepts: conceptIds,
    learningOutcomes: loIds, referenceTopics: refIds,
    exercises: exIds, challenge: chId, quiz: qzId,
    completionCriteria
  };
});

/* ══════════════════════════════════════════
   Migrate Questions (sequential per module)
   ══════════════════════════════════════════ */

console.log('Migrating questions...');

// Build week→module lookup
const weekModuleMap = {};
academy.weeks.forEach((w, i) => {
  weekModuleMap[w.id] = { module: w.module, weekNum: i + 1 };
});

// Sort questions by module then week then ID for sequential numbering
const sortedQuestions = [...questionsData.questions].sort((a, b) => {
  const modA = weekModuleMap[a.week]?.module || a.module;
  const modB = weekModuleMap[b.week]?.module || b.module;
  if (modA !== modB) return modA.localeCompare(modB);
  const weekA = weekModuleMap[a.week]?.weekNum || 0;
  const weekB = weekModuleMap[b.week]?.weekNum || 0;
  if (weekA !== weekB) return weekA - weekB;
  return a.id.localeCompare(b.id);
});

const migratedQuestions = sortedQuestions.map(q => {
  const weekInfo = weekModuleMap[q.week] || { module: q.module, weekNum: 0 };
  const modShort = MODULE_SHORT[weekInfo.module] || weekInfo.module.toUpperCase().slice(0, 3);

  // Sequential numbering per module
  moduleCounters[modShort] = (moduleCounters[modShort] || 0) + 1;
  const newId = `Q-${modShort}-${pad3(moduleCounters[modShort])}`;

  map.questions[q.id] = newId;
  stats.questions++;

  // Find matching concept
  const weekId = `WK-${pad2(weekInfo.weekNum)}`;
  const matchingConcept = migratedConcepts.find(c => c.weekId === weekId);

  // Migrate relationships
  const relationships = {};
  if (q.relationships) {
    if (q.relationships.exercise) {
      relationships.exercise = map.exercises[q.relationships.exercise] || q.relationships.exercise;
      stats.relationships++;
    }
    if (q.relationships.challenge) {
      relationships.challenge = map.challenges[q.relationships.challenge] || q.relationships.challenge;
      stats.relationships++;
    }
    if (q.relationships.quiz) {
      relationships.quiz = map.quizzes[q.relationships.quiz] || q.relationships.quiz;
      stats.relationships++;
    }
  }

  // Add concept reference
  if (matchingConcept) {
    relationships.concept = matchingConcept.id;
    if (!matchingConcept.questions.includes(newId)) {
      matchingConcept.questions.push(newId);
    }
  }

  return {
    id: newId, weekId, moduleId: slugToModule(weekInfo.module),
    conceptId: matchingConcept?.id || null,
    type: q.type, difficulty: q.difficulty,
    question: q.question, answer: q.answer,
    whyCorrect: q.whyCorrect, whyOthersIncorrect: q.whyOthersIncorrect,
    realWorldExample: q.realWorldExample, commonMistakes: q.commonMistakes,
    bestPractices: q.bestPractices, relatedConcepts: q.relatedConcepts,
    relatedQuestionIds: [], estimatedReadingTime: q.estimatedReadingTime,
    interviewRelevance: q.interviewRelevance, tags: q.tags,
    source: q.source, relationships
  };
});

/* ══════════════════════════════════════════
   Migrate Glossary
   ══════════════════════════════════════════ */

console.log('Migrating glossary...');

const migratedGlossary = (academy.glossary || []).map(g => {
  const termSlug = g.term.toUpperCase().replace(/[^A-Z0-9]+/g, '-').replace(/^-|-$/g, '');
  const gId = `GL-${termSlug}`;
  map.glossary[g.term] = gId;
  stats.glossary++;

  return {
    id: gId, term: g.term, definition: g.definition,
    abbreviations: [], relatedTerms: [], concepts: [], tags: []
  };
});

/* ══════════════════════════════════════════
   Build Learning Outcomes Array (with text content)
   ══════════════════════════════════════════ */

console.log('Building learning outcomes...');

const migratedLearningOutcomes = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);

  (w.learningOutcomes || []).forEach((lo, li) => {
    const loId = `LO-WK${pad2(weekNum)}-${pad2(li + 1)}`;
    migratedLearningOutcomes.push({
      id: loId,
      weekId,
      moduleId: modId,
      statement: lo,
      taxonomy: 'understand',
      assessmentCriteria: [],
      evidence: { questions: [], exercises: [], challenges: [] }
    });
  });
});

/* ══════════════════════════════════════════
   Build Reference Topics Array (with content)
   ══════════════════════════════════════════ */

console.log('Building reference topics...');

const migratedReferenceTopics = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);

  (w.reference?.topics || []).forEach((topic, ti) => {
    const refId = `REF-WK${pad2(weekNum)}-${pad2(ti + 1)}`;
    const conceptId = map.concepts[`${w.id}:ref:${topic.name}`] || null;
    migratedReferenceTopics.push({
      id: refId, weekId, moduleId: modId, conceptId,
      name: topic.name, content: topic.content,
      keyPoints: topic.keyPoints || [], tags: []
    });
  });
});

/* ══════════════════════════════════════════
   Build Exercises Array (with content)
   ══════════════════════════════════════════ */

console.log('Building exercises...');

const migratedExercises = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);
  const modShort = MODULE_SHORT[w.module] || w.module.toUpperCase().slice(0, 3);

  (w.exercises || []).forEach((ex, ei) => {
    const exId = `EX-${modShort}-${pad2(weekNum)}-${pad2(ei + 1)}`;
    migratedExercises.push({
      id: exId, weekId, moduleId: modId,
      title: ex.title, description: ex.description,
      difficulty: ex.difficulty, expectedTime: ex.expectedTime,
      learningOutcomes: [], concepts: [], deliverables: []
    });
  });
});

/* ══════════════════════════════════════════
   Build Challenges Array (with content)
   ══════════════════════════════════════════ */

console.log('Building challenges...');

const migratedChallenges = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);
  const modShort = MODULE_SHORT[w.module] || w.module.toUpperCase().slice(0, 3);

  if (w.challenge) {
    moduleChallengeCounters[modShort] = (moduleChallengeCounters[modShort] || 0);
    const chId = `CH-${modShort}-${pad2(moduleChallengeCounters[modShort] + 1)}`;
    moduleChallengeCounters[modShort]++;
    migratedChallenges.push({
      id: chId, weekId, moduleId: modId,
      title: w.challenge.title, description: w.challenge.description,
      requirements: w.challenge.requirements || [],
      expectedTime: w.challenge.expectedTime,
      difficulty: 'advanced', learningOutcomes: [], concepts: [], exercises: []
    });
  }
});

/* ══════════════════════════════════════════
   Build Quizzes Array (with content)
   ══════════════════════════════════════════ */

console.log('Building quizzes...');

const migratedQuizzes = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);

  if (w.quiz) {
    migratedQuizzes.push({
      id: `QZ-${pad2(weekNum)}`, weekId, moduleId: modId,
      questionCount: w.quiz.questions || 10,
      timeLimit: w.quiz.timeLimit || '30 minutes',
      passingScore: w.quiz.passingScore || 80,
      questionPool: [], concepts: []
    });
  }
});

/* ══════════════════════════════════════════
   Build Interview Questions Array (with content)
   ══════════════════════════════════════════ */

console.log('Building interview questions...');

const migratedInterviews = [];
academy.weeks.forEach((w, i) => {
  const weekNum = i + 1;
  const weekId = `WK-${pad2(weekNum)}`;
  const modId = slugToModule(w.module);
  const modShort = MODULE_SHORT[w.module] || w.module.toUpperCase().slice(0, 3);

  (w.interviewQuestions || []).forEach((iq, ii) => {
    const intId = `INT-${modShort}-${pad2(weekNum)}-${pad2(ii + 1)}`;
    migratedInterviews.push({
      id: intId, weekId, moduleId: modId,
      question: iq.question, expectedAnswer: iq.expectedAnswer,
      difficulty: iq.difficulty, concepts: [], tags: []
    });
  });
});

/* ══════════════════════════════════════════
   Build Output Files
   ══════════════════════════════════════════ */

console.log('\nBuilding output files...');

const academyV2 = {
  meta: {
    id: 'CRSE-AEL-ENGINEERING', name: academy.meta.name,
    description: academy.meta.description, author: academy.meta.author,
    version: '2.5.0', license: 'MIT', readingTime: academy.meta.readingTime,
    metadata: {
      createdAt: new Date().toISOString(), updatedAt: new Date().toISOString(),
      status: 'published', migratedFrom: '1.0.0', domainModelVersion: '1.0.0'
    }
  },
  modules: migratedModules, weeks: migratedWeeks,
  concepts: migratedConcepts, learningOutcomes: migratedLearningOutcomes,
  referenceTopics: migratedReferenceTopics, exercises: migratedExercises,
  challenges: migratedChallenges, quizzes: migratedQuizzes,
  interviews: migratedInterviews, glossary: migratedGlossary
};

const questionsV2 = {
  meta: {
    version: '2.5.0', totalQuestions: migratedQuestions.length,
    coverage: '100% of LLM Engineering Curriculum',
    lastUpdated: new Date().toISOString(), migratedFrom: '1.0.0'
  },
  questions: migratedQuestions
};

fs.writeFileSync(path.join(ROOT, 'academy.v2.json'), JSON.stringify(academyV2, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT, 'questions.v2.json'), JSON.stringify(questionsV2, null, 2), 'utf8');
fs.writeFileSync(path.join(ROOT, 'migration-map.json'), JSON.stringify(map, null, 2), 'utf8');

/* ── Report ── */

const elapsed = Date.now() - startTime;
console.log('\n═══ Migration Report ═══\n');
console.log(`  Modules migrated:       ${stats.modules}`);
console.log(`  Weeks migrated:         ${stats.weeks}`);
console.log(`  Concepts created:       ${stats.concepts}`);
console.log(`  Learning Outcomes:      ${stats.learningOutcomes}`);
console.log(`  Questions migrated:     ${stats.questions}`);
console.log(`  Exercises migrated:     ${stats.exercises}`);
console.log(`  Challenges migrated:    ${stats.challenges}`);
console.log(`  Quizzes migrated:       ${stats.quizzes}`);
console.log(`  Interview Questions:    ${stats.interviews}`);
console.log(`  References migrated:    ${stats.references}`);
console.log(`  Glossary terms:         ${stats.glossary}`);
console.log(`  Relationships updated:  ${stats.relationships}`);
console.log(`  Migration time:         ${elapsed}ms`);
console.log('\n  Output files:');
console.log(`    academy.v2.json       (${(fs.statSync(path.join(ROOT, 'academy.v2.json')).size / 1024).toFixed(0)}KB)`);
console.log(`    questions.v2.json     (${(fs.statSync(path.join(ROOT, 'questions.v2.json')).size / 1024).toFixed(0)}KB)`);
console.log(`    migration-map.json    (${(fs.statSync(path.join(ROOT, 'migration-map.json')).size / 1024).toFixed(0)}KB)`);
console.log('\n  Migration complete. Run validate-domain.js to verify.\n');
