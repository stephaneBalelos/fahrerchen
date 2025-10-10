import React from 'npm:react@18.3.1'
import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'
import { renderAsync } from 'npm:@react-email/components@0.0.22'
import SignupMail from '../_shared/_templates/SignupMail.tsx'
import PasswordResetMail from '../_shared/_templates/PasswordResetMail.tsx'
import { sendEmail } from '../_shared/utils.ts';


const hookSecret = Deno.env.get('SEND_EMAIL_HOOK_SECRET') as string

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }

    const verify_url = Deno.env.get('MAILER_VERIFY_URL') as string

    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)
    const secret = hookSecret.split('whsec_')[1]
    const wh = new Webhook(secret)
    try {
        const verifiedPayload = wh.verify(payload, headers) as {
            user: {
                email: string
                user_metadata: {
                    name: string
                    organization_id: string
                    role: string
                    preferred_language?: 'en' | 'de'
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
            email_data: { token_hash, redirect_to, email_action_type },
        } = verifiedPayload

        let html: string = ''
        let subject: string = ''
        if (email_action_type === 'magiclink') {
            throw new Error('Magic link is not supported')
        } else if (email_action_type === 'recovery') {
            subject = user.user_metadata.preferred_language === 'en'
                ? 'Password Reset Request'
                : 'Passwort zurücksetzen Anfrage'
            html = await renderAsync(
                React.createElement(PasswordResetMail, {
                    lang: user.user_metadata.preferred_language || 'de',
                    username: user.user_metadata.name || user.email,
                    call_to_action_url: `${verify_url}?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`,
                })
            )
        } else if (email_action_type === 'signup') {
            subject = user.user_metadata.preferred_language === 'en'
                ? 'Welcome to Karjolen App'
                : 'Willkommen bei der Karjolen App'
            html = await renderAsync(
                React.createElement(SignupMail, {
                    lang: user.user_metadata.preferred_language || 'de',
                    username: user.user_metadata.name || user.email,
                    call_to_action_url: `${verify_url}?token=${token_hash}&type=${email_action_type}&redirect_to=${encodeURIComponent(redirect_to)}`,
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

        // TODO: Get email subect from the template

        await sendEmail(user.email, subject, html)

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