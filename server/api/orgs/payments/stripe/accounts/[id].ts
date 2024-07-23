import { th } from "date-fns/locale"


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)

    const accountId = getRouterParam(event, 'id')

    if (!accountId) {
        throw createError({
            status: 400,
            message: 'Account ID is required'
        })
    }

    try {
        const account = await stripe.accounts.retrieve(accountId);

        return account
        
    } catch (error) {
        throw createError({
            status: 500,
            message: "An error occurred when calling the Stripe API to retrieve the account",
        });
    }



})