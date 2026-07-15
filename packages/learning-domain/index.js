/* AEL Learning Domain — Schema Index */
const fs = require('fs');
const path = require('path');

const schemaDir = __dirname;

const schemas = {
  course:        JSON.parse(fs.readFileSync(path.join(schemaDir, 'course.schema.json'), 'utf8')),
  module:        JSON.parse(fs.readFileSync(path.join(schemaDir, 'module.schema.json'), 'utf8')),
  week:          JSON.parse(fs.readFileSync(path.join(schemaDir, 'week.schema.json'), 'utf8')),
  concept:       JSON.parse(fs.readFileSync(path.join(schemaDir, 'concept.schema.json'), 'utf8')),
  learningOutcome: JSON.parse(fs.readFileSync(path.join(schemaDir, 'learning-outcome.schema.json'), 'utf8')),
  question:      JSON.parse(fs.readFileSync(path.join(schemaDir, 'question.schema.json'), 'utf8')),
  exercise:      JSON.parse(fs.readFileSync(path.join(schemaDir, 'exercise.schema.json'), 'utf8')),
  challenge:     JSON.parse(fs.readFileSync(path.join(schemaDir, 'challenge.schema.json'), 'utf8')),
  quiz:          JSON.parse(fs.readFileSync(path.join(schemaDir, 'quiz.schema.json'), 'utf8')),
  interview:     JSON.parse(fs.readFileSync(path.join(schemaDir, 'interview.schema.json'), 'utf8')),
  project:       JSON.parse(fs.readFileSync(path.join(schemaDir, 'project.schema.json'), 'utf8')),
  reference:     JSON.parse(fs.readFileSync(path.join(schemaDir, 'reference.schema.json'), 'utf8')),
  glossary:      JSON.parse(fs.readFileSync(path.join(schemaDir, 'glossary.schema.json'), 'utf8')),
  relationships: JSON.parse(fs.readFileSync(path.join(schemaDir, 'relationships.schema.json'), 'utf8'))
};

module.exports = schemas;
