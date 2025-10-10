<template>
  <UDashboardPanelContent class="p-0">
    <UDashboardToolbar>
      <UContainer class="w-full">
        <span class="text-lg font-semibold">
          {{ t("schedules") }}
        </span>
      </UContainer>
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <UContainer
        v-if="studentStore.selectedSubscription"
        class="w-full grid grid-cols-1 gap-4"
      >
      Course Infos
      </UContainer>
    </UDashboardPanelContent>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">

const { t } = useI18n({
  useScope: "local",
});

const studentStore = useStudentStore();

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "schedules": "Termine",
    "schedules_desc": "Hier können Sie die Aktivitäten sehen, die Sie in diesem Kurs haben.",
    "no_activities_found": "Keine Aktivitäten gefunden",
    "planned_for": "Geplant für den ",
    "attended": "Teilgenommen",
    "registered": "Registriert",
    "canceled": "Abgesagt",
    "attend": "Teilnehmen",
    "cancel_registration": "Termin absagen"
  },
  "en": {
    "schedules": "Schedules",
    "schedules_desc": "Here you can see the activities you have in this course.",
    "no_activities_found": "No activities found",
    "planned_for": "Planned for ",
    "attended": "Attended",
    "registered": "Registered",
    "canceled": "Canceled",
    "attend": "Attend",
    "cancel_registration": "Cancel registration"
  }
}
</i18n>
