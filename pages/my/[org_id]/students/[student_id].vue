<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar v-if="studentsStore.selectedStudent">
        <template #title>
          <div class="flex items-center gap-2">
            <UAvatar
              :alt="`${studentsStore.selectedStudent.firstname} ${studentsStore.selectedStudent.lastname}`"
              size="sm"
            />
            <span>{{ studentsStore.selectedStudent.full_name }}</span> |
            <span>
              {{ studentsStore.selectedStudent.id }}
            </span>
            <UBadge v-if="studentsStore.selectedStudent" color="red" size="sm">
              {{ t("archive") }}
            </UBadge>
          </div>
        </template>
        <template #right>
          <UButton
            v-if="studentsStore.selectedStudent"
            size="sm"
            color="primary"
            variant="outline"
            @click="() => {}"
          >
            {{ t("generate_certifcate") }}
          </UButton>
        </template>
      </UDashboardNavbar>
      <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
        <UHorizontalNavigation :links="links" />
      </UDashboardToolbar>
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
const { t } = useI18n({
  useScope: "local",
});

const studentsStore = useStudentsStore();

const links = computed(() => {
  const student = studentsStore.selectedStudent;
  if (!student) return [];
  const org_id = student.organization_id;
  const student_id = student.id;
  return [
    [
      {
        label: t("overview"),
        to: `/my/${org_id}/students/${student_id}`,
        exact: true,
      },
      {
        label: t("activity"),
        to: `/my/${org_id}/students/${student_id}/activity`,
      },
      {
        label: t("bills"),
        to: `/my/${org_id}/students/${student_id}/bills`,
      },
      {
        label: t("subscription"),
        to: `/my/${org_id}/students/${student_id}/subscription`,
      },
    ],
  ];
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Student",
    "active": "Aktiv",
    "archive": "Archiv",
    "overview": "Überblick",
    "activity": "Aktivität",
    "bills": "Rechnungen",
    "subscription": "Einschreibung",
    "student_is_inactive": "Der Schüler ist inaktiv.",
    "student_is_inactive_description": "Der Schüler ist inaktiv und hat keine aktiven Abonnements.",
    "generate_certifcate": "Zertifikat generieren"
  },
  "en": {
    "title": "Student",
    "active": "Active",
    "archive": "Archive",
    "overview": "Overview",
    "activity": "Activity",
    "bills": "Bills",
    "subscription": "Registration",
    "student_is_inactive": "The student is inactive.",
    "student_is_inactive_description": "The student is inactive and has no active subscriptions.",
    "generate_certifcate": "Generate certificate"
  }
}
</i18n>
