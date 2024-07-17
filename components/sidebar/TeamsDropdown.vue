<script setup lang="ts">
import type { AppOrganization, Database } from "~/types/app.types";

const actions = [
  {
    label: "Create team",
    icon: "i-heroicons-plus-circle",
  },
  {
    label: "Manage teams",
    icon: "i-heroicons-cog-8-tooth",
  },
];

const client = useSupabaseClient<Database>();
const props = useAttrs() as { orgid: string };
const orgState = useUserOrganizations();
const { userInfos } = useUserInfos();

const {
  data: teams,
  error,
  pending,
} = await useAsyncData(
  "",
  async () => {
    if (!userInfos.value) {
      return [];
    }
    const { data, error } = await client
      .from("organization_members")
      .select("user_id, organizations(*)")
      .eq("user_id", userInfos.value.id);

    if (error) {
      throw error;
    }
    return data;
  },
  {
    watch: [orgState.selected_organization_id, userInfos],
    immediate: true,
    transform: (data) => {
      const orgs = data
        .map((d) => d.organizations)
        .filter((org) => org !== null);
      return orgs.map((d, index) => {
        return {
          id: d.id,
          label: d.name,
          avatar: {
            src: null,
          },
          icon: "i-heroicons-globe-europe-africa",
          click: () => {
            orgState.selected_organization_id.value = d.id;
          },
        };
      });
    },
  }
);

const team = computed(() => {
  if (!teams.value) return null;
  return teams.value.find((t) => t.id === orgState.selected_organization_id.value);
});
</script>

<template>
  <UDropdown
    id="teams-dropdown"
    v-if="teams"
    v-slot="{ open }"
    mode="hover"
    :items="[teams, actions]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      v-if="team"
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar :src="team.avatar.src ?? false" :icon="team.icon" size="2xs" />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        team?.label
      }}</span>
    </UButton>
  </UDropdown>
</template>
