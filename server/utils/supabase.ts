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