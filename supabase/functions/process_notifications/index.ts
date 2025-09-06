import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts";

const BATCH_SIZE = 10

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

        console.log('Found jobs:', data.map(j => j.id))

        if (!data) {
            return new Response('No jobs found', { status: 404 })
        }

        // Set Jobs status to processing
        await supabase.from('notifications_jobs').update({ status: 'PROCESSING' }).in('id', data.map(j => j.id))

        // Process Jobs in the background return early
        processJobs(supabase, data)

        return new Response('Jobs are being processed', { status: 202 })

    } catch (error) {
        console.error('Error fetching jobs:', error)
        return new Response('Error fetching jobs', { status: 500 })
    }
})


async function processJobs(client: SupabaseClient<Database>, jobs: Array<Database['public']['Tables']['notifications_jobs']['Row']>) {
    for (const job of jobs) {
        try {
            if (job.notification_type === 'course_subscriptions.inserted') {
                // Find Targets
                console.log('Finding targets for job:', job.id)
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