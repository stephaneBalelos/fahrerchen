import type { AppOrganization, AppOrganizationMember, Database } from "~/types/app.types"
import { useUserStore } from "./user"

export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organizations = ref<AppOrganizationMember[]>([])
    const selectedOrganization = ref<AppOrganizationMember | null>(null)
    const isLoading = ref(true)

    async function createOrganization(organization: AppOrganization) {
        if (!userStore.user) {
            return
        }
        try {
            const { error } = await supabase.from('organizations').insert({
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
        isLoading.value = true
        const { data, error } = await supabase.from('organization_members').select('*').eq('user_id', userStore.user.id)
        if (error) {
            console.error(error)
            return
        }
        organizations.value = data
        isLoading.value = false
    }

    function relativePath(path: string) {
        return `/my/${selectedOrganization.value?.organization_id}${path}`
    }

    async function selectOrganization(org_id: string) {
        await loadOrganizationsMemberships()
        selectedOrganization.value = organizations.value.find(org => org.organization_id === org_id) ?? null
    }

    function clearSelectedOrganization() {
        selectedOrganization.value = null
    }

    watch(() => userStore.user, async () => {
        if (!userStore.user) {
            organizations.value = []
            return
        }
        await loadOrganizationsMemberships()
    }, { immediate: true })

    return { organizations, selectedOrganization, isLoading, relativePath, loadOrganizationsMemberships, createOrganization, selectOrganization, clearSelectedOrganization }

    
})