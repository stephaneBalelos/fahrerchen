<template>
  <UCard>
    <template #header>
      <div class="flex items-center gap-2">
        <div class="flex items-center justify-between w-full">
          <div class="flex flex-col items-start">
            <h4 class="text-lg font-medium text-gray-900 dark:text-white">
              {{ activity.name }}
            </h4>
            <p class="text-sm text-gray-500">
              {{ activity.description }}
            </p>
          </div>
          <UTooltip :text="t('edit_activity')" :popper="{placement: 'top'}">
            <UButton
              color="white"
              variant="solid"
              icon="i-heroicons-pencil-square"
              @click="openEditActivityForm"
            />
          </UTooltip>
        </div>
      </div>
    </template>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div class="flex flex-col gap-2 items-start">
        <p>{{ t("course_type") }}</p>
        <UBadge
          :icon="ACTIVITY_ICONS[activity.activity_type]"
          :color="ACTIVITY_COLORS[activity.activity_type] || 'gray'"
          size="md"
          variant="soft"
          :label="g(`activities.types.${activity.activity_type}.name`)"
        />
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p>{{ t("base_price") }}</p>
        <p class="font-bold text-lg">{{ formatCurrency(activity.price) }}</p>
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p>{{ t("base_required") }}</p>
        <p class="font-bold text-lg">{{ activity.required ?? t('not_specified') }}</p>
      </div>
      <div class="flex flex-col gap-2 items-start">
        <p>{{ t("max_attendees") }}</p>
        <p class="font-bold text-lg">{{ "TO BE DONE" }}</p>
      </div>
    </div>
    <template #footer>
      <div class="flex gap-4">
        <p>{{ t("classes") }}</p>
        <div
          v-if="allowedClasses && allowedClasses.length > 0"
          class="flex flex-wrap"
        >
          <CourseTypeBadge
            v-for="courseCombination in allowedClasses"
            :key="courseCombination.id"
            :type="courseCombination.course.type"
            class="mr-2 mb-2"
          />
        </div>
        <p
          v-else-if="allowedClasses && allowedClasses.length == 0"
          class="text-sm text-gray-500"
        >
          {{ t("no_classes_assigned_to_activity") }}
        </p>
        <p v-else-if="status == 'pending'" class="flex items-center gap-2">
          <USkeleton class="w-8" />
        </p>
        <p v-else class="text-sm text-red-500">
          {{ t("error_loading_classes") }}
        </p>
      </div>
    </template>
  </UCard>
</template>

<script setup lang="ts">
import { ACTIVITY_ICONS, ACTIVITY_COLORS } from "~/constants";
import type { AppCourseActivity } from "~/types/app.types";
import { formatCurrency } from "~/utils/formatters";
import CourseTypeBadge from "./CourseTypeBadge.vue";
import { USkeleton } from "#components";
import EditCourseActivityForm from "../forms/EditCourseActivityForm.vue";

type Props = {
  activity: AppCourseActivity;
};

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});
const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();
const slideover = useSlideover();
const emits = defineEmits<{
  (e: "updated"): void;
}>();

const { data: allowedClasses, status, refresh } = useAsyncData(
  `allowed-classes-${props.activity.id}`,
  async () => {
    return courseActivitiesStore.getAllowedCourseForActivity(props.activity.id);
  }
);

function openEditActivityForm() {
    slideover.open(EditCourseActivityForm, {
        courseActivityId: props.activity.id,
        "onActivity-saved": () => {
            slideover.close();
            emits("updated");
        },
        "onActivity-deleted": () => {
            slideover.close();
            emits("updated");
        },
        "preventClose": true,
        "onVnodeUnmounted": () => {
            refresh();
        },
    })
}
</script>

<style scoped></style>

<i18n lang="json">
    {
        "de": {
            "edit_activity": "Aktivität bearbeiten",
            "not_specified": "Nicht angegeben",
            "course_type": "Kurstyp",
            "base_price": "Grundpreis",
            "base_required": "Basis pflichtanwesenheit",
            "max_attendees": "Maximale Teilnehmer",
            "classes": "Kurse",
            "no_classes_assigned_to_activity": "Keine Kurse dieser Aktivität zugewiesen",
            "error_loading_classes": "Fehler beim Laden der Kurse"
        },
        "en": {
            "edit_activity": "Edit Activity",
            "not_specified": "Not specified",
            "course_type": "Course Type",
            "base_price": "Base Price",
            "base_required": "Base Required Attendances",
            "max_attendees": "Max Attendees",
            "classes": "Classes",
            "no_classes_assigned_to_activity": "No classes assigned to this activity",
            "error_loading_classes": "Error loading classes"
        }
    }
</i18n>
