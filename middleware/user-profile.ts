import type { Database } from "~/types/app.types"

export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useSupabaseClient<Database>()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return '/login'
    }

    const { data, error } = await supabase.from('users').select('*').eq('id', user.id).single()

    if (error) {
        console.error(error)
        return '/account?profile=error'
    }

    if (!data) {
        return '/account?profile=error'
    }

    if (data.firstname === null || data.lastname === null) {
        return '/account?redirect=/my'
    }

    return
})