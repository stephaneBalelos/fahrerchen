<template>
  <UDashboardSlideover
    :title="t('notifications')"
  >
  <NotificationsNotificationItem
    v-for="notification in notifications"
    :key="notification.id"
    :icon="'i-heroicons-user-plus'"
    :read="false"
    :title="t(`notifications_items.${notification.notification_type.replaceAll('.', '_')}.title`, formatPayload(notification.payload))"
    :description="t(`notifications_items.${notification.notification_type.replaceAll('.', '_')}.description`, formatPayload(notification.payload))"
    :inserted-at="new Date(notification.created_at).toISOString()"
  />
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { formatDate, formatTime } from '~/utils/formatters'


const { t } = useI18n({
  useScope: 'local'
})

const notificationsStore = useNotificationsStore()

const { data: notifications } = useAsyncData('notifications', async() => {
  await notificationsStore.loadNotifications()
  return notificationsStore.notifications
})

const formatPayload = (payload: Record<string, string>) => {
  return {
    ...payload,
    date: payload.date ? formatDate(payload.date) : '',
    time: payload.time ? formatTime(payload.time) : ''
  }
}

</script>

<i18n lang="json">
{
  "de": {
    "notifications": "Benachrichtigungen",
    "mark_all_as_read": "Alle als gelesen markieren",
    "notifications_items": {
      "course_activities.inserted": {
        "title": "Neue Kursaktivität hinzugefügt",
        "description": "Eine neue Kursaktivität wurde hinzugefügt."
      },
      "course_activities.price.updated": {
        "title": "Preis aktualisiert für {activity_name}",
        "description": "Der Preis für die Kursaktivität {activity_name} wurde aktualisiert."
      },
      "course_activity_schedules_assigned_to_updated": {
        "title": "{author_name} hat dir eine Kursaktivität zugewiesen",
        "description": "{author_name} hat dir {activity_name} am {date} zugewiesen."
      },
      "course_activity_schedules.attendees.updated": {
        "title": "Neuer Termin",
        "description": "Du wurdest zu {activity_name} am {date} hinzugefügt."
      },
      "course_activity_schedules.deleted": {
        "title": "Kursaktivität gelöscht",
        "description": "Die Kursaktivität {activity_name} wurde gelöscht."
      },
      "course_activity_schedules.inserted": {
        "title": "Neue Termin für {activity_name}",
        "description": "Jetzt an {activity_name} am {date} teilnehmen."
      },
      "course_activity_schedules.start_at.updated": {
        "title": "Dein Termin am {date}",
        "description": "Der Termin für {activity_name} wurde auf {date} um {time} aktualisiert."
      },
      "course_activity_schedules.status.updated.cancelled": {
        "title": "{activity_name} wurde abgesagt",
        "description": "{activity_name} am {date} findet nicht mehr statt."
      },
      "course_activity_schedules.status.updated.completed": {
        "title": "{activity_name} wurde abgeschlossen",
        "description": "{activity_name} am {date} wurde als abgeschlossen markiert."
      },
      "course_activity_schedules_attendances.completed.updated": {
        "title": "Du hast {activity_name} am {date} abgeschlossen.",
        "description": "Herzlichen Glückwunsch zu deinem Abschluss von {activity_name}!"
      },
      "course_activity_schedules_attendances.deleted": {
        "title": "Deine Teilnahme an {activity_name} wurde gelöscht.",
        "description": "Deine Teilnahme an {activity_name} am {date} wurde entfernt."
      },
      "course_activity_schedules_attendances.inserted": {
        "title": "Du hast an {activity_name} am {date} teilgenommen.",
        "description": "Dein Fortschritt in {activity_name} wurde aufgezeichnet."
      }
    }
  },
  "en": {
    "notifications": "Notifications",
    "mark_all_as_read": "Mark all as read"
  }
}
</i18n>