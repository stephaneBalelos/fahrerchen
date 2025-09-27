<template>
  <UPageHeader
    :title="t('setup_your_course_activities')"
    :description="t('setup_your_course_activities_description')"
  >
    <template #links>
      <UButton
        v-if="isCourseActivitiesSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="() => navigateTo(`/setup/${organizationsStore.selectedOrganization?.id}/course-subscriptions`)"
        >{{
          t("continue")
        }}</UButton
      >
    </template>
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12">
      <CoursesSettingsCourseActivitiesList
        :orgid="organizationsStore.selectedOrganization.id"
      />
    </div>
  </UPageHeader>
</template>

<script setup lang="ts">


const { t } = useI18n({
  useScope: "local",
});


const organizationsStore = useUserOrganizationsStore();
const courseActivitiesStore = useCourseActivitiesStore();


const isCourseActivitiesSetupComplete = computed(() => {
  return (
    courseActivitiesStore.courseActivities.length > 0
  );
});


</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "setup_your_course_activities": "Richte deine Kursaktivitäten ein",
    "setup_your_course_activities_description": "Füge Aktivitäten zu deinem Kurs hinzu, um den Lernenden eine strukturierte Erfahrung zu bieten.",
    "continue": "Weiter"
    
  },
  "en": {
    "setup_your_course_activities": "Set up your course activities",
    "setup_your_course_activities_description": "Add activities to your course to provide learners with a structured experience.",
    "continue": "Continue"
  }
}
</i18n>
