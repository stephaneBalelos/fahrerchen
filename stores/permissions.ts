import type { Database, RolePermission, UserRole } from "~/types/app.types"

export const usePermissionsStore = defineStore('permissions', () => {
    const supabase = useSupabaseClient<Database>()
    const permissions = ref<RolePermission[]>([]);
    const userOrganizationsStore = useUserOrganizationsStore();


    function hasPermission(permission: RolePermission) {
        return permissions.value.includes(permission)
    }

    async function loadPermissions(role: UserRole) {
        const { data, error } = await supabase.from('role_permissions').select('permission').eq('role', role)
        if (error) {
            console.error(error)
            return
        }
        if (!data) {
            console.error('No data')
            permissions.value = []
        }
        permissions.value = data.map((row: { permission: RolePermission }) => row.permission)
    }

    watch(() => userOrganizationsStore.selectedOrganization, async () => {
        if (userOrganizationsStore.selectedOrganization) {
            await loadPermissions(userOrganizationsStore.selectedOrganization.role)
        }
    })


    return { permissions, hasPermission, loadPermissions }

})