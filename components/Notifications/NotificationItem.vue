<template>
  <NuxtLink
    class="p-3 rounded-md hover:bg-gray-50 dark:hover:bg-gray-800/50 cursor-pointer flex items-center gap-3 relative"
    @click="notificationsStore.markAsRead(props.notification.id)"
  >
    <UChip color="primary" :show="!props.notification.read_at" inset>
      <UAvatar
        :alt="'sdasdasd asdadfq'"
        size="md"
        :icon="'i-heroicons-user-plus'"
      />
    </UChip>

    <div class="text-sm flex-1">
      <p class="flex justify-between">
        <span
          :class="`text-gray-900 dark:text-white mr-2 ${
            !props.notification.read_at ? 'font-semibold' : ''
          }`"
        >
          {{
            t(props.notification.type, {
              ...(props.notification.payload as {}),
              actor: props.notification.actor_fullname,
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
import type { Database, NotificationView } from "~/types/app.types";

type Props = {
  notification: NotificationView;
};

type _RessourcePayload = {
  "students_registration_requests.created": Database["public"]["Tables"]["students_registration_requests"]["Row"];
  "students.created": Database["public"]["Tables"]["students"]["Row"];
  "course_subscriptions.created": {
    course_name: string;
    student_name: string;
  };
  "course_activity_schedules.created": Database["public"]["Tables"]["course_activity_schedules"]["Row"];
  "course_activity_schedules.updated": {
    course_name: string;
    activity_name: string;
    activity_start_at: string;
    activity_end_at: string;
  };
  "course_activity_schedules.assigned": {
    course_name: string;
    activity_name: string;
    activity_start_at: string;
    activity_end_at: string;
  };
  "course_activity_attendances.created": {
    course_name: string;
    activity_name: string;
    activity_start_at: string;
    student_name: string;
  };
  "course_activity_attendances.deleted": {
    course_name: string;
    activity_name: string;
    activity_start_at: string;
    stundent_name: string;
  };
  "course_subscription_bills.created": Database["public"]["Tables"]["course_subscription_bills"]["Row"];
  "course_subscription_bills.updated": Database["public"]["Tables"]["course_subscription_bills"]["Row"];
  "course_subscription_bills.paid": Database["public"]["Tables"]["course_subscription_bills"]["Row"];
  "course_subscription_bills.canceled": Database["public"]["Tables"]["course_subscription_bills"]["Row"];
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
    "you": "Sie",
    "students_registration_requests.created": "Ein neuer Schüler möchte sich bei Ihre Schule anmelden! 🎉",
    "students.created": "{actor} hat einen neuen Schüler erstellt!",
    "course_subscriptions.created": "{actor} hat {student_name} zu {course_name} hinzugefügt!",
    "course_activity_schedules.created": "{actor} hat einen neuen Aktivitätstermin für einen Kurs erstellt!",
    "course_activity_schedules.updated": "{course_name}: {activity_name} wurde auf {activity_start_at} bis {activity_end_at} aktualisiert!",
    "course_activity_schedules.deleted": "{course_name}: {activity_name} am {activity_start_at} wurde abgesagt!",
    "course_activity_schedules.assigned": "{actor} hat Ihnen einen Aktivitätstermin zugewiesen!",
    "course_activity_attendances.created": "{course_name}: {student_name} nimmt an {activity_name} am {activity_start_at} teil.",
    "course_activity_attendances.deleted": "{course_name}: {student_name} nimmt nicht an {activity_name} am {activity_start_at} teil.",
    "course_subscription_bills.ready_to_pay": "{actor} hat eine Rechnung für {student_name} erstellt!",
    "course_subscription_bills.updated": "{actor} hat eine Rechnung für {student_name} aktualisiert!",
    "course_subscription_bills.paid": "{actor} hat eine Rechnung für {student_name} bezahlt!",
    "course_subscription_bills.canceled": "{actor} hat eine Rechnung für {student_name} storniert!"
  },
  "en": {
    "you": "You",
    "students_registration_requests.created": "A new student wants to register at your school! 🎉",
    "students.created": "{actor} created a new student!",
    "course_subscriptions.created": "{actor} added {student_name} to {course_name}!",
    "course_activity_schedules.created": "{actor} created a new activity schedule for a course!",
    "course_activity_schedules.updated": "{course_name}: {activity_name} was updated to {activity_start_at} to {activity_end_at}!",
    "course_activity_schedules.deleted": "{course_name}: {activity_name} on {activity_start_at} was canceled!",
    "course_activity_schedules.assigned": "{actor} assigned you an activity schedule!",
    "course_activity_attendances.created": "{course_name}: {student_name} is attending {activity_name} on {activity_start_at}.",
    "course_activity_attendances.deleted": "{course_name}: {student_name} is not attending {activity_name} on {activity_start_at}.",
    "course_subscription_bills.ready_to_pay": "{actor} created an invoice for {student_name}!",
    "course_subscription_bills.updated": "{actor} updated an invoice for {student_name}!",
    "course_subscription_bills.paid": "{actor} paid an invoice for {student_name}!",
    "course_subscription_bills.canceled": "{actor} canceled an invoice for {student_name}!"
  }
}
</i18n>
