import { serverSupabaseServiceRole } from '#supabase/server'
import { User } from '@supabase/supabase-js'
import { AppStudent, Database } from '~/types/app.types'


export default defineEventHandler(async (event) => {

    const user = event.context.auth as User

    console.log('User', user)

    if (!user) {
        return createError({
            status: 403,
            statusMessage: 'Forbidden'
        })
    }

    const faker_base_url = 'https://fakerapi.it/api/v2'

    const client = serverSupabaseServiceRole<Database>(event)

    // Get Some fake Addresses
    
    try {
        const address = await $fetch(`${faker_base_url}/addresses?_quantity=1&_country_code=DE`) as any
        const students = await $fetch(`${faker_base_url}/persons?_quantity=30&_birthday_start=2005-01-01&_birthday_end=2006-12-31&_locale=DE`) as any
        // Generate Organisation
        const { data:org } = await client.from('organizations').insert({
            name: 'Meine Fahrschule',
            owner_id: user.id,
            preferred_language: 'de',
            address_city: address.data[0].city,
            address_country: "Deutschland",
            address_street: address.data[0].street,
            address_zip: address.data[0].zipcode,
            allow_self_registration: false
        }).select('*').single()

        if (!org) {
            return createError({
                status: 500,
                statusMessage: 'Organisation not created'
            })
        }

        // Generate Courses
        const { data:courses } = await client.from('courses').insert([
            {
                name: 'Führerschein Klasse B',
                description: 'Führerschein Klasse B - PKW',
                organization_id: org.id,
                allow_self_registration: false,
                create_bill_on_subscription: true,
                is_active: true,
                type: 5
            },
            {
                name: 'Führerschein Klasse A',
                description: 'Führerschein Klasse A - Motorrad',
                organization_id: org.id,
                allow_self_registration: false,
                create_bill_on_subscription: true,
                is_active: true,
                type: 4
            }
        ]).select('*')

        if (!courses) {
            return createError({
                status: 500,
                statusMessage: 'Courses not created'
            })
        }

        // Generate Students
        const studentsWithOrgId = students.data.map((student: any) => {
            const s: Omit<AppStudent, "id" | "user_id"> = {
                firstname: student.firstname,
                lastname: student.lastname,
                email: student.email,
                phone_number: student.phone,
                birth_date: new Date(student.birthday).toISOString(),
                organization_id: org.id,
                address_city: student.address.city,
                address_country: student.address.country,
                address_street: student.address.street,
                address_zip: student.address.zipcode,
                has_a_license: false,
                self_registered: false
            }
            return s
        })

        const { data:studentsData } = await client.from('students').insert(studentsWithOrgId).select('*')

        if (!studentsData) {
            return createError({
                status: 500,
                statusMessage: 'Students not created'
            })
        }

        // Generate Subscriptions
        const subscriptions = studentsData.map((student: AppStudent) => {
            // random course
            const c = courses[Math.floor(Math.random() * courses.length)]
            return {
                student_id: student.id,
                course_id: c.id,
                organization_id: org.id,
            }
        })

        const { data:subscriptionsData } = await client.from('course_subscriptions').insert(subscriptions).select('*')

        if (!subscriptionsData) {
            return createError({
                status: 500,
                statusMessage: 'Subscriptions not created'
            })
        }

        return {
            status: 200,
            body: {
                message: 'Demo data generated',
                organization: org,
                courses,
                students: studentsData,
                subscriptions: subscriptionsData
            }
        }

        
    } catch (error) {
        console.log(error)
        return createError({
            status: 500,
            statusMessage: 'Internal Server Error'
        })
    }

})