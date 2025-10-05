import type { AppOrganizationNotification } from "~/types/app.types";

export const useNotificationsStore = defineStore('notifications', () => {
    const client = useSupabaseClient();
    const userStore = useUserStore()
    const organizationsStore = useUserOrganizationsStore()
    const notifications = ref<AppOrganizationNotification[]>([])

    async function loadNotifications() {
        if (!userStore.user) {
            return
        }
        if (!organizationsStore.selectedOrganization) {
            return
        }
        const { data, error } = await client.from('organization_notifications').select('*')
        .eq('organization_id', organizationsStore.selectedOrganization.id)
        .contains('target_user_ids', [userStore.user.id])
        .order('created_at', { ascending: false })
        
        if (error) {
            console.error(error)
            return
        }

        console.log('Loaded notifications:', data)

        notifications.value = data
    }

    async function markAsRead(id: string) {

        console.log('Marking notification as read:', id)

    }

    // watch(() => userStore.user, async () => {
    //     if (userStore.user) {
    //         await loadNotifications()
    //     }
    // }, {
    //     immediate: true
    // })

    watch(() => organizationsStore.selectedOrganization, async () => {
        if (organizationsStore.selectedOrganization) {
            await loadNotifications()
        } else {
            notifications.value = []
        }
    }, {
        immediate: true
    })

    return {
        notifications,
        loadNotifications,
        markAsRead
    }
})