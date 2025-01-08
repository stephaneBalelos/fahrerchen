<template>
  <UDashboardPanelContent>
    <UContainer class="w-full">
      <UDashboardSection
        v-if="studentStore.subscription && studentStore.student"
        icon="i-heroicons-user"
        :title="t('hello', { name: studentStore.subscription.student_firstname })"
        :description="t('subscription_description', { course: studentStore.subscription.course_name })"
        orientation="vertical"
        card
      >
      <StudentCourseProfile :title="t('progression')" :description="t('progression_desc')"  :subscription_id="studentStore.subscription.id" :student="studentStore.student" />
      </UDashboardSection>
    </UContainer>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import StudentCourseProfile from '~/components/courses/StudentCourseProfile.vue';

const studentStore = useStudentStore();

const { t } = useI18n({
  useScope: "local",
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "hello": "Hallo {name}",
    "subscription_description": "Du bist angemeldet für den Kurs {course}",
    "progression": "Kursfortschritt",
    "progression_desc": "Übersicht über deinen Kursfortschritt"
  },
  "en": {
    "hello": "Hello {name}",
    "subscription_description": "You are subscribed to the course {course}",
    "progression": "Course Progression",
    "progression_desc": "Overview of your course progression"
  }
}
</i18n>
