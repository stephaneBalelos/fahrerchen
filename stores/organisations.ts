import type { AppOrganization, AppOrganizationMember, Database } from "~/types/app.types"
import { useUserStore } from "./user"

export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organisations = ref<AppOrganizationMember[]>([])
    const selectedOrganization = ref<AppOrganizationMember | null>(null)

    async function createOrganization(organization: AppOrganization) {
        if (!userStore.user) {
            return
        }
        try {
            const { data, error } = await supabase.from('organizations').insert({
                name: organization.name,
                owner_id: userStore.user.id
            })
            if (error) {
                console.error(error)
                return
            }
            await loadOrganizationsMemberships()
        } catch (error) {
            console.error(error)
        }
    }

    async function loadOrganizationsMemberships() {
        if (!userStore.user) {
            return
        }
        const { data, error } = await supabase.from('organization_members').select('*').eq('user_id', userStore.user.id)
        if (error) {
            console.error(error)
            return
        }
        organisations.value = data
    }

    function selectOrganization(organization: AppOrganizationMember) {
        selectedOrganization.value = organization
    }

    function clearSelectedOrganization() {
        selectedOrganization.value = null
    }

    watch(() => userStore.user, async () => {
        if (!userStore.user) {
            organisations.value = []
            return
        }
        const { data, error } = await supabase.from('organization_members').select('*').eq('user_id', userStore.user.id)
        if (error) {
            console.error(error)
            return
        }
        organisations.value = data
    }, { immediate: true })

    return { organisations, selectedOrganization }

    
})