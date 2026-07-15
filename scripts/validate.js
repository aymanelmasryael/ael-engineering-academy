#!/usr/bin/env node
/* AEL Academy — Validate Questions Script */

const fs = require('fs');
const path = require('path');

const REQUIRED_FIELDS = ['id', 'week', 'module', 'question', 'answer', 'type', 'difficulty'];
const VALID_TYPES = ['definition', 'conceptual', 'practical', 'comparison', 'architecture', 'design', 'troubleshooting', 'scenario', 'best-practices', 'code-writing', 'case-study', 'interview'];
const VALID_DIFFICULTIES = ['beginner', 'intermediate', 'advanced', 'expert', 'interview'];
const VALID_MODULES = ['foundations', 'core-techniques', 'applied-engineering', 'production'];

function validate() {
  const filePath = path.join(__dirname, '..', 'questions.json');
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  const questions = data.questions || [];

  console.log(`Validating ${questions.length} questions...\n`);

  let errors = 0;
  let warnings = 0;
  const ids = new Set();
  const weekCounts = {};

  questions.forEach((q, i) => {
    // Check required fields
    REQUIRED_FIELDS.forEach(field => {
      if (!q[field]) {
        console.error(`  ERROR [${i}] Missing field: ${field} (id: ${q.id || 'unknown'})`);
        errors++;
      }
    });

    // Check duplicate IDs
    if (ids.has(q.id)) {
      console.error(`  ERROR [${i}] Duplicate ID: ${q.id}`);
      errors++;
    }
    ids.add(q.id);

    // Check valid type
    if (q.type && !VALID_TYPES.includes(q.type)) {
      console.warn(`  WARN [${i}] Invalid type: ${q.type} (id: ${q.id})`);
      warnings++;
    }

    // Check valid difficulty
    if (q.difficulty && !VALID_DIFFICULTIES.includes(q.difficulty)) {
      console.warn(`  WARN [${i}] Invalid difficulty: ${q.difficulty} (id: ${q.id})`);
      warnings++;
    }

    // Check valid module
    if (q.module && !VALID_MODULES.includes(q.module)) {
      console.warn(`  WARN [${i}] Invalid module: ${q.module} (id: ${q.id})`);
      warnings++;
    }

    // Count by week
    if (q.week) {
      weekCounts[q.week] = (weekCounts[q.week] || 0) + 1;
    }
  });

  console.log('\n--- Week Coverage ---');
  for (const [week, count] of Object.entries(weekCounts).sort()) {
    const status = count >= 50 ? 'OK' : count >= 30 ? 'LOW' : 'CRITICAL';
    console.log(`  ${week}: ${count} questions [${status}]`);
  }

  console.log(`\n--- Summary ---`);
  console.log(`  Total: ${questions.length} questions`);
  console.log(`  Unique IDs: ${ids.size}`);
  console.log(`  Errors: ${errors}`);
  console.log(`  Warnings: ${warnings}`);
  console.log(`  Weeks: ${Object.keys(weekCounts).length}/12`);

  if (errors > 0) {
    process.exit(1);
  } else {
    console.log('\n  Validation PASSED');
  }
}

validate();
