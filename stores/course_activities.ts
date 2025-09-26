import type { AppCourseActivity, CourseActivityEdit } from "~/types/app.types"

export const useCourseActivitiesStore = defineStore('courseActivities', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courseActivities = ref<AppCourseActivity[]>([])
    const isLoadingCourseActivities = ref(false)

    const loadCourseActivities = async () => {
        isLoadingCourseActivities.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            courseActivities.value = []
            isLoadingCourseActivities.value = false
            return
        }
        const { data, error } = await supabase
            .from('course_activities')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.id)
            .order('inserted_at', { ascending: false })
        if (error) {
            console.error("Error loading course activities:", error)
            courseActivities.value = []
        } else {
            courseActivities.value = data || []
        }
        isLoadingCourseActivities.value = false
    }

    const createCourseActivity = async (courseActivity: CourseActivityEdit): Promise<string |   null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const { data, error } = await supabase
            .from('course_activities')
            .insert({
                ...courseActivity,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })
            .select('id')
            .single()

        if (error) {
            throw error
        }

        await loadCourseActivities()
        return data ? data.id : null
    }

    const deleteCourseActivity = async (courseActivity_id: string) => {
        const { error } = await supabase
            .from('course_activities')
            .delete()
            .eq('id', courseActivity_id)
        if (error) {
            console.error("Error deleting course activity:", error)
            throw error
        }
        await loadCourseActivities()
    }

    return {
        courseActivities,
        isLoadingCourseActivities,
        loadCourseActivities,
        createCourseActivity,
        deleteCourseActivity
    }
})