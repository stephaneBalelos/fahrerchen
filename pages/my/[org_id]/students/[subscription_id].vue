<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar v-if="subscriptionStore.selectedSubscription && student" :ui="{ wrapper: 'px-4' }">
        <template #title>
          <div class="flex items-center gap-2">
            <UAvatar
              :alt="`${student.firstname} ${student.lastname}`"
              size="sm"
            />
            <div class="flex flex-col me-4">
              <span>{{ student.full_name }}</span>
              <span class="text-xs text-gray-500 dark:text-gray-400">
                {{ student.email }}
              </span>
            </div>
            <UBadge v-if="subscriptionStore.selectedSubscription.archived_at" color="red" size="sm">
              {{ t("archive") }}
            </UBadge>
            <UBadge v-if="!subscriptionStore.selectedSubscription.archived_at" color="green" size="sm">
              {{ t("active") }}
            </UBadge>
          </div>
        </template>
        <template #right>
          <UButton
            v-if="student"
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

const userOrganizationsStore = useUserOrganizationsStore();
const studentsStore = useStudentsStore();
const subscriptionStore = useSubscriptionStore();


const student = computed(() => {
  if (!subscriptionStore.selectedSubscription) return null;
  return studentsStore.students.find(
    (s) => s.id === (subscriptionStore.selectedSubscription?.student_id ?? "")
  );  
});

const links = computed(() => {
  const subscription = subscriptionStore.selectedSubscription
  if (!subscription) return [];
  return [
    [
      {
        label: t("overview"),
        to: userOrganizationsStore.relativePath(`/students/${subscription.id}`),
        exact: true,
      },
      {
        label: t("activity"),
        to: userOrganizationsStore.relativePath(`/students/${subscription.id}/activity`),
      },
      {
        label: t("bills"),
        to: userOrganizationsStore.relativePath(`/students/${subscription.id}/bills`),
      },
      {
        label: t("subscription"),
        to: userOrganizationsStore.relativePath(`/students/${subscription.id}/subscription`),
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
