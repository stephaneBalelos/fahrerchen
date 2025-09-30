import type { AppCourseSubscription } from "~/types/app.types"

export const useSubscriptionStore = defineStore('subscription', () => {
    const supabase = useSupabaseClient()
    const userOrganizationsStore = useUserOrganizationsStore()
    const subscriptions = ref<AppCourseSubscription[]>([])
    const isLoadingSubscriptions = ref(false)

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
                .eq('id', userOrganizationsStore.selectedOrganization.id)
                .single()

            if (error) {
                throw new Error(`Error loading subscription: ${error.message}`)
            }
            subscriptions.value = [data]
        } catch (error) {
            console.error(error)
        } finally {
            isLoadingSubscriptions.value = false
        }
    }

    const getSubscriptionById = (id: string): AppCourseSubscription | null => {
        return subscriptions.value.find(sub => sub.id === id) || null
    }


    watch(() => userOrganizationsStore.selectedOrganization, () => {
        loadSubscriptions()
    }, { immediate: true })



    return {
        loadSubscriptions,
        subscriptions,
        selectedSubscription,
        isLoadingSubscriptions,
        getSubscriptionById,
    }
})