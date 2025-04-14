<template>
  <UCheckbox
    v-model="isAttending"
    class="items-center p-4 sm:px-6"
    :disabled="props.status !== 'PLANNED'"
    @change="handleChange"
  >
    <template #label>
      <slot />
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
