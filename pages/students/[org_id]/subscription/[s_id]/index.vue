<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardPanelContent v-if="studentStore.selectedSubscription">
      <UContainer v-if="studentStore.student" class="w-full">
        <StudentsStudentSubscriptionStats :subscription-id="studentStore.selectedSubscription.id" />
      </UContainer>
      <UContainer
        class="w-full"
      >
      <StudentsCourseStudentProgression
        :subscription="studentStore.selectedSubscription"
      />
      <div class="grid grid-cols-1 gap-4">
        <SchedulesSubscriptionScheduleList
          v-if="studentStore.student"
          :title="t('schedules_for_student', { student: studentStore.student.firstname })"
          :description="t('schedules_for_student_description')"
          :empty-title="t('no_schedules_title')"
          :empty-description="t('no_schedules_description', { name: studentStore.student.firstname })"
          :subscription-id="studentStore.selectedSubscription.id"
          :start-at="new Date().toISOString()"
        >
          <template #actions>
            <UButton
              :to="`/students/${studentStore.selectedSubscription.organization_id}/subscription/${studentStore.selectedSubscription.id}/course`"
              size="sm"
              color="primary"
              variant="outline"
              trailing
              :label="t('see_schedules')"
              icon="i-heroicons-arrow-right-solid"
            />
          </template>
      </SchedulesSubscriptionScheduleList>
      </div>
      </UContainer>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

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
    "progression_desc": "Übersicht über deinen Kursfortschritt",
    "schedules_for_student": "Kommenden Termine",
    "schedules_for_student_description": "Hier findest du deine anstehenden Termine.",
    "no_schedules_title": "Keine Termine gefunden",
    "no_schedules_description": "Du hast keine geplanten Termine.",
    "see_schedules": "Termine ansehen"
  },
  "en": {
    "hello": "Hello {name}",
    "subscription_description": "You are subscribed to the course {course}",
    "progression": "Course Progression",
    "progression_desc": "Overview of your course progression",
    "schedules_for_student": "Upcoming Sessions",
    "schedules_for_student_description": "Here you can find your upcoming sessions.",
    "no_schedules_title": "No schedules found",
    "no_schedules_description": "You have no scheduled sessions.",
    "see_schedules": "See Schedules"
  }
}
</i18n>
