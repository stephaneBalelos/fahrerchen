<template>
  <UDashboardCard
    :description="t('open_registrations_description')"
    icon="i-heroicons-arrow-down-on-square"
  >
    <template #title>
      <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {{ openRegCount }}
      </div>
    </template>
    <template #links>
      <!-- <UBadge color="primary" variant="soft">+ 5</UBadge> -->
    </template>
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();

const { data: openRegCount } = useAsyncData(async () => {
  const { count, error } = await client
    .from("students_registration_requests")
    .select("*", { count: "exact", head: true }).eq('status', 0)

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
    "open_registrations_description": "Offene Anmeldungen"
  },
  "en": {
    "open_registrations_description": "Open Registrations"
  }
}
</i18n>
