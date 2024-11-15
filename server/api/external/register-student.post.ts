import { serverSupabaseClient } from '#supabase/server'
import { AppStudentRegistrationRequest, Database } from '~/types/app.types'


export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient<Database>(event)
  const body = await readBody(event) as AppStudentRegistrationRequest

  const { data, error } = await client.from('students_registration_requests').insert({
    email: body.email,
    firstname: body.firstname,
    lastname: body.lastname,
    phone_number: body.phone_number,
    address_street: body.address_street,
    address_city: body.address_city,
    address_zip: body.address_zip,
    address_country: body.address_country,
    birth_date: body.birth_date,
    has_a_license: body.has_a_license,
    requested_course_id: body.requested_course_id,
    organization_id: body.organization_id,
  })

  if (error) {
    throw createError({
      status: 500,
      statusMessage: error.message
    })
  }

  setResponseStatus(event, 201)
  return data
})