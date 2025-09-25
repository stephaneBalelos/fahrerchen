import type { AppCourseActivity, AppCourseCost, AppCourseType, Database } from "~/types/app.types";

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

export const ACTIVITY_ICONS = {
    'THEORY': 'ri-book-2-line',
    'PRACTICE': 'ri-steering-line',
    'EXAM': 'ri-file-list-line',
    'OTHER': 'ri-file-list-line'
}

export type StandardCourseTemplate = {
    name: string;
    description: string;
    type: AppCourseType;
    costs: Omit<
        AppCourseCost,
        "id" | "course_id" | "organization_id"
    >[];
    activities: Omit<
        AppCourseActivity,
        "id" | "course_id" | "organization_id" | "sorting_order"
    >[];
    required_documents: Omit<
        Database["public"]["Tables"]["course_required_documents"]["Row"],
        "id" | "organization_id" | "course_id" | "name_slug"
    >[];
}

export const getStandardCourseTemplate = (type: AppCourseType): StandardCourseTemplate => {
    // Todo: Add Translations
    // Starts with A
    return {
        name: `Führerschein Klasse ${type}`,
        description: `Standardkurs für den Führerschein der Klasse ${type}`,
        type: type,
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
                name: "Theoretischer Unterricht",
                description: "Grundlagen des Straßenverkehrs und Verkehrsregeln",
                price: 40,
                required: 12,
                activity_type: 0, // THEORY
                allow_requests: false,
                allow_self_registration: true
            },
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