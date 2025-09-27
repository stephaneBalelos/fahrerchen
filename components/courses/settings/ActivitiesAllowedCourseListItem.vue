<template>
  <div
    v-if="status === 'success'"
    :class="`flex items-center py-4 px-4 ${data ? '' : 'bg-gray-50 dark:bg-gray-800'}`"
  >
    <p class="text-sm font-medium break-all">
      {{
        t("driving_license_of_type", {
          type: g(`course_types.${props.course.type}.name`),
        })
      }}
    </p>
    <div class="ml-auto">
      <div v-if="data" class="flex items-center gap-2">
        <UBadge
          color="primary"
          variant="soft"
          size="sm"
          >{{ t("course_allowed") }}</UBadge
        >
        <UButton
          size="2xs"
          color="red"
          variant="soft"
          icon="i-heroicons-minus-circle"
          @click="() => removeCourseFromAllowedCourses()"
        />
      </div>
      <div v-else class="flex items-center gap-2">
        <UBadge
          color="white"
          variant="solid"
          size="sm"
          >{{ t("course_not_allowed") }}</UBadge
        >
        <UButton
          size="2xs"
          color="black"
          variant="solid"
          icon="i-heroicons-plus-circle"
          @click="() => addCourseToAllowedCourses()"
        />
      </div>

    </div>
  </div>
  <div v-else class="flex items-center justify-center py-4 px-4">
    <USkeleton class="h-6 w-full" />
  </div>
</template>

<script setup lang="ts">
import type { AppCourse } from '~/types/app.types';

type Props = {
  course: AppCourse
  activityId: string;
};

const { t } = useI18n({
  useScope: "local",
});
const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();


const { data, refresh, status } = useAsyncData(
  `course_activities_combination_${props.activityId}_${props.course.id}`,
  () =>
    courseActivitiesStore.getAllowedCourseForActivity(
      props.activityId,
      props.course.id
    ),
  {
    transform: (data) => data[0] || null,
     immediate: true, watch: [() => props.activityId, () => props.course.id] }
);

const addCourseToAllowedCourses = async () => {
  await courseActivitiesStore.addCourseToAllowedCourses(props.activityId, props.course.id);
  await refresh();
};

const removeCourseFromAllowedCourses = async () => {
  await courseActivitiesStore.removeCourseFromAllowedCourses(props.activityId, props.course.id);
  await refresh();
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "driving_license_of_type": "Driving license of type {type}",
    "course_allowed": "Allowed",
    "course_not_allowed": "Not allowed"
  },
  "de": {
    "driving_license_of_type": "Führerschein der Klasse {type}",
    "course_allowed": "Erlaubt",
    "course_not_allowed": "Nicht erlaubt"
  }
}</i18n>
