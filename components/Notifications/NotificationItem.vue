<template>
  <NuxtLink
    class="p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    @click="notificationsStore.markAsRead(props.notification.id)"
  >
    <UChip color="primary" :show="true" inset>
      <UAvatar
        :alt="'sdasdasd asdadfq'"
        size="md"
        :icon="'i-heroicons-user-plus'"
      />
    </UChip>

    <div class="text-sm flex-1">
      <p class="flex justify-between">
        <span :class="`text-gray-900 dark:text-white mr-2 ${!props.notification.read_at ? 'font-semibold' : ''}`">
          {{
            t(`students_registration_requests.created`, {
              count: 1,
            })
          }}
        </span>

        <time
          :datetime="props.notification.updated_at"
          class="text-gray-500 dark:text-gray-400 text-xs whitespace-nowrap"
          v-text="formatTimeAgo(new Date(notification.updated_at))"
        />
      </p>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatTimeAgo } from "@vueuse/core";
import type { NotificationView } from "~/types/app.types";

type Props = {
  notification: NotificationView;
};

const props = defineProps<Props>();
const notificationsStore = useNotificationsStore();

const { t } = useI18n({
  useScope: "local",
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "students_registration_requests.created": "Ein neuer Schüler hat sich registriert! 🎉"
  },
  "en": {
    "students_registration_requests.created": "A new student has registered! 🎉"
  }
}
</i18n>
