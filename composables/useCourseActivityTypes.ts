import type { Database } from '~/types/app.types'



export async function useCourseActivityTypes() {
    const client = useSupabaseClient<Database>()

    try {
        const { data, error } = await client.from('course_activity_types').select('*')
        if (error) {
            throw error
        }
        return data ?? []
    } catch (error) {
        console.log(error)
        return []
    }
}