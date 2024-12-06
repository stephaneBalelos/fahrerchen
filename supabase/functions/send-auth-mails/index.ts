import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import SignupMail from '../_shared/_templates/SignupMail.tsx'
import PasswordResetMail from '../_shared/_templates/PasswordResetMail.tsx'
import InvitationMail from '../_shared/_templates/InvitationMail.tsx'
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'


const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string



Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }

    const url_base = Deno.env.get('MAILER_VERIFY_URL') as string

    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const secret = hookSecret.split('whsec_')[1]
    const wh = new Webhook(secret)
    try {
        const verifiedPayload = wh.verify(payload, headers) as {
            user: {
                email: string
                user_metadata: {
                    organization_id: string
                    role: string
                }
            }
            email_data: {
                token: string
                token_hash: string
                redirect_to: string
                email_action_type: string
                site_url: string
                token_new: string
                token_hash_new: string
            }
        }

        const {
            user,
            email_data: { token, token_hash, redirect_to, email_action_type },
        } = verifiedPayload

        const supabaseClient = createClient(
            Deno.env.get('SUPABASE_URL') ?? '',
            Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        )

        let html: string = ''
        if (email_action_type === 'magiclink') {
            throw new Error('Magic link is not supported')
        } else if (email_action_type === 'recovery') {
            html = await renderAsync(
                React.createElement(PasswordResetMail, {
                    username: user.email,
                    lang: 'en',
                    token,
                    supabase_url: url_base,
                    email_action_type,
                    redirect_to,
                    token_hash,
                })
            )
        } else if (email_action_type === 'invite') {
            const { data, error } = await supabaseClient.from('organizations').select('*').eq('id', user.user_metadata.organization_id).single()
            if (error) {
                throw new Error('Organization not found')
            }
            if (!data) {
                throw new Error('Organization not found')
            }
            html = await renderAsync(
                React.createElement(InvitationMail, {
                    username: user.email,
                    org_name: data.name,
                    lang: 'en',
                    token,
                    supabase_url: url_base,
                    email_action_type,
                    redirect_to,
                    token_hash,
                })
            )

        } else if (email_action_type === 'signup') {
            html = await renderAsync(
                React.createElement(SignupMail, {
                    username: user.email,
                    lang: 'en',
                    token,
                    supabase_url: url_base,
                    email_action_type,
                    redirect_to,
                    token_hash,
                })
            )
        } else if (email_action_type === 'email_change_current') {
            throw new Error('Email change current is not supported')
        } else if (email_action_type === 'email_change_new') {
            throw new Error('Email change current is not supported')
        } else {
            throw new Error('Unknown email action type')
        }


        // Send the email

        const data = {
            "sender": {
                "name": "No Reply",
                "email": "no-reply@stephanedondyas.cloud"
            },
            "to": [
                {
                    "email": user.email,
                    "name": "User"
                }
            ],
            "htmlContent": html,
            "textContent": "Please enable HTML to view this email",
            "subject": "Welcome to Fahrerchen",
        }

        const res = await fetch("https://api.brevo.com/v3/smtp/email", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "api-key": Deno.env.get("BREVO_API_KEY") as string,
                "accept": "application/json",
            },
            body: JSON.stringify(data)
        })

        // const json = await res.json()

    } catch (error) {
        console.log(error)
        return new Response(
            JSON.stringify({
                error: {
                    http_code: error.code,
                    message: error.message,
                },
            }),
            {
                status: 401,
                headers: { 'Content-Type': 'application/json' },
            }
        )
    }

    const responseHeaders = new Headers()
    responseHeaders.set('Content-Type', 'application/json')
    return new Response(JSON.stringify({}), {
        status: 200,
        headers: responseHeaders,
    })
})