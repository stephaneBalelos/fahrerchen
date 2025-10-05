<template>
  <UDashboardSlideover :title="t('notifications')">
    <NotificationsNotificationItem
      v-for="notification in notifications"
      :key="notification.id"
      :icon="notification.icon"
      :read="false"
      :title="notification.title"
      :description="notification.description"
      :action-url="notification.action_url"
      :inserted-at="new Date(notification.created_at).toISOString()"
    />
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppOrganizationNotification } from '~/types/app.types';

const { t, locale } = useI18n({
  useScope: "local",
});

type NotificationItem = {
  id: string;
  created_at: string;
  notification_type: string;
  title: string;
  description: string;
  icon: string;
  action_url: string | null;
}

const notificationsStore = useNotificationsStore();
const userOrganizationsStore = useUserOrganizationsStore();

const { data: notifications } = useAsyncData("notifications", async () => {
  return await notificationsStore.loadNotifications();
}, {
  transform: (data) => formatNotifications(data as AppOrganizationNotification[]),
});

const formatNotifications = (notifications: AppOrganizationNotification[]): NotificationItem[] => {
  const items: NotificationItem[] = [];

  for (const notification of notifications) {
    if (notification.notification_type === 'course_activity_schedules.assigned_to.updated') {
      const payload = notification.payload as {
        id: string;
        author_name: string;
        activity_id: string;
        activity_name: string;
        schedule_start_at: string;
        schedule_assigned_to: string | null;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_activity_schedules_assigned_to_updated.title', {
          author_name: payload.author_name,
        }),
        description: t('notifications_items.course_activity_schedules_assigned_to_updated.description', {
          author_name: payload.author_name,
          activity_name: payload.activity_name,
          schedule_start_at: new Date(payload.schedule_start_at).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        icon: 'i-heroicons-calendar',
        action_url: userOrganizationsStore.relativePath(`/schedules?id=${payload.id}`),
      }
      items.push(item);
      continue;
    }
    if (notification.notification_type === 'course_activity_schedules.start_at.updated') {
      const payload = notification.payload as {
        id: string;
        author_name: string;
        activity_id: string;
        activity_name: string;
        schedule_start_at: string;
        schedule_old_start_at: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_activity_schedules_start_at_updated.title', {
          activity_name: payload.activity_name,
          schedule_start_at: new Date(payload.schedule_start_at).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        description: t('notifications_items.course_activity_schedules_start_at_updated.description', {
          activity_name: payload.activity_name,
          schedule_start_at: new Date(payload.schedule_start_at).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          schedule_old_start_at: new Date(payload.schedule_old_start_at).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        icon: 'i-heroicons-calendar',
        action_url: userOrganizationsStore.relativePath(`/schedules?id=${payload.id}`),
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_activity_schedules_attendees.inserted') {
      const payload = notification.payload as {
        id: string;
        author_name: string;
        activity_id: string;
        activity_name: string;
        schedule_date: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_activity_schedules_attendees_inserted.title', {
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        description: t('notifications_items.course_activity_schedules_attendees_inserted.description', {
          author_name: payload.author_name,
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        icon: 'i-heroicons-calendar',
        action_url: null,
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_activity_schedules_attendees.removed') {
      const payload = notification.payload as {
        id: string;
        author_name: string;
        activity_id: string;
        activity_name: string;
        schedule_date: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_activity_schedules_attendees_removed.title', {
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        description: t('notifications_items.course_activity_schedules_attendees_removed.description', {
          author_name: payload.author_name,
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        icon: 'i-heroicons-calendar',
        action_url: null,
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_activity_schedules.status.updated') {
      const payload = notification.payload as {
        id: string;
        author_name: string;
        activity_id: string;
        activity_name: string;
        schedule_date: string;
        schedule_status: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t(`notifications_items.course_activity_schedules_status_updated_${payload.schedule_status}.title`, {
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
        }),
        description: t(`notifications_items.course_activity_schedules_status_updated_${payload.schedule_status}.description`, {
          author_name: payload.author_name,
          activity_name: payload.activity_name,
          schedule_date: new Date(payload.schedule_date).toLocaleDateString(locale.value, {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          }),
          schedule_status: payload.schedule_status,
        }),
        icon: 'i-heroicons-calendar',
        action_url: null,
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_subscription_bills.ready_to_pay.updated') {
      const payload = notification.payload as {
        id: string;
        course_type: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_subscription_bills_ready_to_pay_updated.title'),
        description: t('notifications_items.course_subscription_bills_ready_to_pay_updated.description', {
          course_type: payload.course_type,
        }),
        icon: 'i-heroicons-document',
        action_url: userOrganizationsStore.relativePath('/billing'),
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_subscription_bills.paid_at.updated') {
      const payload = notification.payload as {
        id: string;
        course_type: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_subscription_bills.paid_at.updated.title'),
        description: t('notifications_items.course_subscription_bills.paid_at.updated.description', {
          course_type: payload.course_type,
        }),
        icon: 'i-heroicons-document',
        action_url: userOrganizationsStore.relativePath('/billing'),
      }
      items.push(item);
    }
    if (notification.notification_type === 'course_subscription_bills.canceled_at.updated') {
      const payload = notification.payload as {
        id: string;
        course_type: string;
      }
      const item = {
        id: notification.id,
        created_at: notification.created_at,
        notification_type: notification.notification_type,
        title: t('notifications_items.course_subscription_bills_canceled_at_updated.title'),
        description: t('notifications_items.course_subscription_bills_canceled_at_updated.description', {
          course_type: payload.course_type,
        }),
        icon: 'i-heroicons-document',
        action_url: userOrganizationsStore.relativePath('/billing'),
      }
      items.push(item);
    }
  }
  return items;
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
        "title": "Neuer Termin - {activity_name}",
        "description": "{author_name} hat dich zu {activity_name} am {schedule_date} hinzugefügt."
      },
      "course_activity_schedules_attendees_removed": {
        "title": "Termin abgesagt - {activity_name}",
        "description": "{author_name} hat dich von {activity_name} am {schedule_date} entfernt."
      },
      "course_activity_schedules_status_updated_CANCELED": {
        "title": "{activity_name} wurde abgesagt",
        "description": "{activity_name} am {schedule_date} findet nicht mehr statt."
      },
      "course_activity_schedules_status_updated_COMPLETED": {
        "title": "{activity_name} wurde abgeschlossen",
        "description": "{activity_name} am {schedule_date} wurde abgeschlossen."
      },
      "course_activity_schedules_start_at_updated": {
        "title": "{activity_name} am {schedule_start_at}",
        "description": "Der Termin für {activity_name} wurde von dem {schedule_old_start_at} auf den {schedule_start_at} geändert."
      },
      "course_activity_schedules_deleted": {
        "title": "Kursaktivität gelöscht",
        "description": "Die Kursaktivität {activity_name} wurde gelöscht."
      },
      "course_activity_schedules_attendances_inserted": {
        "title": "Du hast an {activity_name} am {schedule_date} teilgenommen.",
        "description": "Dein Fortschritt in {activity_name} wurde aufgezeichnet."
      },
      "course_subscription_bills_paid_at_updated": {
        "title": "Rechnung bezahlt",
        "description": "Die Rechnung für deinen {course_type} Kurs wurde bezahlt."
      },
      "course_subscription_bills_ready_to_pay_updated": {
        "title": "Rechnung bereit zur Zahlung",
        "description": "Die Rechnung für deinen {course_type} Kurs ist bereit zur Zahlung."
      },
      "course_subscription_bills_canceled_at_updated": {
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
