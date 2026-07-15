# Changelog

All notable changes to AEL Engineering Academy.

## [1.0.0] - 2026-07-16

### Added
- Learning Domain Model with 14 JSON schemas
- Stable ID system (1,039 unique IDs)
- Knowledge Graph package (1,039 nodes, 1,092 edges)
- academy.js product layer
- academy.css product styles
- Updated progress plugin (v2.0)
- Updated search plugin (v2.0)
- 24 challenges (12 week + 12 standalone)
- 60 learning outcomes with text content
- 36 exercises with full metadata
- 36 interview questions with expected answers
- 47 reference topics with content
- 20 glossary terms
- Domain validation pipeline
- Knowledge graph validation

### Changed
- academy.json migrated to v2 (stable IDs)
- questions.json migrated to v2 (stable IDs)
- app.js updated for v2 ID format
- All rendering functions resolve ID arrays to content
- Progress tracking delegated to AELProgress plugin
- Quiz result storage uses week IDs

### Fixed
- Challenge reference integrity (12 missing challenges added)
- Search results for v2 data format
- Quiz result lookup consistency

## [0.9.0] - 2026-07-15

### Added
- Initial v2 data migration
- Stable ID system implementation
- Domain model schemas

## [0.8.0] - 2026-07-14

### Added
- Data cleanup (single source of truth)
- Removed duplicate inline questions

## [0.7.0] - 2026-07-13

### Added
- Q&A Knowledge Base (741 questions)
- 12-week curriculum
- 4-module structure

## [0.6.0] - 2026-07-12

### Added
- Search plugin
- Export plugin
- Theme plugin

## [0.5.0] - 2026-07-11

### Added
- Progress tracking
- Quiz system
- Dark mode UI

## [0.1.0] - 2026-07-10

### Added
- Initial project structure
- Basic HTML/CSS/JS
