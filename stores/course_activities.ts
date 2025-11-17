import { getStandardCourseActivitiesTemplate, type StandardCourseActivitiesTemplate } from "~/constants"
import type { AppCourseActivity, CourseActivitiesCombinationEdit, CourseActivityEdit } from "~/types/app.types"

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
            .order('name', { ascending: true })
        if (error) {
            console.error("Error loading course activities:", error)
            courseActivities.value = []
        } else {
            courseActivities.value = data || []
        }
        isLoadingCourseActivities.value = false
    }

    const createCourseActivity = async (courseActivity: CourseActivityEdit): Promise<string | null> => {
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

    const getAllowedCourseForActivity = async (id: string, course_id?: string) => {
        let query = supabase
            .from('course_activities_combinations')
            .select('*, activity:course_activities(*)')
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

    const getCourseActivities = async (org_id: string, course_id?: string, search?: string): Promise<AppCourseActivity[]> => {
        let q = supabase
            .from("course_activities")
            .select("*, course_activities_combinations!inner(*)")
            .eq("organization_id", org_id);

        if (search && search.length < 3) {
            q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        if (course_id) {
            q = q.eq("course_activities_combinations.course_id", course_id);
        }
        q = q.order("name", { ascending: true }).limit(5);

        const { data, error } = await q;
        if (error) {
            throw error
        }
        return data || []
    }

    const getActivitiesForCourse = async (course_id: string): Promise<AppCourseActivity[]> => {
        const { data, error } = await supabase
            .from('course_activities_combinations')
            .select('*, activity:course_activities(*)')
            .eq('course_id', course_id)

        if (error) {
            throw error
        }
        return data.map(d => d.activity)
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

    const updateCourseActivityCombination = async (combination_id: string, data: Partial<CourseActivitiesCombinationEdit>) => {
        const { error } = await supabase
            .from('course_activities_combinations')
            .update(data)
            .eq('id', combination_id)

        if (error) {
            throw error
        }
    }

    const getRecurrenceRulesForActivity = async (activity_id: string) => {
        const { data, error } = await supabase
            .from('activity_recurrence_rules')
            .select('*')
            .eq('activity_id', activity_id)

        if (error) {
            throw error
        }
        return data || []
    }

    const getRecurrenceRuleById = async (recurrence_rule_id: string) => {
        const { data, error } = await supabase
            .from('activity_recurrence_rules')
            .select('*, activity:course_activities(*)')
            .eq('id', recurrence_rule_id)
            .single()

        if (error) {
            throw error
        }
        return data || null
    }

    const createRecurrenceRule = async (organization_id: string, activity_id: string, rrule: string) => {
        const { data, error } = await supabase
            .from('activity_recurrence_rules')
            .insert({
                organization_id,
                activity_id,
                rrule
            })
            .select('*')
            .single()

        if (error) {
            throw error
        }
        return data
    }

    const updateRecurrenceRule = async (recurrence_rule_id: string, rrule: string) => {
        const { data, error } = await supabase
            .from('activity_recurrence_rules')
            .update({ rrule })
            .eq('id', recurrence_rule_id)
            .select('*')
            .single()

        if (error) {
            throw error
        }
        return data || null
    }

    const deleteRecurrenceRule = async (recurrence_rule_id: string) => {
        const { error } = await supabase
            .from('activity_recurrence_rules')
            .delete()
            .eq('id', recurrence_rule_id)

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
        getCourseActivities,
        updateCourseActivity,
        deleteCourseActivity,
        createActivitiesFromTemplate,
        getAllowedCourseForActivity,
        getActivitiesForCourse,
        addCourseToAllowedCourses,
        removeCourseFromAllowedCourses,
        updateCourseActivityCombination,
        getRecurrenceRulesForActivity,
        getRecurrenceRuleById,
        createRecurrenceRule,
        updateRecurrenceRule,
        deleteRecurrenceRule
    }
})