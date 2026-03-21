import {useCallback, useEffect, useMemo, useState} from 'react'

import { useToast } from '../components/shared/Toast.tsx'
import type {LanguageConfig, LessonConfig, LessonSave} from '../types/config.ts'
import type {ConjugationFlags, Verb} from '../types/verb.ts'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader.ts'
import { loadLessonFromLocalStorage } from '../utils/localStorage.ts'
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

export function useLesson(name?: string) {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [round, setRound] = useState<Round | undefined>()
  const [lesson, setLesson] = useState<LessonSave | null | undefined>()
  const [languageConfig, setLanguageConfig] = useState<LanguageConfig>(getLanguageConfig(undefined))
  const [lastVerbsIds, setLastVerbsIds] = useState<number[]>([])
  const toast = useToast()

  useEffect(() => {
    if (!name) {
      return
    }
    const lesson = loadLessonFromLocalStorage(name)
    setLesson(lesson)

    if (lesson === null) {
      toast.error('Failed to load lesson from local storage by name', name)
      return
    }
    const newLanguageConfig = getLanguageConfig(lesson.config.language)
    setLanguageConfig(newLanguageConfig)

    loadVerbsFromJson(newLanguageConfig.verbsFilePath)
      .then((loadedVerbs) => {
        const lessonVerbIds = new Set(lesson.verbs)
        const filteredVerbs = loadedVerbs.filter((verb) => lessonVerbIds.has(verb.id))
        setVerbs(filteredVerbs)
        setRound(prepareRound(filteredVerbs[0], lesson.config, newLanguageConfig))
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err)
        toast.error('Failed to load verbs', errorMessage)
        setVerbs([])
      })
  }, [name, toast])

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
    const repeated = [...lesson.repeated]

    learnt[verbIndex] = correct
    repeated[verbIndex] = (repeated[verbIndex] ?? 0) + 1

    const nextLesson: LessonSave = {
      ...lesson,
      learnt,
      repeated,
    }
    const nextLastVerbsIds = [...lastVerbsIds, round.verbId]

    setLesson(nextLesson)
    setLastVerbsIds(nextLastVerbsIds)

    const nextVerb = randomizeVerb(nextLesson, nextLastVerbsIds)
    if (!nextVerb) {
      return
    }
    setRound(prepareRound(nextVerb, nextLesson.config, languageConfig))

  }, [round, lesson, setLesson, setLastVerbsIds, lastVerbsIds, randomizeVerb, setRound, languageConfig])

  return { lesson, verbs, round, lastVerbsIds, updateRoundHiddenFlags, canContinue, onContinue, languageConfig }
}
