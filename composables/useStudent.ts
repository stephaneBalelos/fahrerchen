import type { Database } from "~/types/app.types"

export async function useCourseStudent(student_id: string) {
    
    const client = useSupabaseClient<Database>()

    try {
        const { data, error } = await client.from('students').select('*').eq('id', student_id).single()
        if (error) {
            throw error
        }
        return data
    } catch (error) {
        console.log('error', error)
        throw error
    }
}