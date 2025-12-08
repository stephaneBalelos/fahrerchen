<template>
  <UDashboardPanelContent>
    <div
      v-if="courses && courses.length > 0"
      class="grid grid-cols-1 lg:grid-cols-2 gap-2"
    >
      <CoursesCourseCard
        v-for="course in courses"
        :key="course.id"
        :course="course"
      />
    </div>
    <div 
    v-else-if="coursesStore.isLoadingCourses"
    class="grid grid-cols-1 lg:grid-cols-2 gap-2">
      <USkeleton
        v-for="n in 4"
        :key="n"
        class="h-40 w-full rounded-lg"
      />
    </div>
    <div
      v-else
      class="flex flex-col items-start p-4"
    >
      <UAlert
        :icon="'i-heroicons-information-circle-20-solid'"
        :title="t('no_course_title')"
        :description="t('no_course_description')"
        :color="'amber'"
        :variant="'soft'"
        :actions="[{
          label: t('activate_courses'),
          variant: 'solid',
          color: 'white',
          click: () => {
            console.log('activate Course')
          }
        }]"
      />
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "orgs",
});
const coursesStore = useCoursesStore();

const courses = computed(() => {
  return coursesStore.courses.filter((course) => course.is_active);
});

const { t } = useI18n({
  useScope: "local",
});
</script>
<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Kurseangebote",
    "headline": "Kurse",
    "description": "Hier findest du alle Kurse, die deine Fahrschule anbietet.",
    "no_course_title": "Kein aktiver Kurs",
    "no_course_description": "Derzeit sind keine Kurse in deiner Fahrschule verfügbar. Aktivieren Sie die Kurse, die Sie in Ihre Fahrschule anbieten möchten.",
    "activate_courses": "Kurse aktivieren"
  },
  "en": {
    "title": "Course offerings",
    "headline": "Courses",
    "description": "Here you can find all the courses your driving school offers.",
    "no_course_title": "No active course",
    "no_course_description": "Currently, there are no courses available in your driving school. Activate the courses you want to offer in your driving school.",
    "activate_courses": "Activate courses"
  }
}
</i18n>
