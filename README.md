# AEL Engineering Academy

> Learn LLM Engineering from Zero to Production

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](CHANGELOG.md)
[![Questions](https://img.shields.io/badge/questions-741+-gold.svg)](#qa-knowledge-base)
[![Weeks](https://img.shields.io/badge/weeks-12-blue.svg)](#curriculum)
[![IDs](https://img.shields.io/badge/IDs-1039-purple.svg)](#stable-id-system)

## What is this?

A complete, self-contained learning platform for LLM Engineering. Pure HTML/CSS/JavaScript — no frameworks, no build tools, no dependencies. Just open `index.html` in your browser.

Built on top of the AEL Reference Framework with a Learning Domain Model, stable IDs, and a Knowledge Graph.

## Quick Start

```bash
# Clone
git clone https://github.com/aymanelmasryael/ael-engineering-academy.git
cd ael-engineering-academy

# Open directly (data is embedded)
open index.html

# Or serve locally
npx serve .
```

## Curriculum

| # | Week | Module | Topics |
|---|------|--------|--------|
| 1 | What are LLMs? | Foundations | Definition, history, training, inference, tokens |
| 2 | Transformer Architecture | Foundations | Attention, positional encoding, encoder-decoder |
| 3 | Tokenization | Foundations | BPE, WordPiece, SentencePiece, tiktoken |
| 4 | Prompt Engineering | Core Techniques | Zero-shot, few-shot, chain-of-thought, meta-prompting |
| 5 | Fine-tuning | Core Techniques | SFT, LoRA, QLoRA, RLHF, DPO |
| 6 | RAG Architecture | Core Techniques | Retrieval, embeddings, vector DBs, chunking, re-ranking |
| 7 | Agents & Tools | Applied Engineering | Tool use, planning, memory, multi-agent |
| 8 | Evaluation | Applied Engineering | Benchmarks, human eval, LLM-as-judge, RAGAS |
| 9 | Deployment | Applied Engineering | Serving, scaling, inference optimization, monitoring |
| 10 | Safety & Alignment | Production | Red teaming, guardrails, bias, compliance |
| 11 | Advanced Topics | Production | MoE, state space models, speculative decoding |
| 12 | Capstone Project | Production | End-to-end system, architecture, production deployment |

## Q&A Knowledge Base

**741 unique questions** across all 12 weeks, each with:
- Detailed answer
- Why this answer is correct
- Why other approaches are incorrect
- Real-world example
- Common mistakes
- Best practices
- Related concepts
- Difficulty level (beginner → expert)
- Interview relevance
- Tags and source references

## Stable ID System

Every entity has a stable, domain-driven ID:

| Prefix | Entity | Count |
|--------|--------|-------|
| CRSE- | Course | 1 |
| MOD- | Module | 4 |
| WK- | Week | 12 |
| CON- | Concept | 47 |
| LO- | Learning Outcome | 60 |
| Q- | Question | 741 |
| EX- | Exercise | 36 |
| CH- | Challenge | 24 |
| QZ- | Quiz | 12 |
| INT- | Interview | 36 |
| REF- | Reference | 47 |
| GL- | Glossary | 20 |

**Total: 1,039 unique IDs**

## Knowledge Graph

Built-in knowledge graph with:
- 1,039 nodes across 11 entity types
- 1,092 edges across 10 relationship types
- Prerequisite chain resolution
- Related concept discovery
- Path finding between any two entities
- Full-text search across all entities

## Architecture

```
index.html              → App shell
├── data.js             → Embedded data (academy + questions)
├── academy.js          → Product layer (branding, colors)
├── academy.css         → Product styles
├── packages/
│   ├── progress/       → Progress tracking (v2)
│   ├── quiz/           → Quiz grading
│   ├── learning-domain/ → Domain schemas + migration
│   └── knowledge-graph/ → Knowledge graph package
├── plugins/
│   ├── search/         → Cross-content search
│   ├── export/         → Export progress/notes
│   └── theme/          → Dark/Light toggle
├── app.js              → Core engine (~1550 lines)
└── styles.css          → Design system
```

## Features

- **SPA Architecture** — No page reloads, hash-based routing
- **741+ Q&A Questions** — Complete curriculum coverage
- **Progress Tracking** — localStorage persistence
- **Search** — Cross-indexed across questions, concepts, glossary
- **Favorites** — Bookmark any question
- **Copy** — One-click copy question + answer
- **Filter** — By difficulty level
- **Dark Mode** — AEL design system
- **Responsive** — Works on desktop and mobile
- **Knowledge Graph** — Entity relationships and path finding
- **Export** — Progress and notes export
- **Zero Dependencies** — Pure HTML/CSS/JS
- **Offline Mode** — Works without internet

## Validation

- 0 broken references
- 0 duplicate IDs
- 0 circular dependencies
- 0 validation errors
- Domain validation passed

## Author

**Ayman Elmasry** — AEL Digital Studio

## License

MIT License. See [LICENSE](LICENSE) for details.
