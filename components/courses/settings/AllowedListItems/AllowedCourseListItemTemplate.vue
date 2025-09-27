<template>
  <div
    v-if="!isLoading"
    :class="`flex items-center py-4 px-4 ${isAllowed ? '' : 'bg-gray-50 dark:bg-gray-800'}`"
  >
    <p class="text-sm font-medium break-all">
      {{
        t("driving_license_of_type", {
          type: g(`course_types.${props.course.type}.name`),
        })
      }}
    </p>
    <div class="ml-auto">
      <div v-if="isAllowed" class="flex items-center gap-2">
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
  isLoading: boolean;
  isAllowed: boolean;
  course: AppCourse;
  removeCourseFromAllowedCourses: () => Promise<void>;
  addCourseToAllowedCourses: () => Promise<void>;
}

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
</script>

<style scoped></style>

<i18n lang="json">
{
  "en": {
    "course_allowed": "Course allowed",
    "course_not_allowed": "Course not allowed",
    "driving_license_of_type": "Driving license of type {type}"
  },
  "de": {
    "course_allowed": "Kurs erlaubt",
    "course_not_allowed": "Kurs nicht erlaubt",
    "driving_license_of_type": "Führerschein der Klasse {type}"
  }
}</i18n>
