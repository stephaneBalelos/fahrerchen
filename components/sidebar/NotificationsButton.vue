<template>
    <UChip :text="notificationsStore.notifications.length" size="2xl">
        <UButton color="gray" icon="i-heroicons-bell" variant="ghost" @click.stop="openNotificationsSlideover" />
    </UChip>
</template>

<script setup lang="ts">
import NotificationsSlideover from '../account/NotificationsSlideover.vue';

const slideover = useSlideover();
const notificationsStore = useNotificationsStore();



const openNotificationsSlideover = () => {
    slideover.open(NotificationsSlideover);
};

</script>

<style scoped>

</style>