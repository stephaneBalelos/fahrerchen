<script setup lang="ts">

const userOrganizationsStore = useUserOrganizationsStore();
const userPermissionStore = useUserPermissionsStore();
const config = useRuntimeConfig().public;

const { t } = useI18n({
  useScope: "local",
});

const organizationsStore = useUserOrganizationsStore();

const organizations = computed(() => {
  return organizationsStore.organizations.map((d) => {
    const avatar_path = d.avatar_path
      ? `${config.supabase_storage_url}/object/public/organizations_avatars/${d.avatar_path}`
      : "";
    return {
      id: d.id,
      label: d.name,
      avatar: {
        src: avatar_path,
      },
      icon: avatar_path ? undefined : "i-heroicons-globe-europe-africa",
      avatar_path: avatar_path,
      click: async () => {
        navigateTo(`/my/${d.id}`);
      },
    };
  });
});

const actions = computed(() => {
  const items = [];

  const selectedOrganization = userOrganizationsStore.selectedOrganization;

  if (
    userPermissionStore.hasPermission("organizations.update") &&
    selectedOrganization
  ) {
    items.push({
      label: t("settings"),
      icon: "i-heroicons-cog-8-tooth",
      click: () => {
        navigateTo(userOrganizationsStore.relativePath('/settings'));
      },
    });
  }

  items.push({
    label: t("back_to_home"),
    click: () => {
      navigateTo("/my");
    },
  });
  return items;
});
</script>

<template>
  <UDropdown
    v-if="organizations"
    id="teams-dropdown"
    v-slot="{ open }"
    mode="click"
    :items="[organizations, actions]"
    class="w-full"
    :ui="{ width: 'w-full' }"
    :popper="{ strategy: 'absolute' }"
  >
    <UButton
      v-if="userOrganizationsStore.selectedOrganization"
      color="gray"
      variant="solid"
      :class="[open && 'bg-gray-50 dark:bg-gray-800']"
      class="w-full"
    >
      <UAvatar
        :src="userOrganizationsStore.selectedOrganization.avatar_path ?? undefined"
        :icon="'i-heroicons-globe-europe-africa'"
        size="sm"
      />

      <span class="truncate text-gray-900 dark:text-white font-semibold">{{
        userOrganizationsStore.selectedOrganization.name
      }}</span>
    </UButton>
  </UDropdown>
</template>

<i18n lang="json">
{
  "de": {
    "settings": "Einstellungen",
    "back_to_home": "Zurück zur Startseite"
  },
  "en": {
    "settings": "Settings",
    "back_to_home": "Back to Home"
  }
}
</i18n>
