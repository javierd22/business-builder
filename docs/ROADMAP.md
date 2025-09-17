# Roadmap

This document provides a high-level view of the 10 seeded roadmap items for the Business Builder project.

## P0 Priority Items

### Provider & Model Picker UI
- **Description**: Settings page to choose provider/model (read-only if key missing)
- **Files**: `src/app/settings/provider/page.tsx`, `src/lib/env.ts`
- **Status**: Backlog
- **Impact**: Critical for user configuration and provider management

### Prompt Registry v2 (versioned & labeled)
- **Description**: Versioned prompt profiles with descriptions & change notes
- **Files**: `src/lib/prompt-profiles.ts`, `docs/PROMPTS_CHANGELOG.md`
- **Status**: Backlog
- **Impact**: Essential for prompt management and versioning

### Deploy Experience Polish
- **Description**: Success page variants, copy, and link guard
- **Files**: `src/app/deploy/[projectId]/page.tsx`
- **Status**: Backlog
- **Impact**: Critical for user experience during deployment

## P1 Priority Items

### Idea Templates by Vertical
- **Description**: Add vertical library + chips
- **Files**: `src/lib/jtbd-templates.ts`, `src/app/idea/page.tsx`
- **Status**: Backlog
- **Impact**: Improves user experience with industry-specific templates

### Undo/Redo for PRD Editor
- **Description**: Local history capped at N
- **Files**: `src/app/plan/review/[projectId]/page.tsx`
- **Status**: Backlog
- **Impact**: Enhances editor usability

### Keyboard Shortcuts
- **Description**: ? help modal
- **Files**: `src/app/_components/ShortcutsHelp.tsx`, page integrations
- **Status**: Backlog
- **Impact**: Improves power user experience

### Archive & Tags for Projects
- **Description**: Filters + tag editor
- **Files**: `src/lib/storage.ts`, `src/app/dashboard/page.tsx` (or `/`)
- **Status**: Backlog
- **Impact**: Better project organization and management

### SEO & Social Previews
- **Description**: Metadata, OpenGraph images
- **Files**: `src/app/layout.tsx`, `src/app/opengraph-image.tsx`
- **Status**: Backlog
- **Impact**: Improves discoverability and sharing

### PWA (Local-First Offline)
- **Description**: Manifest + minimal service worker (no network caching of APIs)
- **Files**: `src/app/manifest.webmanifest`, `public/icons/*`, `src/sw.ts` (if applicable)
- **Status**: Backlog
- **Impact**: Enables offline functionality

### Tour / First-Run Coachmarks
- **Description**: Subtle inline tips across the 4 steps
- **Files**: `src/app/_components/Tour.tsx`, page integrations
- **Status**: Backlog
- **Impact**: Improves onboarding experience

## Usage

- View the interactive roadmap at `/roadmap`
- Tasks can be moved between Backlog, In Progress, and Done
- Export/import functionality available for backup and sharing
- Filter by priority (P0/P1) and status
- Search functionality for finding specific tasks

## Notes

- All tasks are stored locally in browser localStorage
- Tasks can be edited, deleted, and re-seeded
- Priority levels: P0 (critical), P1 (important)
- Status levels: backlog, in_progress, done
