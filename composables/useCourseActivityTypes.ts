import type { AppCourseActivityType } from '~/types/app.types'



export async function useCourseActivityTypes() {
    const client = useSupabaseClient()

    try {
        const { data, error } = await client.from('course_activity_types').select('*').overrideTypes<AppCourseActivityType[]>()
        if (error) {
            throw error
        }
        return data ?? []
    } catch (error) {
        console.log(error)
        return []
    }
}