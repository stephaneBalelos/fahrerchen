<template>
  <UPageHeader
    :title="t('compose_your_courses')"
    :description="t('compose_your_courses_description')"
  >
    <template #links>
      <UButton
        v-if="isCourseSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="$emits('course-setup-completed')"
        >{{ t("course_setup_complete", { count: coursesStore.courses.filter(c => c.is_active).length }) }}</UButton
      >
    </template>
    <div
      v-if="coursesStore.courses.length > 0"
      class="grid grid-cols-1 md:grid-cols-2 gap-4 py-12"
    >
      <UCard 
      v-for="course in coursesStore.courses" :key="course.id"
      :ui="{
        base: 'flex flex-col',
        ring: `${course.is_active ? 'ring-primary-500' : ''}`,

        body: {
          base: 'flex-1'
        }
      }">
        <template #header>
          <div class="flex items-center gap-4">
            <UAvatar
              size="lg"
              color="primary"
              :icon="COURSE_ICONS[course.type]"
            />
            <div class="flex items-center gap-2">
              <span class="text-lg font-semibold">{{
                t("driving_license_of_type", {
                  type: g(`course_types.${course.type}.name`),
                })
              }}</span>
            </div>
          </div>
        </template>
        <p>
          {{ g(`course_types.${course.type}.description`) }}
        </p>
        <template #footer>
          <div class="flex justify-end gap-2">
            <UButton
              v-if="!course.is_active"
              size="sm"
              color="primary"
              icon="i-heroicons-plus-circle"
              @click="() => coursesStore.setCourseActiveStatus(course.id, true)"
              >{{ t("activate_course") }}</UButton
            >
                <UBadge
                v-if="course.is_active"
                color="green"
                variant="soft"
                size="sm"
                >{{ t("course_activated") }}</UBadge
              >
            <UButton
              v-if="course.is_active"
              size="sm"
              color="red"
              variant="soft"
              icon="i-heroicons-trash"
              @click="
                () => coursesStore.setCourseActiveStatus(course.id, false)
              "
            />
          </div>
        </template>
      </UCard>
    </div>
    <div v-else>
      <div v-if="coursesStore.isLoadingCourses" class="space-y-2">
        <USkeleton class="h-24 w-full" />
        <USkeleton class="h-24 w-full" />
      </div>
      <UAlert
        v-else
        icon="i-heroicons-exclamation-triangle-20-solid"
        color="red"
        variant="subtle"
        :title="t('failed_to_load_courses')"
        :description="t('failed_to_load_courses_description')"
      />
    </div>
  </UPageHeader>
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";
import { computedAsync } from "@vueuse/core";

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});
const coursesStore = useCoursesStore();
const $emits = defineEmits(["course-setup-completed"]);

const isCourseSetupComplete = computedAsync(async () => {
  const hasCourses = coursesStore.courses.length > 0;
  // at least one course is active
  const hasActiveCourse = coursesStore.courses.some((c) => c.is_active);
  return hasCourses && hasActiveCourse;
}, false);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "compose_your_courses": "Ihre Kursangebote zusammenstellen",
    "compose_your_courses_description": "Wählen Sie die Führerscheinklassen aus, die Sie in Ihrer Fahrschule anbieten möchten. Sie können dies jederzeit anpassen.",
    "activate_course": "Kurs aktivieren",
    "driving_license_of_type": "Führerschein der Klasse {type}",
    "course_setup_complete": "Weiter mit {count} aktiven Kurs(en)",
    "course_activated": "Kurs aktiviert",
    "failed_to_load_courses": "Fehler beim Laden der Kurse",
    "failed_to_load_courses_description": "Es gab ein Problem beim Laden der Kurse. Bitte versuchen Sie es erneut oder kontaktieren Sie den Support, wenn das Problem weiterhin besteht."
  },
  "en": {
    "compose_your_courses": "Compose your course offerings",
    "compose_your_courses_description": "Select and activate the types of driving license courses you want to offer at your driving school. You can always adjust this later.",
    "activate_course": "Activate course",
    "driving_license_of_type": "Driving license of type {type}",
    "course_setup_complete": "Continue with {count} active course(s)",
    "course_activated": "Course activated",
    "failed_to_load_courses": "Failed to load courses",
    "failed_to_load_courses_description": "There was a problem loading the courses. Please try again or contact support if the problem persists."
  }
}
</i18n>
"
