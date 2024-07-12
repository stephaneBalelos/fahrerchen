import { serverSupabaseUser } from '#supabase/server'
import type { Database } from '~/types/app.types'


export default defineEventHandler(async (event) => {
    const user = await serverSupabaseUser(event)

    if (user) {
        event.context.auth = user
    } else {
        throw createError({
            statusCode: 400,
            statusMessage: 'Should be authenticated',
          })
    }

})