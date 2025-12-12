import { getStandardCourseActivitiesTemplate, type StandardCourseActivitiesTemplate } from "~/constants"
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
            .select('*, course_costs_combinations(*)')
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

    const bulkCreateCourseCosts = async (costs: CourseCostEdit[]): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return
        }
        const costsToInsert = costs.map(cost => ({
            ...cost,
            organization_id: userOrganizationsStore.selectedOrganization!.id
        }))
        const { error } = await supabase
            .from('course_costs')
            .insert(costsToInsert)

        if (error) {
            throw error
        }

        await loadCourseCosts()
    }

    const createCourseCostsFromTemplate = async (): Promise<void> => {
        const template: StandardCourseActivitiesTemplate = getStandardCourseActivitiesTemplate()
        return await bulkCreateCourseCosts(template.costs)
    }

    const getCourseCosts = async (organizationId: string, course_id?: string, search?: string) => {
        let q = supabase
            .from('course_costs')
            .select('*, course_costs_combinations(*)')
            .eq('organization_id', organizationId)

        if (search) {
            q = q.or(`name.ilike.%${search}%,description.ilike.%${search}%`);
        }
        if (course_id) {
            q = q.eq("course_costs_combinations.course_id", course_id);
        }
        q = q.order("name", { ascending: true }).limit(5);
        const { data, error } = await q;
        if (error) {
            throw error
        }
        return data || []
    }

    const getCourseCost = async (id: string): Promise<AppCourseCost | null> => {
        const { data, error } = await supabase
            .from('course_costs')
            .select('*')
            .eq('id', id)
            .single()
        if (error) {
            throw error
        }
        return data
    }

    const updateCourseCost = async (id: string, courseCost: Partial<CourseCostEdit>) => {
        const { error } = await supabase
            .from('course_costs')
            .update(courseCost)
            .eq('id', id)
        if (error) {
            console.error("Error updating course cost:", error)
            throw error
        }
        await loadCourseCosts()
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

    const getAllowedCourseForCost = async (id: string, courseId?: string) => {
        let query = supabase
            .from('course_costs_combinations')
            .select('*, cost:course_costs(*), course:courses(*)')
            .eq('cost_id', id)

        if (courseId) {
            query = query.eq('course_id', courseId)
        }
        const { data, error } = await query
        if (error) {
            console.error("Error loading allowed course for cost:", error)
            throw error
        }
        return data || []
    }

    const getCourseCostsForCourse = async (courseId: string) => {
        const { data, error } = await supabase
            .from('course_costs_combinations')
            .select('*, cost:course_costs(*), course:courses(*)')
            .eq('course_id', courseId)
        if (error) {
            console.error("Error loading costs for course:", error)
            throw error
        }
        return data || []
    }

    const addCostToCourse = async (cost_id: string, course_id: string): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error("No organization selected")
        }
        const { error } = await supabase
            .from('course_costs_combinations')
            .insert({
                cost_id,
                course_id,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })
        if (error) {
            console.error("Error adding cost to course:", error)
            throw error
        }
    }

    const removeCostFromCourse = async (cost_id: string, course_id: string): Promise<void> => {
        const { error } = await supabase
            .from('course_costs_combinations')
            .delete()
            .eq('cost_id', cost_id)
            .eq('course_id', course_id)
        if (error) {
            console.error("Error removing cost from course:", error)
            throw error
        }
    }

    const removeCourseCostCombination = async (combination_id: string) => {
        const { error } = await supabase
            .from('course_costs_combinations')
            .delete()
            .eq('id', combination_id)

        if (error) {
            throw error
        }
    }

    const updateCourseCostCombination = async (combination_id: string, data: Partial<CourseCostEdit>) => {
        const { error } = await supabase
            .from('course_costs_combinations')
            .update(data)
            .eq('id', combination_id)

        if (error) {
            throw error
        }
    }

    const getActiveCoursesWithCostCombinations = async (organization_id: string, cost_id: string) => {
        const { data, error } = await supabase
            .from('courses')
            .select('*, course_costs_combinations(*)')
            .eq('is_active', true)
            .eq('organization_id', organization_id)
            .eq('course_costs_combinations.cost_id', cost_id)
        if (error) {
            throw error
        }
        return data || []
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourseCosts()
    }, { immediate: true })

    return {
        isLoadingCourseCosts,
        courseCosts,
        loadCourseCosts,
        createCourseCost,
        updateCourseCost,
        createCourseCostsFromTemplate,
        getCourseCosts,
        getCourseCost,
        deleteCourseCost,
        getAllowedCourseForCost,
        getCourseCostsForCourse,
        addCostToCourse,
        removeCostFromCourse,
        removeCourseCostCombination,
        updateCourseCostCombination,
        getActiveCoursesWithCostCombinations
    }
})