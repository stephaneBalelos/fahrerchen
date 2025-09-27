import { getStandardCourseActivitiesTemplate, type StandardCourseActivitiesTemplate } from "~/constants"
import type { AppCourseRequiredDocument, AppCourseRequiredDocumentCombination, CourseRequiredDocumentEdit } from "~/types/app.types"

export const useCourseRequiredDocumentsStore = defineStore('courseRequiredDocuments', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const courseRequiredDocuments = ref<AppCourseRequiredDocument[]>([])
    const isLoadingCourseRequiredDocuments = ref(false)


    const loadCourseRequiredDocuments = async () => {
        isLoadingCourseRequiredDocuments.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            courseRequiredDocuments.value = []
            isLoadingCourseRequiredDocuments.value = false
            return
        }
        const { data, error } = await supabase
            .from('course_required_documents')
            .select('*')
            .eq('organization_id', userOrganizationsStore.selectedOrganization.id)
            .order('inserted_at', { ascending: false })
        if (error) {
            console.error("Error loading course required documents:", error)
            courseRequiredDocuments.value = []
        } else {
            courseRequiredDocuments.value = data || []
        }
        isLoadingCourseRequiredDocuments.value = false
    }

    const createCourseRequiredDocument = async (courseRequiredDocument: CourseRequiredDocumentEdit): Promise<string | null> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return null
        }
        const { data, error } = await supabase
            .from('course_required_documents')
            .insert({
                ...courseRequiredDocument,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })
            .select('id')
            .single()

        if (error) {
            throw error
        }

        await loadCourseRequiredDocuments()
        return data ? data.id : null
    }

    const bulkCreateCourseRequiredDocuments = async (documents: CourseRequiredDocumentEdit[]): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            console.error("No organization selected")
            return
        }
        const documentsToInsert = documents.map(doc => ({
            ...doc,
            organization_id: userOrganizationsStore.selectedOrganization!.id
        }))

        const { error } = await supabase
            .from('course_required_documents')
            .insert(documentsToInsert)

        if (error) {
            throw error
        }

        await loadCourseRequiredDocuments()
    }

    const createCourseRequiredDocumentsFromTemplate = async (): Promise<void> => {
        const template: StandardCourseActivitiesTemplate = getStandardCourseActivitiesTemplate()
        await bulkCreateCourseRequiredDocuments(template.required_documents)
    }

    const getCourseRequiredDocument = async (id: string): Promise<AppCourseRequiredDocument | null> => {
        const { data, error } = await supabase
            .from('course_required_documents')
            .select('*')
            .eq('id', id)
            .single()

        if (error) {
            throw error
        }
        return data
    }

    const updateCourseRequiredDocument = async (id: string, updates: Partial<CourseRequiredDocumentEdit>): Promise<void> => {
        const { error } = await supabase
            .from('course_required_documents')
            .update(updates)
            .eq('id', id)

        if (error) {
            throw error
        }
        await loadCourseRequiredDocuments()
    }

    const deleteCourseRequiredDocument = async (id: string): Promise<void> => {
        const { error } = await supabase
            .from('course_required_documents')
            .delete()
            .eq('id', id)

        if (error) {
            throw error
        }
        await loadCourseRequiredDocuments()
    }

    const getAllowedCourseForRequiredDocument = async (id: string, courseId?: string): Promise<AppCourseRequiredDocumentCombination[]> => {
        let query = supabase
            .from('course_required_documents_combinations')
            .select('*')
            .eq('required_document_id', id)
        if (courseId) {
            query = query.eq('course_id', courseId)
        }
        const { data, error } = await query
        if (error) {
            console.error("Error loading allowed courses for required document:", error)
            throw error
        }
        return data || []
    }

    const addRequiredDocumentToCourse = async (requiredDocumentId: string, courseId: string): Promise<void> => {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error("No organization selected")
        }
        const { error } = await supabase
            .from('course_required_documents_combinations')
            .insert({
                required_document_id: requiredDocumentId,
                course_id: courseId,
                organization_id: userOrganizationsStore.selectedOrganization.id
            })

        if (error) {
            throw error
        }
    }

    const removeRequiredDocumentFromCourse = async (requiredDocumentId: string, courseId: string): Promise<void> => {
        const { error } = await supabase
            .from('course_required_documents_combinations')
            .delete()
            .eq('required_document_id', requiredDocumentId)
            .eq('course_id', courseId)

        if (error) {
            throw error
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        await loadCourseRequiredDocuments()
    }, { immediate: true })

    return {
        courseRequiredDocuments,
        isLoadingCourseRequiredDocuments,
        loadCourseRequiredDocuments,
        createCourseRequiredDocument,
        bulkCreateCourseRequiredDocuments,
        createCourseRequiredDocumentsFromTemplate,
        getCourseRequiredDocument,
        updateCourseRequiredDocument,
        deleteCourseRequiredDocument,
        getAllowedCourseForRequiredDocument,
        addRequiredDocumentToCourse,
        removeRequiredDocumentFromCourse
    }
})