import { serverSupabaseClient, serverSupabaseSession } from '#supabase/server'
import { User } from '@supabase/supabase-js'
import { stripeClient } from '~/server/utils/stripe'
import { getOrganizationStripeAccount } from '~/server/utils/supabase'
import { AppUser, Database, StripeConnectPostBody } from '~/types/app.types'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)
    const origin = event.headers.get('origin')
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
            const account = await stripe.accounts.create({
                country: "DE",
                email: user.email,
            });
    
            console.log(account)

            if (!account) {
                throw createError({
                    status: 500,
                    message: 'Failed to create account'
                })
            }

            const {error} = await client.from('organizations_stripe_accounts').insert({
                id: body.org_id,
                stripe_account_id: account.id
            })

            if (error) {
                throw createError({
                    status: 500,
                    message: 'Failed to save Account'
                }) 
            }
            return {accountId: account.id}
        } else {
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