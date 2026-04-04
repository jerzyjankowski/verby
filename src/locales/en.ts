import type { LibraryVerbScope } from '../consts/librarySave.ts'
import type {
  Batch,
  Direction,
  Extra,
  Language,
  Level,
  Regularity,
  Speed,
} from '../types/config.ts'
import type { LibrarySettingsView } from '../types/library.ts'
import {MOTIVATIONAL_ENGLISH_QUOTES} from "./quotes.ts";

/** Lesson / filter option labels (shown in dropdowns and config summary). */
export const LANGUAGE_LABELS: Record<Language, string> = {
  ESP: 'Español',
  ENG: 'English',
  GER: 'Deutsch',
  ITA: 'Italiano',
  FRA: 'Française',
  RUS: 'Pусский',
}

export const LEVEL_LABELS: Record<Level, string> = {
  MAIN: 'Main',
  A0: 'A0',
  A1: 'A1',
  A2: 'A2',
  B1: 'B1',
  B2: 'B2',
  C1: 'C1',
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  to_foreign: 'Polish To Foreign',
  to_native: 'Foreign To Polish',
}

export const EXTRA_LABELS: Record<Extra, string> = {
  no: 'No',
  conjugation: 'Conjugation',
  forms: 'Forms',
}

export const REGULARITY_LABELS: Record<Regularity, string> = {
  all: 'All',
  irregular: 'Irregular',
  regular: 'Regular',
}

export const SPEED_LABELS: Record<Speed, string> = {
  same: 'Same',
  random: 'Random',
}

export const BATCH_LABELS: Record<Batch, string> = {
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  ALL: 'All',
}

export const LIBRARY_VERB_SCOPE_LABELS: Record<LibraryVerbScope, string> = {
  all: 'All',
  not_learnt: 'Not learnt',
  learnt: 'Learnt',
  current_verb: 'Current verb',
}

export const LIBRARY_MENU_ITEMS: readonly { view: LibrarySettingsView; label: string }[] = [
  { view: 'library-create-new', label: 'Create new library lesson' },
  { view: 'library-replace-other', label: 'Replace library lesson' },
  { view: 'library-add-to-other', label: 'Add to library lesson' },
  { view: 'library-remove-from', label: 'Remove from library lesson' },
]

export const LIBRARY_VIEW_TITLES: Record<LibrarySettingsView, string> = {
  'library-create-new': 'Create new save',
  'library-replace-other': 'Replace other save',
  'library-add-to-other': 'Add to other save',
  'library-remove-from': 'Remove from save',
}

export const MOTIVATIONAL_QUOTES: readonly { text: string; author: string }[] = [...MOTIVATIONAL_ENGLISH_QUOTES]

export const ui = {
  common: {
    back: 'Back',
    save: 'Save',
    delete: 'Delete',
    cancel: 'Cancel',
    yes: 'Yes',
    no: 'No',
    close: 'Close',
    emDash: '—',
  },
  aria: {
    closeSheet: 'Close sheet',
    closeModal: 'Close modal',
    dismissNotification: 'Dismiss notification',
    openLessonSettings: 'Open lesson settings',
    settings: 'Settings',
    backToPreviousScreen: 'Back to previous screen',
    aboutVerbSource: 'About verb source',
    timeSinceLessonStarted: 'Time since lesson started',
    learntOnLastAppearance: 'Learnt on last appearance',
    notLastAppearance: 'Not last appearance',
    learnt: 'Learnt',
    notLearnt: 'Not learnt',
  },
  toast: {
    libraryTitle: 'Library',
    quickSaveTitle: 'Quick save',
    quickSaveBody: 'Current lesson quick saved',
    lessonSavedToLibrary: 'Lesson saved to your library.',
    librarySaveUpdated: 'Library save updated.',
    librarySaveReplaced: 'Library save replaced with the current lesson.',
    mergeVerbsError: 'Could not load verbs to merge levels into the library save.',
    updateLevelsError: 'Could not load verbs to update levels in the library save.',
    duplicateSaveName: 'That name is already used by another save.',
    saveRemovedElsewhere: 'This save was removed or renamed elsewhere.',
    enterSaveName: 'Enter a name for this save.',
    saveUpdated: 'Save updated.',
    deleteSaveFailed: 'Could not delete this save.',
    saveDeleted: 'Save deleted.',
    loadLessonFailed: 'Failed to load current lesson from local storage',
    loadVerbsFailedTitle: 'Failed to load verbs',
  },
  home: {
    continue: 'Continue',
    newLesson: 'New Lesson',
    markedVerbs: 'Marked Verbs',
    library: 'Library',
    settings: 'Settings',
  },
  settings: {
    title: 'Settings',
    applicationLanguage: 'Application language',
    langEnglish: 'English',
    langPolish: 'Polish',
    lessonCardSection: 'Lesson card',
    showIrregularMarkBeforeAnswer: 'Irregular mark before answer',
    showIrregularMarkAfterAnswer: 'Irregular mark after answer',
    showLevel: 'Verb level',
  },
  prepare: {
    selectLanguagePlaceholder: 'Select Language...',
    selectPlaceholder: 'Select…',
    sourceAllVerbs: 'All verbs',
    sourceHelpAll: 'Every verb from the default full language list can be included.',
    sourceHelpSave: (description: string) =>
      `Use verbs configured in the selected save.\nDescription: "${description}"`,
    rowSource: 'source:',
    rowLevels: 'levels:',
    rowDirection: 'direction:',
    rowExtra: 'extra:',
    rowConjugation: 'conjugation:',
    rowRegularity: 'regularity:',
    rowSpeed: 'speed:',
    rowBatch: 'batch:',
    pickLanguageFirst:
      'Select a language in the header first. Then you can choose source, levels, and other lesson options here.',
    startLesson: 'Start lesson',
    starting: 'Starting...',
    sheetStartTitle: 'Start lesson?',
    sheetNoVerbsTitle: 'No verbs found',
    /** Text before the bold lesson verb count in the start confirmation. */
    startLessonIncludeLead: 'This lesson will include',
    /** After the bold count: noun + full stop. */
    lessonIncludeNounPhrase: (n: number) => (n === 1 ? 'verb.' : 'verbs.'),
    /** After the bold count on the “matched filters” line. */
    matchedFiltersAfterStrong: (n: number) =>
      `${n === 1 ? 'verb' : 'verbs'} matched your filters.`,
    batchShortfall: (batch: number, available: number) =>
      `You selected a batch of ${batch}, but only ${available} ${available === 1 ? 'verb' : 'verbs'} matched your settings, so the lesson has fewer cards than that batch size.`,
    noVerbsBody:
      'You cannot start a lesson without any verbs. Change your filters so at least one verb matches.',
  },
  lesson: {
    noConfig:
      'No config found for lesson. Start from the init page.',
    settingsMenuTitle: 'Lesson settings',
    configSummaryTitle: 'Config Summary',
    manageLibrary: 'Manage library',
    quickSave: 'Quick save',
    configSummaryButton: 'Config Summary',
    manageLibraryButton: 'Manage Library',
    reverseDirection: 'Reverse Direction',
    restartQuestions: 'Restart questions',
    closeQuestions: 'Close Questions',
    closeQuestionsTitle: 'Close Questions',
    reverseDirectionTitle: 'Reverse Direction',
    restartQuestionsTitle: 'Restart Questions',
    verbsLabel: (notLearnt: number, total: number) => `Verbs (${notLearnt}/${total})`,
    editVerb: 'Edit verb',
    editVerbWithName: (name: string) => `Edit verb (${name})`,
    historyLabel: (n: number) => `History (${n})`,
    confirmCloseLesson:
      'Are you sure you want to close this lesson?',
    confirmReverseDirection:
      'Switch which language is shown as the question and which as the answer? The current card will update.',
    confirmRestart:
      'Reset learnt progress, repeat counts, and history for this session? Nothing will be written to storage.',
    toastAddedVerbs: (count: number) =>
      count > 0
        ? `Added ${count} verb${count === 1 ? '' : 's'} to the library save.`
        : 'Library save updated.',
    toastRemovedVerbs: (count: number) =>
      count > 0
        ? `Removed ${count} verb${count === 1 ? '' : 's'} from the library save.`
        : 'Library save updated.',
    topBarTurn: 'Turn',
    topBarLeft: 'Left',
    celebrationTitle: 'Lesson completed',
  },
  configSummary: {
    allVerbsSource: 'All verbs',
    rowLanguage: 'language',
    rowSource: 'source',
    rowLevels: 'levels',
    rowDirectionConjugation: 'direction conjugation',
    rowDirection: 'direction',
    rowExtra: 'extra',
    rowRegularity: 'regularity',
    rowSpeed: 'speed',
    rowBatch: 'batch',
  },
  libraryPage: {
    noLanguageYet: 'No language selected yet.',
    noSavesForLanguage: 'No library saves for this language.',
    sheetTitleEdit: 'Library save',
    sheetTitleDelete: 'Delete library save?',
    deleteConfirmBeforeName: 'Delete',
    deleteConfirmAfterName: 'from your library? This cannot be undone.',
    nameLabel: 'Name',
    descriptionLabel: 'Description',
    optionalNotesPlaceholder: 'Optional notes…',
    nameDuplicateInline: 'That name is already used by another save.',
    maxChars: (n: number) => `Max ${n} characters.`,
    displayVerbs: (count: number) => `Display verbs (${count})`,
    loadingVerbs: 'Loading verbs…',
    loadVerbsFailed: 'Failed to load verbs.',
    noVerbsInSave: 'No verbs in this save.',
    tableId: 'id',
    tableLevel: 'level',
    tableVerb: 'verb',
  },
  libraryForms: {
    removeTitle: 'Remove from library save',
    removeSubtitle:
      'Remove from an existing save every verb that also appears in this lesson (for the verb set you pick below). Verbs in that save that are not in this lesson stay unchanged. You can update the notes as well.',
    addTitle: 'Add to library save',
    addSubtitle:
      'Append verbs from this lesson to an existing save. Verbs already in that save are skipped. You can update the notes as well.',
    replaceTitle: 'Replace library save',
    replaceSubtitle: 'Overwrite an existing library entry with the current lesson state.',
    newTitle: 'New library save',
    newSubtitle: 'Save the current lesson as a new entry in your library.',
    noSavesYet: 'No saves in your library for this language yet.',
    existingSave: 'Existing save',
    chooseSavePlaceholder: 'Choose a library save…',
    notes: 'Notes',
    optionalDetailsPlaceholder: 'Optional details about this save…',
    whichVerbsFromLesson: 'Which verbs (from this lesson)',
    whichVerbs: 'Which verbs',
    chooseVerbsPlaceholder: 'Choose which verbs…',
    namePlaceholderExample: 'e.g. Week 3 irregular verbs',
    nameTaken: 'A save with this name already exists. Choose a different name.',
    nameMaxLengthReached: (n: number) => `Maximum name length (${n} characters) reached.`,
    notesMaxLengthReached: (n: number) => `Maximum notes length (${n} characters) reached.`,
    noVerbsMatchSimple:
      'No verbs match this filter. Choose another option or update progress in the lesson.',
    noVerbsMatchOrNotes:
      'No verbs match this filter. Choose another option, update progress in the lesson, or save to update notes only.',
  },
  markedVerbs: {
    noLanguageYet: 'No language selected yet.',
    loadingVerbs: 'Loading verbs…',
    noneForLanguage: 'No marked verbs for this language.',
    noVerbListForLanguage: 'No verb list for this language.',
    loadVerbsFailed: 'Failed to load verbs.',
    marked: 'Marked',
    reasonPlaceholder: 'Reason for marking...',
    verbFallback: (id: number) => `Verb #${id}`,
    saveBlockedHint: 'Each marked verb needs a non-empty description.',
  },
  verbView: {
    notInLesson: 'This verb is not part of the current lesson.',
    learntInLesson: 'Learnt in this lesson',
    marked: 'Marked',
    reasonPlaceholder: 'Reason for marking...',
  },
  cards: {
    hiddenAnswer: '???',
    fullTextTitle: 'Full text',
    question: 'Question',
    answer: 'Answer',
    formFallback: (index: number) => `Form ${index + 1}`,
  },
  answerDetails: {
    question: 'Question',
    answer: 'Answer',
    showAll: 'Show all',
    irregularMarkLegend:
      'The warning mark indicates a form that is irregular compared with the usual conjugation or pattern for this verb.',
  },
} as const
