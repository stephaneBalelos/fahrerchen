import type { Database } from "~/types/app.types";

export const SCHEDULES_STATUS: Database["public"]["Enums"]["schedule_status"][] = [
    "PLANNED", "CANCELED", "COMPLETED"
]

export const COURSE_ICONS = {
    'AM': 'ri-motorbike-line',
    'A1': 'ri-motorbike-line',
    'A2': 'ri-motorbike-line',
    'A': 'ri-motorbike-line',
    'B': 'ri-car-line',
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