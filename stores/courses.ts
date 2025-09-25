import type { EditCourseFormProps } from "~/components/forms/EditCourseForm.vue"
import type { AppCourse } from "~/types/app.types"

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

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourses()
    }, { immediate: true })

    return {
        courses,
        loadCourses,
        deleteCourse,
        createCourse
    }
})