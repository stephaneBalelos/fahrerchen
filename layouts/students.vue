<template>
  <UDashboardLayout>
    <UDashboardPanel grow>
      <UHeader :links="links">
        <template #logo> Fahari Academy </template>

        <template #right>
          <UColorModeButton />

          <UButton @click="logout" :label="t('logout')" color="gray" />
        </template>

        <template #panel>
          <UNavigationTree :links="links" />
        </template>
      </UHeader>
      <ClientOnly>
        <slot></slot>
      </ClientOnly>
    </UDashboardPanel>
  </UDashboardLayout>
</template>

<script setup lang="ts">
const runtimeConfig = useRuntimeConfig();
const client = useSupabaseClient();
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const links = computed(() => {
  if (!userOrganizationsStore.selectedOrganization) {
    return [];
  }

  const l = [
    {
      label: t("overview"),
      icon: "i-heroicons-home",
      to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}`,
      exact: true,
    },
    {
      label: t("courses"),
      icon: "i-heroicons-graduation-cap",
      to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}/courses`,
      exact: true,
    },
    {
      label: t("bills"),
      icon: "i-heroicons-cash",
      to: `/students/${userOrganizationsStore.selectedOrganization.organization_id}/bills`,
      exact: true,
    },
  ];

  return l;
});

async function logout() {
  await client.auth.signOut();
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "overview": "Übersicht",
    "courses": "Kurse",
    "bills": "Rechnungen",
    "logout": "Abmelden"
  },
  "en": {
    "overview": "Overview",
    "courses": "Courses",
    "bills": "Bills",
    "logout": "Logout"
  }
}
</i18n>
