import { serverSupabaseClient, serverSupabaseSession } from '#supabase/server'
import { User } from '@supabase/supabase-js'
import { stripeClient } from '~/server/utils/stripe'
import { AppUser, Database, StripeConnectPostBody } from '~/types/app.types'

export default defineEventHandler(async (event) => {

    const config = useRuntimeConfig(event)
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
    
        const { data:org, error } = await client.from('organisations').select('*').eq('id', body.org_id).single()
    
        if (error) {
            throw createError({
                status: 500,
                message: 'Failed to load organisation'
            })
        }

        const account = await stripe.accounts.create({
            country: "DE",
            email: user.email,
        });

        if (!account) {
            throw createError({
                status: 500,
                message: 'Failed to create account'
            })
        }
    
        return {accountId: account.id}
    } catch (error) {
        console.error(error)
        throw createError({
            status: 500,
            message: 'Failed to create account'
        })
    }


})