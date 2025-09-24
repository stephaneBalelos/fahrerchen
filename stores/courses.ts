import type { AppCourse } from "~/types/app.types"

export const useCoursesStore = defineStore('course', () => {
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

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourses()
    }, { immediate: true })

    return {
        courses,
        loadCourses,
        deleteCourse
    }
})