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
            variant="solid"
            icon="i-heroicons-plus-circle-solid"
            @click="() => { openEditCourseActivityScheduleSlideover() }"
          >
            {{ t("new_schedule_for_student", { student: student.firstname }) }}
          </UButton>
          <UButton
            v-if="student"
            size="sm"
            color="primary"
            variant="outline"
            icon="i-heroicons-document-arrow-down-solid"
            @click="() => {}"
          >
            {{ t("generate_certificate") }}
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
import EditCourseActivitySchedule from '~/components/forms/EditCourseActivitySchedule.vue';


const { t } = useI18n({
  useScope: "local",
});

const slideover = useSlideover();

const userOrganizationsStore = useUserOrganizationsStore();
const $courseActivitySchedules = useCourseActivitySchedules();
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

const openEditCourseActivityScheduleSlideover = () => {
  if (!subscriptionStore.selectedSubscription) return;
  const subscription = subscriptionStore.selectedSubscription
  slideover.open(EditCourseActivitySchedule, {
    subscriptionId: subscriptionStore.selectedSubscription.id,
    courseId: subscriptionStore.selectedSubscription.course_id,
    "onSchedule-saved": async (id) => {
      slideover.close();
      await $courseActivitySchedules.addAttendeesToSchedule(id, [subscription.id]);
    },
  })
}
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
    "generate_certificate": "Zertifikat generieren",
    "new_schedule_for_student": "Neuer Termin für {student}"
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
    "generate_certificate": "Generate certificate",
    "new_schedule_for_student": "New schedule for {student}"
  }
}
</i18n>
