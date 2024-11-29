export default defineNuxtRouteMiddleware((to) => {
    const { $pinia } = useNuxtApp()
    if (!$pinia) {
        abortNavigation("Pinia store is not provided")
        throw new Error('Pinia store is not provided')
    }
    const organizationsStore = useUserOrganizationsStore($pinia)

    if (organizationsStore.selectedOrganization) {
        return
    } else {
        return '/'
    }
})
