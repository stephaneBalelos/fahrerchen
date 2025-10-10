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
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SchedulesSubscriptionScheduleList
          v-if="studentStore.student"
          :title="t('schedules_for_student', { student: studentStore.student.firstname })"
          :description="t('schedules_for_student_description')"
          :subscription-id="studentStore.selectedSubscription.id"
          :start-at="new Date().toISOString()"
        />
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
    "schedules_for_student": "Zeitpläne für {student}",
    "schedules_for_student_description": "Hier sind die geplanten Termine für diesen Schüler."
  },
  "en": {
    "hello": "Hello {name}",
    "subscription_description": "You are subscribed to the course {course}",
    "progression": "Course Progression",
    "progression_desc": "Overview of your course progression",
    "schedules_for_student": "Schedules for {student}",
    "schedules_for_student_description": "Here are the scheduled sessions for this student."
  }
}
</i18n>
