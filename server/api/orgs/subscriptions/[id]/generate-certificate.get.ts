import type { User } from "@supabase/supabase-js"
import Handlebars from "handlebars"
import { Readable } from "stream"
import { getSubscriptionCertifcateData } from "~/server/utils/supabase"

export default defineEventHandler(async (event) => {
    // Check Auth State
    const user = event.context.auth as User
    if (!user) {
        return createError({
            status: 403,
            statusMessage: 'Forbidden'
        })
    }

    // Get the id
    const id = getRouterParam(event, 'id')
    if (!id) {
        return createError({
            status: 400,
            statusMessage: 'Bad Request'
        })
    }
    
    // Get the template
    const templateHTML = await useStorage('assets:server').getItem('templates/training-certificate.html')
    if (!templateHTML) {
        return createError({
            status: 404,
            statusMessage: 'Template not found'
        })
    }
    const template = Handlebars.compile(templateHTML)

    // Get the data
    const data = await getSubscriptionCertifcateData(event, id)
    if (!data) {
        return createError({
            status: 404,
            statusMessage: 'Subscription not found'
        })
    }

    // Build the pdf
    const html = template(data)

    if (!html) {
        return createError({
            status: 500,
            statusMessage: 'Failed to generate HTML'
        })
    }

    // Debug html
    // const storage = useStorage('assets:server')
    // await storage.setItem(`debug/certificate-${id}.html`, html)


    const pdf = await generatePDF(html)

    if (!pdf) {
        return createError({
            status: 500,
            statusMessage: 'Failed to generate PDF'
        })
    }

    // Set the headers
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="certificate-${id}.pdf"`)
    setHeader(event, 'Content-Length', pdf.length)
    setHeader(event, 'Cache-Control', 'no-cache')

    return sendStream(event, Readable.from([pdf]))

})