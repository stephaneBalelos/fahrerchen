import type { Database, AppOrganization, AppUserOrganizationsView } from "~/types/app.types"
import { useUserStore } from "./user"

export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organizations = ref<AppUserOrganizationsView[]>([])
    const isLoading = ref(true)
    const selectedOrganizationId = ref<string | null>(null)

    const selectedOrganization = computed(() => {
        if (!selectedOrganizationId.value) {
            return null
        }
        return organizations.value.find(org => org.organization_id === selectedOrganizationId.value) || null
    })


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
        const { data, error } = await supabase.from('users_organizations_view').select('*').eq('user_id', userStore.user.id).order('organization_name', { ascending: true })
        if (error) {
            console.error(error)
            return
        }
        organizations.value = data
        isLoading.value = false
    }

    function relativePath(path: string) {
        if (!selectedOrganizationId.value) {
            return '/my'
        }
        return `/my/${selectedOrganizationId.value}${path}`
    }

    async function selectOrganization(org_id: string) {
        await loadOrganizationsMemberships()
        const organization = organizations.value.find(org => org.organization_id === org_id)
        if (!organization) {
            console.error(`Organization with id ${org_id} not found`)
            return
        }
        selectedOrganizationId.value = organization.organization_id
    }

    function clearSelectedOrganization() {
        selectedOrganizationId.value = null
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