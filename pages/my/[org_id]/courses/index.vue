<template>
  <UDashboardPanelContent>
    <UPageHeader
      class="courses-header"
      :headline="t('headline')"
      :title="t('title')"
      :description="t('description')"
    />
    <div
      v-if="coursesStore.courses && coursesStore.courses.length > 0"
      class="grid grid-cols-1 lg:grid-cols-2 gap-2"
    >
    <CoursesCourseCard
        v-for="(course) in coursesStore.courses"
        :key="course.id"
        :course="course"
      />
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

definePageMeta({
  layout: "orgs",
});
const coursesStore = useCoursesStore();

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
    "description": "Hier findest du alle Kurse, die deine Fahrschule anbietet."
  },
  "en": {
    "title": "Course offerings",
    "headline": "Courses",
    "description": "Here you can find all the courses your driving school offers."
  }
}
</i18n>
