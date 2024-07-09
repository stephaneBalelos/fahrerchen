import type { AppOrganisationMember, AppUser, AppUserWithRole, Database, UserRole } from "~/types/app.types";

export type OrganisationMember = AppUser & {role: UserRole, member_id: string}

export function useOrganisationMembers(organisationId: string, role?: UserRole) {
    const client = useSupabaseClient<Database>()

    const organisation_id = ref<string>(organisationId)

    const organisation_members = ref<OrganisationMember[]>([])

    watch(() => organisation_id, async () => {

        const query = client.from('organisation_members').select("*, users(*)").eq('organisation_id', organisation_id.value)

        if(role) {
            query.eq('role', role)
        }
        
        const { data, error } = await query
        if(error) {
            console.error(error)
            organisation_members.value = []
        }
        if(data) {
            organisation_members.value = data.map((member) => {
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

    return { organisation_id, organisation_members }
}