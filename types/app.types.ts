import type { Database } from "./database.types";

export type UserRole = Database['public']['Enums']['app_role']
export type AppOrganisation = Database['public']['Tables']['organisations']['Row']

