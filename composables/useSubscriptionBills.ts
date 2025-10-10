
type CourseSubscriptionBillQuery = {
    student_id?: string;
    course_id?: string;
    subscription_id?: string;
    paid?: boolean;
    ready_to_pay?: boolean;
    organization_id: string;
}

export const useSubscriptionBills = () => {
    const userOrganizationStore = useUserOrganizationsStore()
    const client = useSupabaseClient()

    const fetchSubscriptionBillById = async (id: string) => {
        if (!userOrganizationStore.selectedOrganization) {
            return null;
        }

        const { data, error } = await client
            .from("course_subscription_bills")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            throw error
        }
        return data

    }

    const fetchSubscriptionBills = async (query: CourseSubscriptionBillQuery) => {
        if (!userOrganizationStore.selectedOrganization) {
            return null;
        }

        const q = client
            .from("course_subscription_bills")
            .select("*, cs:course_subscriptions!inner(*, student:students!inner(*), course:courses!inner(*))")

        q.eq("organization_id", query.organization_id)

        if (query.student_id) {
            q.eq("cs.student.id", query.student_id)
        }

        if (query.course_id) {
            q.eq("cs.course.id", query.course_id)
        }

        if (query.paid) {
            q.not("paid_at", "is", null)
        }

        if (query.ready_to_pay) {
            q.eq("ready_to_pay", query.ready_to_pay)
        }

        const { data, error } = await q.order('created_at', { ascending: false })

        if (error) {
            throw error
        }

        console.log("Fetched bills: ", data)

        return data ?? []
    }

    return {
        fetchSubscriptionBillById,
        fetchSubscriptionBills
    }
} 