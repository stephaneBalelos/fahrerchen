import type { NotificationView } from "~/types/app.types";

export const useNotificationsStore = defineStore('notifications', () => {
    const client = useSupabaseClient();
    const userStore = useUserStore()
    const notifications = ref<NotificationView[]>([])

    async function loadNotifications() {
        if (!userStore.user) {
            return
        }
        const { data, error } = await client.from('notifications_view').select('*').overrideTypes<Array<NotificationView>, { merge: false }>()
        if (error) {
            console.error(error)
            return
        }
        console.log(data)
        notifications.value = data
    }

    async function markAsRead(id: string) {
        if (!userStore.user) {
            return
        }
        const n = notifications.value.find(n => n.id === id)
        if (!n || n.read_at) {
            // console.warn('Notification not found or already read')
            return
        }
        const { error } = await client.from('notifications_read_status').insert({
            notification_id: id,
            user_id: userStore.user.id
        })
        if (error) {
            console.error(error)
            return
        }
        await loadNotifications()

    }

    watch(() => userStore.user, async () => {
        if (userStore.user) {
            await loadNotifications()
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