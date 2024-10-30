import type { AppCourse, Database } from "~/types/app.types"

export async function useCourses(id: string): Promise<AppCourse>;
export async function useCourses(): Promise<AppCourse[]>;

export async function useCourses(id?: string) {
    const client = useSupabaseClient<Database>()
    const { selected_organization_id } = useUserOrganizations()

    const res = ref<AppCourse[]>([])

    try {
        const { data, error } = await client.from('courses').select('*').eq('organization_id', selected_organization_id.value)
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