<template>
  <UDashboardLayout>
    <UDashboardPanel grow>
      <UHeader v-if="organization" :links="links">
        <template #left>
          <ULink :to="`/students/${organization.id}`">
            <div class="flex items-center gap-2">
              <UAvatar
                v-if="organization.avatar_path"
                :src="
                  $publicStorageUrl(
                    'organizations_avatars',
                    organization.avatar_path
                  ) ?? undefined
                "
                :size="'sm'"
                :alt="organization.name"
              />
              <UAvatar
                v-else
                :icon="'i-heroicons-building-office-20-solid'"
                :size="'sm'"
                :alt="organization.name"
              />
              <span class="text-lg font-semibold">
                {{ organization.name }}
              </span>
            </div>
          </ULink>
        </template>

        <template #right>
          <UColorModeButton />
          <UButton :label="t('logout')" color="gray" @click="logout" />
        </template>

        <template #panel>
          <UNavigationTree :links="links" default-open/>
        </template>
      </UHeader>
      <ClientOnly>
        <slot />
      </ClientOnly>
    </UDashboardPanel>
  </UDashboardLayout>
</template>

<script setup lang="ts">
import { computedAsync } from "@vueuse/core";
import type { Database } from "~/types/app.types";

const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const subscriptionStore = useSubscriptionStore();

const { t } = useI18n({
  useScope: "local",
});

const organization = computedAsync(async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    return null;
  }

  return userOrganizationsStore.selectedOrganization;
});

const links = computedAsync(async () => {
  if (!userOrganizationsStore.selectedOrganization) {
    return [];
  }

  if (!subscriptionStore.selectedSubscription) {
    return [];
  }

  const subscription_id = subscriptionStore.selectedSubscription.id;
  const l = [
    {
      label: t("overview"),
      icon: "i-heroicons-home",
      to: `/students/${userOrganizationsStore.selectedOrganization.id}/subscription/${subscription_id}`,
      exact: true,
    },
    {
      label: t("course"),
      icon: "i-heroicons-book-open",
      to: `/students/${userOrganizationsStore.selectedOrganization.id}/subscription/${subscription_id}/course`,
    },
    {
      label: t("activity"),
      icon: "i-heroicons-calendar",
      to: `/students/${userOrganizationsStore.selectedOrganization.id}/subscription/${subscription_id}/activity`,
      exact: true,
    },
    {
      label: t("bills"),
      icon: "i-heroicons-document",
      to: `/students/${userOrganizationsStore.selectedOrganization.id}/subscription/${subscription_id}/billing`,
    },
  ];

  return l;
});

async function logout() {
  await client.auth.signOut();
  navigateTo("/");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "overview": "Übersicht",
    "course": "Kurs",
    "activity": "Aktivitäten",
    "bills": "Rechnungen",
    "logout": "Abmelden"
  },
  "en": {
    "overview": "Overview",
    "course": "Course",
    "activity": "Activities",
    "bills": "Bills",
    "logout": "Logout"
  }
}
</i18n>
