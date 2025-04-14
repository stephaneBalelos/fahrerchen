<template>
  <UDashboardSlideover
    :title="t('notifications')"
  >
  <NotificationsNotificationItem v-for="noti in notificationsStore.notifications" :key="noti.id" :notification="noti" />
  </UDashboardSlideover>
</template>

<script setup lang="ts">

const { t } = useI18n({
  useScope: 'local'
})

const notificationsStore = useNotificationsStore()

</script>

<i18n lang="json">
{
  "de": {
    "notifications": "Benachrichtigungen"
  },
  "en": {
    "notifications": "Notifications"
  }
}
</i18n>