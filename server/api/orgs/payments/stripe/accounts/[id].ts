import { getOrganisationById, getOrganizationStripeAccount } from '~/server/utils/supabase'
import type { Database } from '~/types/app.types'


export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)


    const orgid = getRouterParam(event, 'id')


    if (!orgid) {
        throw createError({
            status: 400,
            message: 'Account ID is required'
        })
    }

    const organization = await getOrganisationById(event, orgid)

    if (!organization) {
        throw createError({
            status: 404,
            message: 'Account not found'
        })
    }

    const stripeAccount = await getOrganizationStripeAccount(event, orgid)

    if (!stripeAccount) {
        return null
    }

    try {
        const account = await stripe.accounts.retrieve(stripeAccount.stripe_account_id);
        return account
        
    } catch (error) {
        console.error(error);
        throw createError({
            status: 500,
            message: "An error occurred when calling the Stripe API to retrieve the account",
        });
    }

})