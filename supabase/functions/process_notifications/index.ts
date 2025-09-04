
Deno.serve((req) => {
    if (req.method !== 'POST') {
        return new Response('not allowed', { status: 400 })
    }
    return new Response(`Processing notifications...`, { status: 200 })
})
