<template>
  <UDashboardSlideover :title="t('notifications')">
    <NotificationsNotificationItem
      v-for="notification in notifications"
      :key="notification.id"
      :icon="'i-heroicons-user-plus'"
      :read="false"
      :title="
        t(
          `notifications_items.${notification.notification_type.replaceAll(
            '.',
            '_'
          )}.title`,
          formatPayload(notification.payload)
        )
      "
      :description="
        t(
          `notifications_items.${notification.notification_type.replaceAll(
            '.',
            '_'
          )}.description`,
          formatPayload(notification.payload)
        )
      "
      :inserted-at="new Date(notification.created_at).toISOString()"
    />
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import { formatDate, formatTime } from "~/utils/formatters";

const { t } = useI18n({
  useScope: "local",
});

const notificationsStore = useNotificationsStore();

const { data: notifications } = useAsyncData("notifications", async () => {
  await notificationsStore.loadNotifications();
  return notificationsStore.notifications;
});

const formatPayload = (payload: Record<string, string>) => {
  return {
    ...payload,
    date: payload.date ? formatDate(payload.date) : "",
    time: payload.time ? formatTime(payload.time) : "",
  };
};
</script>

<i18n lang="json">
{
  "de": {
    "notifications": "Benachrichtigungen",
    "mark_all_as_read": "Alle als gelesen markieren",
    "notifications_items": {
      "course_subscriptions_inserted": {
        "title": "Neue Kursanmeldung",
        "description": "{student_name} wurde zu deinem Kurs angemeldet."
      },
      "course_activity_schedules_assigned_to_updated": {
        "title": "{author_name} hat dir eine Kursaktivität zugewiesen",
        "description": "{author_name} hat dir {activity_name} am {schedule_date} zugewiesen."
      },
      "course_activity_schedules_attendees_inserted": {
        "title": "Neue Teilnahmer:in",
        "description": "{student_name} wurde zu {activity_name} am {schedule_date} hinzugefügt."
      },
      "course_activity_schedules_attendees_removed": {
        "title": "Teilnahmer:in entfernt",
        "description": "{student_name} wurde von {activity_name} am {schedule_date} entfernt."
      },
      "course_activity_schedules_status_updated": {
        "title": "{activity_name} wurde abgesagt",
        "description": "{activity_name} am {schedule_date} findet nicht mehr statt."
      },
      "course_activity_schedules_start_at_updated": {
        "title": "Dein Termin am {schedule_date}",
        "description": "Der Termin für {activity_name} wurde auf {schedule_date} um {time} aktualisiert."
      },
      "course_activity_schedules_deleted": {
        "title": "Kursaktivität gelöscht",
        "description": "Die Kursaktivität {activity_name} wurde gelöscht."
      },
      "course_activity_schedules_attendances_inserted": {
        "title": "Du hast an {activity_name} am {schedule_date} teilgenommen.",
        "description": "Dein Fortschritt in {activity_name} wurde aufgezeichnet."
      },
      "course_subscription_bills.paid_at.updated": {
        "title": "Rechnung bezahlt",
        "description": "Die Rechnung für deinen {course_type} Kurs wurde bezahlt."
      },
      "course_subscription_bills.ready_to_pay.updated": {
        "title": "Rechnung bereit zur Zahlung",
        "description": "Die Rechnung für deinen {course_type} Kurs ist bereit zur Zahlung."
      },
      "course_subscription_bills.canceled_at.updated": {
        "title": "Rechnung storniert",
        "description": "Die Rechnung für deinen {course_type} Kurs wurde storniert."
      }
    }
  },
  "en": {
    "notifications": "Notifications",
    "mark_all_as_read": "Mark all as read"
  }
}
</i18n>
