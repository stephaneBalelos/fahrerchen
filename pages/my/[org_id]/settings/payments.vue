<template>
  <UDashboardPanel
    v-if="stripeStore.stripeAccount"
    grow
    :ui="{
      wrapper: 'flex-row',
    }"
  >
    <div
      v-if="stripeStore.stripeAccount.details_submitted"
      class="w-60 flex flex-col items-between justify-between p-4 border-b lg:border-b-0 lg:border-r border-gray-200 dark:border-gray-800 flex-shrink-0"
    >
      <UNavigationTree :links="links" />
    </div>

    <div class="grow relative" v-if="stripeStore.stripeAccount.details_submitted">
      <div class="absolute inset-0 overflow-y-auto p-4">
        <div class="pb-4">
          <StripeEmbeddedComponent :component="'notification-banner'" />
        </div>
        <NuxtPage />
      </div>
    </div>
    <div class="absolute inset-0 p-4 overflow-y-auto" v-else>
      <StripeOnboarding @exit="stripeStore.fetchStripeAccount"/>
    </div>

    <!-- <StripeOnboarding /> -->
  </UDashboardPanel>
  <UDashboardPanel
    v-else
    grow
    :ui="{
      wrapper: 'flex-row',
    }"
  >
  <div class="w-full grid justify-center">
      <UPageHero
        icon="i-simple-icons-stripe"
        :title="t('title')"
        :description="t('description')"
        align="center"
        :links="[
          {
            label: t('connect_stripe'),
            click: connectStripe,
            loading: connectIsLoading,
            color: 'primary',
            variant: 'solid',
          },
        ]"
      />
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import StripeEmbeddedComponent from "~/components/settings/stripe/StripeEmbeddedComponent.vue";
import StripeOnboarding from "~/components/settings/stripe/StripeOnboarding.vue";
import type { Database, StripeConnectPostBody } from "~/types/app.types";

const client = useSupabaseClient<Database>();
const userOrganizationStore = useUserOrganizationsStore();
const stripeStore = useStripeStore();
const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();

const connectIsLoading = ref(false);

const links = [
  {
    label: "Zahlungen",
    to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments`,
    exact: true,
  },
  {
    label: "Auszahlungen",
    to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/payouts`,
  },
  {
    label: "Zahlungseinstellungen",
    to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/payments-settings`,
  },
  {
    label: "Stripe Anbindung",
    to: `/my/${userOrganizationStore.selectedOrganization?.organization_id}/settings/payments/account`,
  },
];

async function connectStripe() {
  if (!userOrganizationStore.selectedOrganization) {
    return;
  }
  const body: StripeConnectPostBody = {
    org_id: userOrganizationStore.selectedOrganization.organization_id,
  };
  connectIsLoading.value = true;
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
      await stripeStore.fetchStripeAccount();
    }
  } catch (error) {
    console.error(error);
  } finally {
    connectIsLoading.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Jetzt online Zahlungen empfangen mit Stripe",
    "description": "Stripe ist ein Online-Zahlungsabwickler, der es Organisationen ermöglicht, Zahlungen online zu empfangen. Verbinde dein Stripe-Konto, um Zahlungen zu empfangen.",
    "connect_stripe": "Mit Stripe verbinden",
    "remove_stripe": "Stripe entfernen"
  },
  "en": {
    "title": "Start receiving online payments with Stripe",
    "description": "Stripe is an online payment processor that allows organizations to receive payments online. Connect your Stripe account to start receiving payments.",
    "connect_stripe": "Connect with Stripe",
    "remove_stripe": "Remove Stripe"
  }
}
</i18n>
