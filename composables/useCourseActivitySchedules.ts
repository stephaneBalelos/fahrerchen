import type { AppCourseActivitySchedule, CourseActivityScheduleEdit, Database } from "~/types/app.types";

export type CourseActivityScheduleQuery = {
    activity_id?: string;
    status?: Database["public"]["Enums"]["schedule_status"];
    assigned_to?: string;
    start_at?: Date;
    subscription_id?: string;
    limit?: number;
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

    const fetchCourseActivitySchedules = async (query: Partial<CourseActivityScheduleQuery>) => {
        if (!userOrganizationStore.selectedOrganization) {
            console.error("No organization selected");
            return null;
        }

        let q = client
            .from("course_activity_schedules")
            .select("*, user:assigned_to(*), course_activity_schedules_attendees(id, subscription_id), activity:activity_id(*)")

        q = q.eq("organization_id", userOrganizationStore.selectedOrganization.id)

        if (query.activity_id) {
            q = q.eq("activity_id", query.activity_id)
        }

        if (query.status) {
            q = q.eq("status", query.status)
        }

        if (query.assigned_to) {
            q = q.eq("assigned_to", query.assigned_to)
        }

        if (query.subscription_id) {
            q = q.eq("course_activity_schedules_attendees.subscription_id", query.subscription_id)
        }

        if (query.start_at) {
            q = q.gte("start_at", query.start_at.toISOString())
        }
        if (query.limit) {
            q = q.limit(query.limit)
        } else {
            q = q.limit(100) // default limit to 100
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

    const removeAttendeeFromSchedule = async (attendee_id: string) => {
        const { error } = await client
            .from("course_activity_schedules_attendees")
            .delete()
            .eq("id", attendee_id)

        if (error) {
            throw error
        }
        return true
    }

    const fetchAttendeesForSchedule = async (schedule_id: string) => {
        if (!userOrganizationStore.selectedOrganization) {
            console.warn("No organization selected");
            return []
        }
        const { data, error } = await client
            .from("course_activity_schedules_attendees")
            .select("*, course_subscriptions:subscription_id(*, student:students(*), course:courses(*))")
            .eq("schedule_id", schedule_id)
            .eq("organization_id", userOrganizationStore.selectedOrganization.id)

        if (error) {
            throw error
        }
        return data || []
    }

    const fetchScheduleAttendancesForSchedule = async (schedule_id: string) => {
        if (!userOrganizationStore.selectedOrganization) {
            console.warn("No organization selected");
            return []
        }
        const { data, error } = await client
            .from("course_activity_schedules_attendances")
            .select("*, subscription:course_subscription_id(*, student:students(*))")
            .eq("course_activity_schedule_id", schedule_id)
            .eq("organization_id", userOrganizationStore.selectedOrganization.id)

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
        removeAttendeeFromSchedule,
        fetchAttendeesForSchedule,
        fetchScheduleAttendancesForSchedule
    }

}