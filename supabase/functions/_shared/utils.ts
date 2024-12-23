import { SupabaseClient } from "https://esm.sh/@supabase/supabase-js@2.46.1"
import type { Database } from "../_shared/types/database.types.ts"
import { decodeBase64, encodeBase64 } from "jsr:@std/encoding/base64";

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
    console.log(data)

}

export const translator = (translationsEn: Record<string, string>, translationsDe: Record<string, string>, lang: string= 'de') => (key: string, ...args: string[]): string => {
    const translations = lang.includes('de') ? translationsDe : translationsEn
    let translation = translations[key] || key
    if (args.length > 0) {
        for (let i = 0; i < args.length; i++) {
            translation = translation.replace(`{${i}}`, args[i] )
        }
    }

    return translation
}