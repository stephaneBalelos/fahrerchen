import { createClient, type SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database, Json } from "../_shared/types/database.types.ts";


type OrganizationNotification = Omit<Database["public"]["Tables"]["organization_notifications"]["Row"], "id" | "read">;

type OrganizationNotificationJob<T = JSON
    , U = JSON> = {
        org_id: string;
        type: Database["public"]["Enums"]["notification_type"];
        old: T | null;
        new: U | null;
        created_by_user_id: string | null;
        enqueued_at: Date;
    };


Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }


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

    // Pop 100 messages from the organization_notifications queue
    const dequeuedMessages = await Promise.all(
        Array(100).fill(null).map(() => {
            return supabaseAdmin.schema('pgmq_public').rpc('pop', { queue_name: 'organization_notifications' });
        })
    );

    // Filter out any errors and null values
    const dequeued = dequeuedMessages.filter((result) => result.data !== null && !result.error).reduce((acc, curr) => {
        if (curr.data) {
            acc.data.push(...curr.data);
        }
        if (curr.error) {
            acc.error = curr.error;
        }
        return acc;
    }, { data: [] as unknown[], error: null as Error | null });


    if (dequeued.error) {
        console.error('Error dequeuing notifications:', dequeued.error)
        return new Response('Error processing notifications', { status: 500 })
    }

    if (dequeued.data.length === 0) {
        return new Response('No notifications to process', { status: 200 })
    }

    const notifications: OrganizationNotificationJob[] = dequeued.data.map((item: unknown) => {
        const i = item as { enqueued_at: string; message: OrganizationNotificationJob };
        const enqueued_at = new Date(i.enqueued_at);
        const message = i.message;
        return {
            org_id: message.org_id,
            type: message.type,
            old: message.old,
            new: message.new,
            created_by_user_id: message.created_by_user_id,
            enqueued_at: enqueued_at
        };
    })

    const results = []
    for (const notification of notifications) {
        const result = await handleNotification(supabaseAdmin, notification)
        results.push(result)
    }

    // Flatten the results array
    const flattenedResults = results.flat();

    if (flattenedResults.length === 0) {
        return new Response('No notifications to insert', { status: 200 })
    }

    // Insert the notifications into the organization_notifications table
    const { error: insertError } = await supabaseAdmin.from('organization_notifications').insert(flattenedResults);
    if (insertError) {
        console.error('Error inserting notifications:', insertError);
        return new Response('Error processing notifications', { status: 500 });
    }

    console.log(`Processed ${flattenedResults.length} notifications`)

    return new Response(`Processed ${flattenedResults.length} notifications`, { status: 200 })
})

const handleNotification = async (supabase: SupabaseClient<Database>, notification: OrganizationNotificationJob): Promise<OrganizationNotification[]> => {
    const memberships = await supabase.from('organization_members').select().eq('organization_id', notification.org_id)
    if (memberships.data === null) {
        console.error('Error fetching organization members:', memberships.error)
        return []
    }
    const targets = memberships.data.filter(member => {
        switch (notification.type) {
            case 'organization_members.inserted':
                return ['owner', 'manager'].includes(member.role);
            case 'students.inserted':
                return ['owner', 'manager'].includes(member.role);
            default:
                console.warn(`Unhandled notification type: ${notification.type}`);
                return false; // Skip unhandled types
        }
    }).filter(member => member.user_id !== notification.created_by_user_id);

    return targets.map(member => {
        const notificationData: OrganizationNotification = {
            organization_id: notification.org_id,
            created_by_user_id: notification.created_by_user_id,
            created_by_user_fullname: '<fullname>', // This can be fetched if needed
            target_user_id: member.user_id,
            type: notification.type,
            payload: {
                old: notification.old,
                new: notification.new,
            } as Json,
            created_at: notification.enqueued_at.toISOString(),
        }
        return notificationData
    });
}