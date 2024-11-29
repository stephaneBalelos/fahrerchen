<script setup lang="ts">
import type { AppOrganization, Database } from "~/types/app.types";

const client = useSupabaseClient<Database>();
const user = useSupabaseUser();
const userOrganizationsStore = useUserOrganizationsStore();
const userPermissionStore = useUserPermissionsStore();

const {
  data: organizations,
  error,
  status,
} = await useAsyncData(
  "user_organizations_select",
  async () => {
    const { data, error } = await client
      .from("organizations")
      .select("id, name")
      .in(
        "id",
        userOrganizationsStore.organizations.map((o) => o.organization_id)
      );

    if (error) {
      throw error;
    }
    if (!data) {
      throw new Error("No Organizations found");
    }
    return data;
  },
  {
    watch: [userOrganizationsStore.organizations],
    immediate: true,
    transform: (data) => {
      return data.map((d, index) => {
        return {
          id: d.id,
          label: d.name,
          avatar: {
            src: null,
          },
          icon: "i-heroicons-globe-europe-africa",
          click: () => {
            userOrganizationsStore.selectOrganization(d.id);
          },
        };
      });
    },
  }
);

const actions = computed(() => {
  const items = [];

  const selectedOrganization = userOrganizationsStore.selectedOrganization;

  if (
    userPermissionStore.hasPermission("organizations.update") &&
    selectedOrganization
  ) {
    items.push({
      label: "Settings",
      icon: "i-heroicons-cog-8-tooth",
      click: () => {
        navigateTo(`/my/${selectedOrganization.organization_id}/settings`);
      },
    });
  }

  items.push({
    label: "Zurück zu den Teams",
    click: () => {
      navigateTo("/my");
    },
  });
  return items;
});

const selectedOrganization = computed(() => {
  return organizations.value?.find(
    (o) => o.id === userOrganizationsStore.selectedOrganization?.organization_id
  );
});
</script>

<template>
  <UDropdown
    id="teams-dropdown"
    v-if="organizations"
    v-slot="{ open }"
    mode="hover"
    :items="[organizations, actions]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      v-if="userOrganizationsStore.selectedOrganization"
      color="gray"
      variant="ghost"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar
        :src="false"
        :icon="'i-heroicons-globe-europe-africa'"
        size="2xs"
      />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        selectedOrganization?.label
      }}</span>
    </UButton>
  </UDropdown>
</template>
