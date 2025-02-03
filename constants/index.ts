import type { Database } from "~/types/app.types";

export const SCHEDULES_STATUS: Database["public"]["Enums"]["schedule_status"][] = [
    "PLANNED", "CANCELED", "COMPLETED"
]