<template>
  <UDashboardPanel grow :ui="{
    wrapper: 'flex-row',
  }">
    <div v-if="stripeStore.stripeAccount" class="w-60 flex flex-col items-between justify-between p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex-shrink-0">
      <UNavigationTree :links="links" />
    </div>

    <UAlert
      v-if="!stripeStore.stripeAccount"
      icon="i-heroicons-credit-card"
      :title="t('title')"
      :description="t('description')"
    >
      <template #actions>
        <UButton
          v-if="organization && !organization.stripe_account_id"
          color="black"
          variant="solid"
          @click="connectStripe"
          :disabled="status === 'pending'"
          :loading="status === 'pending'"
        >
          Connect with Stripe</UButton
        >
      </template>
    </UAlert>
    <div class="grow relative" v-else>
      <div class="absolute inset-0 overflow-y-auto p-4">
        <div class="pb-4">
          <StripeEmbeddedComponent :component="'notification-banner'" />
        </div>
        <NuxtPage />
      </div>
    </div>

    <!-- <StripeOnboarding /> -->
  </UDashboardPanel>
</template>

<script setup lang="ts">
import StripeEmbeddedComponent from "~/components/settings/stripe/StripeEmbeddedComponent.vue";
import type { Database, StripeConnectPostBody } from "~/types/app.types";

const client = useSupabaseClient<Database>();
const userOrganizationStore = useUserOrganizationsStore();
const stripeStore = useStripeStore();
const { t } = useI18n({
  useScope: "local",
});

const links =   [
    {
      label: "Zahlungen",
      to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments`,
      exact: true,
    },
    {
      label: "Auszahlungen",
      to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/payouts`
    },
    {
      label: "Zahlungseinstellungen",
      to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/payments-settings`
    },
    {
      label: "Stripe Anbindung",
      to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/account`
    },
  ];

const {
  data: organization,
  error,
  status,
  refresh,
} = useAsyncData(async () => {
  if (!userOrganizationStore.selectedOrganization) {
    return null;
  }
  const { data, error } = await client
    .from("organizations")
    .select("*")
    .eq("id", userOrganizationStore.selectedOrganization.organization_id)
    .single();
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
});

async function connectStripe() {
  if (!organization.value) {
    return;
  }
  const body: StripeConnectPostBody = {
    org_id: organization.value.id,
  };
  try {
    const { accountId } = await $fetch("/api/orgs/payments/stripe/connect", {
      cache: "no-cache",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (accountId) {
      console.log(accountId);
      refresh();
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Zahlungseinstellungen",
    "description": "Verwalten Sie Ihre Zahlungseinstellungen mit Stripe.",
    "connect_stripe": "Mit Stripe verbinden",
    "remove_stripe": "Stripe entfernen"
  },
  "en": {
    "title": "Payment Configuration",
    "description": "Manage your payment settings with Stripe.",
    "connect_stripe": "Connect with Stripe",
    "remove_stripe": "Remove Stripe"
  }
}
</i18n>
