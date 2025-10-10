import type { AppCourseDocument } from "~/types/app.types"

export const useCourseDocumentsStore = defineStore('courseDocuments', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courseDocuments = ref<AppCourseDocument[]>([])
    const isLoadingCourseDocuments = ref(false)


    const loadCourseDocuments = async () => {
        isLoadingCourseDocuments.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            courseDocuments.value = []
            isLoadingCourseDocuments.value = false
            return
        }
        const { data, error } = await supabase
            .from('course_documents')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.id)
            .order('inserted_at', { ascending: false })
        if (error) {
            console.error("Error loading course documents:", error)
            courseDocuments.value = []
        } else {
            courseDocuments.value = data || []
        }
        isLoadingCourseDocuments.value = false
    }


    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourseDocuments()
    })

    return {
        courseDocuments,
        isLoadingCourseDocuments,
        loadCourseDocuments,
    }
})