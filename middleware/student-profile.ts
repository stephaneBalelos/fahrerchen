import type { Database } from "~/types/app.types"

export default defineNuxtRouteMiddleware(async (to) => {
    const supabase = useSupabaseClient<Database>()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return '/login'
    }

    if (!to.params.org_id) {
        return '/my'
    }

    const org_id = to.params.org_id as string

    const membership = await supabase.from('organization_members').select().eq('user_id', user.id).eq('organization_id', org_id as string).single()

    if (membership.error) {
        console.error(membership.error)
        return '/my'
    }

    if (!membership.data) {
        return '/my'
    }

    if (membership.data.role === 'student') {
        // Student profile
        const student = await supabase.from('students').select('*').eq('user_id', user.id).eq('organization_id', org_id).limit(1)
        if (student.error) {
            console.error(student.error)
            return '/my'
        }

        if ((student.data.length == 0)) {
            return `/onboarding/${org_id}`
        }

        return
    }

    return
})