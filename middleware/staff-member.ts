import type { Database } from "~/types/app.types"

export default defineNuxtRouteMiddleware(async (to) => {
    const { $pinia } = useNuxtApp()
    if (!$pinia) {
        abortNavigation("Pinia store is not provided")
        throw new Error('Pinia store is not provided')
    }
    const supabase = useSupabaseClient<Database>()
    const organizationsStore = useUserOrganizationsStore($pinia)

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
        return '/login'
    }

    const { data, error } = await supabase.from('organization_members').select().eq('user_id', user.id).eq('organization_id', to.params.org_id as string).single()

    if (error) {
        console.error(error)
        return '/my'
    }

    if (!data) {
        return '/my'
    }

    if (data.role !== 'student') {
        return 
    }

    return '/students/' + to.params.org_id
})