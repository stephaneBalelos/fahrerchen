import type { AppCourseActivityType, AppCourseType, CourseActivityEdit, CourseCostEdit, CourseRequiredDocumentEdit, Database, UserRole } from "~/types/app.types";

export const USER_ROLES: UserRole[] = ['owner', 'manager', 'teacher', 'student']

export const SCHEDULES_STATUS: Database["public"]["Enums"]["schedule_status"][] = [
    "PLANNED", "CANCELED", "COMPLETED"
]

export const COURSE_TYPES: AppCourseType[] = [
    'AM', 'A1', 'A2', 'A', 'B', 'BE', 'C1', 'C1E', 'C', 'CE', 'D1', 'D1E', 'D', 'DE', 'L', 'T'
]

export const COURSE_ICONS = {
    'B': 'ri-car-line',
    'AM': 'ri-motorbike-line',
    'A1': 'ri-motorbike-line',
    'A2': 'ri-motorbike-line',
    'A': 'ri-motorbike-line',
    'BE': 'ri-caravan-line',
    'C1': 'ri-truck-line',
    'C1E': 'ri-truck-line',
    'C': 'ri-truck-line',
    'CE': 'ri-truck-line',
    'D1': 'ri-bus-line',
    'D1E': 'ri-bus-line',
    'D': 'ri-bus-line',
    'DE': 'ri-bus-line',
    'L': 'ph-tractor',
    'T': 'ph-tractor'
}

export const ACTIVITY_TYPES: AppCourseActivityType[] = ['THEORY', 'PRACTICE', 'EXAM', 'OTHER'] as const;

export const ACTIVITY_ICONS = {
    'THEORY': 'ri-book-2-line',
    'PRACTICE': 'ri-steering-line',
    'EXAM': 'ri-file-list-line',
    'OTHER': 'ri-file-list-line'
}

export type StandardCourseActivitiesTemplate = {
    costs: CourseCostEdit[];
    activities: CourseActivityEdit[];
    required_documents: CourseRequiredDocumentEdit[];
}

export const getStandardCourseActivitiesTemplate = (): StandardCourseActivitiesTemplate => {
    // Todo: Add Translations
    // Starts with A
    return {
        costs: [
            {
                name: "Grundgebühr",
                description: "Anmelde- und Verwaltungskosten",
                price: 250,
            },
            {
                name: "Lernmaterial",
                description: "Lehrbücher und Online-Ressourcen",
                price: 100,
            }
        ],
        activities: [
            {
                name: "Grundstoffunterricht",
                description: "Theoretischer Unterricht gemäß StVZO",
                price: 40,
                required: 12,
                activity_type: "THEORY", // THEORY
                allow_requests: false,
                allow_self_registration: true,
                sorting_order: 1,
            },
            {
                name: "Zusatzstoff Motorrad",
                description: "Theoretischer Unterricht für Motorradfahrer",
                price: 40,
                required: 4,
                activity_type: "THEORY", // THEORY
                allow_requests: false,
                allow_self_registration: true,
                sorting_order: 3,
            },
            {
                name: "Sonderfahrten",
                description: "Überland-, Autobahn- und Nachtfahrten",
                price: 60,
                required: 5,
                activity_type: "PRACTICE", // PRACTICE
                allow_requests: true,
                allow_self_registration: true,
                sorting_order: 2,
            },
            {
                name: "Praktische Prüfung",
                description: "Prüfung durch den TÜV oder DEKRA",
                price: 150,
                required: 1,
                activity_type: "EXAM", // EXAM
                allow_requests: false,
                allow_self_registration: false,
                sorting_order: 4,
            }
        ],
        required_documents: [
            {
                name: "Personalausweis oder Reisepass",
                description: "Gültiges Identifikationsdokument",
            },
            {
                name: "Biometrisches Passfoto",
                description: "Aktuelles Passfoto nach biometrischen Standards",
            },
            {
                name: "Sehtestbescheinigung",
                description: "Nachweis über die bestandene Sehtestuntersuchung",
            },
            {
                name: "Erste-Hilfe-Nachweis",
                description: "Bescheinigung über die Teilnahme an einem Erste-Hilfe-Kurs",    
            },
        ],
    }
}