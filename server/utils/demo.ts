import { addDays, addHours } from "date-fns"
import { randomNumber } from "./utilities"
import type { AppCourseActivitySchedule, Database } from "~/types/app.types"
import { SCHEDULES_STATUS } from "~/constants"
import type { H3Event } from 'h3';
import { serverSupabaseClient } from '#supabase/server'



export const createSchedule = async (event: H3Event,course_id: string, activity_id: string, org_id: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const dateStart = addDays(new Date(), randomNumber(-30, 30)) // 30 days before or after
    dateStart.setHours(randomNumber(8, 18)) // between 8 and 18
    const dateEnd = addHours(dateStart, randomNumber(1, 3)) // 1-3 hours
    const schdl: Omit<AppCourseActivitySchedule, "id"> = {
        activity_id: activity_id,
        course_id: course_id,
        organization_id: org_id,
        start_at: dateStart.toISOString(),
        end_at: dateEnd.toISOString(),
        status: SCHEDULES_STATUS[randomNumber(0, SCHEDULES_STATUS.length - 1)],
        assigned_to: null,
    }

    return await client.from('course_activity_schedules').insert([schdl])

}