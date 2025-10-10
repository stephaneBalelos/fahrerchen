import type { AppCourse } from "~/types/app.types"

export const useCoursesStore = defineStore('courses', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courses = ref<AppCourse[]>([])
    const activeCourses = computed(() => courses.value.filter(c => c.is_active))
    const isLoadingCourses = ref(false)

    const loadCourses = async () => {
        isLoadingCourses.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            courses.value = []
            isLoadingCourses.value = false
            return
        }
        const { data, error } = await supabase
            .from('courses')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.id)
            .order('type', { ascending: true })
        if (error) {
            console.error("Error loading courses:", error)
            courses.value = []
        } else {
            courses.value = data || []
        }
        isLoadingCourses.value = false
    }

    const setCourseActiveStatus = async (courseId: string, isActive: boolean): Promise<void> => {
        const { error } = await supabase
            .from('courses')
            .update({ is_active: isActive })
            .eq('id', courseId)

        if (error) {
            throw error
        }
        await loadCourses()
    }





    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourses()
    }, { immediate: true })

    return {
        isLoadingCourses,
        courses,
        activeCourses,
        loadCourses,
        setCourseActiveStatus
    }
})