import { combine } from "./combine"
import { createSubject } from "./subject"

const letters$ = createSubject()
const numbers$ = createSubject()

const sub1 = letters$.subscribe(x => console.warn(x + '1'))
const sub2 = letters$.subscribe(x => console.warn(x + '2'))
const sub3 = letters$.subscribe(x => console.warn(x + '3'))
const sub4 = letters$.subscribe(x => console.warn(x + '4'))

combine(letters$, numbers$).subscribe((x) => { console.warn('combination', x) })

letters$.next('a')
letters$.terminate()
letters$.next('b')

numbers$.next(1)
numbers$.next(2)