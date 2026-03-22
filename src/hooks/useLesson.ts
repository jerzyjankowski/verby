import {useCallback, useEffect, useMemo, useState} from 'react'

import { useToast } from '../components/shared/Toast.tsx'
import { ui } from '../locales'
import type {LanguageConfig, LessonConfig, LessonSave} from '../types/config.ts'
import type {ConjugationFlags, Verb} from '../types/verb.ts'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader.ts'
import { loadCurrentLessonFromLocalStorage, saveLessonAsCurrentToLocalStorage } from '../utils/localStorage.ts'
import type {Round, UpdateRoundHiddenFlags} from "../types/lesson.ts";
import {getLanguageConfig} from "../configs/languageConfigMap.ts";

const prepareRound = (verb: Verb, lessonConfig: LessonConfig, languageConfig: LanguageConfig): Round => {
  const defaultValues: Round = {
    verbId: verb.id,
    question: lessonConfig.direction === 'to_foreign' ? verb.meaning : verb.verb,
    answer: lessonConfig.direction === 'to_foreign' ? verb.verb : verb.meaning,
    isConjugation: false,
    isForms: false,
    answerHidden: true,
    answerIrregular: false,
    conjugationAnswers: { s1: '-', s2: '-', s3: '-', p1: '-', p2: '-', p3: '-'},
    conjugationAnswersHidden: { s1: true, s2: true, s3: true, p1: true, p2: true, p3: true},
    conjugationAnswersIrregulars: { s1: false, s2: false, s3: false, p1: false, p2: false, p3: false},
    formsAnswers: [],
    formsAnswersHidden: [],
    formsAnswersIrregulars: [],
  }
  switch (lessonConfig.extra) {
    case 'no':
      return {
        ...defaultValues,
      }
    case 'conjugation':
      const conjugation = languageConfig.conjugate(verb, lessonConfig.conjugation ?? 0)
      return {
        ...defaultValues,
        isConjugation: true,
        conjugationAnswers: conjugation.conjugation,
        conjugationAnswersHidden: { s1: true, s2: true, s3: true, p1: true, p2: true, p3: true },
        conjugationAnswersIrregulars: conjugation.irregularity,
      }
    case 'forms':
      const forms = languageConfig.getForms(verb)
      return {
        ...defaultValues,
        isForms: true,
        formsAnswers: forms.map(form => form.form),
        formsAnswersHidden: forms.map(() => true),
        formsAnswersIrregulars: forms.map(form => form.irregularity),
      }
  }
}

/** Bump `repeated` for the verb currently being shown (once per display, not on continue). */
function withRepeatedIncrementedForShownVerb(lesson: LessonSave, verbId: number): LessonSave {
  const verbIndex = lesson.verbs.findIndex((id) => id === verbId)
  if (verbIndex < 0) return lesson
  const repeated = [...lesson.repeated]
  repeated[verbIndex] = (repeated[verbIndex] ?? 0) + 1
  return { ...lesson, repeated }
}

function normalizeLastVerbId(lesson: LessonSave): number | undefined {
  const id = lesson.lastVerbId
  if (typeof id !== 'number' || !Number.isFinite(id)) return undefined
  return lesson.verbs.includes(id) ? id : undefined
}

export function useLesson() {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [round, setRound] = useState<Round | undefined>()
  const [lesson, setLesson] = useState<LessonSave | null | undefined>()
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>(getLanguageConfig(undefined))
  const [isCompleted, setIsCompleted] = useState(false)
  const toast = useToast()

  useEffect(() => {
    setIsCompleted(false)
    const lesson = loadCurrentLessonFromLocalStorage()
    if (lesson === null) {
      toast.error(ui.toast.loadLessonFailed)
      setLesson(null)
      return
    }
    const lessonNormalized: LessonSave = {
      ...lesson,
      history: lesson.history ?? [],
      lastVerbId: normalizeLastVerbId(lesson),
    }
    setLesson(lessonNormalized)
    const newLanguageConfig = getLanguageConfig(lessonNormalized.config.language)
    setLanguageConfig(newLanguageConfig)

    loadVerbsFromJson(newLanguageConfig.verbsFilePath)
      .then((loadedVerbs) => {
        const lessonVerbIds = new Set(lessonNormalized.verbs)
        const filteredVerbs = loadedVerbs.filter((verb) => lessonVerbIds.has(verb.id))
        setVerbs(filteredVerbs)
        if (filteredVerbs.length === 0) {
          setRound(undefined)
          return
        }
        const resumeId = lessonNormalized.lastVerbId
        const resumeVerb =
          resumeId != null
            ? filteredVerbs.find((v) => v.id === resumeId)
            : undefined
        if (resumeVerb) {
          const lessonResumed: LessonSave = {
            ...lessonNormalized,
            lastVerbId: resumeVerb.id,
          }
          setLesson(lessonResumed)
          setRound(prepareRound(resumeVerb, lessonResumed.config, newLanguageConfig))
          return
        }
        const firstVerb =
          filteredVerbs[Math.floor(Math.random() * filteredVerbs.length)]!
        const lessonWithFirstShown: LessonSave = {
          ...withRepeatedIncrementedForShownVerb(lessonNormalized, firstVerb.id),
          lastVerbId: firstVerb.id,
        }
        setLesson(lessonWithFirstShown)
        setRound(prepareRound(firstVerb, lessonWithFirstShown.config, newLanguageConfig))
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err)
        toast.error(ui.toast.loadVerbsFailedTitle, errorMessage)
        setVerbs([])
      })
  }, [toast])

  const updateRoundHiddenFlags: UpdateRoundHiddenFlags = useCallback((
    answerHidden: boolean,
    conjugationAnswersHidden: ConjugationFlags,
    formsAnswersHidden: boolean[]
  ) => {
    setRound(currentRound => {
      return currentRound ? { ...currentRound, answerHidden, conjugationAnswersHidden, formsAnswersHidden } : undefined
    })
  }, [setRound])

  const canContinue = useMemo(() => {
    const cah = round?.conjugationAnswersHidden
    const fah = round?.formsAnswersHidden
    return round && (
      !round.answerHidden ||
      (cah && !(cah.s1 && cah.s2 && cah.s3 && cah.p1 && cah.p2 && cah.p3)) ||
      (fah && fah.some(hidden => !hidden))
    )
  }, [round])

  const randomizeVerb = useCallback((lessonData: LessonSave, history: number[]) => {
    const candidates = lessonData.verbs.map((id, index) => {
      let minLeft = 10000
      if (id === history.at(-1)) {
        minLeft = 1
      } else if (id === history.at(-2)) {
        minLeft = 2
      } else if (id === history.at(-3)) {
        minLeft = 3
      }

      return {
        id,
        learnt: lessonData.learnt[index] ?? false,
        repeated: lessonData.repeated[index] ?? 0,
        minLeft,
      }
    })

    let available = candidates.filter(candidate => !candidate.learnt)
    if (available.length === 0) {
      return undefined
    }

    if (lessonData.config.speed === 'same') {
      const minRepeated = Math.min(...available.map(candidate => candidate.repeated))
      available = available.filter(candidate => candidate.repeated === minRepeated)
    }

    const maxMinLeft = Math.max(...available.map(candidate => candidate.minLeft))
    available = available.filter(candidate => candidate.minLeft >= maxMinLeft)
    if (available.length === 0) {
      return undefined
    }

    const selected = available[Math.floor(Math.random() * available.length)]
    return verbs.find(verb => verb.id === selected.id)
  }, [verbs])

  const onContinue = useCallback((correct: boolean) => {
    if (!lesson || !round) {
      return
    }
    const verbIndex = lesson.verbs.findIndex(id => id === round.verbId)
    if (verbIndex < 0) {
      return
    }

    const learnt = [...lesson.learnt]
    learnt[verbIndex] = correct

    const history = [...(lesson.history ?? []), round.verbId]
    const nextLessonAfterLearnt: LessonSave = {
      ...lesson,
      learnt,
      history,
    }

    const nextVerb = randomizeVerb(nextLessonAfterLearnt, history)
    if (!nextVerb) {
      const completed: LessonSave = { ...nextLessonAfterLearnt, lastVerbId: undefined }
      saveLessonAsCurrentToLocalStorage(completed)
      setLesson(completed)
      setRound(undefined)
      setIsCompleted(true)
      return
    }
    const nextLesson: LessonSave = {
      ...withRepeatedIncrementedForShownVerb(nextLessonAfterLearnt, nextVerb.id),
      lastVerbId: nextVerb.id,
    }
    setLesson(nextLesson)
    setRound(prepareRound(nextVerb, nextLesson.config, languageConfig))

  }, [round, lesson, randomizeVerb, setRound, languageConfig])

  const setVerbLearnt = useCallback((verbId: number, learntValue: boolean) => {
    setLesson((current) => {
      if (!current) return current

      const verbIndex = current.verbs.findIndex((id) => id === verbId)
      if (verbIndex < 0) return current

      const learnt = [...current.learnt]
      learnt[verbIndex] = learntValue
      const nextLesson: LessonSave = { ...current, learnt }

      saveLessonAsCurrentToLocalStorage(nextLesson)
      return nextLesson
    })
  }, [])

  const reverseDirection = useCallback(() => {
    if (!lesson || !round) return
    const nextDirection =
      lesson.config.direction === 'to_foreign' ? 'to_native' : 'to_foreign'
    const nextConfig: LessonConfig = { ...lesson.config, direction: nextDirection }
    const nextLesson: LessonSave = { ...lesson, config: nextConfig }
    saveLessonAsCurrentToLocalStorage(nextLesson)
    setLesson(nextLesson)
    const verb = verbs.find((v) => v.id === round.verbId)
    if (verb) {
      setRound(prepareRound(verb, nextConfig, languageConfig))
    }
  }, [lesson, round, verbs, languageConfig])

  const quickSave = useCallback(() => {
    setLesson((current) => {
      if (!current) return current
      const next: LessonSave = {
        ...current,
        lastVerbId: round?.verbId,
      }
      saveLessonAsCurrentToLocalStorage(next)
      return next
    })
  }, [round])

  const resetProgressAndSave = useCallback(() => {
    setLesson((current) => {
      if (!current) return current
      const next: LessonSave = {
        ...current,
        learnt: current.verbs.map(() => false),
        repeated: current.verbs.map(() => 0),
        history: [],
        lastVerbId: undefined,
      }
      saveLessonAsCurrentToLocalStorage(next)
      return next
    })
  }, [])

  const restartQuestions = useCallback(() => {
    if (!lesson) return
    setIsCompleted(false)
    const resetLesson: LessonSave = {
      ...lesson,
      learnt: lesson.verbs.map(() => false),
      repeated: lesson.verbs.map(() => 0),
      history: [],
      lastVerbId: undefined,
    }
    if (verbs.length === 0) {
      setLesson(resetLesson)
      setRound(undefined)
      return
    }
    const firstVerb = verbs[Math.floor(Math.random() * verbs.length)]!
    const lessonWithFirstShown: LessonSave = {
      ...withRepeatedIncrementedForShownVerb(resetLesson, firstVerb.id),
      lastVerbId: firstVerb.id,
    }
    setLesson(lessonWithFirstShown)
    setRound(prepareRound(firstVerb, lessonWithFirstShown.config, languageConfig))
  }, [lesson, verbs, languageConfig])

  return {
    lesson,
    verbs,
    round,
    isCompleted,
    updateRoundHiddenFlags,
    canContinue,
    onContinue,
    languageConfig,
    setVerbLearnt,
    reverseDirection,
    restartQuestions,
    resetProgressAndSave,
    quickSave,
  }
}
