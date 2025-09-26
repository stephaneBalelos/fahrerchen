import type { AppCourseCost, CourseCostEdit } from "~/types/app.types"

export const useCourseCostsStore = defineStore('courseCosts', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courseCosts = ref<AppCourseCost[]>([])
    const isLoadingCourseCosts = ref(false)

    const loadCourseCosts = async () => {
        isLoadingCourseCosts.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            courseCosts.value = []
            isLoadingCourseCosts.value = false
            return
        }
        const { data, error } = await supabase
            .from('course_costs')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.id)
            .order('inserted_at', { ascending: false })
        if (error) {
            console.error("Error loading course costs:", error)
            courseCosts.value = []
        } else {
            courseCosts.value = data || []
        }
        isLoadingCourseCosts.value = false
    }

    const createCourseCost = async (courseCost: CourseCostEdit): Promise<string | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const { data, error } = await supabase
            .from('course_costs')
            .insert({
                ...courseCost,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })
            .select('id')
            .single()

        if (error) {
            throw error
        }

        await loadCourseCosts()
        return data ? data.id : null
    }

    const deleteCourseCost = async (courseCost_id: string) => {
        const { error } = await supabase
            .from('course_costs')
            .delete()
            .eq('id', courseCost_id)
        if (error) {
            console.error("Error deleting course cost:", error)
            throw error
        }
        await loadCourseCosts()
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourseCosts()
    }, { immediate: true })

    return {
        isLoadingCourseCosts,
        courseCosts,
        loadCourseCosts,
        createCourseCost,
        deleteCourseCost,
    }
})