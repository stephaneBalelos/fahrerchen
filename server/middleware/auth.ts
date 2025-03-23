import { serverSupabaseUser } from '#supabase/server'


export default defineEventHandler(async (event) => {
    try {
        const user = await serverSupabaseUser(event)
        if (user) {
            event.context.auth = user
        }
    
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
        event.context.auth = null
    }

})