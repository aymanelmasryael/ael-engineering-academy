# AEL Engineering Academy — Complete Specification

> **Version:** 1.1.0
> **Author:** Ayman Elmasry — AEL Digital Studio
> **License:** MIT
> **Repository:** https://github.com/aymanelmasryael/ael-engineering-academy

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Design Philosophy](#2-design-philosophy)
3. [Technology Stack](#3-technology-stack)
4. [File Structure](#4-file-structure)
5. [Curriculum Architecture](#5-curriculum-architecture)
6. [Q&A Knowledge Base](#6-qa-knowledge-base)
7. [Core Engine (app.js)](#7-core-engine-appjs)
8. [Design System (styles.css)](#8-design-system-stylescss)
9. [Data Layer](#9-data-layer)
10. [State Management](#10-state-management)
11. [Routing](#11-routing)
12. [Plugins & Packages](#12-plugins--packages)
13. [Rendering Pipeline](#13-rendering-pipeline)
14. [Search System](#14-search-system)
15. [Quiz Engine](#15-quiz-engine)
16. [Progress Tracking](#16-progress-tracking)
17. [Export System](#17-export-system)
18. [Theme System](#18-theme-system)
19. [Scripts & Tooling](#19-scripts--tooling)
20. [Deployment](#20-deployment)
21. [API Reference](#21-api-reference)
22. [Data Schema](#22-data-schema)
23. [Performance Considerations](#23-performance-considerations)
24. [Future Roadmap](#24-future-roadmap)

---

## 1. Project Overview

### What is AEL Engineering Academy?

AEL Engineering Academy is a **complete, self-contained, offline-first learning platform** for LLM (Large Language Model) Engineering. It covers the entire journey from zero knowledge to production deployment across a structured 12-week curriculum.

### Key Characteristics

| Property | Value |
|----------|-------|
| Architecture | Single Page Application (SPA) |
| Framework | None — Pure Vanilla JavaScript |
| Dependencies | Zero (no npm, no bundler, no transpiler) |
| Data Storage | Embedded in JavaScript (works offline) |
| User State | localStorage persistence |
| Routing | Hash-based (`#week-1`, `#module-foundations`) |
| Rendering | Dynamic DOM manipulation |
| Design System | Custom CSS with CSS custom properties |
| Browser Support | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ |
| Total Code | ~3,250 lines (1,535 JS + 1,715 CSS) |
| Total Data | ~1.8MB (741 questions + curriculum) |

### What Makes It Different

1. **Zero dependencies** — No React, Vue, Angular, or any framework. No Webpack, Vite, or bundler. Just HTML, CSS, and JavaScript.
2. **Offline-first** — All data is embedded directly in `data.js`. No server required. Double-click `index.html` and it works.
3. **Massive Q&A knowledge base** — 741 unique questions with detailed answers, real-world examples, common mistakes, and best practices.
4. **Complete curriculum** — 12 weeks, 4 modules, covering every aspect of LLM engineering from fundamentals to production.
5. **Design system** — AEL Dark theme with glassmorphism, consistent color palette, and responsive layout.

---

## 2. Design Philosophy

### Core Principles

1. **Simplicity over complexity** — No frameworks means no abstraction layers, no dependency hell, no version conflicts.
2. **Data-driven content** — All curriculum content lives in JSON files. The engine renders it dynamically.
3. **Progressive enhancement** — Works in any modern browser. JavaScript enhances the experience but the data is always accessible.
4. **Offline-first** — The application must work without an internet connection. Data is embedded, state is local.
5. **Single-file deployment** — The entire application can be distributed as a folder of static files. No build step required.

### Design System Colors

```
Primary:    #0074FF (AEL Blue)
Secondary:  #FFD700 (AEL Gold)
Accent 1:   #00FFCC (AEL Teal)
Accent 2:   #6C47FF (AEL Purple)
Accent 3:   #FF4D8D (AEL Pink)
Success:    #00FF88 (AEL Green)
Error:      #FF4444 (AEL Red)
Background: #0B1220 (AEL Dark)
Surface:    rgba(255, 255, 255, 0.05)
Border:     rgba(255, 255, 255, 0.12)
```

### Visual Language

- **Glassmorphism** — Semi-transparent surfaces with backdrop blur
- **Rounded corners** — 12px for cards, 8px for smaller elements
- **Smooth transitions** — 0.25s ease for all interactive elements
- **Sticky header** — Remains visible during scroll
- **Badge system** — Color-coded badges for difficulty, type, and status

---

## 3. Technology Stack

### Frontend (100% of the application)

| Technology | Usage | Version |
|-----------|-------|---------|
| HTML5 | App shell, semantic markup | ES2020 |
| CSS3 | Design system, components, animations | Custom Properties |
| Vanilla JavaScript | Core engine, all logic | ES2020+ (async/await) |
| localStorage | State persistence | Web Storage API |

### Build Tools (optional)

| Tool | Usage |
|------|-------|
| Node.js | Running validation/build scripts |
| Python 3 | Local development server (`http.server`) |
| Git | Version control |

### What We Do NOT Use

- No React, Vue, Angular, Svelte, or any UI framework
- No Webpack, Vite, Rollup, or any bundler
- No TypeScript (plain JavaScript)
- No CSS preprocessors (Sass, Less)
- No npm packages for runtime
- No build step required for deployment
- No server-side rendering
- No database — all data is file-based

---

## 4. File Structure

```
ael-engineering-academy/
│
├── index.html                    # Application shell (26 lines)
│   ├── <head>                    # Meta tags, Open Graph, favicon
│   ├── <div id="app">            # Mount point for dynamic content
│   ├── <script src="data.js">    # Embedded curriculum + questions
│   ├── <script src="packages/*"> # Utility packages
│   ├── <script src="plugins/*">  # Feature plugins
│   └── <script src="app.js">     # Core engine
│
├── app.js                        # Core engine (1,535 lines)
│   ├── AELAcademy object         # Main application object
│   ├── init()                    # Application bootstrap
│   ├── loadData()                # Data loading (embedded or fetch)
│   ├── render()                  # Main render loop
│   ├── renderHeader()            # Sticky header with search
│   ├── renderModuleNav()         # Module tab navigation
│   ├── renderWeekNav()           # Sidebar week navigation
│   ├── renderDashboard()         # Dashboard overview
│   ├── renderWeekContent()       # Week detail view
│   ├── renderModuleContent()     # Module overview
│   ├── renderQuestionsSection()  # Q&A cards with filters
│   ├── renderQuestionCard()      # Individual question card
│   ├── renderExercisesSection()  # Exercises list
│   ├── renderChallengeSection()  # Capstone challenge
│   ├── renderQuizSection()       # Interactive quiz
│   ├── renderInterviewSection()  # Interview questions
│   ├── renderSearchResults()     # Cross-content search
│   ├── state management          # localStorage persistence
│   └── routing                   # Hash-based navigation
│
├── styles.css                    # Design system (1,715 lines)
│   ├── CSS Custom Properties     # Color palette, spacing, typography
│   ├── Base styles               # Reset, body, typography
│   ├── Header                    # Sticky header, search, nav
│   ├── Module tabs               # Navigation tabs
│   ├── Week sidebar              # Left sidebar navigation
│   ├── Layout                    # Grid layout, responsive
│   ├── Cards                     # Glassmorphism card system
│   ├── Badges                    # Color-coded badge system
│   ├── Progress bars             # Visual progress indicators
│   ├── Q&A components            # Question cards, filters, tags
│   ├── Quiz components           # Quiz interface, results
│   ├── Forms                     # Input styles
│   ├── Buttons                   # Button variants
│   ├── Search                    # Search interface
│   ├── Collapsible sections      # Expandable content
│   ├── Responsive breakpoints    # Mobile, tablet, desktop
│   └── Animations                # Transitions, hover effects
│
├── data.js                       # Embedded data (1.6MB)
│   ├── window.ACADEMY_DATA       # Curriculum structure
│   └── window.QUESTIONS_DATA     # 741 Q&A questions
│
├── academy.json                  # Curriculum source (115KB)
│   ├── meta                      # Name, version, description
│   ├── modules[]                 # 4 modules with metadata
│   │   ├── id, title, description, color
│   │   └── weeks[]               # Week IDs in module
│   └── weeks[]                   # 12 weeks with content
│       ├── id, module, number, title
│       ├── learningOutcomes[]    # 5 learning outcomes per week
│       ├── reference[]           # Reference topics
│       ├── questions[]           # Legacy questions (inline)
│       ├── exercises[]           # 3 exercises per week
│       ├── challenge[]           # 1 capstone challenge
│       ├── quiz[]                # 1 quiz with questions
│       └── interviewQuestions[]  # 3 interview questions
│
├── questions.json                # Q&A knowledge base (1.8MB)
│   ├── meta                      # Version, total, coverage
│   └── questions[]               # 741 unique questions
│       ├── id                    # e.g., "w1-q-001"
│       ├── week                  # e.g., "week-1"
│       ├── module                # e.g., "foundations"
│       ├── question              # Full question text
│       ├── answer                # Detailed answer (2-4 paragraphs)
│       ├── type                  # definition, conceptual, etc.
│       ├── difficulty            # beginner, intermediate, etc.
│       ├── whyCorrect            # Explanation of correctness
│       ├── whyOthersIncorrect    # Why alternatives are wrong
│       ├── realWorldExample      # Practical example
│       ├── commonMistakes[]      # List of common errors
│       ├── bestPractices[]       # Recommended approaches
│       ├── relatedConcepts[]     # Related topics
│       ├── estimatedReadingTime  # e.g., "3 min"
│       ├── interviewRelevance    # high, medium, low
│       ├── tags[]                # Searchable tags
│       ├── source                # Learning outcome reference
│       └── relationships{}       # Links to LO, exercises, etc.
│
├── packages/
│   ├── schema/
│   │   └── question.schema.json  # JSON Schema for validation
│   ├── quiz/
│   │   └── plugin.js             # Quiz grading engine
│   └── progress/
│       └── plugin.js             # Progress tracking utilities
│
├── plugins/
│   ├── search/
│   │   └── plugin.js             # Cross-content search with ranking
│   ├── export/
│   │   └── plugin.js             # Export progress, notes, certificates
│   └── theme/
│       └── plugin.js             # Dark/Light theme toggle
│
├── scripts/
│   ├── build-data.js             # Generate data.js from JSON files
│   └── validate.js               # Validate question integrity
│
├── specs/
│   └── ARCHITECTURE.md           # Architecture documentation
│
├── assets/                       # Static assets directory (empty)
├── package.json                  # Project metadata
├── README.md                     # Project overview
├── LICENSE                       # MIT License
├── CHANGELOG.md                  # Version history
└── .gitignore                    # Git ignore rules
```

---

## 5. Curriculum Architecture

### Module Structure

The curriculum is organized into **4 modules** spanning **12 weeks**:

```
Module 1: Foundations (Weeks 1-3)
├── Week 1: What are LLMs?
├── Week 2: Transformer Architecture
└── Week 3: Tokenization

Module 2: Core Techniques (Weeks 4-6)
├── Week 4: Prompt Engineering
├── Week 5: Fine-tuning
└── Week 6: RAG Architecture

Module 3: Applied Engineering (Weeks 7-9)
├── Week 7: Agents & Tools
├── Week 8: Evaluation
└── Week 9: Deployment

Module 4: Production (Weeks 10-12)
├── Week 10: Safety & Alignment
├── Week 11: Advanced Topics
└── Week 12: Capstone Project
```

### Week Structure

Each week contains:

| Component | Count | Description |
|-----------|-------|-------------|
| Learning Outcomes | 5 | What the student will learn |
| Reference Topics | Varies | Key concepts and definitions |
| Q&A Questions | 50-86 | Detailed knowledge base |
| Exercises | 3 | Hands-on practice |
| Challenge | 1 | Capstone project |
| Quiz | 1 | Assessment with scoring |
| Interview Questions | 3 | Job interview preparation |

### Module Metadata

```json
{
  "id": "foundations",
  "title": "Foundations",
  "description": "Build a solid understanding of LLMs, Transformers, and Tokenization",
  "color": "#0074FF",
  "weeks": ["week-1", "week-2", "week-3"]
}
```

---

## 6. Q&A Knowledge Base

### Statistics

| Metric | Value |
|--------|-------|
| Total Questions | 741 |
| Modules Covered | 4/4 |
| Weeks Covered | 12/12 |
| Question Types | 12 |
| Difficulty Levels | 5 |
| Average per Week | 61.75 |
| Min per Week | 50 |
| Max per Week | 86 |

### Question Distribution

| Week | Module | Questions |
|------|--------|-----------|
| Week 1 | Foundations | 80 |
| Week 2 | Foundations | 50 |
| Week 3 | Foundations | 50 |
| Week 4 | Core Techniques | 50 |
| Week 5 | Core Techniques | 86 |
| Week 6 | Core Techniques | 80 |
| Week 7 | Applied Engineering | 50 |
| Week 8 | Applied Engineering | 50 |
| Week 9 | Applied Engineering | 50 |
| Week 10 | Production | 65 |
| Week 11 | Production | 80 |
| Week 12 | Production | 50 |
| **Total** | | **741** |

### Question Types

| Type | Description |
|------|-------------|
| `definition` | What is X? Clear definitions of concepts |
| `conceptual` | How does X work? Conceptual understanding |
| `practical` | How do I implement X? Hands-on guidance |
| `comparison` | What's the difference between X and Y? Comparative analysis |
| `architecture` | How do I design X? System design questions |
| `design` | How should I structure X? Design patterns |
| `troubleshooting` | X is not working, why? Debugging guidance |
| `scenario` | In situation X, what should I do? Real-world scenarios |
| `best-practices` | What's the best way to do X? Industry best practices |
| `code-writing` | Write code to do X. Code generation tasks |
| `case-study` | Analyze this real-world example. Deep analysis |
| `interview` | How would you explain X in an interview? Interview prep |

### Difficulty Levels

| Level | Description | Target Audience |
|-------|-------------|-----------------|
| `beginner` | No prior knowledge required | Newcomers to LLM engineering |
| `intermediate` | Some foundational knowledge needed | Practicing engineers |
| `advanced` | Deep understanding required | Senior engineers |
| `expert` | Cutting-edge knowledge | Tech leads, architects |
| `interview` | Job interview focus | Job seekers |

### Question Schema

Every question in `questions.json` follows this schema:

```json
{
  "id": "w1-q-001",
  "week": "week-1",
  "module": "foundations",
  "question": "What is a Large Language Model (LLM)?",
  "answer": "A Large Language Model is a type of artificial intelligence...",
  "type": "definition",
  "difficulty": "beginner",
  "whyCorrect": "This definition captures the essential characteristics...",
  "whyOthersIncorrect": {
    "A simple chatbot": "Chatbots use rule-based logic, not neural networks",
    "A search engine": "Search engines index and retrieve, they don't generate"
  },
  "realWorldExample": "ChatGPT, Claude, and Llama are all examples of LLMs...",
  "commonMistakes": [
    "Confusing LLMs with traditional NLP systems",
    "Assuming all LLMs are the same size"
  ],
  "bestPractices": [
    "Start with understanding transformer architecture",
    "Experiment with different model sizes"
  ],
  "relatedConcepts": ["Transformers", "Neural Networks", "NLP"],
  "estimatedReadingTime": "3 min",
  "interviewRelevance": "high",
  "tags": ["llm", "definition", "fundamentals"],
  "source": "Week 1 Learning Outcome 1",
  "relationships": {
    "learningOutcome": "LO-1",
    "reference": "ref-1",
    "exercise": "ex-1",
    "challenge": "ch-1",
    "quiz": "qz-1",
    "glossary": "gl-1"
  }
}
```

### Question Index

Questions are indexed at load time for fast retrieval:

```javascript
questionIndex = {
  byWeek: { "week-1": [...], "week-2": [...] },
  byModule: { "foundations": [...], "core-techniques": [...] },
  byDifficulty: { "beginner": [...], "intermediate": [...] },
  byType: { "definition": [...], "conceptual": [...] },
  byTag: { "llm": [...], "transformer": [...] }
}
```

---

## 7. Core Engine (app.js)

### Architecture

The entire application is a single JavaScript object: `AELAcademy`. It follows the module pattern with no classes, no imports, and no external dependencies.

```javascript
const AELAcademy = {
  // Properties
  data: null,              // Academy curriculum data
  questions: [],           // Q&A questions array
  questionIndex: {},       // Indexed questions for fast lookup
  state: { ... },          // Current application state
  STORAGE_KEY: 'ael-academy-state',

  // Methods (grouped by category)
  // ── Initialization ──
  async init()
  async loadData()
  buildQuestionIndex()
  getQuestionsForWeek(weekId)
  searchQuestions(query)

  // ── State Management ──
  saveState()
  restoreState()
  toggleProgress(itemId)
  toggleFavorite(itemId)
  toggleExpand(itemId)
  isCompleted(itemId)

  // ── Routing ──
  setupRouting()
  handleHash()
  navigateTo(view, moduleId, weekId)

  // ── Search ──
  setupSearch()

  // ── Data Helpers ──
  getWeekById(weekId)
  getModuleById(moduleId)
  getModuleWeeks(moduleId)
  getAllWeeks()

  // ── Progress Calculations ──
  getWeekProgress(weekId)
  getModuleProgress(moduleId)
  getOverallProgress()
  getQuizProgress()
  getProjectProgress()
  getLearningTime()
  getCertificationReadiness()

  // ── Rendering ──
  render()
  renderMainContent()
  renderHeader()
  renderModuleNav()
  renderWeekNav()
  renderDashboard()
  renderSearchResults()
  renderModuleContent()
  renderWeekContent()
  renderLearningOutcomes(week)
  renderReferenceSection(week)
  renderQuestionsSection(week)
  renderQuestionCard(q, index)
  renderLegacyQuestions(week)
  renderExercisesSection(week)
  renderChallengeSection(week)
  renderQuizSection(week)
  renderInterviewSection(week)
  createProgressCard(title, value, subtitle)

  // ── Utilities ──
  escapeHtml(str)
  toggleExpand(itemId)
};
```

### Initialization Flow

```
1. Browser loads index.html
2. data.js executes → sets window.ACADEMY_DATA + window.QUESTIONS_DATA
3. app.js executes → defines AELAcademy object
4. DOMContentLoaded → AELAcademy.init() called
5. init():
   a. restoreState() — load from localStorage
   b. loadData() — read window.ACADEMY_DATA / QUESTIONS_DATA
   c. buildQuestionIndex() — create lookup indexes
   d. setupRouting() — listen for hashchange
   e. setupSearch() — listen for input events
   f. handleHash() — parse current URL hash
   g. render() — build the DOM
```

### Data Loading Strategy

```javascript
async loadData() {
  // Priority 1: Embedded data (works offline, no server needed)
  if (window.ACADEMY_DATA) {
    this.data = window.ACADEMY_DATA;
  }
  // Priority 2: Fetch from server (for development with live data)
  else {
    const r = await fetch('academy.json');
    this.data = await r.json();
  }
  // Same pattern for questions
}
```

---

## 8. Design System (styles.css)

### CSS Custom Properties

All design tokens are defined as CSS custom properties on `:root`:

```css
:root {
  /* Colors */
  --blue: #0074FF;
  --gold: #FFD700;
  --teal: #00FFCC;
  --purple: #6C47FF;
  --pink: #FF4D8D;
  --green: #00FF88;
  --red: #FF4444;

  /* Surfaces */
  --bg: #0B1220;
  --surface: rgba(255, 255, 255, 0.05);
  --surface-hover: rgba(255, 255, 255, 0.10);
  --border: rgba(255, 255, 255, 0.12);

  /* Text */
  --text: #E0E0E0;
  --text-secondary: #A0A0A0;
  --text-muted: #666666;

  /* Layout */
  --radius: 12px;
  --radius-sm: 8px;
  --transition: 0.25s ease;
}
```

### Component Styles

| Component | Class | Description |
|-----------|-------|-------------|
| Header | `.header` | Sticky glassmorphism header |
| Module Tabs | `.module-tabs` | Tab navigation for modules |
| Week Nav | `.week-nav` | Sidebar navigation |
| Card | `.card` | Glassmorphism card container |
| Badge | `.badge` | Color-coded status badges |
| Progress Bar | `.progress-bar` | Visual progress indicator |
| Q&A Card | `.qa-card` | Question and answer card |
| Q&A Filters | `.qa-filters` | Difficulty filter buttons |
| Q&A Question | `.qa-question` | Question text container |
| Q&A Answer | `.qa-answer` | Answer content container |
| Q&A Subsection | `.qa-subsection` | Why correct, mistakes, etc. |
| Q&A Tags | `.qa-tags` | Tag list display |
| Q&A Navigation | `.qa-nav` | Previous/Next buttons |
| Q&A Favorite | `.qa-fav` | Bookmark button |
| Q&A Copy | `.qa-copy` | Copy to clipboard button |
| Quiz | `.quiz-container` | Quiz interface |
| Quiz Result | `.quiz-result` | Score display |
| Search | `.search-container` | Search input wrapper |
| Button | `.btn` | Button base class |
| Section Title | `.section-title` | Section headers |

### Responsive Breakpoints

```css
/* Desktop: 1200px+ */
/* Tablet: 768px - 1199px */
/* Mobile: < 768px */
```

---

## 9. Data Layer

### Data Files

| File | Size | Purpose |
|------|------|---------|
| `academy.json` | 115KB | Curriculum structure, exercises, quizzes |
| `questions.json` | 1.8MB | 741 Q&A questions with full metadata |
| `data.js` | 1.6MB | Pre-processed embedded data |

### data.js Generation

`data.js` is auto-generated from `academy.json` and `questions.json`:

```javascript
// Generated by scripts/build-data.js
window.ACADEMY_DATA = { ... };  // From academy.json
window.QUESTIONS_DATA = { ... }; // From questions.json
```

This enables the application to work without a server by embedding all data as JavaScript variables.

### Data Loading Priority

1. **Embedded** (`window.ACADEMY_DATA`) — Works with `file://` protocol
2. **Fetch** (`fetch('academy.json')`) — Works with HTTP server
3. **Fallback** — Shows error message

---

## 10. State Management

### State Structure

All user state is persisted in `localStorage` under key `ael-academy-state`:

```json
{
  "progress": {
    "ex-1-1": { "completed": true, "timestamp": 1721059200000 },
    "ch-1": { "completed": true, "timestamp": 1721059200000 },
    "qz-1": { "completed": true, "timestamp": 1721059200000 }
  },
  "favorites": ["w1-q-001", "w3-q-015"],
  "notes": {
    "w1-q-001": { "content": "Important concept to review" }
  },
  "quizResults": {
    "qz-1": { "score": 85, "passed": true, "timestamp": 1721059200000 }
  },
  "expandedItems": {
    "w1-q-001": true
  },
  "certificates": []
}
```

### State Operations

| Operation | Method | Description |
|-----------|--------|-------------|
| Save | `saveState()` | Serialize to localStorage |
| Restore | `restoreState()` | Load from localStorage |
| Toggle Progress | `toggleProgress(id)` | Mark item complete/incomplete |
| Toggle Favorite | `toggleFavorite(id)` | Add/remove from favorites |
| Toggle Expand | `toggleExpand(id)` | Expand/collapse UI element |

---

## 11. Routing

### Hash-Based Routing

| Hash | View | Description |
|------|------|-------------|
| `#` or empty | Dashboard | Main overview page |
| `#module-foundations` | Module | Module 1 overview |
| `#module-core-techniques` | Module | Module 2 overview |
| `#module-applied-engineering` | Module | Module 3 overview |
| `#module-production` | Module | Module 4 overview |
| `#week-1` | Week | Week 1 detail view |
| `#week-2` | Week | Week 2 detail view |
| ... | ... | ... |
| `#week-12` | Week | Week 12 detail view |

### Navigation Methods

```javascript
// Programmatic navigation
AELAcademy.navigateTo('week', null, 'week-1');
AELAcademy.navigateTo('module', 'foundations', null);
AELAcademy.navigateTo('dashboard');

// URL updates automatically via hash
```

---

## 12. Plugins & Packages

### Plugin Architecture

Plugins are standalone JavaScript files that attach to `window` globals. They are loaded via `<script>` tags in `index.html` before the core engine.

### Available Plugins

#### AELSearch (`plugins/search/plugin.js`)

```javascript
window.AELSearch.search(query)    // Returns ranked results
window.AELSearch.highlight(text, query)  // Highlight matches
```

Features:
- Cross-content search across questions, weeks, and modules
- Relevance scoring (question match = 10, answer match = 5, tag match = 3)
- Text highlighting for matched terms

#### AELExport (`plugins/export/plugin.js`)

```javascript
window.AELExport.exportProgress('json')    // Export progress as JSON
window.AELExport.exportProgress('csv')     // Export progress as CSV
window.AELExport.exportNotes('json')       // Export notes as JSON
window.AELExport.exportNotes('markdown')   // Export notes as Markdown
window.AELExport.exportQuizResults()       // Export quiz results
window.AELExport.exportCertificate(weekId, score)  // Generate certificate
window.AELExport.download(content, filename, type) // Trigger download
```

#### AELTheme (`plugins/theme/plugin.js`)

```javascript
window.AELTheme.toggle()          // Toggle dark/light
window.AELTheme.apply('dark')     // Apply specific theme
window.AELTheme.current           // Current theme name
```

### Available Packages

#### AELQuiz (`packages/quiz/plugin.js`)

```javascript
window.AELQuiz.grade(quiz, answers)  // Grade a quiz
window.AELQuiz.getState(quizId)      // Get saved results
window.AELQuiz.saveState(quizId, result)  // Save results
window.AELQuiz.renderResult(result)  // Render score display
```

#### AELProgress (`packages/progress/plugin.js`)

```javascript
window.AELProgress.load()                    // Load state
window.AELProgress.save(state)               // Save state
window.AELProgress.toggleItem(state, id)     // Toggle completion
window.AELProgress.isCompleted(state, id)    // Check completion
window.AELProgress.weekProgress(state, week) // Week progress
window.AELProgress.moduleProgress(state, weeks) // Module progress
window.AELProgress.overallProgress(state, weeks) // Overall progress
window.AELProgress.renderBar(percent)        // Render progress bar
```

#### Question Schema (`packages/schema/question.schema.json`)

JSON Schema for validating question data structure. Used by `scripts/validate.js`.

---

## 13. Rendering Pipeline

### Render Flow

```
render()
├── renderHeader()
│   ├── Brand logo + title
│   ├── Search input
│   └── Progress badge
├── renderModuleNav()
│   ├── Dashboard button
│   ├── Foundations tab
│   ├── Core Techniques tab
│   ├── Applied Engineering tab
│   └── Production tab
├── layout
│   ├── renderWeekNav() (sidebar)
│   │   └── Week list with progress bars
│   └── main-content
│       ├── renderDashboard()
│       │   ├── Overall progress card
│       │   ├── Quiz progress card
│       │   ├── Project progress card
│       │   ├── Certification readiness card
│       │   ├── Learning time card
│       │   └── Recent activity
│       ├── renderWeekContent()
│       │   ├── Week title
│       │   ├── renderLearningOutcomes()
│       │   ├── renderReferenceSection()
│       │   ├── renderQuestionsSection()
│       │   │   ├── Filter bar (All/Beginner/Intermediate/...)
│       │   │   └── renderQuestionCard() × N
│       │   │       ├── Header (number, type badge, difficulty badge)
│       │   │       ├── Question text
│       │   │       ├── Tags
│       │   │       ├── Answer (collapsible)
│       │   │       │   ├── Why correct
│       │   │       │   ├── Why others incorrect
│       │   │       │   ├── Real-world example
│       │   │       │   ├── Common mistakes
│       │   │       │   ├── Best practices
│       │   │       │   └── Related concepts
│       │   │       └── Navigation (prev/toggle)
│       │   ├── renderExercisesSection()
│       │   ├── renderChallengeSection()
│       │   ├── renderQuizSection()
│       │   └── renderInterviewSection()
│       └── renderModuleContent()
│           ├── Module title
│           └── Week cards with progress
└── renderSearchResults() (when searching)
    ├── Result count
    └── Result cards (questions, weeks, exercises, etc.)
```

---

## 14. Search System

### Search Architecture

The search system operates at two levels:

1. **Core Engine Search** — Built into `app.js`, indexes questions by week, module, difficulty, type, and tags.
2. **Plugin Search** — `AELSearch` plugin provides cross-content search with relevance scoring.

### Search Scoring

| Match Type | Score |
|-----------|-------|
| Question text match | 10 |
| Answer text match | 5 |
| Tag match | 3 |
| Source match | 2 |
| Week title match | 8 |
| Module title match | 6 |

### Search Event Flow

```
User types in search input
  → input event listener (setupSearch)
  → state.searchQuery updated
  → renderMainContent() called
  → renderSearchResults() if query exists
  → Results ranked by score
  → Rendered as cards with highlights
```

---

## 15. Quiz Engine

### Quiz Structure

```json
{
  "id": "qz-1",
  "title": "Week 1 Quiz",
  "passingScore": 80,
  "questions": [
    {
      "id": "qz-1-q1",
      "question": "What does LLM stand for?",
      "options": ["Large Language Model", "Linear Logic Machine", ...],
      "correctAnswer": "Large Language Model",
      "explanation": "LLM stands for Large Language Model..."
    }
  ]
}
```

### Quiz Flow

1. User selects answers for each question
2. `AELQuiz.grade(quiz, answers)` called
3. Returns `{ score, correct, total, passed, details }`
4. Results saved to `localStorage`
5. Score displayed with pass/fail indicator

---

## 16. Progress Tracking

### Progress Items

Each week tracks completion of:

| Item | ID Pattern | Count |
|------|-----------|-------|
| Exercises | `ex-{week}-{n}` | 3 per week |
| Challenge | `ch-{week}` | 1 per week |
| Quiz | `qz-{week}` | 1 per week |
| Interview | `iq-{week}-{n}` | 3 per week |

### Progress Calculation

```javascript
weekProgress = {
  total: items.length,      // Total trackable items
  done: completed.length,   // Completed items
  percent: Math.round((done / total) * 100)
}
```

---

## 17. Export System

### Export Formats

| Format | Content |
|--------|---------|
| JSON | Raw progress data |
| CSV | Tabular progress data |
| Markdown | Formatted notes |

### Certificate Generation

```javascript
{
  "type": "AEL Engineering Academy Certificate",
  "recipient": "Student",
  "week": "week-1",
  "score": 85,
  "date": "2026-07-15T00:00:00.000Z",
  "issuer": "AEL Digital Studio",
  "verification": "https://aymanelmasryael.github.io/ael-engineering-academy/#verify-week-1"
}
```

---

## 18. Theme System

### Available Themes

| Theme | Background | Surface | Text |
|-------|-----------|---------|------|
| Dark (default) | `#0B1220` | `rgba(255,255,255,0.05)` | `#E0E0E0` |
| Light | `#F9FAFB` | `rgba(0,0,0,0.03)` | `#111827` |

### Theme Toggle

```javascript
AELTheme.toggle();  // Switch between dark and light
```

Theme preference is saved to `localStorage` under key `ael-academy-theme`.

---

## 19. Scripts & Tooling

### Build Script

```bash
node scripts/build-data.js
```

Generates `data.js` from `academy.json` and `questions.json`. Must be run after modifying either JSON file.

### Validation Script

```bash
node scripts/validate.js
```

Validates all 741 questions for:
- Required fields present
- Valid question types
- Valid difficulty levels
- Valid module assignments
- Unique IDs
- No duplicate IDs
- Week coverage thresholds

### npm Scripts

```bash
npm run serve      # python3 -m http.server 8080
npm run dev        # npx serve .
npm run build:data # node scripts/build-data.js
npm run validate   # node scripts/validate.js
```

---

## 20. Deployment

### Option 1: Double-Click (Simplest)

Just open `index.html` in any modern browser. The data is embedded in `data.js`. No server needed.

### Option 2: Local Server

```bash
cd ael-engineering-academy
python3 -m http.server 8080
# Open http://localhost:8080
```

### Option 3: GitHub Pages

The repository is configured for GitHub Pages:
```
https://aymanelmasryael.github.io/ael-engineering-academy/
```

### Option 4: Any Static Host

Upload all files to any static hosting service (Netlify, Vercel, Cloudflare Pages, S3, etc.).

---

## 21. API Reference

### AELAcademy (Core)

| Method | Returns | Description |
|--------|---------|-------------|
| `init()` | `Promise<void>` | Initialize the application |
| `loadData()` | `Promise<void>` | Load curriculum and questions |
| `render()` | `void` | Re-render the entire DOM |
| `navigateTo(view, moduleId, weekId)` | `void` | Navigate to a specific view |
| `getWeekById(id)` | `Object` | Get week data by ID |
| `getModuleById(id)` | `Object` | Get module data by ID |
| `getQuestionsForWeek(id)` | `Array` | Get questions for a week |
| `searchQuestions(query)` | `Array` | Search questions by query |
| `getOverallProgress()` | `Object` | Get overall progress stats |
| `escapeHtml(str)` | `String` | Escape HTML special characters |

### AELSearch (Plugin)

| Method | Returns | Description |
|--------|---------|-------------|
| `search(query)` | `Array` | Search across all content |
| `highlight(text, query)` | `String` | Highlight matches in text |
| `buildIndex(data, questions)` | `void` | Build search index |

### AELExport (Plugin)

| Method | Returns | Description |
|--------|---------|-------------|
| `exportProgress(format)` | `String` | Export progress data |
| `exportNotes(format)` | `String` | Export notes |
| `exportQuizResults()` | `String` | Export quiz results |
| `exportCertificate(weekId, score)` | `Object` | Generate certificate |
| `download(content, filename, type)` | `void` | Trigger file download |

### AELQuiz (Package)

| Method | Returns | Description |
|--------|---------|-------------|
| `grade(quiz, answers)` | `Object` | Grade a quiz |
| `getState(quizId)` | `Object` | Get saved quiz state |
| `saveState(quizId, result)` | `void` | Save quiz results |
| `renderResult(result)` | `String` | Render score HTML |

### AELProgress (Package)

| Method | Returns | Description |
|--------|---------|-------------|
| `load()` | `Object` | Load state from localStorage |
| `save(state)` | `void` | Save state to localStorage |
| `toggleItem(state, id)` | `void` | Toggle item completion |
| `isCompleted(state, id)` | `Boolean` | Check if item is completed |
| `weekProgress(state, week)` | `Object` | Calculate week progress |
| `moduleProgress(state, weeks)` | `Object` | Calculate module progress |
| `overallProgress(state, weeks)` | `Object` | Calculate overall progress |
| `renderBar(percent)` | `String` | Render progress bar HTML |

---

## 22. Data Schema

### academy.json Schema

```json
{
  "meta": {
    "name": "AEL Engineering Academy",
    "version": "1.0.0",
    "description": "Learn LLM Engineering from Zero to Production"
  },
  "modules": [
    {
      "id": "foundations",
      "title": "Foundations",
      "description": "...",
      "color": "#0074FF",
      "weeks": ["week-1", "week-2", "week-3"]
    }
  ],
  "weeks": [
    {
      "id": "week-1",
      "module": "foundations",
      "number": 1,
      "title": "What are LLMs?",
      "learningOutcomes": ["LO-1", "LO-2", "LO-3", "LO-4", "LO-5"],
      "reference": [...],
      "exercises": [...],
      "challenge": {...},
      "quiz": {...},
      "interviewQuestions": [...]
    }
  ]
}
```

### questions.json Schema

```json
{
  "meta": {
    "version": "1.0.0",
    "totalQuestions": 741,
    "lastUpdated": "2025-01-15"
  },
  "questions": [
    {
      "id": "w1-q-001",
      "week": "week-1",
      "module": "foundations",
      "question": "...",
      "answer": "...",
      "type": "definition|conceptual|practical|...",
      "difficulty": "beginner|intermediate|advanced|expert|interview",
      "whyCorrect": "...",
      "whyOthersIncorrect": {"option": "reason"},
      "realWorldExample": "...",
      "commonMistakes": ["..."],
      "bestPractices": ["..."],
      "relatedConcepts": ["..."],
      "estimatedReadingTime": "3 min",
      "interviewRelevance": "high|medium|low",
      "tags": ["..."],
      "source": "...",
      "relationships": {
        "learningOutcome": "LO-1",
        "reference": "ref-1",
        "exercise": "ex-1",
        "challenge": "ch-1",
        "quiz": "qz-1",
        "glossary": "gl-1"
      }
    }
  ]
}
```

---

## 23. Performance Considerations

### Load Performance

| Metric | Value |
|--------|-------|
| HTML | 26 lines (~1KB) |
| CSS | 1,715 lines (~30KB) |
| JS Core | 1,535 lines (~57KB) |
| JS Plugins | ~500 lines (~15KB) |
| Data | 1.6MB (embedded) |
| **Total** | **~1.7MB** |

### Optimization Notes

1. **Embedded data** eliminates network requests for JSON files
2. **Lazy rendering** — Only the current view is rendered; other views are destroyed and recreated
3. **Event delegation** — Search uses event delegation instead of per-element listeners
4. **Question indexing** — Questions are indexed at load time for O(1) lookup by week/module/difficulty/type
5. **CSS transitions** — Hardware-accelerated transitions for smooth animations
6. **No framework overhead** — Direct DOM manipulation without virtual DOM diffing

### localStorage Limits

| Browser | Limit |
|---------|-------|
| Chrome | 10MB |
| Firefox | 10MB |
| Safari | 5MB |
| Edge | 10MB |

The application state typically uses <100KB, well within limits.

---

## 24. Future Roadmap

### Planned Features

| Feature | Priority | Description |
|---------|----------|-------------|
| Dark/Light Theme Toggle | High | UI toggle in header |
| Offline Service Worker | Medium | PWA support for full offline |
| Print Styles | Medium | Print-friendly quiz results |
| Certificate PDF Export | Medium | Generate printable certificates |
| Progress Sync | Low | Cloud sync via API |
| Multi-language | Low | Arabic, French support |
| Video Integration | Low | Embed tutorial videos |
| Live Code Playground | Low | In-browser code execution |

### Q&A Expansion

| Week | Current | Target | Gap |
|------|---------|--------|-----|
| Week 1 | 80 | 100 | +20 |
| Week 2 | 50 | 80 | +30 |
| Week 3 | 50 | 80 | +30 |
| Week 4 | 50 | 80 | +30 |
| Week 5 | 86 | 100 | +14 |
| Week 6 | 80 | 100 | +20 |
| Week 7 | 50 | 80 | +30 |
| Week 8 | 50 | 80 | +30 |
| Week 9 | 50 | 80 | +30 |
| Week 10 | 65 | 80 | +15 |
| Week 11 | 80 | 100 | +20 |
| Week 12 | 50 | 80 | +30 |
| **Total** | **741** | **1,000+** | **+259** |

---

## Author

**Ayman Elmasry**
AEL Digital Studio
https://github.com/aymanelmasryael

## License

MIT License — See [LICENSE](LICENSE) for details.
