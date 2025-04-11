<template>
  <div
    v-for="(event, index) in events"
    :key="event.id"
    class="absolute bg-primary-50 dark:bg-primary-400 dark:bg-opacity-10 text-primary-500 dark:text-primary-400 rounded-lg ring-1 ring-inset ring-primary-500 dark:ring-primary-400 ring-opacity-25 dark:ring-opacity-25 shadow p-2 px-4 cursor-pointer"
    :style="{
      width: `calc(100% / ${events.length})`,
      left: `calc(100% / ${events.length} * ${index})`,
      top: `calc(6rem * ${event.start_hour} + 6rem * ${
        event.start_minute / 60
      }  + 1rem)`,
      height: `calc(6rem * ${event.end_hour - event.start_hour})`,
    }"
  >
    <div class="calendar-event-label flex justify-between items-center">
      <div class="flex flex-col">
        <p class="text-lg font-semibold truncate">{{ event.label }}</p>
        <p class="text-sm">{{ getLocalizedDateTimeString(event.date) }}</p>
      </div>

      <div class="flex gap-2">
        <UDropdown :items="getDropdownItem(event.schedule)">
          <UButton
            color="white"
            trailing-icon="i-heroicons-ellipsis-vertical-solid"
          />
        </UDropdown>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { CourseActivityScheduleView } from "~/types/app.types";
import { getLocalizedDateTimeString } from "~/utils/formatters";
import EditCourseActivitySchedule from "../forms/EditCourseActivitySchedule.vue";
import ConfirmModal from "../ui/Modals/ConfirmModal.vue";

type Props = {
  blockIndex: number;
  events: {
    id: string;
    label: string;
    date: Date;
    start_hour: number;
    start_minute: number;
    end_hour: number;
    end_minute: number;
    schedule: CourseActivityScheduleView;
  }[];
};

const $emits = defineEmits(["update"]);
const modal = useModal();
const { events } = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const courseActivitySchedules = useCourseActivitySchedules();

const slideover = useSlideover();

function getDropdownItem(schedule: CourseActivityScheduleView) {
  const items = [
    [
      {
        label: t("edit_schedule"),
        icon: "i-heroicons-pencil-square-20-solid",
        click: () => {
          slideover.open(EditCourseActivitySchedule, {
            orgid: schedule.organization_id,
            activityid: schedule.activity_id,
            scheduleId: schedule.id,
            courseid: schedule.course_id,
            "onActivity-saved": () => {
              $emits("update");
            },
            "onActivity-deleted": () => {
              $emits("update");
            },
          });
        },
      }
    ],
    [
      {
        label: t("delete_schedule"),
        icon: "i-heroicons-trash-20-solid",
        click: async () => {
          await deleteSchedule(schedule.id);
        },
      },
    ],
  ];
  return items;
}

async function deleteSchedule(id: string) {
  try {
    modal.open(ConfirmModal, {
      title: "Delete Course Activity Schedule",
      description:
        "Are you sure you want to delete this course activity schedule?",
      confirmLabel: "Delete",
      cancelLabel: "Cancel",
      action: async () => {
        const result =
          await courseActivitySchedules.deleteCourseActivitySchedule(id);
        if (!result) {
          throw new Error("Failed to delete course activity schedule");
        }
        $emits("update");
      },
    });
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "edit_schedule": "Bearbeiten",
    "edit_attendees": "Teilnehmer bearbeiten",
    "delete_schedule": "Löschen",
    "assigned_to": "Zugewiesen an",
    "attendees": "Teilnehmer",
    "no_attendees": "Keine Teilnehmer gefunden",
    "no_schedule_found": "Kein Termin gefunden"
  },
  "en": {
    "edit_schedule": "Edit",
    "edit_attendees": "Edit attendees",
    "delete_schedule": "Delete",
    "assigned_to": "Assigned to",
    "attendees": "Attendees",
    "no_attendees": "No attendees found",
    "no_schedule_found": "No schedule found"
  }
}
</i18n>
