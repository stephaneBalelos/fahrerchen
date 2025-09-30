import type { AppCourseSubscription, AppStudent, StudentEdit } from "~/types/app.types"

export type StudentWithSubscriptions = AppStudent & {
    subscriptions: AppCourseSubscription[]
    active_subscriptions: AppCourseSubscription[] // Subscriptions that are not archived
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
    const route = useRoute()
    // const selectedStudent = ref<StudentWithSubscriptions | null>(null)
    const selectedStudent = computed(() => {
        const studentId = route.params.student_id as string | undefined
        if (!studentId) return null
        return students.value.find(s => s.id === studentId) || null
    })

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
            console.log("Students loaded:", students.value.length)

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

        if (!data) return []
        
        return data.map((item) => {
            const active_subscriptions = item.subscriptions?.filter((sub) => sub.archived_at === null) ?? [];
             return {
               ...item,
               active_subscriptions: active_subscriptions
             };
        })
    }

    const getStudentById = async (id: string): Promise<StudentWithSubscriptions | null> => {
        const { data, error } = await supabase
            .from('students')
            .select(`*, subscriptions:course_subscriptions(*)`)
            .eq('id', id)
            .single();

        if (error) {
            console.error("Error fetching student by ID:", error);
            return null;
        }
        if (!data) return null;
        const active_subscriptions = data.subscriptions?.filter((sub) => sub.archived_at === null) ?? [];
        return {
            ...data,
            active_subscriptions: active_subscriptions
        };
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

        await loadStudents()

        return data.map(s => s.id)
    }

    const updateStudent = async (id: string, student: Partial<StudentEdit>): Promise<void> => {
        const { error } = await supabase
            .from('students')
            .update(student)
            .eq('id', id)

        if (error) throw error
        await loadStudents()
    }

    watch(() => userOrganizationsStore.selectedOrganization, () => {
        loadStudents()
    }, { immediate: true })


    return {
        students,
        selectedStudent,
        isLoadingStudents,
        loadStudents,
        queryStudents,
        getStudentById,
        createStudents,
        updateStudent,
    }
})