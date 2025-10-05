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
        getSubscriptionsForStudent
    }
})