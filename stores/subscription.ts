import { format } from "date-fns"
import type { AppCourseSubscription } from "~/types/app.types"

export const useSubscriptionStore = defineStore('subscription', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const subscriptions = ref<AppCourseSubscription[]>([])

    const isLoadingSubscriptions = ref(false)

    const activeSubscriptions = computed(() => subscriptions.value.filter(s => s.archived_at === null))

    const selectedSubscription = computed(() => {
        const route = useRoute()
        const subscriptionId = route.params.subscription_id as string | undefined
        if (!subscriptionId) return null
        return subscriptions.value.find(s => s.id === subscriptionId) || null
    })

    const loadSubscriptions = async () => {
        isLoadingSubscriptions.value = true
        if (!userOrganizationsStore.selectedOrganization) {
            subscriptions.value = []
            isLoadingSubscriptions.value = false
            return
        }
        try {
            const { data, error } = await supabase
                .from('course_subscriptions')
                .select('*')
                .eq('organization_id', userOrganizationsStore.selectedOrganization.id)

            if (error) {
                throw new Error(`Error loading subscription: ${error.message}`)
            }
            subscriptions.value = data
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingSubscriptions.value = false
        }
    }

    const getSubscriptionById = (id: string): AppCourseSubscription | null => {
        return subscriptions.value.find(sub => sub.id === id) || null
    }

    const getSubscriptionsForStudent = async (org_id: string, student_id: string): Promise<AppCourseSubscription[]> => {
        try {
            const { data, error } = await supabase
                .from('course_subscriptions')
                .select('*')
                .eq('student_id', student_id)
                .eq('organization_id', org_id);
            if (error) {
                throw new Error(`Error loading subscriptions for student ${student_id}: ${error.message}`);
            }
            return data;
        } catch (error) {
            console.error(error);
            return [];
        }
    }

    async function generateCertificate(subscriptionId: string, filename?: string) {

        try {
            const res = await $fetch<Blob>(
                `/api/orgs/subscriptions/${subscriptionId}/generate-certificate`,
                {
                    method: "GET",
                }
            );
            const date = format(new Date(), "yyyy-MM-dd");

            const blob = new Blob([res], { type: "application/pdf" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = filename || `ausbildungsnachweis-b-${subscriptionId}-${date}.pdf`;
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
        } catch (error) {
            console.error(error);
            throw new Error('Failed to generate certificate');
        }
    }

    watch(() => userOrganizationsStore.selectedOrganization, () => {
        loadSubscriptions()
    }, { immediate: true })



    return {
        loadSubscriptions,
        subscriptions,
        activeSubscriptions,
        selectedSubscription,
        isLoadingSubscriptions,
        getSubscriptionById,
        getSubscriptionsForStudent,
        generateCertificate
    }
})