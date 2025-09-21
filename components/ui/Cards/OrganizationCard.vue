<template>
  <UDashboardCard
    v-if="organization"
    :key="organization.id"
    class="mb-4 cursor-pointer"
    :title="organization.name"
    :ui="{ wrapper: 'relative group org-card' }"
  >
    <template #description>
      {{
        t("created_at", {
          date: formatDate(organization.inserted_at),
        })
      }}
    </template>
    <template #icon>
      <UAvatar :src="organization.avatar" :alt="organization.name" size="lg" />
    </template>

    <template #links>
      <UButton
        size="sm"
        color="primary"
        :to="`/my/${organization.id}`"
        icon="i-heroicons-arrow-right-20-solid"
      />
    </template>

    <UAlert
      color="amber"
      variant="soft"
      class="mt-4"
      icon="i-heroicons-exclamation-circle-20-solid"
      :title="t('no_licence_warning_title')"
      :actions="[
        {
          label: t('manage_licence'),
          to: `/my/${organization.id}/settings/billing`,
          variant: 'outline',
          color: 'amber',
        },
      ]"
    />
    <UAlert
      color="green"
      variant="soft"
      class="mt-4"
      icon="i-heroicons-check-circle-20-solid"
      :title="t('licence_active_title', { date: formatDate(organization.inserted_at) })"

      :actions="[
        {
          label: t('manage_licence'),
          to: `/my/${organization.id}/settings/billing`,
          variant: 'outline',
          color: 'green',
        },
      ]"
    />
  </UDashboardCard>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  orgId: string;
};
const props = defineProps<Props>();
const supabase = useSupabaseClient<Database>();

const config = useRuntimeConfig().public;

const { t } = useI18n({
  useScope: "local",
});

const { data: organization } = useAsyncData(
  `organization_${props.orgId}`,
  async () => {
    const { data, error } = await supabase
      .from("organizations")
      .select("*")
      .eq("id", props.orgId)
      .single();
    if (error) {
      throw error;
    }
    return data;
  },
  {
    transform: (data) => {
      return {
        ...data,
        avatar: data.avatar_path
          ? `${config.supabase_storage_url}/object/public/organizations_avatars/${data.avatar_path}`
          : undefined,
      };
    },
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "created_at": "Erstellt am {date}",
    "no_licence_warning_title": "Keine Lizenz aktiv",
    "licence_active_title": "Lizenz aktiv - Nächste Abrechnung am {date}",
    "next_billing_date": "Nächste Abrechnung am {date}",
    "manage_licence": "Lizenz verwalten"
  },
  "en": {
    "created_at": "Created at {date}",
    "no_licence_warning_title": "No active license",
    "licence_active_title": "License active - Next billing on {date}",
    "next_billing_date": "Next billing on {date}",
    "manage_licence": "Manage license"
  }
}
</i18n>
