import { Webhook } from 'https://esm.sh/standardwebhooks@1.0.0'

const secret = Deno.env.get('MAIL_WEBHOOK_SECRET_KEY') as string

Deno.serve(async (req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }

    const payload = await req.text()
    const headers = Object.fromEntries(req.headers)

    console.log('headers:', headers)
    console.log('payload', payload)
    console.log('secret:', secret)

    const wh = new Webhook(secret)

    
    try {
        const res = wh.verify(payload, headers)

        console.log('res:', res)

        return new Response('ok', { status: 200 })
    } catch (error) {
        console.error('error:', error)

        return new Response('error', { status: 500 })
    }
})    