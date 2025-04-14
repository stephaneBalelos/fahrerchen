import { createClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import type { Database } from "../_shared/types/database.types.ts";
import type { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"

const secret = Deno.env.get('NOTIFICATION_WEBHOOK_SECRET_KEY') as string

type WebhookPayload = {
    type: Database['public']['Enums']['notification_type']
    actor_id: string | null
    target_id: string | null
    resource_id: string
    target_roles: Database['public']['Enums']['app_role'][]
    payload: unknown,
    organization_id: string
}


Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }

    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)

    const wh = new Webhook(secret)


    try {
        const res = wh.verify(payload, headers) as WebhookPayload

        const supabaseAdmin = createClient<Database>(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        await insertNotification(supabaseAdmin, res)

        return new Response('ok', { status: 200 })
    } catch (error) {
        console.error('error:', error)

        return new Response('error', { status: 500 })
    }
})


const insertNotification = async (supabaseAdmin: SupabaseClient<Database>, payload: WebhookPayload) => {
    const { data, error } = await supabaseAdmin
        .from('notifications')
        .insert({
            type: payload.type,
            actor_id: payload.actor_id,
            target_id: payload.target_id,
            resource_id: payload.resource_id,
            payload: payload.payload,
            target_roles: payload.target_roles,
            organization_id: payload.organization_id,
        })
        .select()
        .single()

    if (error) {
        console.error('Failed to insert notification', error)
        return null
    }

    return data
}