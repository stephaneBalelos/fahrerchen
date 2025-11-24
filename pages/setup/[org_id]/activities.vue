<template>

    <div class="flex-1 flex flex-col h-full">
    <div
      class="w-full py-4 bg-white dark:bg-gray-900 border-b border-gray-100 dark:border-gray-800"
    >
      <UContainer class="w-full">
  <UPageHeader
    :title="t('setup_your_course_activities')"
    :description="t('setup_your_course_activities_description')"
  />
      </UContainer>
    </div>
    <div class="flex-1 relative">
      <div class="absolute inset-0 py-8 overflow-y-auto">
        <UContainer class="w-full">
    <div 
    v-if="organizationsStore.selectedOrganization"
      class="py-12">
      <CoursesSettingsCourseActivitiesList
        :orgid="organizationsStore.selectedOrganization.id"
      />
    </div>
        </UContainer>
      </div>
    </div>
    <div
      class="w-full relative py-4 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-700 flex justify-end px-8"
    >
      <UButton
        v-if="organizationsStore.selectedOrganization"
          :disabled="!isCourseActivitiesSetupComplete"
        data-label="next-step"
        :to="`/setup/${organizationsStore.selectedOrganization.id}/costs`"
      >
        {{ t("continue_setup") }}
      </UButton>
    </div>
  </div>
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
