import type { Database, AppOrganization, OrganizationEdit, AppOrganizationBillingSettings, OrganizationBillingSettingsEdit, UserRole, AppUser } from "~/types/app.types"
import { useUserStore } from "./user"

export type UserOrganization = AppOrganization & { organization_role: UserRole }
export type OrganizationMember = (AppUser & { organization_role: UserRole, organization_member_id: string })
export const useUserOrganizationsStore = defineStore('userOrganizations', () => {
    const supabase = useSupabaseClient<Database>()
    const userStore = useUserStore()
    const organizations = ref<UserOrganization[]>([])
    const selectedOrganizationMembers = ref<OrganizationMember[]>([])

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
            .select('id, role, organization:organization_id(*)')
            .eq('user_id', userStore.user.id)
        if (error) {
            console.error("Error loading organizations memberships:", error)
            organizations.value = []
        } else {
            organizations.value = data ? data.map(d => {
                return { ...d.organization, organization_role: d.role }
            }) : []
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

    const getOrganizationBillingSettings = async (orgId: string): Promise<AppOrganizationBillingSettings | null> => {
        const { data, error } = await supabase
            .from('organization_billing_settings')
            .select('*')
            .eq('id', orgId)
        if (error) {
            return null
        } else {
            return data[0] || null
        }
    }


    const createBillingSettings = async (settings: OrganizationBillingSettingsEdit): Promise<AppOrganizationBillingSettings | null> => {
        if (!selectedOrganization.value) {
            throw new Error("No organization selected")
        }
        const orgId = selectedOrganization.value.id
        const { data, error } = await supabase
            .from('organization_billing_settings')
            .insert({
                ...settings,
                id: orgId
            })
            .select('*')
            .single()
        if (error) {
            console.error("Error saving billing settings:", error)
            throw error
        }
        return data
    }

    const updateBillingSettings = async (settings: Partial<OrganizationBillingSettingsEdit>): Promise<AppOrganizationBillingSettings | null> => {
        if (!selectedOrganization.value) {
            throw new Error("No organization selected")
        }
        const orgId = selectedOrganization.value.id
        const { data, error } = await supabase
            .from('organization_billing_settings')
            .update(settings)
            .eq('id', orgId)
            .select('*')
            .single()
        if (error) {
            console.error("Error updating billing settings:", error)
            throw error
        }
        return data
    }

    const getOrganizationMembers = async (orgId: string, roles: UserRole[] = [], search: string = ""): Promise<OrganizationMember[]> => {
        let query = supabase
            .from('organization_members')
            .select('id, role, user:users!user_id(*)')

        if (roles.length > 0) {
            query = query.in('role', roles)
        }
        if (search) {
            query = query.or(`email.ilike.%${search}%,firstname.ilike.%${search}%,lastname.ilike.%${search}%`, {
                referencedTable: 'users'
            })
        }
        query = query.eq('organization_id', orgId)

        const { data, error } = await query
        if (error) {
            console.error("Error loading organization members:", error)
            return []
        }
        return data ? data.map(d => {
            return {
                ...d.user,
                organization_role: d.role,
                organization_member_id: d.id
            }
        }) : []
    }

    watch(() => route.params.org_id, async (newOrgId, oldOrgId) => {
        if (newOrgId && newOrgId !== oldOrgId) {
            try {
                selectedOrganizationMembers.value = await getOrganizationMembers(newOrgId as string)
            } catch (error) {
                console.error("Error loading organization members:", error)
            }
        }
    }, { immediate: true })

    watch(() => userStore.user, async () => {
        if (!userStore.user) {
            organizations.value = []
            return
        }
        await loadOrganizationsMemberships()
    }, { immediate: true })

    return {
        organizations, selectedOrganizationMembers, loadOrganizationsMemberships, getOrganizationById, updateOrganizationById, createOrganization, relativePath, selectedOrganization, isLoading,
        getOrganizationBillingSettings, createBillingSettings, updateBillingSettings, getOrganizationMembers
    }


})