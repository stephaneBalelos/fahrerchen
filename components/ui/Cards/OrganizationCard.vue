<template>
  <UPageCard
    v-if="organization"
    :key="organization.id"
    class="mb-4 cursor-pointer"
    :title="organization.name"
    :ui="{ wrapper: 'relative group org-card' }"
    @click="navigateTo(`/my/${organization.id}`)"
  >
    <template #description>
      {{ t("created_at", { date: formatDate(organization.inserted_at) }) }}
    </template>
    <template #icon>
      <UAvatar :src="organization.avatar" :alt="organization.name" size="lg" />
    </template>
  </UPageCard>
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
    "created_at": "Erstellt am {date}"
  },
  "en": {
    "created_at": "Created at {date}"
  }
}
</i18n>
