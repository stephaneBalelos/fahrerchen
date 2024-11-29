import type { Database, RolePermission, UserRole } from "~/types/app.types"

export const useUserPermissionsStore = defineStore('permissions', () => {
    const supabase = useSupabaseClient<Database>()
    const permissions = ref<RolePermission[]>([]);
    const userOrganizationsStore = useUserOrganizationsStore();


    function hasPermission(permission: RolePermission) {
        return permissions.value.includes(permission)
    }

    async function loadPermissions(role: UserRole) {
        const { data, error } = await supabase.from('role_permissions').select('*').eq('role', role)
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('No data')
            permissions.value = []
        }
        permissions.value = data.map((row) => row.permission)
        console.log('Permissions loaded', permissions.value)
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        console.log('Selected organization changed')
        if (userOrganizationsStore.selectedOrganization) {
            await loadPermissions(userOrganizationsStore.selectedOrganization.role)
        }
    }, { immediate: true })


    return { permissions, hasPermission, loadPermissions }

})