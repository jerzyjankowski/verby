import type { LibraryVerbScope } from '../consts/librarySave.ts'
import type {
  Batch,
  Direction,
  Extra,
  Regularity,
  Speed,
} from '../types/config.ts'
import type { LibrarySettingsView } from '../types/library.ts'

export { LANGUAGE_LABELS, LEVEL_LABELS } from './en.ts'

/** Nominative plural form of „czasownik” after a numeral (Polish numeral agreement). */
function verbsAfterNumber(n: number): string {
  if (n === 1) return 'czasownik'
  const last = n % 10
  const lastTwo = n % 100
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'czasowniki'
  return 'czasowników'
}

/** 3rd person plural agreement for „pasować” with a numeral + noun phrase. */
function matchVerbWithCount(n: number): string {
  if (n === 1) return 'pasuje'
  const last = n % 10
  const lastTwo = n % 100
  if (last >= 2 && last <= 4 && (lastTwo < 12 || lastTwo > 14)) return 'pasują'
  return 'pasuje'
}

export const DIRECTION_LABELS: Record<Direction, string> = {
  to_foreign: 'Z polskiego na język obcy',
  to_native: 'Z języka obcego na polski',
}

export const EXTRA_LABELS: Record<Extra, string> = {
  no: 'Brak',
  conjugation: 'Koniugacja',
  forms: 'Formy',
}

export const REGULARITY_LABELS: Record<Regularity, string> = {
  all: 'Wszystkie',
  irregular: 'Nieregularne',
  regular: 'Regularne',
}

export const SPEED_LABELS: Record<Speed, string> = {
  same: 'Kolejno',
  random: 'Losowo',
}

export const BATCH_LABELS: Record<Batch, string> = {
  10: '10',
  20: '20',
  30: '30',
  40: '40',
  50: '50',
  ALL: 'Wszystkie',
}

export const LIBRARY_VERB_SCOPE_LABELS: Record<LibraryVerbScope, string> = {
  all: 'Wszystkie',
  not_learnt: 'Nienauczone',
  learnt: 'Nauczone',
  current_verb: 'Bieżący czasownik',
}

export const LIBRARY_MENU_ITEMS: readonly { view: LibrarySettingsView; label: string }[] = [
  { view: 'library-create-new', label: 'Utwórz nową lekcję w bibliotece' },
  { view: 'library-replace-other', label: 'Zastąp lekcję w bibliotece' },
  { view: 'library-add-to-other', label: 'Dodaj do lekcji w bibliotece' },
  { view: 'library-remove-from', label: 'Usuń z lekcji w bibliotece' },
]

export const LIBRARY_VIEW_TITLES: Record<LibrarySettingsView, string> = {
  'library-create-new': 'Nowy zapis',
  'library-replace-other': 'Zastąp inny zapis',
  'library-add-to-other': 'Dodaj do innego zapisu',
  'library-remove-from': 'Usuń z zapisu',
}

export const MOTIVATIONAL_QUOTES: readonly { text: string; author: string }[] = [
  { text: 'Sukces to suma małych wysiłków, powtarzanych dzień po dniu.', author: 'Robert Collier' },
  { text: 'Zawsze wydaje się niemożliwe, dopóki nie zostanie zrobione.', author: 'Nelson Mandela' },
  { text: 'Przyszłość zależy od tego, co robisz dzisiaj.', author: 'Mahatma Gandhi' },
  { text: 'Dyscyplina jest mostem między celami a osiągnięciami.', author: 'Jim Rohn' },
  { text: 'Nie musisz być wielki, żeby zacząć, ale musisz zacząć, żeby być wielkim.', author: 'Zig Ziglar' },
  { text: 'Małe codzienne ulepszenia z czasem prowadzą do zdumiewających rezultatów.', author: 'Robin Sharma' },
  { text: 'Jesteśmy tym, co powtarzamy. Doskonałość nie jest jednorazowym aktem, ale nawykiem.', author: 'Will Durant' },
  { text: 'Każdy ekspert był kiedyś początkującym.', author: 'Helen Hayes' },
  { text: 'Nauka nigdy nie wyczerpuje umysłu.', author: 'Leonardo da Vinci' },
  { text: 'Sekret bycia przed innymi polega na tym, żeby zacząć.', author: 'Mark Twain' },
  { text: 'Sukces nie wynika z tego, co robisz od czasu do czasu, ale z tego, co robisz konsekwentnie.', author: 'Marie Forleo' },
  { text: 'Jakość nie jest czynem, jest nawykiem.', author: 'Arystoteles' },
  { text: 'Nie czekaj, aż żelazo będzie gorące - rozgrzej je uderzając.', author: 'William Butler Yeats' },
  { text: 'Jedynym ograniczeniem w realizacji jutra są nasze dzisiejsze wątpliwości.', author: 'Franklin D. Roosevelt' },
  { text: 'Niewielki postęp każdego dnia daje wielkie efekty.', author: 'Satya Nani' },
  { text: 'Nie ma znaczenia, jak wolno idziesz, dopóki się nie zatrzymujesz.', author: 'Konfucjusz' },
  { text: 'Sukces jest produktem codziennych nawyków, a nie jednorazowych przemian.', author: 'James Clear' },
  { text: 'Tracisz 100% strzałów, których nie oddajesz.', author: 'Wayne Gretzky' },
  { text: 'Im ciężej pracuję, tym więcej mam szczęścia.', author: 'Samuel Goldwyn' },
  { text: 'Motywacja sprawia, że ruszasz, ale to dyscyplina sprawia, że rośniesz.', author: 'John C. Maxwell' },
  { text: 'Bez ciągłego rozwoju i postępu takie słowa jak poprawa, osiągnięcie i sukces nie mają znaczenia.', author: 'Benjamin Franklin' },
  { text: 'Marz odważnie i nie bój się porażki.', author: 'Norman Vaughan' },
  { text: 'Różnica między zwyczajnym a niezwykłym to ten mały dodatek.', author: 'Jimmy Johnson' },
  { text: 'Rób, co możesz, tym, co masz, tam, gdzie jesteś.', author: 'Theodore Roosevelt' },
  { text: 'Wielkie rzeczy powstają z połączenia wielu małych rzeczy.', author: 'Vincent van Gogh' },
  { text: 'Sukces nie jest ostateczny, porażka nie jest śmiertelna: liczy się odwaga, by iść dalej.', author: 'Winston Churchill' },
  { text: 'Bądź cierpliwy i ufaj swojej drodze.', author: 'Nieznany' },
  { text: 'Jeśli nie chcesz się uczyć, nikt ci nie pomoże. Jeśli jesteś zdeterminowany, by się uczyć, nikt cię nie zatrzyma.', author: 'Zig Ziglar' },
  { text: 'Podróż tysiąca mil zaczyna się od pierwszego kroku.', author: 'Lao Tzu' },
  { text: 'Wytrwałość potrafi zamienić porażkę w niezwykłe osiągnięcie.', author: 'Matt Biondi' },
  { text: 'Stawiaj sobie wysokie cele i nie zatrzymuj się, dopóki ich nie osiągniesz.', author: 'Bo Jackson' },
  { text: 'Nigdy nie marzyłam o sukcesie. Pracowałam na niego.', author: 'Estee Lauder' },
  { text: 'Sukces to wynik przygotowania, ciężkiej pracy i nauki na błędach.', author: 'Colin Powell' },
  { text: 'Działanie jest podstawowym kluczem do każdego sukcesu.', author: 'Pablo Picasso' },
  { text: 'Nigdy nie myl pojedynczej porażki z ostateczną porażką.', author: 'F. Scott Fitzgerald' },
  { text: 'Nie musisz widzieć całych schodów, po prostu zrób pierwszy krok.', author: 'Martin Luther King Jr.' },
  { text: 'Dzięki ciężkiej pracy, wytrwałości i wierze możesz żyć swoimi marzeniami.', author: 'Ben Carson' },
  { text: 'Cele to marzenia z terminem realizacji.', author: 'Diana Scharf Hunt' },
  { text: 'Kluczem nie jest ustalanie priorytetów tego, co masz w harmonogramie, ale planowanie swoich priorytetów.', author: 'Stephen Covey' },
  { text: 'Zwycięzcy akceptują ciężką pracę. Kochają dyscyplinę, która się z nią wiąże.', author: 'Lou Holtz' },
  { text: 'Przewróć się siedem razy, wstań osiem.', author: 'Przysłowie japońskie' },
  { text: 'Zrób dziś coś, za co twoje przyszłe ja ci podziękuje.', author: 'Sean Patrick Flanery' },
  { text: 'Zjedz tę żabę.', author: 'Brian Tracy' },
]

export const ui = {
  common: {
    back: 'Wstecz',
    save: 'Zapisz',
    delete: 'Usuń',
    cancel: 'Anuluj',
    yes: 'Tak',
    no: 'Nie',
    close: 'Zamknij',
    emDash: '—',
  },
  aria: {
    closeSheet: 'Zamknij panel',
    closeModal: 'Zamknij okno',
    dismissNotification: 'Odrzuć powiadomienie',
    openLessonSettings: 'Otwórz ustawienia lekcji',
    settings: 'Ustawienia',
    backToPreviousScreen: 'Wróć do poprzedniego widoku',
    aboutVerbSource: 'Informacja o źródle czasowników',
    timeSinceLessonStarted: 'Czas od rozpoczęcia lekcji',
    learntOnLastAppearance: 'Nauczone przy ostatnim pokazaniu',
    notLastAppearance: 'Nie ostatnie pokazanie',
    learnt: 'Nauczone',
    notLearnt: 'Nienauczone',
  },
  toast: {
    libraryTitle: 'Biblioteka',
    quickSaveTitle: 'Szybki zapis',
    quickSaveBody: 'Bieżąca lekcja zapisana (szybki zapis)',
    lessonSavedToLibrary: 'Lekcja zapisana w bibliotece.',
    librarySaveUpdated: 'Zapis biblioteki zaktualizowany.',
    librarySaveReplaced: 'Zapis biblioteki zastąpiony stanem bieżącej lekcji.',
    mergeVerbsError:
      'Nie udało się wczytać czasowników, by połączyć poziomy w zapisie biblioteki.',
    updateLevelsError:
      'Nie udało się wczytać czasowników, by zaktualizować poziomy w zapisie biblioteki.',
    duplicateSaveName: 'Ta nazwa jest już używana przez inny zapis.',
    saveRemovedElsewhere: 'Ten zapis został usunięty lub zmieniono jego nazwę gdzie indziej.',
    enterSaveName: 'Podaj nazwę tego zapisu.',
    saveUpdated: 'Zapis zaktualizowany.',
    deleteSaveFailed: 'Nie udało się usunąć tego zapisu.',
    saveDeleted: 'Zapis usunięty.',
    loadLessonFailed: 'Nie udało się wczytać bieżącej lekcji z pamięci lokalnej',
    loadVerbsFailedTitle: 'Nie udało się wczytać czasowników',
  },
  home: {
    continue: 'Kontynuuj',
    newLesson: 'Nowa lekcja',
    markedVerbs: 'Oznaczone czasowniki',
    library: 'Biblioteka',
    settings: 'Ustawienia',
  },
  settings: {
    title: 'Ustawienia',
    applicationLanguage: 'Język aplikacji',
    langEnglish: 'Angielski',
    langPolish: 'Polski',
  },
  prepare: {
    selectLanguagePlaceholder: 'Wybierz język…',
    selectPlaceholder: 'Wybierz…',
    sourceAllVerbs: 'Wszystkie czasowniki',
    sourceHelpAll: 'Mogą być użyte wszystkie czasowniki z domyślnej pełnej listy dla tego języka.',
    sourceHelpSave: (description: string) =>
      `Używane są czasowniki z wybranego zapisu.\nOpis: „${description}”`,
    rowSource: 'źródło:',
    rowLevels: 'poziomy:',
    rowDirection: 'kierunek:',
    rowExtra: 'dodatkowo:',
    rowConjugation: 'koniugacja:',
    rowRegularity: 'regularność:',
    rowSpeed: 'tempo:',
    rowBatch: 'wielkość partii:',
    pickLanguageFirst:
      'Najpierw wybierz język w nagłówku. Potem ustawisz tutaj źródło, poziomy i pozostałe opcje lekcji.',
    startLesson: 'Rozpocznij lekcję',
    starting: 'Uruchamianie…',
    sheetStartTitle: 'Rozpocząć lekcję?',
    sheetNoVerbsTitle: 'Brak czasowników',
    startLessonIncludeLead: 'Ta lekcja obejmuje',
    lessonIncludeNounPhrase: (n: number) => `${verbsAfterNumber(n)}.`,
    matchedFiltersAfterStrong: (n: number) =>
      `${verbsAfterNumber(n)} ${matchVerbWithCount(n)} do Twoich filtrów.`,
    batchShortfall: (batch: number, available: number) =>
      `Wybrano partię ${batch}, ale tylko ${available} ${verbsAfterNumber(available)} ${matchVerbWithCount(available)} do ustawień, więc lekcja ma mniej kart niż wybrana wielkość partii.`,
    noVerbsBody:
      'Nie można rozpocząć lekcji bez żadnych czasowników. Zmień filtry tak, by przynajmniej jeden czasownik pasował.',
  },
  lesson: {
    noConfig: 'Brak konfiguracji lekcji. Zacznij od strony przygotowania.',
    settingsMenuTitle: 'Ustawienia lekcji',
    configSummaryTitle: 'Podsumowanie konfiguracji',
    manageLibrary: 'Zarządzaj biblioteką',
    quickSave: 'Szybki zapis',
    configSummaryButton: 'Podsumowanie konfiguracji',
    manageLibraryButton: 'Zarządzaj biblioteką',
    reverseDirection: 'Odwróć kierunek',
    restartQuestions: 'Zacznij pytania od nowa',
    closeQuestions: 'Zakończ lekcję',
    closeQuestionsTitle: 'Zakończyć lekcję?',
    reverseDirectionTitle: 'Odwrócenie kierunku',
    restartQuestionsTitle: 'Ponowne rozpoczęcie pytań',
    verbsLabel: (notLearnt: number, total: number) => `Czasowniki (${notLearnt}/${total})`,
    editVerb: 'Edytuj czasownik',
    editVerbWithName: (name: string) => `Edytuj czasownik (${name})`,
    historyLabel: (n: number) => `Historia (${n})`,
    confirmCloseLesson:
      'Czy na pewno chcesz zamknąć tę lekcję?',
    confirmReverseDirection:
      'Zamienić język pytania i odpowiedzi? Bieżąca karta zostanie zaktualizowana.',
    confirmRestart:
      'Zresetować postęp nauki, liczniki powtórzeń i historię w tej sesji? Nic nie zostanie zapisane w pamięci trwałej.',
    toastAddedVerbs: (count: number) =>
      count > 0
        ? `Dodano ${count} ${verbsAfterNumber(count)} do zapisu biblioteki.`
        : 'Zapis biblioteki zaktualizowany.',
    toastRemovedVerbs: (count: number) =>
      count > 0
        ? `Usunięto ${count} ${verbsAfterNumber(count)} z zapisu biblioteki.`
        : 'Zapis biblioteki zaktualizowany.',
    topBarTurn: 'Tura',
    topBarLeft: 'Pozostało',
    celebrationTitle: 'Lekcja ukończona',
  },
  configSummary: {
    allVerbsSource: 'Wszystkie czasowniki',
    rowLanguage: 'język',
    rowSource: 'źródło',
    rowLevels: 'poziomy',
    rowDirectionConjugation: 'kierunek · koniugacja',
    rowDirection: 'kierunek',
    rowExtra: 'dodatkowo',
    rowRegularity: 'regularność',
    rowSpeed: 'tempo',
    rowBatch: 'partia',
  },
  libraryPage: {
    noLanguageYet: 'Nie wybrano jeszcze języka.',
    noSavesForLanguage: 'Brak zapisów biblioteki dla tego języka.',
    sheetTitleEdit: 'Zapis biblioteki',
    sheetTitleDelete: 'Usunąć zapis biblioteki?',
    deleteConfirmBeforeName: 'Usunąć',
    deleteConfirmAfterName: 'z biblioteki? Tej operacji nie można cofnąć.',
    nameLabel: 'Nazwa',
    descriptionLabel: 'Opis',
    optionalNotesPlaceholder: 'Opcjonalne notatki…',
    nameDuplicateInline: 'Ta nazwa jest już używana przez inny zapis.',
    maxChars: (n: number) => `Maks. ${n} znaków.`,
    displayVerbs: (count: number) => `Pokaż czasowniki (${count})`,
    loadingVerbs: 'Wczytywanie czasowników…',
    loadVerbsFailed: 'Nie udało się wczytać czasowników.',
    noVerbsInSave: 'Brak czasowników w tym zapisie.',
    tableId: 'id',
    tableLevel: 'poziom',
    tableVerb: 'czasownik',
  },
  libraryForms: {
    removeTitle: 'Usuń z zapisu biblioteki',
    removeSubtitle:
      'Z istniejącego zapisu usuwane są wszystkie czasowniki, które występują także w tej lekcji (dla wybranego zestawu). Czasowniki w zapisie, których nie ma w tej lekcji, pozostają bez zmian. Możesz też zaktualizować notatki.',
    addTitle: 'Dodaj do zapisu biblioteki',
    addSubtitle:
      'Dopisuje czasowniki z tej lekcji do istniejącego zapisu. Czasowniki już obecne w zapisie są pomijane. Możesz też zaktualizować notatki.',
    replaceTitle: 'Zastąp zapis biblioteki',
    replaceSubtitle: 'Nadpisuje wybrany wpis biblioteki stanem bieżącej lekcji.',
    newTitle: 'Nowy zapis biblioteki',
    newSubtitle: 'Zapisuje bieżącą lekcję jako nowy wpis w bibliotece.',
    noSavesYet: 'Nie masz jeszcze zapisów biblioteki dla tego języka.',
    existingSave: 'Istniejący zapis',
    chooseSavePlaceholder: 'Wybierz zapis biblioteki…',
    notes: 'Notatki',
    optionalDetailsPlaceholder: 'Opcjonalny opis tego zapisu…',
    whichVerbsFromLesson: 'Które czasowniki (z tej lekcji)',
    whichVerbs: 'Które czasowniki',
    chooseVerbsPlaceholder: 'Wybierz czasowniki…',
    namePlaceholderExample: 'np. tydzień 3, czasowniki nieregularne',
    nameTaken: 'Zapis o tej nazwie już istnieje. Wybierz inną nazwę.',
    nameMaxLengthReached: (n: number) => `Osiągnięto maksymalną długość nazwy (${n} znaków).`,
    notesMaxLengthReached: (n: number) => `Osiągnięto maksymalną długość notatek (${n} znaków).`,
    noVerbsMatchSimple:
      'Żaden czasownik nie pasuje do tego filtra. Wybierz inną opcję lub zaktualizuj postęp w lekcji.',
    noVerbsMatchOrNotes:
      'Żaden czasownik nie pasuje do tego filtra. Wybierz inną opcję, zaktualizuj postęp w lekcji albo zapisz, aby zmienić tylko notatki.',
  },
  markedVerbs: {
    noLanguageYet: 'Nie wybrano jeszcze języka.',
    loadingVerbs: 'Wczytywanie czasowników…',
    noneForLanguage: 'Brak oznaczonych czasowników dla tego języka.',
    noVerbListForLanguage: 'Brak listy czasowników dla tego języka.',
    loadVerbsFailed: 'Nie udało się wczytać czasowników.',
    marked: 'Oznaczone',
    reasonPlaceholder: 'Powód oznaczenia…',
    verbFallback: (id: number) => `Czasownik #${id}`,
    saveBlockedHint: 'Każdy oznaczony czasownik musi mieć niepusty opis.',
  },
  verbView: {
    notInLesson: 'Ten czasownik nie należy do bieżącej lekcji.',
    learntInLesson: 'Nauczone w tej lekcji',
    marked: 'Oznaczone',
    reasonPlaceholder: 'Powód oznaczenia…',
  },
  cards: {
    hiddenAnswer: '???',
    fullTextTitle: 'Pełny tekst',
    question: 'Pytanie',
    answer: 'Odpowiedź',
    formFallback: (index: number) => `Forma ${index + 1}`,
  },
  answerDetails: {
    question: 'Pytanie',
    answer: 'Odpowiedź',
    showAll: 'Pokaż wszystko',
  },
} as const
