import type { User } from "@supabase/supabase-js"
import Handlebars from "handlebars"
import { format } from "date-fns"
import { Readable } from "stream"
import { getBillDataById, getBillItemsByBillId, getOrganisationBilllingSettings, getStudentById } from "~/server/utils/supabase"
import type { BillTemplateData } from "~/types/app.types"

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
    const templateHTML = await useStorage('assets:server').getItem('templates/invoices/template-1.html')
    if (!templateHTML) {
        return createError({
            status: 404,
            statusMessage: 'Template not found'
        })
    }
    const template = Handlebars.compile(templateHTML)


    // Get the data
    const billData = await getBillDataById(event, id)
    if (!billData) {
        return createError({
            status: 404,
            statusMessage: 'Bill not found'
        })
    }
    const organization = await getOrganisationById(event, billData.organization_id)
    if (!organization) {
        return createError({
            status: 404,
            statusMessage: 'Organization not found'
        })
    }
    const billItems = await getBillItemsByBillId(event, billData.id)
    if (!billItems) {
        return createError({
            status: 404,
            statusMessage: 'Bill items not found'
        })
    }

    const billingSettings = await getOrganisationBilllingSettings(event, billData.organization_id)
    if (!billingSettings) {
        return createError({
            status: 404,
            statusMessage: 'Billing settings not found'
        })
    }

    const studentData = await getStudentById(event, billData.student_id)
    if (!studentData) {
        return createError({
            status: 404,
            statusMessage: 'Student not found'
        })
    }

    const data: BillTemplateData = {
        driving_school_name: organization.name,
        driving_school_address_street: organization.address_street,
        driving_school_address_zip: organization.address_zip,
        driving_school_address_city: organization.address_city,
        driving_school_address_country: organization.address_country,
        driving_school_email: organization.email,
        driving_school_phone_number: organization.phone_number,
        student_firstname: studentData.firstname,
        student_lastname: studentData.lastname,
        student_address_street: studentData.address_street || '',
        student_address_zip: studentData.address_zip || '',
        student_address_city: studentData.address_city || '',
        student_address_country: studentData.address_country || '',
        bill_date: format(new Date(billData.created_at), 'dd.MM.yyyy'),
        bill_number: billData.bill_number,
        invoice_title: billingSettings.invoice_title,
        invoice_subtitle: billingSettings.invoice_subtitle || '',
        invoice_message: billingSettings.invoice_message || '',
        invoice_footer: billingSettings.invoice_footer || '',
        bill_total: billData.total.toFixed(2),
        bill_vat_exempt: billingSettings.vat_exempt,
        bill_vat_rate: billData.vat_rate ? `${billData.vat_rate}` : '0',
        bill_vat_amount: billData.vat_amount ? `${billData.vat_amount.toFixed(2)}` : '0.00',
        bill_total_with_vat: billData.total_with_vat ? `${billData.total_with_vat.toFixed(2)}` : '0.00',
        bill_settings_bank_account_name: billingSettings.bank_account_name || '',
        bill_settings_bank_account_number: billingSettings.bank_account_number || '',
        bill_settings_bank_account_bic: billingSettings.bank_account_bic || '',
        bill_settings_bank_account_iban: billingSettings.bank_account_iban || '',
        bill_settings_tax_id: billingSettings.tax_id || '',
        bill_items: billItems.map(item => ({
            title: item.title,
            description: item.description || '',
            date: format(new Date(item.inserted_at), 'dd.MM.yyyy'),
            total: item.price.toFixed(2),
        }))
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
    // await storage.setItem(`debug/bill-template-1-${id}.html`, html)


    const pdf = await generatePDF(html)

    if (!pdf) {
        return createError({
            status: 500,
            statusMessage: 'Failed to generate PDF'
        })
    }

    // Set the headers
    setHeader(event, 'Content-Type', 'application/pdf')
    setHeader(event, 'Content-Disposition', `attachment; filename="bill-${id}.pdf"`)
    setHeader(event, 'Content-Length', pdf.length)
    setHeader(event, 'Cache-Control', 'no-cache')

    return sendStream(event, Readable.from([pdf]))

})