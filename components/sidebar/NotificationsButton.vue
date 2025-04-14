<template>
  <UChip :text="notificationsCount" :show="notificationsCount > 0" size="2xl">
    <UButton
      color="gray"
      icon="i-heroicons-bell"
      variant="ghost"
      @click.stop="openNotificationsSlideover"
    />
  </UChip>
</template>

<script setup lang="ts">
import NotificationsSlideover from "../account/NotificationsSlideover.vue";

const slideover = useSlideover();
const notificationsStore = useNotificationsStore();

const notificationsCount = computed(
  () => notificationsStore.notifications.filter((n) => !n.read_at).length
);

const openNotificationsSlideover = () => {
  slideover.open(NotificationsSlideover);
};
</script>

<style scoped></style>
