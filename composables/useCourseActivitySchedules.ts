import type { AppCourseActivitySchedule, CourseActivityScheduleEdit, Database } from "~/types/app.types";

type CourseActivityScheduleQuery = {
    activity_id?: string;
    status?: Database["public"]["Enums"]["schedule_status"];
    assigned_to?: string;
    start_at?: string;
    subscription_id?: string;
}

export const useCourseActivitySchedules = () => {
    const userOrganizationStore = useUserOrganizationsStore()
    const client = useSupabaseClient()

    const fetchCourseActivitySchedulesById = async (id: string) => {

        const { data, error } = await client
            .from("course_activity_schedules")
            .select("*")
            .eq("id", id)
            .single()

        if (error) {
            throw error
        }
        return data

    }

    const createCourseActivitySchedule = async (courseActivitySchedule: CourseActivityScheduleEdit): Promise<AppCourseActivitySchedule | null> => {
        if (!userOrganizationStore.selectedOrganization) {
            throw new Error("No organization selected");
        }

        const { data, error } = await client
            .from("course_activity_schedules")
            .insert({
                ...courseActivitySchedule,
                organization_id: userOrganizationStore.selectedOrganization.id
            })
            .select()
            .single()

        if (error) {
            throw error
        }
        return data
    }

    const updateCourseActivitySchedule = async (id: string, courseActivitySchedule: Partial<CourseActivityScheduleEdit>): Promise<AppCourseActivitySchedule | null> => {

        const { data, error } = await client
            .from("course_activity_schedules")
            .update({
                ...courseActivitySchedule,
            })
            .eq("id", id)
            .select()
            .single()

        if (error) {
            throw error
        }
        return data
    }

    const deleteCourseActivitySchedule = async (id: string) => {

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
            console.error("No organization selected");
            return null;
        }

        const q = client
            .from("course_activity_schedules")
            .select("*, course_activity_schedules_attendees(id, subscription_id)")

        q.eq("organization_id", userOrganizationStore.selectedOrganization.id)

        if (query.activity_id) {
            q.eq("activity_id", query.activity_id)
        }

        if (query.status) {
            q.eq("status", query.status)
        }

        if (query.assigned_to) {
            q.eq("assigned_to", query.assigned_to)
        }

        if (query.start_at) {
            q.gte("start_at", query.start_at)
        }

        const { data, error } = await q

        if (error) {
            throw error
        }

        if (query.subscription_id) {
            // filter the schedules that have the subscription_id in their attendees
            return data?.filter(schedule => {
                const attendees = schedule.course_activity_schedules_attendees || []
                return attendees.some(attendee => attendee.subscription_id === query.subscription_id)
            }) || []
        }

        return data || []
    }

    const addAttendeesToSchedule = async (schedule_id: string, subscription_id: string[]) => {
        if (!userOrganizationStore.selectedOrganization) {
            throw new Error("No organization selected");
        }
        const attendees = subscription_id.map(id => {
            return {
                schedule_id,
                subscription_id: id,
                organization_id: userOrganizationStore.selectedOrganization!.id
            }
        })
        const { data, error } = await client
            .from("course_activity_schedules_attendees")
            .insert(attendees)
            .select()

        if (error) {
            throw error
        }
        return data || []
    }

    return {
        fetchCourseActivitySchedules,
        fetchCourseActivitySchedulesById,
        createCourseActivitySchedule,
        updateCourseActivitySchedule,
        deleteCourseActivitySchedule,
        addAttendeesToSchedule,
    }

}