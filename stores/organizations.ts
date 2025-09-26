import type { Database, AppOrganization, OrganizationEdit } from "~/types/app.types"
import { useUserStore } from "./user"

export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organizations = ref<AppOrganization[]>([])
    const isLoading = ref(true)
    const route = useRoute()

    // Selected organization based on route param org_id
    const selectedOrganization = computed(() => {
        if (route.params.org_id && organizations.value.length > 0) {
            return organizations.value.find(o => o.id === route.params.org_id) || null
        }
        return null
    });

    function relativePath(path: string) {
        if (!selectedOrganization.value) {
            return '/my'
        }
        return `/my/${selectedOrganization.value.id}${path}`
    }


    const loadOrganizationsMemberships = async () => {
        isLoading.value = true
        if (!userStore.user) {
            organizations.value = []
            isLoading.value = false
            return
        }
        const { data, error } = await supabase
            .from('organization_members')
            .select('id, organization:organization_id(*)')
            .eq('user_id', userStore.user.id)
        if (error) {
            console.error("Error loading organizations memberships:", error)
            organizations.value = []
        } else {
            organizations.value = data ? data.map(d => (d.organization)) : []
        }
        isLoading.value = false
    }

    const getOrganizationById = async (id: string) => {
        console.log("Get organization by ID:", id)
        if (organizations.value.length === 0) {
            await loadOrganizationsMemberships()
        }
        const org = organizations.value.find(o => o.id === id)
        if (!org) {
            await loadOrganizationsMemberships()
        }
        return organizations.value.find(o => o.id === id) || null
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

    const createOrganization = async (data: OrganizationEdit) => {
        const { error } = await supabase
            .from('organizations')
            .insert(data)
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

    return { organizations, loadOrganizationsMemberships, getOrganizationById, updateOrganizationById, createOrganization, relativePath, selectedOrganization, isLoading }


})