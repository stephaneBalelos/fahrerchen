import type { AppCourse, Database } from "~/types/app.types"

export async function useCourses(orgid: string, id: string): Promise<AppCourse>;
export async function useCourses(orgid: string): Promise<AppCourse[]>;

export async function useCourses(orgid: string, id?: string) {
    const client = useSupabaseClient<Database>()

    const res = ref<AppCourse[]>([])

    try {
        const { data, error } = await client.from('courses').select('*').eq('organization_id', orgid)
        if (error) {
            throw error
        }
        res.value = data ?? []
    } catch (error) {
        console.log(error)
    }

    if (id) {
        return res.value.find((course: AppCourse) => course.id === id)
    }

    return res.value
}