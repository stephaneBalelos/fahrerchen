import { serverSupabaseClient } from '#supabase/server'
import type { User } from '@supabase/supabase-js'
import { stripeClient } from '~/server/utils/stripe'
import { getOrganizationStripeAccount } from '~/server/utils/supabase'
import type { Database, StripeConnectPostBody } from '~/types/app.types'

export type StripeConnectPostResponse = {
    accountId: string
}

export default defineEventHandler(async (event): Promise<StripeConnectPostResponse> => {
    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)
    const user = event.context.auth as User
    if (!user) {
        throw createError({
            status: 401,
            message: 'Unauthorized'
        })
    }

    try {
        const body = await readBody<StripeConnectPostBody>(event)
        const client = await serverSupabaseClient<Database>(event)
        const org = await getOrganisationById(event, body.org_id)

        if (!org) {
            throw createError({
                status: 500,
                message: 'Failed to fetch organization'
            })
        }

        // user is the main owner of the organization
        if (user.id !== org.owner_id) {
            throw createError({
                status: 401,
                message: 'Unauthorized'
            })
        }

        const stripeAccount = await getOrganizationStripeAccount(event, body.org_id)

        if (!stripeAccount) {
            let accountId: string
            // Check if connected account already exists with the same email & org_id
            const accounts = await stripe.accounts.list()
            const connectedAccount = accounts.data.find(account => account.email === user.email)
            if (connectedAccount && connectedAccount.metadata && connectedAccount.metadata.org_id === body.org_id) {
                accountId = connectedAccount.id
            } else {
                const account = await stripe.accounts.create({
                    country: "DE",
                    email: user.email,
                    metadata: {
                        org_id: body.org_id
                    }
                });
    
                if (!account) {
                    throw createError({
                        status: 500,
                        message: 'Failed to create account'
                    })
                }
                accountId = account.id
            }

            const {error} = await client.from('organizations_stripe_accounts').insert({
                id: body.org_id,
                stripe_account_id: accountId
            })

            if (error) {
                throw createError({
                    status: 500,
                    message: 'Failed to save Account'
                }) 
            }
            return {accountId: accountId}
        } else {
            // Verify if the account exists
            const account = await stripe.accounts.retrieve(stripeAccount.stripe_account_id)
            if (!account) {
                throw createError({
                    status: 500,
                    message: 'Saved account not found'
                })
            }
            return {accountId: stripeAccount.stripe_account_id}
        }

    } catch (error) {
        console.error(error)
        throw createError({
            status: 500,
            message: 'Failed to create account'
        })
    }


})