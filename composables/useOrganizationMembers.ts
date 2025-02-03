import type { Database, UserRole } from "~/types/app.types";

export async function useOrganizationMembers(orgid: string, roles: UserRole[] = [], search?: string) {
    const client = useSupabaseClient<Database>()
    try {
        const promise = client.from('organization_members_view').select().eq('organization_id', orgid)
        if (roles.length > 0) {
            promise.in('role', roles)
        }
        if (search) {
            promise.or(`user_email.ilike.%${search}%,user_firstname.ilike.%${search}%,user_lastname.ilike.%${search}%`)
        }
        const { data, error } = await promise
        if (error) {
            throw error
        }
        return data ?? []
    } catch (error) {
        console.log(error)
        return []
    }
} 