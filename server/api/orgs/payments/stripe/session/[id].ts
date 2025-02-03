import { User } from "@supabase/supabase-js"
import { getOrganizationStripeAccount } from "~/server/utils/supabase"

export default defineEventHandler(async (event) => {

    // check if the user is authenticated
    const user = event.context.auth as User
    if (!user) {
        console.log('Unauthorized - user not authenticated')
        throw createError({
            status: 401,
            message: 'Unauthorized'
        })
    }

    // user is the main owner of the organization
    const orgid = getRouterParam(event, 'id')
    if (!orgid) {
        console.log('Organization ID is required')
        throw createError({
            status: 400,
            message: 'Organization ID is required'
        })
    }

    const organization = await getOrganisationById(event, orgid)

    if (!organization) {
        console.log('Organization not found')
        throw createError({
            status: 404,
            message: 'Organization not found'
        })
    }

    if (user.id !== organization.owner_id) {
        console.log('Unauthorized - user is not the owner of the organization')
        throw createError({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const stripeAccount = await getOrganizationStripeAccount(event, orgid)

    if (!stripeAccount) {
        console.log('Organization does not have a stripe account')
        throw createError({
            status: 404,
            message: 'Organization does not have a stripe account'
        })
    }


    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)

    try {
        const accountSession = await stripe.accountSessions.create({
            account: stripeAccount.stripe_account_id,
            components: {
                account_onboarding: {
                    enabled: true,
                },
                notification_banner: {
                    enabled: true,
                },
                payments: {
                    enabled: true,
                },
                payouts: {
                    enabled: true,
                    features: {
                        instant_payouts: true,
                        standard_payouts: true,
                        edit_payout_schedule: true,
                    },
                },
                account_management: {
                    enabled: true
                },
                documents: { enabled: true },
            },
        });
        return accountSession
    } catch (error) {
        console.error(error);
        throw createError({
            status: 500,
            message: "An error occurred when calling the Stripe API to create the account session",
        });
    }

})