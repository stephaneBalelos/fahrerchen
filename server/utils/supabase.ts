import { serverSupabaseClient } from '#supabase/server'
import type { AppOrganization, Database } from "~/types/app.types";
import type { H3Event } from 'h3';
import { arrayFillWithNullValues } from './utilities';

export const getOrganisationById = async (event: H3Event, id: string): Promise<AppOrganization | null> => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('organizations').select().eq('id', id).single()
    if (error) {
        return null
    }
    return data
}

export const getOrganizationStripeAccount = async (event: H3Event, orgid: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from("organizations_stripe_accounts").select().eq('id', orgid).single()
    if (error) {
        return null
    }
    return data
}

export const getBillById = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('course_subscription_bills').select().eq('id', id).single()
    if (error) {
        return null
    }
    return data
}

export const getSubscriptionCertifcateData = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient(event)
    const { data: subData, error: subError } = await client.from('course_subscriptions')
    .select('*, student:student_id(*), course:course_id(*), organization:organization_id(*)')
    .eq('id', id).single()

    const { data: attendancesData, error: attendancesError } = await client.from('course_activity_schedules_attendances')
    .select('*').eq('course_subscription_id', id)

    if (!subData || subError) {
        throw new Error('Subscription not found')
    }

    if (!attendancesData || attendancesError) {
        throw new Error('Attendaces not found')
    }

    const attendanceDataFormatted = attendancesData.map((a) => {
        return {
            date: new Date(a.schedule_start_at).toLocaleDateString('de-DE', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit'
            }),
            minutes: (new Date(a.schedule_end_at).getTime() - new Date(a.schedule_start_at).getTime()) / 1000 / 60,
            supervisor: a.schedule_assigned_to_id ? a.schedule_assigned_to_firstname + ' ' + a.schedule_assigned_to_lastname : null,
            ...a
        }
    })

    const { data: courseCosts, error: courseCostsError } = await client.from('course_costs').select().eq('course_id', subData.course_id)
    if (courseCostsError) {
        throw new Error('Course costs not found')
    }
    const { data: activities, error: activitiesError } = await client.from('course_activities').select().eq('course_id', subData.course_id)
    if (activitiesError) {
        throw new Error('Course activities not found')
    }

    const student = {
        address_full: `${subData.student.address_street}, ${subData.student.address_zip} ${subData.student.address_city}`,
        birthDate: new Date(subData.student.birth_date).toLocaleDateString('de-DE', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit'
        }),
        ...subData.student,
    }

    const courseCoustsFormatted = courseCosts.map((c) => {
        return {
            name: c.name,
            price: c.price,
        }
    })
    const courseCostsTotal = courseCosts.reduce((acc, c) => {
        return acc + c.price
    }, 0)

    const activitiesCostsFormatted = activities.map((a) => {
        return {
            activity_type: a.activity_type,
            name: a.name,
            price: a.price,
        }
    })

    const attendanceCostsTotal = attendancesData.reduce((acc, a) => {
        return acc + a.activity_price
    }, 0)

    const examCostsTotal = attendancesData.filter((a) => a.activity_type === 3).reduce((acc, a) => {
        return acc + a.activity_price
    }, 0)


    


    return {
        base_costs: courseCoustsFormatted,
        activity_costs: activitiesCostsFormatted,
        trainingCostsWithoutExam: courseCostsTotal + attendanceCostsTotal - examCostsTotal,
        examCostsTotal: examCostsTotal,
        theory_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 1), 20),
        practice_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 2), 20),
        theory_exam_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 3), 5),
        practice_exam_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 3), 5),
        student: student,
        course: subData.course,
        organization: subData.organization,

    }
}