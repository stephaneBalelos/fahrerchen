import type { AppCourse } from "~/types/app.types"

export const useCourseStore = defineStore('course', () => {
    const supabase = useSupabaseClient()
    const course = ref<AppCourse | null>(null)

    const loadCourse = async (courseId: string) => {
        const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single()
        if (error) {
            throw new Error(`Error loading course: ${error.message}`)
        }
        course.value = data
    }

    return {
        course,
        loadCourse
    }
})