<template>
  <UDashboardCard
    :description="t('inactive_students_description')"
    icon="i-heroicons-academic-cap"
  >
    <template #title>
      <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {{ subCount }}
      </div>
    </template>
    <template #links>
      <!-- <UBadge color="primary" variant="soft">+ 5</UBadge> -->
    </template>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

type Props = {
  orgId: string
};

const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const userOrganizationsStore = useUserOrganizationsStore();

// Todo: Aggregate the count of inactive students
const { data: subCount } = useAsyncData(`inactive-students-total`, async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    return null;
  }
    const { count, error } = await client
        .from("students")
        .select("*, sub:course_subscriptions(*)", { count: "exact", head: true })
        .eq("organization_id", props.orgId)
        
    if (error) {
        throw error;
    }
        
  return count;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "inactive_students_description": "Inaktive Schüler:innen"
  },
  "en": {
    "inactive_students_description": "Inactive Students"
  }
}
</i18n>
