import { describe, expect, test, vi } from 'vitest'
import { createSubject } from './subject'
import { combine } from './combine'

describe("combine", () => {
    describe("given combine of multiple subjects", () => {
        describe("when one of the subjects emits", () => {
            test("then the latest value from all subjects is emitted", () => {
                const subFn = vi.fn()
                const letters$ = createSubject()
                const numbers$ = createSubject()
    
                combine(letters$, numbers$).subscribe(subFn)
    
                letters$.next("a")
        
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, ["a", undefined])
            })
        })

        describe("when emissions occur from multiple subjects", () => {
            test("then the latest value from all subjects is emitted on each occassion", () => {
                const subFn = vi.fn()
                const letters$ = createSubject()
                const numbers$ = createSubject()
    
                combine(letters$, numbers$).subscribe(subFn)
    
                letters$.next("a")
                numbers$.next(1)
    
                expect(subFn).toHaveBeenCalledTimes(2)
                expect(subFn).toHaveBeenNthCalledWith(1, ["a", undefined])
                expect(subFn).toHaveBeenNthCalledWith(2, ["a", 1])
            })
        })
    })
})
