import type { Database } from "~/types/app.types";

type CourseSubscriptionBillQuery = {
    student_id?: string;
    course_id?: string;
    subscription_id?: string;
    paid?: boolean;
    ready_to_pay?: boolean;
}

export const useSubscriptionBills = () => {
    const userOrganizationStore = useUserOrganizationsStore()
    const client = useSupabaseClient<Database>()

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
            .from("course_subscription_bills_view")
            .select("*")

        q.eq("organization_id", userOrganizationStore.selectedOrganization.organization_id)

        if (query.student_id) {
            q.eq("student_id", query.student_id)
        }

        if (query.course_id) {
            q.eq("course_id", query.course_id)
        }

        // if (query.subscription_id) {
        //     q.eq("subscription.id", query.subscription_id)
        // }

        if (query.paid) {
            q.not("paid_at", "is", null)
        }

        if (query.ready_to_pay) {
            q.eq("ready_to_pay", query.ready_to_pay)
        }

        const { data, error } = await q

        if (error) {
            throw error
        }

        console.log(data)
        return data
    }

    return {
        fetchSubscriptionBillById,
        fetchSubscriptionBills
    }
} 