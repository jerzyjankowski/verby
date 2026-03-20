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
    question: verb.meaning,
    answer: verb.verb,
    isConjugation: false,
    answerHidden: true,
    answerIrregular: false
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
        question: verb.meaning,
        answer: correctForm.form,
        isConjugation: false,
        answerHidden: true,
        answerIrregular: correctForm.irregularity,
      }
  }
}

export function useLesson(name?: string) {
  const [verbs, setVerbs] = useState<Verb[]>([])
  const [round, setRound] = useState<Round | undefined>()
  const toast = useToast()

  const lesson = useMemo<LessonSave | null>(() => {
    if (!name) return null
    return loadLessonFromLocalStorage(name)
  }, [name])

  useEffect(() => {
    if (!lesson) {
      setVerbs([])
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
  }, [lesson, toast])

  const updateRoundHiddenFlags: UpdateRoundHiddenFlags = useCallback((answerHidden: boolean, conjugationAnswersHidden?: ConjugationFlags) => {
    setRound(currentRound => {
      return currentRound ? { ...currentRound, answerHidden, conjugationAnswersHidden } : undefined
    })
  }, [setRound])

  const canContinue = useMemo(() => {
    const cah = round?.conjugationAnswersHidden
    return round && (!round.answerHidden || (cah && !(cah.s1 && cah.s2 && cah.s3 && cah.p1 && cah.p2 && cah.p3)))
  }, [round])

  return { lesson, verbs, round, updateRoundHiddenFlags, canContinue }
}
