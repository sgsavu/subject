import { describe, expect, test, vi } from 'vitest'
import { createSubject } from './subject'

describe("subject", () => {
    describe("given subject initialized with a value", () => {
        test("then getLatestValue() returns that value", () => {
            const result$ = createSubject({
                initValue: "abc"
            })
    
            const initValue = result$.getLatestValue()
    
            expect(initValue).toBe("abc")
        })
    
        describe("when a new value is emitted into the subject", () => {
            test("then the value is reflected into the getLatestValue()", () => {
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                result$.next("def")
    
                const initValue = result$.getLatestValue()
    
                expect(initValue).toBe("def")
            })
        })
    
        describe("when a consumer subscribes to the subject", () => {
            test("then no value is received", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                result$.subscribe(subFn)
    
                expect(subFn).not.toHaveBeenCalled()
            })
        })
    
        describe("when a consumer subscribes to the subject and a value is emitted by the subject", () => {
            test("then that value is received by the consumer", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
            })
        })
    
        describe("when a subscriber unsubscribes", () => {
            test("then it no longer receives updates from the subject", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                const sub = result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
    
                sub.unsubscribe()
    
                result$.next("ghi")
    
                expect(subFn).toHaveBeenCalledTimes(1)
            })
        })
    
        describe("when multiple consumers subscribe to the subject", () => {
            test("then all consumers receive updates when emissions occur", () => {
                const subFnA = vi.fn()
                const subFnB = vi.fn()
                const subFnC = vi.fn()
    
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                result$.subscribe(subFnA)
                result$.subscribe(subFnB)
                result$.subscribe(subFnC)
    
                result$.next("def")
                    
                expect(subFnA).toHaveBeenCalledOnce()
                expect(subFnA).toHaveBeenNthCalledWith(1, "def")
    
                expect(subFnB).toHaveBeenCalledOnce()
                expect(subFnB).toHaveBeenNthCalledWith(1, "def")
    
                expect(subFnC).toHaveBeenCalledOnce()
                expect(subFnC).toHaveBeenNthCalledWith(1, "def")
            })
        })
    
        describe("when a subject is terminated", () => {
            test("then consumers no longer receive updates and new values are no longer emitted", () => {
                const subFn = vi.fn()
    
                const result$ = createSubject({
                    initValue: "abc"
                })
        
                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
    
                result$.terminate()
    
                result$.next('ghi')
    
                expect(subFn).toHaveBeenCalledTimes(1)
            })
        })
    })

    describe("given subject initialized with a value and replay of 1", () => {
        test("then getLatestValue() returns that value", () => {
            const result$ = createSubject({
                initValue: "abc",
                replay: 1
            })
    
            const initValue = result$.getLatestValue()
    
            expect(initValue).toBe("abc")
        })
    
        describe("when a new value is emitted into the subject", () => {
            test("then the value is reflected into the getLatestValue()", () => {
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                result$.next("def")
    
                const initValue = result$.getLatestValue()
    
                expect(initValue).toBe("def")
            })
        })
    
        describe("when a consumer subscribes to the subject", () => {
            test("then the initial value is received", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                result$.subscribe(subFn)
    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenCalledTimes(1)
            })
        })
    
        describe("when a consumer subscribes to the subject and a value is emitted by the subject", () => {
            test("then that value is received by the consumer", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledTimes(2)
                expect(subFn).toHaveBeenNthCalledWith(1, "abc")
                expect(subFn).toHaveBeenNthCalledWith(2, "def")
            })
        })
    
        describe("when a subscriber unsubscribes", () => {
            test("then it no longer receives updates from the subject", () => {
                const subFn = vi.fn()
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                const sub = result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledTimes(2)
                expect(subFn).toHaveBeenNthCalledWith(1, "abc")
                expect(subFn).toHaveBeenNthCalledWith(2, "def")
    
                sub.unsubscribe()
    
                result$.next("ghi")
    
                expect(subFn).toHaveBeenCalledTimes(2)
            })
        })
    
        describe("when multiple consumers subscribe to the subject", () => {
            test("then all consumers receive updates when emissions occur", () => {
                const subFnA = vi.fn()
                const subFnB = vi.fn()
                const subFnC = vi.fn()
    
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                result$.subscribe(subFnA)
                result$.subscribe(subFnB)
                result$.subscribe(subFnC)
    
                result$.next("def")
                    
                expect(subFnA).toHaveBeenCalledTimes(2)
                expect(subFnA).toHaveBeenNthCalledWith(1, "abc")
                expect(subFnA).toHaveBeenNthCalledWith(2, "def")
    
                expect(subFnB).toHaveBeenCalledTimes(2)
                expect(subFnB).toHaveBeenNthCalledWith(1, "abc")
                expect(subFnB).toHaveBeenNthCalledWith(2, "def")
    
                expect(subFnC).toHaveBeenCalledTimes(2)
                expect(subFnC).toHaveBeenNthCalledWith(1, "abc")
                expect(subFnC).toHaveBeenNthCalledWith(2, "def")
            })
        })
    
        describe("when a subject is terminated", () => {
            test("then consumers no longer receive updates and new values are no longer emitted", () => {
                const subFn = vi.fn()
    
                const result$ = createSubject({
                    initValue: "abc",
                    replay: 1
                })
        
                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledTimes(2)
                expect(subFn).toHaveBeenNthCalledWith(1, "abc")
                expect(subFn).toHaveBeenNthCalledWith(2, "def")
    
                result$.terminate()
    
                result$.next('ghi')
    
                expect(subFn).toHaveBeenCalledTimes(2)
            })
        })
    })

    describe("given subject initialized with no config", () => {
        test("then getLatestValue() returns undefined", () => {
            const result$ = createSubject()
    
            const initValue = result$.getLatestValue()
    
            expect(initValue).toBe(undefined)
        })
    
        describe("when a new value is emitted into the subject", () => {
            test("then the value is reflected into the getLatestValue()", () => {
                const result$ = createSubject()
        
                result$.next("def")
    
                const initValue = result$.getLatestValue()
    
                expect(initValue).toBe("def")
            })
        })
    
        describe("when a consumer subscribes to the subject", () => {
            test("then no value is received", () => {
                const subFn = vi.fn()
                const result$ = createSubject()
        
                result$.subscribe(subFn)
    
                expect(subFn).not.toHaveBeenCalled()
            })
        })
    
        describe("when a consumer subscribes to the subject and a value is emitted by the subject", () => {
            test("then that value is received by the consumer", () => {
                const subFn = vi.fn()
                const result$ = createSubject()

                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
            })
        })
    
        describe("when a subscriber unsubscribes", () => {
            test("then it no longer receives updates from the subject", () => {
                const subFn = vi.fn()
                const result$ = createSubject()
        
                const sub = result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
    
                sub.unsubscribe()
    
                result$.next("ghi")
    
                expect(subFn).toHaveBeenCalledTimes(1)
            })
        })
    
        describe("when multiple consumers subscribe to the subject", () => {
            test("then all consumers receive updates when emissions occur", () => {
                const subFnA = vi.fn()
                const subFnB = vi.fn()
                const subFnC = vi.fn()
    
                const result$ = createSubject()
        
                result$.subscribe(subFnA)
                result$.subscribe(subFnB)
                result$.subscribe(subFnC)
    
                result$.next("def")
                    
                expect(subFnA).toHaveBeenCalledOnce()
                expect(subFnA).toHaveBeenNthCalledWith(1, "def")
    
                expect(subFnB).toHaveBeenCalledOnce()
                expect(subFnB).toHaveBeenNthCalledWith(1, "def")
    
                expect(subFnC).toHaveBeenCalledOnce()
                expect(subFnC).toHaveBeenNthCalledWith(1, "def")
            })
        })
    
        describe("when a subject is terminated", () => {
            test("then consumers no longer receive updates and new values are no longer emitted", () => {
                const subFn = vi.fn()

                const result$ = createSubject()
        
                result$.subscribe(subFn)
    
                result$.next("def")
                    
                expect(subFn).toHaveBeenCalledOnce()
                expect(subFn).toHaveBeenNthCalledWith(1, "def")
    
                result$.terminate()
    
                result$.next('ghi')
    
                expect(subFn).toHaveBeenCalledTimes(1)
            })
        })
    })
})
