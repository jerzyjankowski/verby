# 0.1.1

# 0.1.0

## Tech details

- Mobile-first React + TypeScript app.
- Browser routing with dedicated pages for home, prepare lesson, lesson, marked verbs, library, and settings.
- Shared UI foundation with reusable components (buttons, dropdowns, sheets/modals, toast notifications).
- Theme-driven styling and localized UI texts (EN/PL).
- Local storage persistence for lesson progress, marked verbs, library saves, and app settings.

## Lesson setup and settings

- New lesson setup with language selection and configurable options: source, levels, direction, extras, regularity, speed, and batch size.
- Dynamic config validation per selected language (only available extras/conjugations/levels are selectable).
- Lesson source selection from all verbs or saved library sets, with contextual source help.
- Pre-start confirmation sheet showing planned lesson size, matched verbs, and batch shortfall details.

## Lesson flow and progress

- Home screen quick actions: continue lesson, start new lesson, open marked verbs, library, and settings.
- Interactive lesson rounds with question/answer cards, optional conjugation/forms reveal flow, and correctness actions.
- Progress engine with non-repeating bias, speed modes, history tracking, per-verb learnt flags, repeated counters, and completion state.
- In-lesson settings sheet with config summary, quick save, reverse direction, restart questions, close lesson, and detailed history view.
- Verb management during lesson: browse verbs, open current/selected verb details, and manually toggle learnt status.
- Lesson resume support from last shown verb and saved in-progress state.

## Library features

- Library management from lesson: create new save, replace existing save, add selected verbs to save, remove selected verbs from save.
- Dedicated library page for per-language saves with metadata editing, duplicate-name validation, delete confirmation, and optional verbs table preview.

## Marked verbs

- Per-language marked verbs page with active toggle, reason/description editing, and save guard for empty descriptions.

## App settings

- Settings page with persisted application language selection (EN/PL).

