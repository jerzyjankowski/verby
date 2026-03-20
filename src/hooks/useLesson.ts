import {useCallback, useEffect, useMemo, useState} from 'react'

import { useToast } from '../components/shared/Toast.tsx'
import type {LessonConfig, LessonSave} from '../types/config.ts'
import type {ConjugationFlags, Verb} from '../types/verb.ts'
import { loadVerbsFromJson } from '../utils/jsonVerbsLoader.ts'
import { loadLessonFromLocalStorage } from '../utils/localStorage.ts'
import type {Round, UpdateRoundHiddenFlags} from "../types/lesson.ts";
import {conjugate, getCorrectForm} from "../configs/esp.ts";

const prepareRound = (verb: Verb, config: LessonConfig): Round => {
  const defaultValues: Round = {
    verbId: verb.id,
    question: verb.meaning,
    answer: verb.verb,
    isConjugation: false,
    answerHidden: true,
    answerIrregular: false,
    conjugationAnswers: { s1: '-', s2: '-', s3: '-', p1: '-', p2: '-', p3: '-'},
    conjugationAnswersHidden: { s1: true, s2: true, s3: true, p1: true, p2: true, p3: true},
    conjugationAnswersIrregulars: { s1: false, s2: false, s3: false, p1: false, p2: false, p3: false},
  }
  switch (config.direction) {
    case 'to_foreign':
      return {
        ...defaultValues,
      }
    case 'to_native':
      return {
        ...defaultValues,
        question: verb.verb,
        answer: verb.meaning,
      }
    case 'conjugation':
      const conjugation = conjugate(verb, config.directionConjugation ?? 0)
      return {
        ...defaultValues,
        isConjugation: true,
        conjugationAnswers: conjugation.conjugation,
        conjugationAnswersHidden: { s1: true, s2: true, s3: true, p1: true, p2: true, p3: true },
        conjugationAnswersIrregulars: conjugation.irregularity,
      }
    case 'form':
      const correctForm = getCorrectForm(verb, config.directionForm ?? 0)
      return {
        ...defaultValues,
        answer: correctForm.form,
        answerIrregular: correctForm.irregularity,
      }
  }
}

export function useLesson(name?: string) {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [round, setRound] = useState<Round | undefined>()
  const [lesson, setLesson] = useState<LessonSave | null | undefined>()
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

    const lessonFile =
      (lesson as LessonSave & { config: LessonSave['config'] & { file?: string } }).config.file ??
      lesson.file

    loadVerbsFromJson(lessonFile)
      .then((loadedVerbs) => {
        const lessonVerbIds = new Set(lesson.verbs)
        const filteredVerbs = loadedVerbs.filter((verb) => lessonVerbIds.has(verb.id))
        setVerbs(filteredVerbs)
        setRound(prepareRound(filteredVerbs[0], lesson.config))
      })
      .catch((err) => {
        const errorMessage = err instanceof Error ? err.message : String(err)
        toast.error('Failed to load verbs', errorMessage)
        setVerbs([])
      })
  }, [name, toast])

  const updateRoundHiddenFlags: UpdateRoundHiddenFlags = useCallback((answerHidden: boolean, conjugationAnswersHidden: ConjugationFlags) => {
    setRound(currentRound => {
      return currentRound ? { ...currentRound, answerHidden, conjugationAnswersHidden } : undefined
    })
  }, [setRound])

  const canContinue = useMemo(() => {
    const cah = round?.conjugationAnswersHidden
    return round && (!round.answerHidden || (cah && !(cah.s1 && cah.s2 && cah.s3 && cah.p1 && cah.p2 && cah.p3)))
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
    console.log('[JJ]onContinue', correct)
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
    setRound(prepareRound(nextVerb, nextLesson.config))

  }, [round, lesson, setLesson, setLastVerbsIds, lastVerbsIds, randomizeVerb, setRound])

  return { lesson, verbs, round, updateRoundHiddenFlags, canContinue, onContinue }
}
