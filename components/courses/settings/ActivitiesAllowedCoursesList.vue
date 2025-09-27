<template>
  <UCard
    :ui="{
      body: {
        padding: 'sm:p-0 py-0 px-0',
      },
    }"
  >
    <div class="grid grid-cols-1 divide-y divide-gray-200 dark:divide-gray-800">
      <ActivitiesAllowedCourseListItem
        v-for="course in coursesStore.courses.filter(c => c.is_active)"
        :key="course.id"
        :course="course"
        :activity-id="activityId"
        class="py-4 px-4"
      />
    </div>
  </UCard>
</template>

<script setup lang="ts">
import ActivitiesAllowedCourseListItem from "./ActivitiesAllowedCourseListItem.vue";

const activityId = defineModel("activityId", {
  type: String,
  required: true,
});

const coursesStore = useCoursesStore();

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "driving_license_of_type": "Führerschein der Klasse {type}",
    "no_allowed_courses": "Keine erlaubten Kurse",
    "no_allowed_courses_description": "Für diese Aktivität sind keine Kurse erlaubt. Bitte füge Kurse hinzu, um fortzufahren."
  },
  "en": {
    "driving_license_of_type": "Driving license of type {type}",
    "no_allowed_courses": "No allowed courses",
    "no_allowed_courses_description": "There are no allowed courses for this activity. Please add courses to proceed."
  }
}
</i18n>
