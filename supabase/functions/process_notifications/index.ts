import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database, Json } from "../_shared/types/database.types.ts";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { getCourseActivityById, getNotificationEmailData, getOrganization, getOrganizationMembers, sendNotificationEmail } from "../_shared/utils.ts";
import * as React from 'npm:react@18.3.1'

const BATCH_SIZE = 10

type NotificationJobPayload = {
    resource_id: string
    old: Json
    new: Json
}

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }

    const supabase = createClient<Database>(
        Deno.env.get('SUPABASE_URL')!,
        Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    )

    try {
        const { data, error } = await supabase.from('notifications_jobs').select('*').eq('status', 'PENDING').limit(BATCH_SIZE)
        if (error) {
            throw error
        }

        if (!data) {
            return new Response('No jobs found', { status: 404 })
        }

        // Set Jobs status to processing
        await supabase.from('notifications_jobs').update({ status: 'PROCESSING' }).in('id', data.map(j => j.id))

        console.log('Processing jobs:', data.map(j => j.id))

        // Process Jobs in the background return early
        await processJobs(supabase, data)

        return new Response('Jobs are being processed', { status: 202 })

    } catch (error) {
        console.error('Error fetching jobs:', error)
        return new Response('Error fetching jobs', { status: 500 })
    }
})


async function processJobs(client: SupabaseClient<Database>, jobs: Array<Database['public']['Tables']['notifications_jobs']['Row']>) {
    for (const job of jobs) {
        const payload = job.payload as NotificationJobPayload
        try {
            const organization = await getOrganization(client, job.organization_id)
            if (!organization) {
                throw new Error(`Organization not found: ${job.organization_id}`)
            }
            const members = await getOrganizationMembers(client, organization.id)
            if (!members) {
                throw new Error(`No members to notify for organization: ${organization.id}`)
            }
            console.log('Processing job:', job.notification_type)
            if (job.notification_type === 'course_subscriptions.inserted') {
                console.log('Processing course_subscriptions.inserted notification')
                // Notifify the student per email
                const payloadNew = payload.new as Database['public']['Tables']['course_subscriptions']['Row']
                const student = await client.from('students').select('*').eq('id', payloadNew["student_id"]).single()
                if (student.error) {
                    throw student.error
                }
                if (!student.data) {
                    throw new Error(`Student not found: ${payloadNew["student_id"]}`)
                }
                const emailData = getNotificationEmailData(job.notification_type)
                const html = await renderAsync(
                    React.createElement(emailData.template, {
                        student_name: student.data.full_name,
                        organization_name: organization.name,
                        lang: organization.preferred_language,
                    })
                )
                await sendNotificationEmail(student.data.email, emailData.getSubject(organization.name), html)
                // Mark Job as completed
                await client.from('notifications_jobs').update({ status: 'COMPLETED' }).eq('id', job.id)

            } else if (job.notification_type === 'course_activity_schedules.assigned_to.updated') {
                // Notify the new Assigned to user if he is not the actor
                const payloadNew = payload.new as Database['public']['Tables']['course_activity_schedules']['Row']
                if (payloadNew.assigned_to && payloadNew.assigned_to !== job.actor_id) {
                    const newAssignedUser = members.find(member => member.user_id === payloadNew.assigned_to)
                    const activity = await getCourseActivityById(client, payloadNew.activity_id)
                    const author = members.find(member => member.user_id === job.actor_id)

                    // Insert Notification
                    if (newAssignedUser && newAssignedUser?.user_id && newAssignedUser?.user_fullname) {
                        await client.from('organization_notifications').insert({
                            notification_type: job.notification_type,
                            author_id: job.actor_id,
                            target_user_ids: [newAssignedUser.user_id],
                            payload: {
                                id: payloadNew.id,
                                author_name: author?.user_fullname,
                                activity_name: activity?.name,
                                date: payloadNew.start_at
                            },
                            organization_id: organization.id
                        })
                    }
                }
                await client.from('notifications_jobs').update({ status: 'COMPLETED' }).eq('id', job.id)

            } else if (job.notification_type === 'course_activity_schedules.date.updated') {
                // Notify the students about the date change
                // Notify the assigned to user if he is not the actor

            } else if (job.notification_type === 'course_activity_schedules.deleted') {
                // Notify the students about the schedule deletion
                // Notify the assigned to user if he is not the actor

            } else if (job.notification_type === 'course_activity_schedules.attendees.updated') {
                // Notify the students that have been added or removed from the schedule

            } else if (job.notification_type === 'course_activity_schedules.status.updated') {
                // Notify the students about the status change
                // Notify the assigned to user if he is not the actor

            } else if (job.notification_type === 'course_activity_schedules_attendances.inserted') {
                // Notify the students that he has attended the schedule

            } else if (job.notification_type === 'course_subscription_bills.ready_to_pay.updated') {
                // Notify the student that the bill is ready to pay

            } else if (job.notification_type === 'course_subscription_bills.paid_at.updated') {
                // Notify the student that the bill has been paid

            } else if (job.notification_type === 'course_subscription_bills.canceled_at.updated') {
                // Notify the student that the bill has been canceled

            } else if (job.notification_type === 'students_registration_requests.inserted') {
                // Notify the admin about the new registration request

            } else {
                throw new Error(`Unknown notification type: ${job.notification_type}`)
            }

            // Update Job Status to 'completed'
        } catch (error) {
            console.error('Error processing job:', error)
            await client.from('notifications_jobs').update({ status: 'FAILED' }).eq('id', job.id)
        }
    }
}