import type { User } from "@supabase/supabase-js"
import { Readable } from "stream"

export default defineEventHandler(async (event) => {
    // Check Auth State
    const user = event.context.auth as User
    if (!user) {
        return createError({
            status: 403,
            statusMessage: 'Forbidden'
        })
    }


    
    // Get the template
    const templateHTML = await useStorage('assets:server').getItem('templates/invoices/template-1.html')
    if (!templateHTML) {
        return createError({
            status: 404,
            statusMessage: 'Template not found'
        })
    }
    templateHTML.toString()

    // Set the headers
    setHeader(event, 'Content-Type', 'text/html; charset=utf-8')
    setHeader(event, 'Content-Disposition', `attachment; templated-name="invoice-template-1.html"`)
    setHeader(event, 'Content-Length', Buffer.byteLength(templateHTML.toString()))
    setHeader(event, 'Cache-Control', 'no-cache')

    return sendStream(event, Readable.from([templateHTML.toString()]))

})