import { serverSupabaseClient, serverSupabaseServiceRole } from '#supabase/server'
import type { AppOrganization, Database } from "~/types/app.types";
import type { H3Event } from 'h3';
import { arrayFillWithNullValues } from './utilities';

export const getOrganisationById = async (event: H3Event, id: string): Promise<AppOrganization | null> => {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client.from('organizations').select().eq('id', id).single()
    if (error) {
        return null
    }
    return data
}

export const getOrganizationStripeAccount = async (event: H3Event, orgid: string) => {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client.from("organizations_stripe_accounts").select().eq('id', orgid).single()
    if (error) {
        return null
    }
    return data
}

export const getBillById = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client.from('course_subscription_bills').select().eq('id', id).single()
    if (error) {
        return null
    }
    return data
}

export const getSubscriptionCertifcateData = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient(event)
    const { data: subData, error: subError } = await client.from('course_subscriptions')
    .select('*, student:students(*), course:courses(*), organization:organizations(*)')
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

    const { data: courseCosts, error: courseCostsError } = await client.from('course_costs_combinations')
    .select('*, costs:course_costs!inner(*)')
    .eq('course_id', subData.course_id)
    if (courseCostsError) {
        throw new Error('Course costs not found')
    }
    const { data: activities, error: activitiesError } = await client.from('course_activities_combinations')
    .select('*, activity:course_activities!inner(*)')
    .eq('course_id', subData.course_id)
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

    const courseCostsFormatted = courseCosts.map((c) => {
        return {
            name: c.costs.name,
            price: c.costs.price,
        }
    })
    const courseCostsTotal = courseCosts.reduce((acc, c) => {
        return acc + c.costs.price
    }, 0)

    const activitiesCostsFormatted = activities.map((a) => {
        return {
            activity_type: a.activity.activity_type,
            name: a.activity.name,
            price: a.activity.price,
        }
    })

    const attendanceCostsTotal = attendancesData.reduce((acc, a) => {
        return acc + a.activity_price
    }, 0)

    const examCostsTotal = attendancesData.filter((a) => a.activity_type === 'EXAM').reduce((acc, a) => {
        return acc + a.activity_price
    }, 0)

    return {
        base_costs: courseCostsFormatted,
        activity_costs: activitiesCostsFormatted,
        trainingCostsWithoutExam: courseCostsTotal + attendanceCostsTotal - examCostsTotal,
        examCostsTotal: examCostsTotal,
        theory_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 'THEORY'), 20),
        practice_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 'PRACTICE'), 20),
        theory_exam_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 'EXAM'), 5),
        practice_exam_attendances: arrayFillWithNullValues(attendanceDataFormatted.filter((a) => a.activity_type === 'EXAM'), 5),
        student: student,
        course: subData.course,
        organization: subData.organization,

    }
}

export const getBillDataById = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('course_subscription_bills').select('*, cs:course_subscriptions(*, student:students(*), course:courses(*))').eq('id', id).single()
    if (error) {
        return null
    }
    return data
}

export const updateBillPaymentIntentId = async (event: H3Event, billId: string, paymentIntentId: string) => {
    const client = serverSupabaseServiceRole<Database>(event)
    const { error } = await client.from('course_subscription_bills').update({
        stripe_payment_intent_id: paymentIntentId
    }).eq('id', billId)
    return error
}

export const getBillItemsByBillId = async (event: H3Event, billId: string) => {
    const client = await serverSupabaseClient(event)
    const { data, error } = await client.from("course_subscription_bill_items").select().eq('bill_id', billId)
    if (error) {
        return null
    }
    return data
}

export const getOrganisationBilllingSettings = async (event: H3Event, orgId: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('organization_billing_settings').select().eq('id', orgId).single()
    if (error) {
        return null
    }
    return data
}

export const getStudentById = async (event: H3Event, id: string) => {
    const client = await serverSupabaseClient<Database>(event)
    const { data, error } = await client.from('students').select().eq('id', id).single()
    if (error) {
        return null
    }
    return data
}