const subject = ({
    init,
    replay
} = {}) => {
    let values = []
    let subscribers = {}
    let subIndex = 0
    let terminated = false

    if (init) {
        values.push(init)
    }

    return {
        next: (newValue) => {
            if (terminated) return
            if (values.length === replay) {
                values.shift()
            }
            values.push(newValue)

            Object.values(subscribers).forEach(subscriber => {
                subscriber(newValue)
            })
        },
        subscribe: (fn) => {
            const idx = subIndex
            subIndex = subIndex + 1

            subscribers[`${idx}`] = fn

            if (replay) {
                values.forEach(fn)
            }

            return {
                unsubscribe: () => {
                    const { [idx]: _, ...rest} = subscribers
                    subscribers = rest
                }
            }
        },
        getLatestValue: () => values[values.length - 1],
        terminate: () => {
            subscribers = {}
            terminated  = true
        }
    }
}

const combine = (...subjects) => {
    const result = subject()

    subjects.forEach((subject, index, subjectsArray) => {
        subject.subscribe(v => {
            const nextValue = subjectsArray.map((subject, idx) => index === idx ? v : subject.getLatestValue())

            result.next(nextValue)
        })
    })

    const { next, ...resultWithoutNext } = result

    return resultWithoutNext
}

const letters$ = subject()
const numbers$ = subject()

const sub1 = letters$.subscribe(x => console.warn(x + '1'))
const sub2 = letters$.subscribe(x => console.warn(x + '2'))
const sub3 = letters$.subscribe(x => console.warn(x + '3'))
const sub4 = letters$.subscribe(x => console.warn(x + '4'))

combine(letters$, numbers$).subscribe((x) => {console.warn('combination', x)})

letters$.next('a')
letters$.terminate()
letters$.next('b')

numbers$.next(1)
numbers$.next(2)
