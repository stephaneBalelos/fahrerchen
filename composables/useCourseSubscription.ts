import type { Database } from "~/types/app.types"

export async function useCourseSubscription(subscription_id: string) {
    
    const client = useSupabaseClient<Database>()

    const { data, error, status } = useAsyncData(`course_subscriptions_${subscription_id}`, async () => {
        const { data, error } = await client.from('course_subscriptions').select('*').eq('id', subscription_id).single()
        if (error) {
            console.log('error', error)
            throw error
        }
        return data
    })
    if (error) {
        throw error
    }
    return { data, error, status }
}