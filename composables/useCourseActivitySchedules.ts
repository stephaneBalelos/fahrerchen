import type { AppOrganizationSchedulesView, Database } from "~/types/app.types";

type CourseActivityScheduleQuery = {
    course_id?: string;
    activity_id?: string;
    status?: Database["public"]["Enums"]["schedule_status"];
    assigned_to?: string;
    student_id?: string;
    start_at?: string;
    end_at?: string;
}

export const useCourseActivitySchedules = () => {

    const userOrganizationStore = useUserOrganizationsStore()
    const client = useSupabaseClient()

    const fetchCourseActivitySchedulesById = async (id: string) => {
        if (!userOrganizationStore.selectedOrganization) {
            return null;
        }

        const { data, error } = await client
            .from("organizations_schedules_view")
            .select("*")
            .eq("schedule_id", id)
            .single()

        if (error) {
            throw error
        }
        return data

    }

    const deleteCourseActivitySchedule = async (id: string) => {
        if (!userOrganizationStore.selectedOrganization) {
            return null;
        }

        const { error } = await client
            .from("course_activity_schedules")
            .delete()
            .eq("id", id)

        if (error) {
            throw error
        }
        
        return true
    }

    const fetchCourseActivitySchedules = async (query: CourseActivityScheduleQuery) => {
        if (!userOrganizationStore.selectedOrganization) {
            return null;
        }

        const q = client
            .from("organizations_schedules_view")
            .select("*")

        q.eq("schedule_organization_id", userOrganizationStore.selectedOrganization.organization_id)

        if (query.course_id) {
            q.eq("course_id", query.course_id)
        }

        if (query.activity_id) {
            q.eq("activity_id", query.activity_id)
        }

        if (query.status) {
            q.eq("schedule_status", query.status)
        }

        if (query.assigned_to) {
            q.eq("schedule_assigned_to", query.assigned_to)
        }

        if (query.student_id) {
            q.contains('schedule_attendees', [query.student_id])
        }

        if (query.start_at) {
            q.gte("schedule_start_at", query.start_at)
        }

        if (query.end_at) {
            q.lte("schedule_start_at", query.end_at)
        }

        const { data, error } = await q.overrideTypes<AppOrganizationSchedulesView[]>()

        if (error) {
            throw error
        }
        return data
    }

    return {
        fetchCourseActivitySchedules,
        fetchCourseActivitySchedulesById,
        deleteCourseActivitySchedule
    }

}