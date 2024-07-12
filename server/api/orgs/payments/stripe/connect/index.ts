import { serverSupabaseClient } from '#supabase/server'


export default defineEventHandler(async (event) => {
    const user = await serverSupabaseClient(event)
})