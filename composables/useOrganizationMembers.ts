import type { Database, UserRole } from "~/types/app.types";

export async function useOrganizationMembers(orgid: string, staff?: Boolean) {
    const client = useSupabaseClient<Database>()
    try {
        const promise = client.from('organization_members').select('*, user:users(firstname, lastname, fullname, email)').eq('organization_id', orgid)
        if (staff) {
            promise.neq('role', 'student')
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