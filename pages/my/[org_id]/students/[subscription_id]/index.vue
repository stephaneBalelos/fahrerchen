<template>
  <UDashboardPanelContent>
    <div v-if="subscriptionStore.selectedSubscription">
      <StudentsStudentSubscriptionStats
        :subscription-id="subscriptionStore.selectedSubscription.id"
      />
      <StudentsCourseStudentProgression
        :subscription="subscriptionStore.selectedSubscription"
      />
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <SchedulesSubscriptionScheduleList
          v-if="student"
          :title="t('schedules_for_student', { student: student.firstname })"
          :description="t('schedules_for_student_description')"
          :subscription-id="subscriptionStore.selectedSubscription.id"
          :start-at="new Date().toISOString()"
        />
      </div>
    </div>
    <div v-else>No student selected</div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const studentsStore = useStudentsStore();
const subscriptionStore = useSubscriptionStore();

const student = computed(() => {
  if (!subscriptionStore.selectedSubscription) return null;
  return studentsStore.students.find(
    (s) => s.id === (subscriptionStore.selectedSubscription?.student_id ?? "")
  );
});

function _deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "schedules_for_student": "Zeitpläne für {student}",
    "schedules_for_student_description": "Hier sind die geplanten Termine für diesen Schüler."
  },
  "en": {
    "schedules_for_student": "Schedules for {student}",
    "schedules_for_student_description": "Here are the scheduled sessions for this student."
  }
}
</i18n>
