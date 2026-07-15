# AEL Engineering Academy — Architecture

## Overview

AEL Engineering Academy is a single-page application (SPA) built with pure HTML, CSS, and Vanilla JavaScript. No frameworks, no build tools, no dependencies.

## File Structure

```
ael-engineering-academy/
├── index.html              # App shell
├── styles.css              # Design system + all components
├── app.js                  # Core engine (~1550 lines)
├── data.js                 # Embedded data (academy + questions)
├── academy.json            # Curriculum structure
├── questions.json          # Q&A knowledge base (741 questions)
├── package.json            # Project metadata
├── packages/
│   ├── schema/             # JSON schemas for data validation
│   │   └── question.schema.json
│   ├── quiz/               # Quiz grading engine
│   │   └── plugin.js
│   └── progress/           # Progress tracking
│       └── plugin.js
├── plugins/
│   ├── export/             # Data export (JSON, CSV, Markdown)
│   │   └── plugin.js
│   ├── search/             # Cross-content search
│   │   └── plugin.js
│   └── theme/              # Dark/Light theme toggle
│       └── plugin.js
├── specs/
│   └── ARCHITECTURE.md     # This file
├── README.md
├── LICENSE
└── CHANGELOG.md
```

## Data Flow

```
index.html
  └── loads data.js (embedded JSON)
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
           ├── progress tracking
           ├── favorites/bookmarks
           ├── notes
           ├── quiz results
           └── expanded items
```

## Rendering

All content is rendered dynamically into `<div id="app">`. No server required — data is embedded in `data.js`.

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
  "quizResults": { "quizId": { "score": 85, "passed": true } },
  "expandedItems": { "itemId": true }
}
```

## Routing

Hash-based routing: `#week-1`, `#module-foundations`, etc.
No server-side routing needed.
