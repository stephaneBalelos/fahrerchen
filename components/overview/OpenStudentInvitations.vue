<template>
  <UDashboardCard
    :description="t('open_invitations_description')"
    icon="i-heroicons-envelope"
  >
    <template #title>
      <div class="text-2xl font-semibold text-gray-800 dark:text-gray-200">
        {{ openInvitCount }}
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

const { data: openInvitCount } = useAsyncData(async () => {
  const { count, error } = await client
    .from("organizations_invitations")
    .select("*", { count: "exact", head: true })
    .eq("role", "student")
    .eq("status", 0);

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
    "open_invitations_description": "Offene Einladungen"
  },
  "en": {
    "open_invitations_description": "Open Invitations"
  }
}
</i18n>
