import type { AppCourseType, Database } from '~/types/app.types'



export async function useCourseTypes(id: number): Promise<AppCourseType>;
export async function useCourseTypes(): Promise<AppCourseType[]>;

export async function useCourseTypes(id?: number) {
    const client = useSupabaseClient<Database>()

    const res = ref<AppCourseType[]>([])

    try {
        const { data, error } = await client.from('course_types').select('*')
        if (error) {
            throw error
        }
        res.value = data ?? []
    } catch (error) {
        console.log(error)
    }

    if (id) {
        return res.value.find((courseType: AppCourseType) => courseType.id === id)
    }

    return res.value
}