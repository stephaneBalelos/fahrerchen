/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverSupabaseServiceRole } from '#supabase/server'
import type { User } from '@supabase/supabase-js'
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

    // Get Some fake Addresses

    try {
        const address = await $fetch(`${faker_base_url}/addresses?_quantity=1&_country_code=DE`) as any
        const students = await $fetch(`${faker_base_url}/persons?_quantity=30&_birthday_start=2005-01-01&_birthday_end=2006-12-31&_locale=DE`) as any
        // Generate Organisation
        const { data: org } = await client.from('organizations').insert({
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

        // Generate Subscriptions
        const subscriptions = studentsData.map((student: AppStudent) => {
            // random course
            const c = courses[randomNumber(0, courses.length - 1)]
            return {
                student_id: student.id,
                course_id: c.id,
                organization_id: org.id,
            }
        })

        const { data: subscriptionsData } = await client.from('course_subscriptions').insert(subscriptions).select('*')

        if (!subscriptionsData) {
            return createError({
                status: 500,
                statusMessage: 'Subscriptions not created'
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
                    // Create 20 Schedules
                    for (let j = 0; j < 20; j++) {
                        await createSchedule(event, activity.course_id, activity.id, org.id)
                    }
                    break;
                case 2:
                    // Practical
                    // Create 20 Schedules
                    for (let j = 0; j < 20; j++) {
                        await createSchedule(event, activity.course_id, activity.id, org.id)
                    }
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

        subscriptionsData.forEach(async (subscription) => {

            // TODO: Optimize this mess

            const { data: activities } = await client.from('course_activities').select('*').eq('course_id', subscription.course_id).eq('organization_id', org.id)

            if (!activities) {
                return
            }

            activities.forEach(async (activity) => {

                if (activity.activity_type === 3 || activity.activity_type === 4) {
                    return // Skip Exam and Other
                }
                const { data: schedules } = await client.from('course_activity_schedules').select('*').eq('activity_id', activity.id).eq('organization_id', org.id)

                if (!schedules) {
                    return
                }

                if (activity.activity_type === 1) {
                    // Get theory schedules
                    const theorySchedules = schedules
                    if (theorySchedules.length > 1) {
                        const theoryCount = randomNumber(1, activity.required)
                        for (let i = 0; i < theoryCount; i++) {
                            await client.from('course_activity_attendances').insert({
                                course_subscription_id: subscription.id,
                                activity_schedule_id: theorySchedules[i].id,
                                course_activity_id: theorySchedules[i].activity_id,
                                organization_id: org.id
                            })
                        }
                    }
                }

                if (activity.activity_type === 2) {
                    // Get practical schedules
                    const practicalSchedules = schedules
                    if (practicalSchedules.length > 1) {
                        const practicalCount = randomNumber(1, activity.required)
                        for (let i = 0; i < practicalCount; i++) {
                            await client.from('course_activity_attendances').insert({
                                course_subscription_id: subscription.id,
                                activity_schedule_id: practicalSchedules[i].id,
                                course_activity_id: practicalSchedules[i].activity_id,
                                organization_id: org.id
                            })
                        }
                    }
                }
            })
        })


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