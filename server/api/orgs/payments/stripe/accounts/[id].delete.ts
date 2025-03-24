import { serverSupabaseClient } from '#supabase/server'
import type { User } from '@supabase/supabase-js'
import { stripeClient } from '~/server/utils/stripe'
import type { Database } from '~/types/app.types'

export default defineEventHandler(async (event) => {
    const config = useRuntimeConfig()
    const stripe = await stripeClient(config.stripe_sk)
    const user = event.context.auth as User
    if (!user) {
        throw createError({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const orgid = getRouterParam(event, 'id')
    if (!orgid) {
        throw createError({
            status: 400,
            message: 'Organization ID is required'
        })
    }
    const org = await getOrganisationById(event, orgid)

    if (!org) {
        throw createError({
            status: 404,
            message: 'Organization not found'
        })
    }

    if (user.id !== org.owner_id) {
        throw createError({
            status: 401,
            message: 'Unauthorized'
        })
    }

    const stripeAccount = await getOrganizationStripeAccount(event, orgid)

    if (!stripeAccount) {
        throw createError({
            status: 404,
            message: 'Organization does not have a stripe account'
        })
    }

    const client = await serverSupabaseClient<Database>(event)

    try {

        const { error } = await client.from('organizations_stripe_accounts').delete().eq('id', orgid)

        console.log('delete account sb')

        if (error) {
            console.error(error)
            throw createError({
                status: 500,
                message: 'Failed to delete account'
            })
        }

        const res = await stripe.accounts.del(stripeAccount.stripe_account_id)

        console.log('delete account stripe', res)
        if (!res.deleted) {
            throw createError({
                status: 500,
                message: 'Failed to delete account'
            })
        }

        return { success: true }

        
    } catch (error) {
        console.error(error)
        throw createError({
            status: 500,
            message: 'Failed to delete account'
        })
    }
    
})