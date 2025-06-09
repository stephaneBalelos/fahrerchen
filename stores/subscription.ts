import type { AppCourseSubscriptionsView } from "~/types/app.types"

export const useSubscriptionStore = defineStore('subscription', () => {
    const supabase = useSupabaseClient()
    const subscription = ref<AppCourseSubscriptionsView | null>(null)

    const loadSubscription = async (subId: string) => {
        const { data, error } = await supabase
            .from('course_subscriptions_view')
            .select('*')
            .eq('id', subId)
            .single().overrideTypes<AppCourseSubscriptionsView>()

        if (error) {
            throw new Error(`Error loading subscription: ${error.message}`)
        }
        subscription.value = data
    }

    const reset = () => {
        subscription.value = null
    }

    return {
        subscription,
        loadSubscription,
        reset
    }
})