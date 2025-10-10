<template>
  <div v-if="status === 'success' && student" :class="`flex items-center rounded-md`">
    <div class="flex flex-col items-start">
      <UBadge v-if="isAttending && !props.disabled" color="primary" variant="soft" size="xs" class="mb-2">{{
        t("is_attending")
      }}</UBadge>
      <p class="text-sm font-medium break-all">
        {{ student.firstname }} {{ student.lastname }}
      </p>
      <p class="text-xs text-muted-foreground break-all">
        {{ student.email }}
      </p>
    </div>
    <div class="ms-3 flex-1">
      <UBadge v-if="course" color="primary" variant="soft" size="xs">{{
        g(`course_types.${course.type}.name`)
      }}</UBadge>
    </div>

    <div v-if="!props.disabled" class="ml-auto">
      <div v-if="isAttending && attendeeId" class="flex items-center gap-2">
        <UButton
          size="2xs"
          color="red"
          variant="soft"
          icon="i-heroicons-minus-circle"
          @click="removedFromSchedule()"
        />
      </div>
      <div v-else class="flex items-center gap-2">
        <UButton
          size="2xs"
          color="primary"
          variant="solid"
          icon="i-heroicons-plus-circle"
          @click="addedToSchedule()"
        />
      </div>
    </div>
  </div>
  <div v-else class="flex items-center justify-center py-4 px-4">
    <USkeleton class="h-6 w-full" />
  </div>
</template>

<script setup lang="ts">
import type { AppCourseSubscription } from "~/types/app.types";

type Props = {
  subscription: AppCourseSubscription;
  scheduleId: string;
  disabled?: boolean;
};
const props = defineProps<Props>();

const { t } = useI18n({ useScope: "local" });
const { t: g } = useI18n({ useScope: "global" });

const $emits = defineEmits<{
  (e: "remove", attendeeId: string): void;
}>()

const client = useSupabaseClient();
const coursesStore = useCoursesStore();
const $activitySchedules = useCourseActivitySchedules();
const studentsStore = useStudentsStore();

const student = computed(() => {
  return studentsStore.students.find(
    (s) => s.id === props.subscription.student_id
  );
});

const course = computed(() => {
  return coursesStore.courses.find(
    (c) => c.id === props.subscription.course_id
  );
});

const { data: attendeeId, status, refresh } = useAsyncData(`attendee-${props.scheduleId}-${props.subscription.id}`, async () => {
  const { data, error } = await client
    .from("course_activity_schedules_attendees")
    .select("id")
    .eq("schedule_id", props.scheduleId)
    .eq("subscription_id", props.subscription.id)
  if (error) {
    return null;
  }
  console.log(data);
  return data && data.length > 0 ? data[0].id : null;
});

const isAttending = computed(() => {
  if (status.value !== "success" || !attendeeId.value) return false;
  return true;
});

const addedToSchedule = async () => {
    await $activitySchedules.addAttendeesToSchedule(props.scheduleId, [
      props.subscription.id,
    ]);
  await refresh();
};
const removedFromSchedule = async () => {
    if (!attendeeId.value) return;
    $emits("remove", attendeeId.value);
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "is_attending": "Nimmt teil"
  },
  "en": {
    "is_attending": "Is attending"
  }
}

</i18n>
