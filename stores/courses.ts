import type { CourseActivityEdit } from "~/components/forms/EditCourseActivityForm.vue"
import type { CourseCostEdit } from "~/components/forms/EditCourseCostForm.vue"
import type { EditCourseFormProps } from "~/components/forms/EditCourseForm.vue"
import type { CourseRequirementEdit } from "~/components/forms/EditCourseRequirementFrom.vue"
import type { AppCourseActivity, AppCourseCost, AppCourse, AppCourseRequiredDocument } from "~/types/app.types"

export const useCoursesStore = defineStore('courses', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courses = ref<AppCourse[]>([])

    const loadCourses = async () => {
        if (!userOrganizationsStore.selectedOrganization) {
            courses.value = []
            return
        }
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.organization_id)
            .order('inserted_at', { ascending: false })
        if (error) {
            console.error("Error loading courses:", error)
            courses.value = []
        } else {
            courses.value = data || []
        }
    }
    const createCourse = async (course: EditCourseFormProps): Promise<string | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const { data, error } = await supabase
            .from('courses')
            .insert({
                ...course,
                organization_id: userOrganizationsStore.selectedOrganization.organization_id
            })
            .select('id')
            .single()

        if (error) {
            throw error
        }

        await loadCourses()
        return data ? data.id : null
    }
    const deleteCourse = async (course_id: string) => {
        const { error } = await supabase
            .from('courses')
            .delete()
            .eq('id', course_id)
        if (error) {
            console.error("Error deleting course:", error)
            throw error
        }
        await loadCourses()
    }


    const getCourseCosts = async (course_id: string): Promise<AppCourseCost[]> => {
        const { data, error } = await supabase
            .from('course_costs')
            .select('*')
            .eq('course_id', course_id)
        if (error) {
            console.error("Error loading course costs:", error)
            return []
        }
        return data || []
    }

    const getCourseActivities = async (course_id: string): Promise<AppCourseActivity[]> => {
        const { data, error } = await supabase
            .from('course_activities')
            .select('*')
            .eq('course_id', course_id)
            .order('sorting_order', { ascending: true })
        if (error) {
            console.error("Error loading course activities:", error)
            return []
        }
        return data || []
    }

    const getCourseRequiredDocuments = async (course_id: string): Promise<AppCourseRequiredDocument[]> => {
        const { data, error } = await supabase
            .from('course_required_documents')
            .select('*')
            .eq('course_id', course_id)
        if (error) {
            console.error("Error loading course required documents:", error)
            return []
        }
        return data || []
    }

    const createCourseCost = async (course_id: string, costs: CourseCostEdit[]): Promise<string[] | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const organization_id = userOrganizationsStore.selectedOrganization.organization_id
        const { data, error } = await supabase
            .from('course_costs')
            .insert(costs.map(cost => ({
                ...cost,
                course_id,
                organization_id: organization_id
            })))
            .select('id')

        if (error) {
            console.error("Error creating course cost:", error)
            return null
        }

        return data.map(d => d.id) || null
    }

    const deleteCourseCost = async (cost_id: string) => {
        const { error } = await supabase
            .from('course_costs')
            .delete()
            .eq('id', cost_id)
        if (error) {
            console.error("Error deleting course cost:", error)
            throw error
        }
    }

    const createCourseActivity = async (course_id: string, activities: CourseActivityEdit[]): Promise<string[] | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const organization_id = userOrganizationsStore.selectedOrganization.organization_id
        const { data, error } = await supabase
            .from('course_activities')
            .insert(activities.map((activity, index) => ({
                ...activity,
                course_id,
                organization_id: organization_id,
                sorting_order: index + 1 // Simple sorting order based on insertion order
            })))
            .select('id')

        if (error) {
            console.error("Error creating course activity:", error)
            return null
        }

        return data.map(d => d.id) || null
    }

    const deleteCourseActivity = async (activity_id: string) => {
        const { error } = await supabase
            .from('course_activities')
            .delete()
            .eq('id', activity_id)
        if (error) {
            console.error("Error deleting course activity:", error)
            throw error
        }
    }

    const createCourseRequiredDocument = async (course_id: string, documents: CourseRequirementEdit[]): Promise<string[] | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const organization_id = userOrganizationsStore.selectedOrganization.organization_id
        const { data, error } = await supabase
            .from('course_required_documents')
            .insert(documents.map((document) => ({
                ...document,
                course_id,
                organization_id: organization_id,
            })))
            .select('id')

        if (error) {
            console.error("Error creating course required document:", error)
            return null
        }

        return data ? data.map(d => d.id) : null
    }
    const deleteCourseRequiredDocument = async (document_id: string) => {
        const { error } = await supabase
            .from('course_required_documents')
            .delete()
            .eq('id', document_id)
        if (error) {
            console.error("Error deleting course required document:", error)
            throw error
        }
    }


    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourses()
    }, { immediate: true })

    return {
        courses,
        loadCourses,
        createCourse,
        deleteCourse,
        getCourseCosts,
        createCourseCost,
        deleteCourseCost,
        getCourseActivities,
        createCourseActivity,
        deleteCourseActivity,
        getCourseRequiredDocuments,
        createCourseRequiredDocument,
        deleteCourseRequiredDocument
    }
})