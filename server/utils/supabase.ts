import { serverSupabaseClient } from '#supabase/server'
import type { AppOrganization, Database } from "~/types/app.types";
import type { H3Event } from 'h3';

export const getOrganisationById = async (event: H3Event, id: string): Promise<AppOrganization | null> => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('organizations').select().eq('id', id).single()
    if (error) {
        console.error(error)
        return null
    }
    return data
}

export const getOrganizationStripeAccount = async (event: H3Event, orgid: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from("organizations_stripe_accounts").select().eq('id', orgid).single()
    if (error) {
        console.error(error)
        return null
    }
    return data
}

export const getBillById = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('course_subscription_bills').select().eq('id', id).single()
    if (error) {
        console.error(error)
        return null
    }
    return data
}