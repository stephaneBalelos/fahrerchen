/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverSupabaseServiceRole } from '#supabase/server'
import type { User } from '@supabase/supabase-js'
import { addWeeks, setDay, setHours } from 'date-fns'
import { createSchedule } from '~/server/utils/demo'
import { randomNumber } from '~/server/utils/utilities'
import type { AppCourse, AppCourseActivity, AppStudent, Database } from '~/types/app.types'


export default defineEventHandler(async (event) => {

    const user = event.context.auth as User

    console.log('start generating demo data')

    if (!user) {
        return createError({
            status: 403,
            statusMessage: 'Forbidden'
        })
    }

    const faker_base_url = 'https://fakerapi.it/api/v2'

    const client = serverSupabaseServiceRole<Database>(event)

    // Get Current User name
    const { data: user_data } = await client.from('users').select('firstname, lastname').eq('id', user.id).single()

    if (!user_data) {
        return createError({
            status: 404,
            statusMessage: 'User not found'
        })
    }

    try {
        // Get Some fake Addresses
        const address = await $fetch(`${faker_base_url}/addresses?_quantity=1&_country_code=DE`) as any
        const students = await $fetch(`${faker_base_url}/persons?_quantity=30&_birthday_start=2005-01-01&_birthday_end=2006-12-31&_locale=DE`) as any
        // Generate Organisation
        const { data: org } = await client.from('organizations').insert({
            name: `${user_data.firstname}'s Fahrschule`,
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
        const { data: courses } = await client.from('courses').insert([
            {
                name: 'Führerschein Klasse B',
                description: 'Führerschein Klasse B - PKW',
                organization_id: org.id,
                allow_self_registration: false,
                create_bill_on_subscription: false,
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

        // Generate Course Activities
        const courseActivities = courses.map((course: AppCourse) => {
            const course_activities: Omit<AppCourseActivity, "id">[] = [
                {
                    name: 'Theorie',
                    description: 'Theorieunterricht',
                    course_id: course.id,
                    organization_id: org.id,
                    activity_type: 1,
                    price: 45,
                    required: 12,
                    sorting_order: 1
                },
                {
                    name: 'Praxis',
                    description: 'Praxisunterricht',
                    course_id: course.id,
                    organization_id: org.id,
                    activity_type: 2,
                    price: 45,
                    required: 12,
                    sorting_order: 2
                },
                {
                    name: 'Theorieprüfung',
                    description: 'Theorieprüfung',
                    course_id: course.id,
                    organization_id: org.id,
                    activity_type: 3,
                    price: 30,
                    required: 1,
                    sorting_order: 3
                },
                {
                    name: 'Praxisprüfung',
                    description: 'Praxisprüfung',
                    course_id: course.id,
                    organization_id: org.id,
                    activity_type: 4,
                    price: 60,
                    required: 1,
                    sorting_order: 4
                }
            ]
            return course_activities
        }).flat()

        const { error } = await client.from('course_activities').insert(courseActivities)

        if (error) {
            return createError({
                status: 500,
                statusMessage: 'Course Activities not created'
            })
        }

        // Generate Course Required Documents
        const courseRequiredDocuments = courses.map((course: AppCourse) => {
            return [
                {
                    course_id: course.id,
                    organization_id: org.id,
                    name: 'Personalausweis',
                    description: 'Personalausweis'
                },
                {
                    course_id: course.id,
                    organization_id: org.id,
                    name: 'Passbild',
                    description: 'Passbild'
                },
                {
                    course_id: course.id,
                    organization_id: org.id,
                    name: 'Sehtest',
                    description: 'Sehtest'
                },
                {
                    course_id: course.id,
                    organization_id: org.id,
                    name: 'Erste Hilfe Kurs',
                    description: 'Erste Hilfe Kurs'
                }
            ]
        }).flat()

        const { error: error2 } = await client.from('course_required_documents').insert(courseRequiredDocuments)

        if (error2) {
            return createError({
                status: 500,
                statusMessage: 'Course Required Documents not created'
            })
        }


        // Get generated Courses Activities
        const { data: activities } = await client.from('course_activities').select('*').eq('organization_id', org.id).order('activity_type', { ascending: true })

        if (!activities) {
            return createError({
                status: 500,
                statusMessage: 'Activities not found'
            })
        }
        // Generate Schedules
        for (let i = 0; i < activities.length; i++) {
            const activity = activities[i];

            switch (activity.activity_type) {
                case 1:
                    // Theory
                    // Create 20 Schedules in the past with 2 schedules per week
                    {
                        let date = setHours(addWeeks(new Date(), -10), 18)

                        for (let j = 0; j < 10; j++) {
                            date = addWeeks(date, 1)
                            const d1 = setDay(date, 2) // Tuesday
                            const d2 = setDay(date, 4) // Thursday
                            await createSchedule(event, activity.course_id, activity.id, org.id, d1)
                            await createSchedule(event, activity.course_id, activity.id, org.id, d2)
                        }
                        break;
                    }
                case 2:
                    // Practical
                    // Create 20 Schedules
                    // for (let j = 0; j < 20; j++) {
                    //     await createSchedule(event, activity.course_id, activity.id, org.id)
                    // }
                    break;
                case 3:
                    // Exam
                    break;
                case 4:
                    // Other
                    break;
                default:
                    break;
            }
        }

        // Generate Students
        const studentsWithOrgId = students.data.map((student: any) => {
            const s: Omit<AppStudent, "id" | "user_id" | "created_at"> = {
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
                avatar_path: null
            }
            return s
        })

        const { data: studentsData } = await client.from('students').insert(studentsWithOrgId).select('*')

        if (!studentsData) {
            return createError({
                status: 500,
                statusMessage: 'Students not created'
            })
        }

        // Generate Subscriptions Data
        const subscriptionsData = studentsData.map((student: AppStudent) => {
            // random course
            const c = courses[randomNumber(0, courses.length - 1)]
            return {
                student_id: student.id,
                course_id: c.id,
                organization_id: org.id,
            }
        })

        for (let i = 0; i < subscriptionsData.length; i++) {
            const sub = subscriptionsData[i]
            await generateStudentPersona(event, sub.organization_id, sub.student_id, sub.course_id)
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