import type { AppCourseActivitySchedule, AppCourseActivityScheduleRequest, CourseActivityScheduleEdit, CourseActivityScheduleRequestEdit, Database } from "~/types/app.types";

export type CourseActivityScheduleQuery = {
    organization_id?: string;
    activity_ids?: string[];
    statuses?: Database["public"]["Enums"]["schedule_status"][];
    assigned_to_ids: string[];
    start_at?: Date;
    end_at?: Date;
    subscription_ids?: string[];
    limit?: number;
}

export type CourseActivitySchedulesRequestQuery = {
    organization_id: string;
    subscription_ids?: string[];
    activity_ids?: string[];
    status: Database["public"]["Enums"]["schedule_request_statuses"];
}

export const useCourseActivitySchedules = () => {
    const userOrganizationStore = useUserOrganizationsStore()
    const client = useSupabaseClient()

    const fetchCourseActivitySchedulesById = async (id: string) => {

        const { data, error } = await client
            .from("course_activity_schedules")
            .select("*, user:assigned_to(*), course_activity_schedules_attendees(id, subscription_id), activity:activity_id(*)")
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
        if (!query.organization_id) {
            throw new Error("organization_id is required to fetch course activity schedules");
        }

        let q = client
            .from("course_activity_schedules")
            .select("*, user:assigned_to(*), course_activity_schedules_attendees(id, subscription_id), activity:activity_id(*)")

        q = q.eq("organization_id", query.organization_id)

        if (query.activity_ids && query.activity_ids.length > 0) {
            q = q.in("activity_id", query.activity_ids)
        }

        if (query.statuses && query.statuses.length > 0) {
            q = q.in("status", query.statuses)
        }

        if (query.assigned_to_ids && query.assigned_to_ids.length > 0) {
            q = q.in("assigned_to", query.assigned_to_ids)
        }

        if (query.subscription_ids && query.subscription_ids.length > 0) {
            q = q.in("course_activity_schedules_attendees.subscription_id", query.subscription_ids)
        }

        if (query.start_at) {
            q = q.gte("start_at", query.start_at.toISOString())
        }
        if (query.end_at) {
            q = q.lte("start_at", query.end_at.toISOString())
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

    const getCourseActivitySchedulesRequestById = async (id: string) => {
        const { data, error } = await client
            .from("course_activity_schedule_requests")
            .select("*, user:requested_by(*), subscription:subscription_id(*, student:students(*), course:courses(*)), activity:activity_id(*)")
            .eq("id", id)
            .single()

        if (error) {
            throw error
        }
        return data
    }

    const fetchCourseActivitySchedulesRequests = async (query: CourseActivitySchedulesRequestQuery) => {
        let q = client
            .from("course_activity_schedule_requests")
            .select("*, user:requested_by(*), subscription:subscription_id(*, student:students(*), course:courses(*)), activity:activity_id(*)")
            .eq("organization_id", query.organization_id)
            .eq("status", query.status)

        if (query.subscription_ids && query.subscription_ids.length > 0) {
            q = q.in("subscription_id", query.subscription_ids)
        }

        if (query.activity_ids && query.activity_ids.length > 0) {
            q = q.in("activity_id", query.activity_ids)
        }

        const { data, error } = await q

        if (error) {
            throw error
        }
        return data || []
    }

    const createCourseActivityScheduleRequest = async (data: Omit<AppCourseActivityScheduleRequest, 'id' | 'inserted_at' | 'status'>) => {
        const { error } = await client
            .from("course_activity_schedule_requests")
            .insert({
                ...data
            })

        if (error) {
            throw error
        }
    }

    const deleteCourseActivityScheduleRequest = async (id: string) => {
        const { error } = await client
            .from("course_activity_schedule_requests")
            .delete()
            .eq("id", id)

        if (error) {
            throw error
        }

        return true
    }

    const updateCourseActivityScheduleRequest = async (id: string, data: Partial<CourseActivityScheduleRequestEdit>) => {
        const { error } = await client
            .from("course_activity_schedule_requests")
            .update(data)
            .eq("id", id)

        if (error) {
            throw error
        }
    }

    const approveScheduleRequest = async (id: string) => {
        const { data, error } = await client
            .rpc('approve_schedule_request', { request_id: id })

        if (error) {
            throw error
        }
        return data
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
        getCourseActivitySchedulesRequestById,
        fetchScheduleAttendancesForSchedule,
        fetchCourseActivitySchedulesRequests,
        createCourseActivityScheduleRequest,
        deleteCourseActivityScheduleRequest,
        updateCourseActivityScheduleRequest,
        approveScheduleRequest,
    }

}