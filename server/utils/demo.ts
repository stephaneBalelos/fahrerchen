import { addDays, addHours, addMonths, differenceInMonths } from "date-fns"
import { randomNumber } from "./utilities"
import type { AppCourseActivitySchedule } from "~/types/app.types"
import { SCHEDULES_STATUS } from "~/constants"
import type { H3Event } from 'h3';
import { serverSupabaseServiceRole } from '#supabase/server'



export const createSchedule = async (event: H3Event, course_id: string, activity_id: string, org_id: string, start_date?: Date, start_time?: number, duration?: number) => {
    const client = await serverSupabaseServiceRole(event)
    const currentDate = new Date()
    const dateStart = start_date ?? addDays(currentDate, randomNumber(-30, 30)) // 30 days before or after
    dateStart.setHours(start_time ?? randomNumber(8, 18)) // between 8 and 18
    const dateEnd = addHours(dateStart, duration ?? randomNumber(1, 3)) // 1-3 hours

    const status = SCHEDULES_STATUS[0]

    const schdl: Omit<AppCourseActivitySchedule, "id"> = {
        activity_id: activity_id,
        course_id: course_id,
        organization_id: org_id,
        start_at: dateStart.toISOString(),
        end_at: dateEnd.toISOString(),
        status: status,
        assigned_to: null,
        attendees: [],
    }

    return await client.from('course_activity_schedules').insert([schdl])
}


export const generateStudentPersona = async (event: H3Event, org_id: string, student_id: string, course_id: string) => {

    const client = await serverSupabaseServiceRole(event)

    const subscriptionDate = randomDate(addMonths(new Date(), -5), new Date())

    const { data: student } = await client.from('students').select('*').eq('id', student_id).single()

    if (!student) throw new Error('Student not found')

    // Course Subscription
    const { data: subscription } = await client.from('course_subscriptions').insert({
        course_id: course_id,
        student_id: student_id,
        organization_id: org_id,
        inserted_at: subscriptionDate.toISOString()
    }).select('id').single()

    if (!subscription) throw new Error('Subscription not created')

    const { data: activities } = await client.from('course_activities').select('*').eq('course_id', course_id)

    if (!activities) throw new Error('No activities found')

    const theoryActivity = activities.find(a => a.activity_type == 1)
    const practiceActivity = activities.find(a => a.activity_type == 2)
    const examActivity = activities.find(a => a.activity_type == 3)

    if (!theoryActivity || !practiceActivity || !examActivity) throw new Error('Activities not found')


    const { data: theorySchedules } = await client.from('course_activity_schedules')
        .select('*')
        .eq('course_id', course_id)
        .eq('activity_id', theoryActivity.id)
        .gte('start_at', subscriptionDate.toISOString()).order('start_at', { ascending: true })

    if (!theorySchedules) throw new Error('No theory schedules found')

    // Generate Attendances to Theory Schedules
    let theoryAttendancesCount = 0
    for (const schedule of theorySchedules) {
        const { data, error} = await client.rpc('add_attendee_to_schedule', {
            course_schedule_id: schedule.id,
            course_subscription_id: subscription.id,
        })
        if (error) throw new Error('Theory Attendance not created')
        if (!data) throw new Error('Theory Attendance not created')
        theoryAttendancesCount++
    }

    const monthsSinceSubscription = differenceInMonths(new Date(), subscriptionDate)
    let practiceAttendancesCount = 0
    for (let i = 0; i < monthsSinceSubscription; i++) {
        // Create a Practice Schedule
        const start_date = addMonths(subscriptionDate, i + 1)
        const {data: s} = await client.from('course_activity_schedules').insert({
            course_id: course_id,
            activity_id: practiceActivity.id,
            organization_id: org_id,
            start_at: start_date.toISOString(),
            attendees: [subscription.id],
            end_at: addHours(start_date, 2).toISOString()
        }).select('*').single()

        if (!s) throw new Error('Practice Schedule not created')
        practiceAttendancesCount++
    }

    // Create Therorie Exam Schedule
    if (theoryAttendancesCount >= theoryActivity.required) {
        const lastTheorySchedule = theorySchedules[theorySchedules.length - 1]
        const theoryExamDate = addMonths(new Date(lastTheorySchedule.start_at), 1)
        const { data: examSchedule } = await client.from('course_activity_schedules').insert({
            course_id: course_id,
            activity_id: examActivity.id,
            organization_id: org_id,
            start_at: theoryExamDate.toISOString(),
            end_at: addHours(theoryExamDate, 2).toISOString(),
            attendees: [subscription.id],
        }).select('*').single()

        if (!examSchedule) throw new Error('Exam Schedule not created')

        if (practiceAttendancesCount >= practiceActivity.required) {
            const practiceExamDate = addMonths(theoryExamDate, 1)
            const { data: practiceExamSchedule } = await client.from('course_activity_schedules').insert({
                course_id: course_id,
                activity_id: examActivity.id,
                organization_id: org_id,
                start_at: practiceExamDate.toISOString(),
                end_at: addHours(practiceExamDate, 2).toISOString(),
                attendees: [subscription.id],
            }).select('*').single()

            if (!practiceExamSchedule) throw new Error('Practice Exam Schedule not created')
        }
    }    
}