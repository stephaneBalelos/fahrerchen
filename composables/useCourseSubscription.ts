import type { AppCourseSubscription, Database } from "~/types/app.types"


export async function useCourseSubscription(subscription_id?: string) {
    if (!subscription_id) {
        return null
    }
    
    const client = useSupabaseClient<Database>()

    const { data, error } = await client.from('course_subscriptions').select('*, student:students(*), course:courses(*)')
    .eq('id', subscription_id).single()
    if (error) {
        console.log('error', error)
        throw error
    }
    return data
}