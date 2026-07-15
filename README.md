# AEL Engineering Academy

> Learn LLM Engineering from Zero to Production

[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![Version](https://img.shields.io/badge/version-1.0.0-green.svg)](CHANGELOG.md)
[![Questions](https://img.shields.io/badge/questions-741+-gold.svg)](#qa-knowledge-base)
[![Weeks](https://img.shields.io/badge/weeks-12-blue.svg)](#curriculum)

## What is this?

A complete, self-contained learning platform for LLM Engineering. Pure HTML/CSS/JavaScript — no frameworks, no build tools, no dependencies. Just open `index.html` in your browser.

## Quick Start

```bash
# Clone
git clone https://github.com/aymanelmasryael/ael-engineering-academy.git
cd ael-engineering-academy

# Open directly (data is embedded)
open index.html

# Or serve locally
npx serve .
# or
python3 -m http.server 8080
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

### Coverage

| Week | Questions |
|------|-----------|
| Week 1 | 80 |
| Week 2 | 50 |
| Week 3 | 50 |
| Week 4 | 50 |
| Week 5 | 86 |
| Week 6 | 80 |
| Week 7 | 50 |
| Week 8 | 50 |
| Week 9 | 50 |
| Week 10 | 65 |
| Week 11 | 80 |
| Week 12 | 50 |
| **Total** | **741** |

## Architecture

```
index.html              → App shell
├── data.js             → Embedded data (academy + questions)
├── packages/
│   ├── progress/       → Progress tracking
│   └── quiz/           → Quiz grading
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
- **Search** — Cross-indexed across questions + curriculum
- **Favorites** — Bookmark any question
- **Copy** — One-click copy question + answer
- **Filter** — By difficulty level
- **Dark Mode** — AEL design system
- **Responsive** — Works on desktop and mobile
- **Zero Dependencies** — Pure HTML/CSS/JS

## Author

**Ayman Elmasry** — AEL Digital Studio

## License

MIT License. See [LICENSE](LICENSE) for details.
