import type { Database, AppUserOrganizationsView, AppOrganization } from "~/types/app.types"
import { useUserStore } from "./user"

export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organizations = ref<AppUserOrganizationsView[]>([])
    const isLoading = ref(true)
    const route = useRoute()

    // Selected organization based on route param org_id
    const selectedOrganization = computed(() => {
        if (route.params.org_id && organizations.value.length > 0) {
            return organizations.value.find(o => o.organization_id === route.params.org_id) || null
        }
        return null
    });

    function relativePath(path: string) {
        if (!selectedOrganization.value) {
            return '/my'
        }
        return `/my/${selectedOrganization.value.organization_id}${path}`
    }


    const loadOrganizationsMemberships = async () => {
        isLoading.value = true
        if (!userStore.user) {
            organizations.value = []
            isLoading.value = false
            return
        }
        const { data, error } = await supabase
            .from('users_organizations_view')
            .select('*')
            .eq('user_id', userStore.user.id)
            .overrideTypes<AppUserOrganizationsView[]>()
        if (error) {
            console.error("Error loading organizations memberships:", error)
            organizations.value = []
        } else {
            organizations.value = data || []
        }
        isLoading.value = false
    }

    const getOrganizationById = async (id: string) => {
        console.log("Get organization by ID:", id)
        if (organizations.value.length === 0) {
            await loadOrganizationsMemberships()
        }
        const org = organizations.value.find(o => o.organization_id === id)
        if (!org) {
            await loadOrganizationsMemberships()
        }
        return organizations.value.find(o => o.organization_id === id) || null
    }

    const updateOrganizationById = async (id: string, updates: Partial<AppOrganization>) => {
        const { error } = await supabase
            .from('organizations')
            .update(updates)
            .eq('id', id)
        if (error) {
            throw error
        }
        await loadOrganizationsMemberships()
    }

    watch(() => userStore.user, async () => {
        if (!userStore.user) {
            organizations.value = []
            return
        }
        await loadOrganizationsMemberships()
    }, { immediate: true })

    return { organizations, loadOrganizationsMemberships, getOrganizationById, updateOrganizationById, relativePath, selectedOrganization, isLoading }


})