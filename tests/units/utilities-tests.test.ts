// @vitest-environment nuxt

import { expect, describe, it } from "vitest"
import { randomNumber } from "~/server/utils/utilities"

describe('Utilities', () => {

    it('should generate a random number between 1 and 10', () => {
        const random = randomNumber(1, 10)
        expect(random).toBeGreaterThanOrEqual(1)
        expect(random).toBeLessThanOrEqual(10)
    })

    it('should generate a random number between -30 and 20', () => {
        const random = randomNumber(-30, 20)
        expect(random).toBeGreaterThanOrEqual(-30)
        expect(random).toBeLessThanOrEqual(20)
    })
})