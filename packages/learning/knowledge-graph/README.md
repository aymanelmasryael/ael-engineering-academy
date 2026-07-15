# @ael/learning-knowledge-graph

Knowledge Graph package for AEL Learning Domain Model.

Builds relationships between all learning entities using stable IDs. Consumes `academy.json` and `questions.json` as read-only inputs.

## Usage

```js
const KnowledgeGraph = require('./graph');
const graph = KnowledgeGraph.fromData(academy, questions);
```

## API

| Method | Description |
|--------|-------------|
| `getConcept(id)` | Get a concept node |
| `getPrerequisites(id)` | Get prerequisite nodes |
| `getDependents(id)` | Get dependent nodes |
| `getRelated(id)` | Get related nodes |
| `findPath(from, to)` | BFS shortest path |
| `search(query)` | Text search across all nodes |
| `getEdges(id)` | Get all edges for a node |
| `getNeighbors(id)` | Get all neighbors |
| `getNodesByType(type)` | Filter by entity type |
| `getStats()` | Graph statistics |
| `validate()` | Run full validation |

## Entity Types

`module`, `week`, `concept`, `learning-outcome`, `reference`, `exercise`, `challenge`, `quiz`, `interview`, `glossary`, `question`

## Edge Relations

`contains`, `teaches`, `aims`, `practices`, `assesses`, `references`, `requires`, `produces`, `tested-by`, `related`, `prerequisite`, `challenges`, `prepares`

## Validation

Zero errors required. Orphan warnings are expected for standalone entities not linked from weeks.

## Architecture

- `builder.js` — Constructs graph from academy data (read-only)
- `graph.js` — Public API over pre-built graph
- `validator.js` — Detects orphans, broken refs, circular deps, invalid chains

## Constraints

- Never mutates source data
- Generated once, cached internally
- O(1) lookups via Map indexes
- No external dependencies
