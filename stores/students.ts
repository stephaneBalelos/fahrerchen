import type { AppCourseSubscription, AppStudent, StudentEdit } from "~/types/app.types"

export type StudentWithSubscriptions = AppStudent & {
    subscriptions: AppCourseSubscription[]
}

export type StudentQueryFilter = {
    search?: string
    subscriptions_course_id?: string
    org_id?: string
}

export const useStudentsStore = defineStore('students', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const students = ref<StudentWithSubscriptions[]>([])
    const isLoadingStudents = ref(false)

    const loadStudents = async () => {
        isLoadingStudents.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            students.value = []
            isLoadingStudents.value = false
            return
        }

        try {
            const data = await queryStudents({
                org_id: userOrganizationsStore.selectedOrganization.id
            })
            students.value = data || []
        } catch (error) {
            console.error("Error loading students:", error)
            students.value = []
        } finally {
            isLoadingStudents.value = false
        }
    }
    const queryStudents = async (q: StudentQueryFilter): Promise<StudentWithSubscriptions[]> => {
        let query = supabase
            .from('students')
            .select(`*, subscriptions:course_subscriptions(*)`)

        if (q.org_id) {
            query = query.eq('organization_id', q.org_id)
        }

        if (q.search) {
            query = query.or(`email.ilike.%${q.search}%,firstname.ilike.%${q.search}%,lastname.ilike.%${q.search}%`)
        }
        if (q.subscriptions_course_id) {
            query = query.contains('subscriptions', { course_id: q.subscriptions_course_id })
        }

        const { data, error } = await query

        if (error) throw error

        return data || []
    }

    const createStudents = async (newStudents: StudentEdit[]): Promise<string[]> => {
        if (!userOrganizationsStore.selectedOrganization) {
            throw new Error("No organization selected")
        }
        const { data, error } = await supabase
            .from('students')
            .insert(newStudents.map(s => ({
                ...s,
                organization_id: userOrganizationsStore.selectedOrganization!.id
            })))
            .select('id')

        if (error) throw error

        return data.map(s => s.id)
    }

    return {
        students,
        isLoadingStudents,
        loadStudents,
        queryStudents,
        createStudents
    }
})