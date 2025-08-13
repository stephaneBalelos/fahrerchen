<template>
  <UDashboardSlideover
    :title="t('notifications')"
  >
  <NotificationsNotificationItem
    v-for="notification in testNotificationsData"
    :key="notification.id"
    :icon="'i-heroicons-user-plus'"
    :read="notification.read"
    :title="t(`notifications_items.${notification.type}.title`)"
    :description="t(`notifications_items.${notification.type}.description`)"
    :inserted-at="new Date(notification.created_at).toISOString()"
  />
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppOrganizationNotification } from '~/types/app.types';


const { t } = useI18n({
  useScope: 'local'
})

const testNotificationsData = ref<AppOrganizationNotification[]>([
  {
    id: '1',
    type: 'course_activities.inserted',
    target_user_id: 'user_1',
    author_id: 'user_2',
    read: false,
    payload: {
      activity_name: 'Aktivität 1',
      activity_id: 'activity_1',
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '2',
    type: 'course_activities.price.updated',
    target_user_id: 'user_1',
    author_id: 'user_3',
    read: true,
    payload: {
      activity_id: 'activity_2',
      activity_name: 'Aktivität 2',
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '3',
    type: 'course_activity_schedules.assigned_to.updated',
    target_user_id: 'user_1',
    author_id: 'user_4',
    read: false,
    payload: {
      author_name: 'Benutzer 4',
      activity_name: 'Aktivität 3',
      activity_id: 'activity_3',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '4',
    type: 'course_activity_schedules.attendees.updated',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
    {
    id: '5',
    type: 'course_activity_schedules.deleted',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
    {
    id: '6',
    type: 'course_activity_schedules.inserted',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '7',
    type: 'course_activity_schedules.start_at.updated',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '8',
    type: 'course_activity_schedules.status.updated',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '9',
    type: 'course_activity_schedules_attendances.completed.updated',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '10',
    type: 'course_activity_schedules_attendances.deleted',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
  {
    id: '11',
    type: 'course_activity_schedules_attendances.inserted',
    target_user_id: 'user_1',
    author_id: 'user_5',
    read: false,
    payload: {
      author_name: 'Benutzer 5',
      activity_name: 'Aktivität 4',
      activity_id: 'activity_4',
      date: new Date().toISOString(),
    },
    created_at: new Date().toISOString(),
    organization_id: 'org_1',
  },
])

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
      "course_activity_schedules.assigned_to.updated": {
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