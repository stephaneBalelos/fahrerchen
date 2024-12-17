import { serverSupabaseClient, serverSupabaseSession } from '#supabase/server'
import { User } from '@supabase/supabase-js'
import { stripeClient } from '~/server/utils/stripe'
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
    
        const { data:org, error } = await client.from('organizations').select('*').eq('id', body.org_id).single()

        if (error) {
            throw createError({
                status: 500,
                message: 'Failed to fetch organization'
            })
        }

        if (!org) {
            throw createError({
                status: 404,
                message: 'Organization not found'
            })
        }

        if (!org?.stripe_account_id) {
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

            const res = await client.from('organizations').update({
                stripe_account_id: account.id
            }).eq('id', body.org_id)

            if (res.error) {
                throw createError({
                    status: 500,
                    message: 'Failed to save Account'
                }) 
            }
            return {accountId: account.id}
        } else {
            return {accountId: org.stripe_account_id}
        }

    } catch (error) {
        console.error(error)
        throw createError({
            status: 500,
            message: 'Failed to create account'
        })
    }


})