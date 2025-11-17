// deno-lint-ignore-file
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts"
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";
import NewSubscriptionEmail, { NewSubscriptionEmailSubject } from "./_templates/NewSubscriptionMail.tsx";


export async function getAuthUserWithToken(supabase: SupabaseClient<Database>, token: string) {
    const { data, error } = await supabase.auth.getUser(token)
    if (error || !data) {
        return null
    }
    return data.user
}

export async function hasUserOrganisationMembership(supabase: SupabaseClient<Database>, user_id: string, orgid: string): Promise<Database['public']['Tables']['organization_members']['Row'] | null> {
    const { data, error } = await supabase.from('organization_members').select('*').eq('organization_id', orgid).eq('user_id', user_id).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getUserByEmail(supabase: SupabaseClient<Database>, email: string): Promise<Database['public']['Tables']['users']['Row'] | null> {
    const { data, error } = await supabase.from('users').select('*').eq('email', email).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getOrganization(supabase: SupabaseClient<Database>, orgid: string): Promise<Database['public']['Tables']['organizations']['Row'] | null> {
    const { data, error } = await supabase.from('organizations').select('*').eq('id', orgid).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getOrganizationMembers(supabase: SupabaseClient<Database>, orgid: string) {
    const { data, error } = await supabase.from('organization_members')
        .select('*, user:users(id, email, firstname, lastname, email)')
        .eq('organization_id', orgid)
    if (error || !data) {
        return null
    }
    return data
}

export async function getOrganizationStripeAccount(supabase: SupabaseClient<Database>, orgid: string): Promise<Database['public']['Tables']['organizations_stripe_accounts']['Row'] | null> {
    const { data, error } = await supabase.from('organizations_stripe_accounts').select('*').eq('id', orgid).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getCourseById(supabase: SupabaseClient<Database>, courseId: string): Promise<Database['public']['Tables']['courses']['Row'] | null> {
    const { data, error } = await supabase.from('courses').select('*').eq('id', courseId).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getCourseActivityById(supabase: SupabaseClient<Database>, activityId: string): Promise<Database['public']['Tables']['course_activities']['Row'] | null> {
    const { data, error } = await supabase.from('course_activities').select('*').eq('id', activityId).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getCourseActivityScheduleById(supabase: SupabaseClient<Database>, scheduleId: string) {
    const { data, error } = await supabase.from('course_activity_schedules')
        .select('*, activity:course_activities(id, name)').eq('id', scheduleId).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getCourseActivityRecurrenceRuleById(supabase: SupabaseClient<Database>, ruleId: string) {
    const { data, error } = await supabase.from('activity_recurrence_rules')
        .select('*').eq('id', ruleId).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getCourseSubscriptionById(supabase: SupabaseClient<Database>, subscriptionId: string) {
    const { data, error } = await supabase.from('course_subscriptions')
        .select('*, c:courses(id, type), s:students(id, firstname, lastname, email, user_id)').eq('id', subscriptionId).single()
    if (error || !data) {
        return null
    }
    return data
}

export async function getScheduleAttendeesByScheduleId(supabase: SupabaseClient<Database>, scheduleId: string) {
    const { data, error } = await supabase.from('course_activity_schedules_attendees')
        .select('*, cs:course_subscriptions(id, s:students(id, firstname, lastname, email, user_id))')
        .eq('schedule_id', scheduleId)
    if (error || !data) {
        return null
    }
    return data
}

export const getHmacSignature = async (data: string): Promise<string> => {
    const { createHmac } = await import('node:crypto');
    const secret = Deno.env.get("MAIL_WEBHOOK_SECRET_KEY")
    if (!secret) {
        throw new Error('HMAC_SECRET not set')
    }

    // decode the base64 secret
    const secretKey = decodeBase64(secret)

    const hmac = createHmac('sha256', secretKey)
    return hmac.update(data).digest('base64url')
}

export const verifyHmacSignature = async (data: string, signature: string): Promise<boolean> => {
    const secret = Deno.env.get("MAIL_WEBHOOK_SECRET_KEY")
    if (!secret) {
        throw new Error('HMAC_SECRET not set')
    }

    const expectedSignature = await getHmacSignature(data)
    return expectedSignature === signature
}

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
    // Check if dev or production
    if (!Deno.env.get('MAILER_API_KEY') || !Deno.env.get('MAILER_DOMAIN') || !Deno.env.get('MAILER_FROM_EMAIL')) {
        await sendWithToMailPit(to, subject, text)
        return
    }
    const body = new FormData()
    body.append('from', Deno.env.get('MAILER_FROM_EMAIL') ?? '')
    body.append('to', to)
    body.append('subject', subject)
    body.append('html', text)

    const domain = Deno.env.get('MAILER_DOMAIN')
    const apiKey = Deno.env.get('MAILER_API_KEY')

    const res = await fetch(`https://api.eu.mailgun.net/v3/${domain}/messages`, {
        method: 'POST',
        headers: {
            Authorization: `Basic ${encodeBase64(`api:${apiKey}`)}`
        },
        body
    })

    const data = await res.text()
    console.log('Mailgun response:', data)

}

const sendWithToMailPit = async(to: string, subject: string, text: string) => {
    const options = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({"From":{"Email":"no-reply@karjolen.de","Name":"Fahrerchen Dev"},"To":[{"Email": to }],"Subject": subject,"HTML": text})
    };

    const url = Deno.env.get("MAIL_PIT_URL")

    console.log(url);

    const response = await fetch(url ?? '', options)
    const data = await response.json()
    console.log('MailPit response:', data)
    
}

export const translator = (translationsEn: Record<string, string>, translationsDe: Record<string, string>, lang: string = 'de') => (key: string, ...args: string[]): string => {
    const translations = lang.includes('de') ? translationsDe : translationsEn
    let translation = translations[key] || key
    if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            translation = translation.replace(`{${i}}`, args[i])
        }
    }

    return translation
}

export const getStudentById = async (supabase: SupabaseClient<Database>, studentId: string) => {
    const { data, error } = await supabase.from('students').select('*').eq('id', studentId).single()
    if (error || !data) {
        return null
    }
    return data
}

export const getNotificationEmailData = (notification_type: Database['public']['Enums']['notification_type']) => {
    switch (notification_type) {
        case 'course_subscriptions.inserted':
            return {
                getSubject: NewSubscriptionEmailSubject,
                template: NewSubscriptionEmail
            }
        default:
            throw new Error(`Unknown notification type: ${notification_type}`)
    }
}

export const sendNotificationEmail = async (to: string, subject: string, html: string): Promise<void> => {
    await sendEmail(to, subject, html)
}