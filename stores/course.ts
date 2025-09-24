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
        if (error) {
            console.error("Error loading courses:", error)
            courses.value = []
        } else {
            courses.value = data || []
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourses()
    }, { immediate: true })

    return {
        courses,
        loadCourses
    }
})