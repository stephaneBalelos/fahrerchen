import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
    try {
        const user = await serverSupabaseUser(event)
        if (user) {
            event.context.auth = user
        }
    
    } catch (error) {
        console.error(error)
    }

})