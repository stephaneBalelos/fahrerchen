<template>
  <UCheckbox
    v-model="isAttending"
    class="items-center p-4 sm:px-6"
    :disabled="props.status !== 'PLANNED'"
    @change="handleChange"
  >
    <template #label>
      <div class="flex justify-between">
        <slot />
        <div v-if="attendance && props.status === 'COMPLETED'">
          <UBadge
            color="green"
            size="xs"
            class="ml-2"
            variant="soft"
          >
            {{ t('attendance_is_confirmed') }}
          </UBadge>

        </div>
      </div>
    </template>
  </UCheckbox>
</template>

<script setup lang="ts">
import type {
  AppStudent
} from "~/types/app.types";
import type { Database } from "~/types/database.types";

type Props = {
  subscriptionId: string;
  student: AppStudent;
  scheduleId: string;
  attendees: string[];
  status: Database["public"]["Enums"]["schedule_status"];
  onChange: () => void;
};

const tutorialStore = useTutorialStore();

const props = defineProps<Props>();

const { t } = useI18n({ useScope: "local" });

const client = useSupabaseClient();

const isAttending = computed(() => {
  return props.attendees.includes(props.subscriptionId);
});

const { data: attendance } = useAsyncData(`course_activity_schedule_attendance_${props.scheduleId}_${props.subscriptionId}`, async () => {
  const { data, error } = await client
    .from('course_activity_schedules_attendances')
    .select('*')
    .eq('course_activity_schedule_id', props.scheduleId)
    .eq('course_subscription_id', props.subscriptionId)

  if (error) {
    return null;
  }
  return data[0];
});

async function handleChange($event: boolean) {

  if ($event) {
    await addStudentSubscriptionToSchedule();
  } else {
    await removeStudentSubscriptionFromSchedule();
  }
}

const toast = useToast();

async function addStudentSubscriptionToSchedule() {
  try {
    const { data, error } = await client.rpc('add_attendee_to_schedule', {
      course_schedule_id: props.scheduleId,
      course_subscription_id: props.subscriptionId,
    })
    if (error) {
      throw error
    }
    if (data) {
      toast.add({
        title: t('success.student_added_to_schedule'),
        color: 'green'
      });
    }
  } catch (error) {
    console.error('Error adding student to schedule:', error);
    toast.add({
        title: t('errors.failed_to_add_student'),
        color: 'red'
      });
  }
  tutorialStore.completeStep('activity_schedule_attendance');
}

async function removeStudentSubscriptionFromSchedule() {
  try {
    const { data, error } = await client.rpc('remove_attendee_from_schedule', {
      course_schedule_id: props.scheduleId,
      course_subscription_id: props.subscriptionId,
    })
    if (error) {
      throw error
    }
    if (data) {
      toast.add({
        title: t('success.student_removed_from_schedule'),
        color: 'green'
      });
    }
  } catch (error) {
    console.error('Error removing student from schedule:', error);
    toast.add({
        title: t('errors.failed_to_remove_student'),
        color: 'red'
      });
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Teilnehmer hinzufügen oder entfernen",
    "attendance_is_confirmed": "Teilnahme bestätigt",
    "success": {
      "student_added_to_schedule": "Teilnehmer erfolgreich hinzugefügt",
      "student_removed_from_schedule": "Teilnehmer erfolgreich entfernt"
    },
    "errors": {
      "failed_to_add_student": "Fehler beim Hinzufügen des Teilnehmers",
      "failed_to_remove_student": "Fehler beim Entfernen des Teilnehmers"
    }
  },
  "en": {
    "title": "Add or remove participants",
    "attendance_is_confirmed": "Attendance confirmed",
    "success": {
      "student_added_to_schedule": "Participant successfully added",
      "student_removed_from_schedule": "Participant successfully removed"
    },
    "errors": {
      "failed_to_add_student": "Error adding participant",
      "failed_to_remove_student": "Error removing participant"
    }
  }
}
</i18n>
