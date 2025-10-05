import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database, Json } from "../_shared/types/database.types.ts";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { getCourseActivityById, getNotificationEmailData, getOrganization, getOrganizationMembers, getScheduleAttendeesByScheduleId, sendNotificationEmail, getCourseSubscriptionById, getCourseActivityScheduleById } from "../_shared/utils.ts";
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
            const author = members.find(member => member.user_id === job.actor_id)
            if (!author || (author.user === null)) {
                throw new Error(`Author not found: ${job.actor_id}`)
            }
            if (job.notification_type === 'course_subscriptions.inserted') {
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
            } else if (job.notification_type === 'course_activity_schedules.assigned_to.updated') {
                // Notify the new Assigned to user if he is not the actor
                const payloadNew = payload.new as Database['public']['Tables']['course_activity_schedules']['Row']
                if (payloadNew.assigned_to && payloadNew.assigned_to !== job.actor_id) {
                    const newAssignedUser = members.find(member => member.user_id === payloadNew.assigned_to)
                    const activity = await getCourseActivityById(client, payloadNew.activity_id)
                    if (!activity) {
                        throw new Error(`Activity not found: ${payloadNew.activity_id}`)
                    }

                    // Insert Notification
                    if (newAssignedUser) {
                        await client.from('organization_notifications').insert({
                            notification_type: job.notification_type,
                            author_id: author.user_id,
                            target_user_ids: [newAssignedUser.user_id],
                            payload: {
                                id: payloadNew.id,
                                author_name: `${author.user.firstname} ${author.user.lastname}`,
                                activity_name: activity.name,
                                date: payloadNew.start_at
                            },
                            organization_id: organization.id
                        })
                    }
                }
            } else if (job.notification_type === 'course_activity_schedules.start_at.updated') {
                // Notify the students about the date change
                const target_user_ids= new Set<string>()
                const payloadNew = payload.new as Database['public']['Tables']['course_activity_schedules']['Row']
                const attendees = await getScheduleAttendeesByScheduleId(client, payloadNew.id)
                if (!attendees) {
                    throw new Error(`No attendees found for schedule: ${payloadNew.id}`)
                }
                for (const attendee of attendees) {
                    if (!attendee.cs || !attendee.cs.s || !attendee.cs.s.user_id) continue
                    target_user_ids.add(attendee.cs.s.user_id)
                }
                const activity = await getCourseActivityById(client, payloadNew.activity_id)
                if (payloadNew.assigned_to && payloadNew.assigned_to !== job.actor_id) {
                    target_user_ids.add(payloadNew.assigned_to)
                }
                // Insert Notification
                if (target_user_ids.size > 0) {
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids: Array.from(target_user_ids),
                        payload: {
                            id: payloadNew.id,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            activity_name: activity?.name,
                            schedule_date: payloadNew.start_at
                        },
                        organization_id: organization.id
                    })
                }

            } else if (job.notification_type === 'course_activity_schedules_attendees.inserted') {
                const target_user_ids: Set<string> = new Set()
                const payloadNew = payload.new as Database['public']['Tables']['course_activity_schedules_attendees']['Row']
                const schedule = await getCourseActivityScheduleById(client, payloadNew.schedule_id)
                if (!schedule) {
                    throw new Error(`No schedule found for attendee: ${payloadNew.id}`)
                }
                const subscription = await getCourseSubscriptionById(client, payloadNew.subscription_id)
                if (!subscription) {
                    throw new Error(`No subscription found for schedule: ${payloadNew.id}`)
                }
                if (!subscription.s) {
                    throw new Error(`No student found for subscription: ${subscription.id}`)
                }
                if (subscription.s.user_id) {
                    target_user_ids.add(subscription.s.user_id)
                }
                if (schedule.assigned_to && schedule.assigned_to !== job.actor_id) {
                    target_user_ids.add(schedule.assigned_to)
                }

                // Insert Notification
                if (target_user_ids.size > 0) {
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids: Array.from(target_user_ids),
                        payload: {
                            id: payloadNew.id,
                            schedule_status: schedule.status,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            activity_name: schedule.activity?.name,
                            schedule_date: schedule.start_at
                        },
                        organization_id: organization.id
                    })
                }

            } else if (job.notification_type === 'course_activity_schedules.status.updated') {
                const target_user_ids: string[] = []
                // Notify the students about the status change
                const payloadNew = payload.new as Database['public']['Tables']['course_activity_schedules']['Row']
                const attendees = await getScheduleAttendeesByScheduleId(client, payloadNew.id)
                if (!attendees) {
                    throw new Error(`No attendees found for schedule: ${payloadNew.id}`)
                }
                const activity = await getCourseActivityById(client, payloadNew.activity_id)

                for (const attendee of attendees) {
                    if (!attendee.cs || !attendee.cs.s || !attendee.cs.s.user_id) continue
                    target_user_ids.push(attendee.cs.s.user_id)
                }
                if (payloadNew.assigned_to && payloadNew.assigned_to !== job.actor_id) {
                    target_user_ids.push(payloadNew.assigned_to)
                }
                // Insert Notification
                if (target_user_ids.length > 0) {
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids,
                        payload: {
                            id: payloadNew.id,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            activity_name: activity?.name,
                            schedule_date: payloadNew.start_at,
                            schedule_status: payloadNew.status
                        },
                        organization_id: organization.id
                    })
                }
            } else if (job.notification_type === 'course_activity_schedules_attendances.inserted') {
                // Notify the students that he has attended the schedule

            } else if (job.notification_type === 'course_subscription_bills.ready_to_pay.updated') {
                // Notify the student that the bill is ready to pay
                const payloadNew = payload.new as Database['public']['Tables']['course_subscription_bills']['Row']
                const subscription = await getCourseSubscriptionById(client, payloadNew.course_subscription_id)
                if (!subscription) {
                    throw new Error(`Subscription not found: ${payloadNew.course_subscription_id}`)
                }
                const student = members.find(member => member.user_id === subscription.s?.user_id)
                if (!student) {
                    throw new Error(`Student not found: ${subscription.s?.user_id}`)
                }
                if (student.user_id) {
                    // Insert Notification
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids: [student.user_id],
                        payload: {
                            id: payloadNew.id,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            student_name: student.user?.firstname + ' ' + student.user?.lastname,
                            course_type: subscription.c?.type,
                        },
                        organization_id: organization.id
                    })
                }



            } else if (job.notification_type === 'course_subscription_bills.paid_at.updated') {
                // Notify the student that the bill has been paid
                const payloadNew = payload.new as Database['public']['Tables']['course_subscription_bills']['Row']
                const subscription = await getCourseSubscriptionById(client, payloadNew.course_subscription_id)
                if (!subscription) {
                    throw new Error(`Subscription not found: ${payloadNew.course_subscription_id}`)
                }
                const student = members.find(member => member.user_id === subscription.s?.user_id)
                if (!student) {
                    throw new Error(`Student not found: ${subscription.s?.user_id}`)
                }
                if (student.user_id) {
                    // Insert Notification
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids: [student.user_id],
                        payload: {
                            id: payloadNew.id,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            student_name: student.user?.firstname + ' ' + student.user?.lastname,
                            course_type: subscription.c?.type,
                        },
                        organization_id: organization.id
                    })
                }

            } else if (job.notification_type === 'course_subscription_bills.canceled_at.updated') {
                // Notify the student that the bill has been canceled
                const payloadNew = payload.new as Database['public']['Tables']['course_subscription_bills']['Row']
                const subscription = await getCourseSubscriptionById(client, payloadNew.course_subscription_id)
                if (!subscription) {
                    throw new Error(`Subscription not found: ${payloadNew.course_subscription_id}`)
                }
                const student = members.find(member => member.user_id === subscription.s?.user_id)
                if (!student) {
                    throw new Error(`Student not found: ${subscription.s?.user_id}`)
                }
                if (student.user_id) {
                    // Insert Notification
                    await client.from('organization_notifications').insert({
                        notification_type: job.notification_type,
                        author_id: author.user_id,
                        target_user_ids: [student.user_id],
                        payload: {
                            id: payloadNew.id,
                            author_name: author.user.firstname + ' ' + author.user.lastname,
                            student_name: student.user?.firstname + ' ' + student.user?.lastname,
                            course_type: subscription.c?.type,
                        },
                        organization_id: organization.id
                    })
                }

            } else if (job.notification_type === 'students_registration_requests.inserted') {
                // Notify the admin about the new registration request
                const target_user_ids: string[] = []
                const payloadNew = payload.new as Database['public']['Tables']['students_registration_requests']['Row']
                const admins = members.filter(member => member.role === 'owner' || member.role === 'manager')
                if (admins.length === 0) {
                    throw new Error(`No admins found for organization: ${organization.id}`)
                }

                for (const admin of admins) {
                    if (admin.user_id) {
                        target_user_ids.push(admin.user_id)
                    }
                }
                // Insert Notification
                await client.from('organization_notifications').insert({
                    notification_type: job.notification_type,
                    author_id: author.user_id,
                    target_user_ids,
                    payload: {
                        id: payloadNew.id,
                        author_name: author.user.firstname + ' ' + author.user.lastname,
                        requester_name: payloadNew.firstname + ' ' + payloadNew.lastname,
                        requester_email: payloadNew.email,
                    },
                    organization_id: organization.id
                })

            } else {
                throw new Error(`Unknown notification type: ${job.notification_type}`)
            }

            // Update Job Status to 'completed'
            await client.from('notifications_jobs').update({ status: 'COMPLETED' }).eq('id', job.id)
        } catch (error) {
            console.error('Error processing job:', error)
            await client.from('notifications_jobs').update({ status: 'FAILED' }).eq('id', job.id)
        }
    }
}