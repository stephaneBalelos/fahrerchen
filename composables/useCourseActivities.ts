import type { AppCourseActivity, Database } from "~/types/app.types";

export async function useCourseActivities(orgid: string, courseid: string, id: string): Promise<AppCourseActivity>;
export async function useCourseActivities(orgid: string, courseid: string): Promise<AppCourseActivity[]>;

export async function useCourseActivities(orgid: string, courseid: string, id?: string,) {
    const client = useSupabaseClient<Database>()
    const userOrganizationsStore = useUserOrganizationsStore()

    const res = ref<AppCourseActivity[]>([])

    try {
        const { data, error } = await client.from('course_activities').select('*').eq('organization_id', orgid).eq('course_id', courseid)
        if (error) {
            throw error
        }
        res.value = data ?? []
    } catch (error) {
        console.log(error)
    }

    if (id) {
        return res.value.find((course: AppCourseActivity) => course.id === id)
    }

    return res.value
}