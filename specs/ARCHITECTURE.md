# AEL Engineering Academy — Architecture

## Overview

AEL Engineering Academy is a single-page application (SPA) built on the AEL Reference Framework. Pure HTML, CSS, and Vanilla JavaScript — no frameworks, no build tools, no dependencies.

## File Structure

```
ael-engineering-academy/
├── index.html              # App shell
├── styles.css              # Design system + all components
├── academy.css             # Product-specific styles
├── academy.js              # Product layer (branding, colors)
├── app.js                  # Core engine (~1550 lines)
├── data.js                 # Embedded data (academy + questions)
├── academy.json            # Curriculum structure (v2, stable IDs)
├── questions.json          # Q&A knowledge base (v2, 741 questions)
├── packages/
│   ├── learning-domain/    # Domain schemas + migration
│   │   ├── course.schema.json
│   │   ├── concept.schema.json
│   │   ├── validate-domain.js
│   │   └── migrate-ids.js
│   ├── learning/
│   │   └── knowledge-graph/ # Knowledge graph package
│   │       ├── graph.js    # Public API
│   │       ├── builder.js  # Graph construction
│   │       └── validator.js # Validation
│   ├── progress/           # Progress tracking (v2)
│   │   └── plugin.js
│   ├── quiz/               # Quiz grading
│   │   └── plugin.js
│   └── schema/             # JSON schemas
│       └── question.schema.json
├── plugins/
│   ├── export/             # Data export (JSON, CSV)
│   │   └── plugin.js
│   ├── search/             # Cross-content search (v2)
│   │   └── plugin.js
│   └── theme/              # Dark/Light theme toggle
│       └── plugin.js
├── scripts/
│   ├── build-data.js       # Data build script
│   └── validate.js         # Legacy validator
└── specs/
    └── ARCHITECTURE.md     # This file
```

## Data Flow

```
index.html
  ├── loads data.js (embedded JSON)
  ├── loads academy.js (product layer)
  ├── loads packages/progress/plugin.js
  ├── loads packages/quiz/plugin.js
  ├── loads plugins/search/plugin.js
  ├── loads plugins/export/plugin.js
  ├── loads plugins/theme/plugin.js
  └── loads app.js
       ├── AELAcademy.init()
       │   ├── restoreState() from localStorage
       │   ├── loadData() from window.ACADEMY_DATA / QUESTIONS_DATA
       │   ├── setupRouting() hash-based routing
       │   ├── setupSearch() event delegation
       │   ├── handleHash() determine initial view
       │   └── render() build DOM
       │
       ├── render()
       │   ├── renderHeader() brand + search + progress
       │   ├── renderModuleNav() 4 modules
       │   ├── renderWeekNav() 12 weeks sidebar
       │   └── main content
       │       ├── renderDashboard() overview
       │       ├── renderWeekContent() week detail
       │       └── renderModuleContent() module overview
       │
       └── State Management
           ├── localStorage persistence
           ├── progress tracking (via AELProgress)
           ├── favorites/bookmarks
           ├── notes
           ├── quiz results
           └── expanded items
```

## Stable ID System

Every entity has a stable, domain-driven ID:

| Prefix | Entity | Example |
|--------|--------|---------|
| CRSE- | Course | CRSE-AEL-ENGINEERING |
| MOD- | Module | MOD-FOUNDATIONS |
| WK- | Week | WK-01 |
| CON- | Concept | CON-FOU-001 |
| LO- | Learning Outcome | LO-WK01-01 |
| Q- | Question | Q-FOU-001 |
| EX- | Exercise | EX-FOU-01-01 |
| CH- | Challenge | CH-FOU-01 |
| QZ- | Quiz | QZ-01 |
| INT- | Interview | INT-FOU-01-01 |
| REF- | Reference | REF-WK01-01 |
| GL- | Glossary | GL-LLM |

## Knowledge Graph

The knowledge graph builds relationships between all entities:

- **Nodes**: 1,039 (11 types)
- **Edges**: 1,092 (10 relations)
- **Relations**: contains, teaches, aims, practices, assesses, references, requires, produces, tested-by, related

API: `getConcept()`, `getPrerequisites()`, `getDependents()`, `getRelated()`, `findPath()`, `search()`

## Plugins

Plugins are loaded as separate `<script>` tags and attach to `window` globals:
- `window.AELExport` — export progress, notes, certificates
- `window.AELSearch` — cross-content search with ranking
- `window.AELTheme` — dark/light theme toggle
- `window.AELQuiz` — quiz grading and state
- `window.AELProgress` — progress tracking utilities

## State

All state is persisted in `localStorage` under key `ael-academy-state`:
```json
{
  "progress": { "itemId": { "completed": true, "timestamp": 1234567890 } },
  "favorites": ["itemId1", "itemId2"],
  "notes": { "itemId": { "content": "note text" } },
  "quizResults": { "weekId": { "score": 85, "passed": true } },
  "expandedItems": { "itemId": true }
}
```

## Routing

Hash-based routing: `#week-1`, `#module-foundations`, etc.
No server-side routing needed.

## Validation

- Domain validation: 992 IDs, 0 errors
- Knowledge graph: 1,039 nodes, 0 broken refs
- Question coverage: 741 questions across 12 weeks
