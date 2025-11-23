<template>
  <UDashboardCard
    v-if="organization"
    :key="organization.id"
    class="organization-card mb-4 cursor-pointer"
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
        v-if="organization.setup_completed"
        data-label="go-to-organization"
        class="go-to-organization-button"
        size="sm"
        color="primary"
        :to="`/my/${organization.id}`"
        icon="i-heroicons-arrow-right-20-solid"
      />
      <UButton
        v-else
        data-label="continue-setup"
        size="sm"
        color="primary"
        :label="t('continue_setup')"
        :to="`/setup/${organization.id}`"
        icon="i-heroicons-arrow-right-20-solid"
        trailing
      />
    </template>
    <div v-if="organization.setup_completed">
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
        :title="
          t('licence_active_title', {
            date: formatDate(organization.inserted_at),
          })
        "
        :actions="[
          {
            label: t('manage_licence'),
            to: `/my/${organization.id}/settings/billing`,
            variant: 'outline',
            color: 'green',
          },
        ]"
      />
    </div>
    <div v-else class="mt-4">
      <UAlert
        color="blue"
        variant="soft"
        icon="i-heroicons-information-circle-20-solid"
        :title="t('setup_incomplete_title')"
      />

    </div>
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
    "continue_setup": "Einrichtung fortsetzen",
    "no_licence_warning_title": "Keine Lizenz aktiv",
    "licence_active_title": "Lizenz aktiv - Nächste Abrechnung am {date}",
    "next_billing_date": "Nächste Abrechnung am {date}",
    "manage_licence": "Lizenz verwalten",
    "setup_incomplete_title": "Deine Fahrschule ist noch nicht einsatzbereit. Bitte schließe die Einrichtung ab."
  },
  "en": {
    "created_at": "Created at {date}",
    "continue_setup": "Continue setup",
    "no_licence_warning_title": "No active license",
    "licence_active_title": "License active - Next billing on {date}",
    "next_billing_date": "Next billing on {date}",
    "manage_licence": "Manage license",
    "setup_incomplete_title": "Your driving school is not ready for use yet. Please complete the setup."
  }
}
</i18n>
