<template>
  <UDashboardSlideover v-if="subscriptions" :title="t('student_subscriptions')">
    <div v-if="student" class="d-flex">
      <UAvatar
        size="3xl"
        :alt="`${student.firstname} ${student.lastname}`"
        :icon="props.studentId ? 'i-heroicons-user' : 'i-heroicons-user-plus'"
      />
      <div class="pt-4">
        <h1 class="text-2xl font-semibold">
          {{ student.firstname }} {{ student.lastname }}
        </h1>
        <p class="text-gray-500">{{ student.email }}</p>
      </div>
    </div>
    <UDivider class="py-4" size="sm" />
    <UDashboardSection
      :title="t('student_active_subscription')"
      :description="t('student_active_subscription_description')"
    >
      <div>
        <UDashboardCard
          v-if="activeSubsription"
          :title="activeSubsription.course_name"
          :description="activeSubsription.course_description"
        >
          <template #links>
            <UButton
              v-if="activeSubsription"
              color="white"
              icon="i-heroicons-arrow-right"
              trailing
              @click="
                $emit('close', `/my/${orgId}/students/${activeSubsription.id}`)
              "
            >
              {{ t("view") }}
            </UButton>
          </template>
          <!-- <UProgress /> -->
        </UDashboardCard>
        <UAlert
          v-else
          color="orange"
          variant="soft"
          :title="t('student_no_active_subscription')"
          :description="t('student_no_active_subscription_description')"
        />
      </div>
    </UDashboardSection>
    <div class="py-4" />
    <UDashboardSection
      v-if="archivedSubscriptions.length > 0"
      :title="t('student_archived_subscriptions')"
      :description="t('student_archived_subscriptions_description')"
    >
      <div>
        <UDashboardCard
          v-for="sub in archivedSubscriptions"
          :key="sub.id"
          :title="sub.course_name"
          :description="sub.course_description"
        >
          <template #links>
            <UButton
              color="white"
              icon="i-heroicons-arrow-right"
              trailing
              @click="$emit('close', `/my/${orgId}/students/${sub.id}`)"
            >
              {{ t("view") }}
            </UButton>
          </template>
          <!-- <UProgress /> -->
        </UDashboardCard>
      </div>
    </UDashboardSection>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  studentId: string;
};

const props = defineProps<Props>();
const $emit = defineEmits<{
  (event: "close", path: string): void;
}>();
const route = useRoute();
const orgId = route.params.org_id as string;

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const student = await useCourseStudent(props.studentId);

const { data: subscriptions } = useAsyncData(async () => {
  const { data, error } = await client
    .from("course_subscriptions_view")
    .select("*")
    .eq("student_id", props.studentId);
  if (error) {
    throw error;
  }

  return data;
});

const activeSubsription = computed(() => {
  if (!subscriptions.value) {
    return null;
  }
  return subscriptions.value.find((sub) => sub.archived_at === null);
});

const archivedSubscriptions = computed(() => {
  if (!subscriptions.value) {
    return [];
  }
  return subscriptions.value.filter((sub) => sub.archived_at !== null);
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "student_subscriptions": "Student Kurse",
    "student_active_subscription": "Aktive Kurs",
    "student_active_subscription_description": "Hier finden Sie Informationen zu der aktiver Kurs des Schülers.",
    "student_no_active_subscription": "Kein aktiver Kurs",
    "student_no_active_subscription_description": "Der Schüler hat keinen aktiven Kurs.",
    "student_archived_subscriptions": "Archivierte Kurse",
    "student_archived_subscriptions_description": "Hier finden Sie Informationen zu den archivierten Kurse des Schülers.",
    "view": "Anzeigen"
  },
  "en": {
    "student_subscriptions": "Student Subscriptions",
    "student_active_subscription": "Active Subscription",
    "student_active_subscription_description": "Here you can find information about the student's active subscription.",
    "student_no_active_subscription": "No active subscription",
    "student_no_active_subscription_description": "The student has no active subscription.",
    "student_archived_subscriptions": "Archived Subscriptions",
    "student_archived_subscriptions_description": "Here you can find information about the student's archived subscriptions.",
    "view": "View"
  }
}
</i18n>
