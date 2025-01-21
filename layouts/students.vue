<template>
  <UDashboardLayout>
    <UDashboardPanel grow>
      <UHeader v-if="organization">
        <template #logo> {{ organization?.name }} </template>

        <template #right>
          <UColorModeButton />

          <UButton :label="t('logout')" color="gray"  @click="logout"/>
        </template>

        <template #panel>
          <!-- <UNavigationTree v-if="organization" :links="links" /> -->
        </template>
      </UHeader>
      <ClientOnly>
        <slot />
      </ClientOnly>
    </UDashboardPanel>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import { computedAsync } from '@vueuse/core';
import type { Database } from '~/types/app.types';

const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
  useScope: "local",
});

const organization = computedAsync(async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    return null;
  }
  const { data, error } = await client.from('organizations').select('*').eq('id', userOrganizationsStore.selectedOrganization.organization_id).single();
  if (error) {
    console.log(error);
    return null;
  }

  return data;
})

async function logout() {
  await client.auth.signOut();
  navigateTo("/");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "logout": "Abmelden"
  },
  "en": {
    "logout": "Logout"
  }
}
</i18n>
