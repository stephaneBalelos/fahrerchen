import { getStandardCourseActivitiesTemplate, type StandardCourseActivitiesTemplate } from "~/constants"
import type { AppCourseActivitiesCombination, AppCourseActivity, CourseActivityEdit } from "~/types/app.types"

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

    const bulkCreateCourseActivities = async (activities: CourseActivityEdit[]): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return
        }
        const activitiesToInsert = activities.map(activity => ({
            ...activity,
            organization_id: userOrganizationsStore.selectedOrganization!.id
        }))
        const { error } = await supabase
            .from('course_activities')
            .insert(activitiesToInsert)

        if (error) {
            throw error
        }

        await loadCourseActivities()
    }

    const createActivitiesFromTemplate = async () => {
        const template: StandardCourseActivitiesTemplate = getStandardCourseActivitiesTemplate()
        await bulkCreateCourseActivities(template.activities)
    }

    const getCourseActivity = async (courseActivity_id: string): Promise<AppCourseActivity | null> => {
        const { data, error } = await supabase
            .from('course_activities')
            .select('*')
            .eq('id', courseActivity_id)
            .single()

        if (error) {
            console.error("Error loading course activity:", error)
            throw error
        }

        return data
    }

    const updateCourseActivity = async (courseActivity_id: string, courseActivity: Partial<CourseActivityEdit>) => {
        const { error } = await supabase
            .from('course_activities')
            .update(courseActivity)
            .eq('id', courseActivity_id)
        if (error) {
            console.error("Error updating course activity:", error)
            throw error
        }
        await loadCourseActivities()
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

    const getAllowedCourseForActivity = async (id: string, course_id?: string): Promise<AppCourseActivitiesCombination[]> => {
       let query =  supabase
            .from('course_activities_combinations')
            .select('*')
            .eq('activity_id', id)

        if (course_id) {
            query = query.eq('course_id', course_id)
        }

        const { data, error } = await query

        if (error) {
            throw error
        }
        return data || []
    }

    const addCourseToAllowedCourses = async (activity_id: string, course_id: string): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error("No organization selected")
        }
        const { error } = await supabase
            .from('course_activities_combinations')
            .insert({
                activity_id,
                course_id,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })

        if (error) {
            throw error
        }
    }

    const removeCourseFromAllowedCourses = async (activity_id: string, course_id: string): Promise<void> => {
        const { error } = await supabase
            .from('course_activities_combinations')
            .delete()
            .eq('activity_id', activity_id)
            .eq('course_id', course_id)

        if (error) {
            throw error
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourseActivities()
    }, { immediate: true })

    return {
        courseActivities,
        isLoadingCourseActivities,
        loadCourseActivities,
        createCourseActivity,
        getCourseActivity,
        updateCourseActivity,
        deleteCourseActivity,
        createActivitiesFromTemplate,
        getAllowedCourseForActivity,
        addCourseToAllowedCourses,
        removeCourseFromAllowedCourses,
    }
})