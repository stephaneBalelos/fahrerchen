<template>
  <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
        <div class="flex items-center gap-4 justify-between">
          <div class="flex flex-col">
            <h3
              class="text-2xl font-semibold leading-6 text-gray-900 dark:text-white mb-2"
            >
              {{ t('compose_your_courses')}}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
              {{ t('compose_your_courses_description') }}
            </p>
          </div>
        </div>
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full max-w-full">
          <CoursesSetup
            v-if="userOrganizationsStore.selectedOrganization"
            :org-id="userOrganizationsStore.selectedOrganization?.id"
            @course-setup-completed="
              () =>
                navigateTo(
                  `/setup/${userOrganizationsStore.selectedOrganization?.id}/activities`
                )
            "
          />
        </UContainer>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end items-end px-8 pb-6"
    >
    <div class="flex flex-col gap-2 mr-8">
      <span class="text-sm font-medium text-gray-400 dark:text-gray-400">
        {{ t("selected_courses") }}
      </span>

      <div class="flex gap-2">
        <CoursesCourseTypeBadge v-for="course in coursesStore.activeCourses" :key="course.id" :type="course.type" />
      </div>
    </div>
      <div class="flex">
        <UButton
          v-if="userOrganizationsStore.selectedOrganization"
          :disabled="!isCourseSetupComplete"
          data-label="next-step"
          :to="`/setup/${userOrganizationsStore.selectedOrganization.id}/activities`"
        >
          {{ t("continue_setup", { count: coursesStore.courses.filter(c => c.is_active).length }) }}
        </UButton>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import CoursesSetup from "~/components/setup/CoursesSetup.vue";
import { computedAsync } from "@vueuse/core";



const userOrganizationsStore = useUserOrganizationsStore();
const coursesStore = useCoursesStore();

const { t } = useI18n({
  useScope: "local",
});

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
    "continue_setup": "Weiter mit {count} aktiven Kurs(en)",
    "selected_courses": "Ausgewählte Klassen",
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
    "continue_setup": "Continue with {count} active course(s)",
    "selected_courses": "Selected classes",
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
