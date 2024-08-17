import { createSubject, Subject } from "./subject"

export const combine = (...subjects: Array<Subject>) => {
    const result = createSubject()

    subjects.forEach((subject, index, subjectsArray) => {
        subject.subscribe(v => {
            const nextValue = subjectsArray.map((subject, idx) => index === idx ? v : subject.getLatestValue())

            result.next(nextValue)
        })
    })

    const { next, ...resultWithoutNext } = result

    return resultWithoutNext
}