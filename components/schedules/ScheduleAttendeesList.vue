<template>
  <UCard class="w-full">
    <template v-if="courseActivitySchedule.status === 'PLANNED'" #header>
      <UInput
        v-model="q"
        icon="i-heroicons-magnifying-glass"
        :placeholder="t('search_for_students')"
      />
    </template>

    <div v-for="attendee in filteredAttendees" :key="attendee.id">
      <div class="flex items-center">
        <UAvatar
          :alt="`${attendee.course_subscriptions.student.firstname} ${attendee.course_subscriptions.student.lastname}`"
          size="sm"
        />
        <div class="ms-3 flex-1">
          <div class="font-semibold">
            {{
              `${attendee.course_subscriptions.student.firstname} ${attendee.course_subscriptions.student.lastname}`
            }}
          </div>
          <div class="text-sm text-muted-foreground">
            {{ attendee.course_subscriptions.student.email }}
          </div>
        </div>
        <div class="flex items-center gap-3">
          <UBadge color="primary">
            {{
              g(
                `course_types.${attendee.course_subscriptions.course.type}.name`
              )
            }}
          </UBadge>
          <UButton
            v-if="courseActivitySchedule.status === 'PLANNED'"
            icon="i-heroicons-minus-circle"
            color="red"
            variant="ghost"
            @click="removeFromSchedule(attendee.id)"
          />
        </div>
      </div>
    </div>
  </UCard>
</template>

<script setup lang="ts">
import type { AppCourseActivitySchedule } from "~/types/app.types";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type Props = {
  courseActivitySchedule: AppCourseActivitySchedule;
};

const { t } = useI18n({ useScope: "local" });

const { t: g } = useI18n({ useScope: "global" });

const modal = useModal();

const props = defineProps<Props>();
const $emit = defineEmits(["updated"]);

const q = ref("");

const $courseActivitiesSchedules = useCourseActivitySchedules();

const { data: attendees, refresh } = await useAsyncData(async () => {
  return await $courseActivitiesSchedules.fetchAttendeesForSchedule(
    props.courseActivitySchedule.id
  );
});

const filteredAttendees = computed(() => {
  if (attendees.value === null) {
    return [];
  }
  return attendees.value.filter((a) => {
    return (
      a.course_subscriptions.student.firstname.search(
        new RegExp(q.value, "i")
      ) !== -1 ||
      a.course_subscriptions.student.lastname.search(
        new RegExp(q.value, "i")
      ) !== -1
    );
  });
});

const removeFromSchedule = async (attendeeId: string) => {
  modal.open(ConfirmModal, {
    title: t("confirm_remove_student_title"),
    description: t("confirm_remove_student_description"),
    confirmLabel: t("remove"),
    cancelLabel: t("cancel"),
    action: async () => {
      await $courseActivitiesSchedules.removeAttendeeFromSchedule(attendeeId);
      await refresh();
      $emit("updated");
    },
  });
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Teilnehmer hinzufügen oder entfernen",
    "section_title": "{activityName} am {date} um {time} bearbeiten",
    "description": "Fügen Sie Teilnehmer zu diesem Termin hinzu oder entfernen Sie sie.",
    "search_for_students": "Nach Teilnehmern suchen"
  },
  "en": {
    "title": "Add or remove students",
    "section_title": "Edit {activityName} on {date} at {time}",
    "description": "Add or remove students to this schedule.",
    "search_for_students": "Search for students"
  }
}
</i18n>
