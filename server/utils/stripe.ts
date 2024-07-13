import Stripe from 'stripe';

export const stripeClient = async (key: string) => {

    try {
        const stripe = new Stripe(key)
        if (stripe) {
            return stripe
        }
        throw createError({
            status: 500,
            message: 'Failed to load stripe client'
        })
    } catch (error) {
        throw createError({
            status: 500,
            message: 'Failed to load stripe client'
        })
    }
}