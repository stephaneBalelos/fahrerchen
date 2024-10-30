import type { AppOrganizationMember, AppUser, AppUserWithRole, Database, UserRole } from "~/types/app.types";

export type OrganizationMember = AppUser & {role: UserRole, member_id: string}

export function useOrganizationMembers(organizationId: string, role?: UserRole) {
    const client = useSupabaseClient<Database>()

    const organization_id = ref<string>(organizationId)

    const organization_members = ref<OrganizationMember[]>([])

    watch(() => organization_id, async () => {

        const query = client.from('organization_members').select("*, users(*)").eq('organization_id', organization_id.value)

        if(role) {
            query.eq('role', role)
        }
        
        const { data, error } = await query
        if(error) {
            console.error(error)
            organization_members.value = []
        }
        if(data) {
            organization_members.value = data.map((member) => {
                if (member.users == null) {
                    return null
                }
                return {
                    ...member.users,
                    role: member.role,
                    member_id: member.id
                }
            }).filter((m) => m !== null)
        }
    }, { immediate: true })

    return { organization_id, organization_members }
}