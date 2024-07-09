import type { AppCourseActivity, Database } from "~/types/app.types";

export function useCourseActivities(courseId: string) {
    const client = useSupabaseClient<Database>()


    const course_id = ref<string>(courseId)
    const course_activities = ref<AppCourseActivity[]>([])

    watch(course_id, async (newCourseId) => {
        if(!newCourseId) {
            course_activities.value = []
        }
        const { data, error } = await client.from('course_activities').select("*").eq('course_id', newCourseId)
        if(error) {
            console.error(error)
            course_activities.value = []
        }
        course_activities.value = data ?? []
    }, { immediate: true })

    return { course_id, course_activities }
}