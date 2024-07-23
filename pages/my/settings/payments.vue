<template>
  <UDashboardSection
    icon="i-heroicons-user"
    title="Payment Configuration"
    description="Configure your payment settings"
    :links="[{ label: 'Save changes', color: 'black' }]"
  >
    <template #links>
      <UButton
        v-if="!stripeAccount"
        @click="linkAccount"
        color="black"
        variant="solid"
        :disabled="status === 'pending'"
        :loading="status === 'pending'"
      >
        Connect with Stripe</UButton
      >
      <UButton
        v-else
        color="black"
        variant="solid"
        :disabled="status === 'pending'"
        :loading="status === 'pending'"
        >Remove Stripe</UButton
      >

      <UButton
        v-if="stripeAccounLink"
        :to="stripeAccounLink.url"
        :target="'_blank'"
        color="black"
        variant="solid"
        :disabled="status === 'pending'"
        :loading="status === 'pending'"
      >Konto verlinken</UButton>
    </template>

    <div v-if="stripeAccount">
      <UDashboardCard
        title="Konto Details"
        description="Hier können Sie Ihre Kontodetails einsehen und bearbeiten."
      >
        <template #links>
          <UButton
            v-if="!stripeAccount?.details_submitted"
            icon="i-heroicons-exclamation-triangle"
            color="amber"
            variant="soft"
            >Aktualisieren</UButton
          >
        </template>
        <template #footer>
          <div class="flex gap-4">
            <UBadge
              v-if="stripeAccount?.charges_enabled"
              color="primary"
              variant="solid"
              >Sie können Zahlungen erhalten</UBadge
            >
            <UBadge v-else color="amber" variant="solid"
              >Sie können noch keine Zahlungen erhalten</UBadge
            >

            <UBadge
              v-if="stripeAccount?.payouts_enabled"
              color="primary"
              variant="solid"
              >Sie Ihres Geld auszahlen</UBadge
            >
            <UBadge v-else color="amber" variant="solid"
              >Sie können momentan keine Auszahlungen machen</UBadge
            >
          </div>
        </template>
      </UDashboardCard>
    </div>

    <div>
      <div v-if="status === 'pending'">Loading...</div>
      <div v-else-if="error">Error: {{ error.message }}</div>
      <div v-else-if="stripeAccount">
        <div v-if="stripeAccount.details_submitted">
          <div>Account ID: {{ stripeAccount.id }}</div>
          <div>Account Type: {{ stripeAccount.type }}</div>
          <div>Country: {{ stripeAccount.country }}</div>
          <div>Details Submitted: {{ stripeAccount.details_submitted }}</div>
          <div>Charges Enabled: {{ stripeAccount.charges_enabled }}</div>
          <div>Payouts Enabled: {{ stripeAccount.payouts_enabled }}</div>
        </div>
        <div v-else>
          <div>Account ID: {{ stripeAccount.id }}</div>
          <div>Account Type: {{ stripeAccount.type }}</div>
          <div>Country: {{ stripeAccount.country }}</div>
          <div>Details Submitted: {{ stripeAccount.details_submitted }}</div>
          <div>Charges Enabled: {{ stripeAccount.charges_enabled }}</div>
          <div>Payouts Enabled: {{ stripeAccount.payouts_enabled }}</div>
        </div>
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type Stripe from "stripe";
import type {
  Database,
  StripeConnectLinkAccountPostBody,
  StripeConnectPostBody,
} from "~/types/app.types";

type Props = {
  orgid: string;
};

const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();

const stripeAccount = ref<Stripe.Account | null>(null);
const stripeAccounLink = ref<Stripe.AccountLink | null>(null);

const {
  data: organization,
  error,
  status,
  refresh,
} = useAsyncData(`organization_${props.orgid}`, async () => {
  const { data, error } = await client
    .from("organizations")
    .select("*")
    .eq("id", props.orgid)
    .single();
  if (error) {
    console.error(error);
    throw error;
  }
  return data;
});

onMounted(async () => {
  await fetchPaymentAccount();
});

async function fetchPaymentAccount() {
  if (!organization.value) {
    return;
  }
  try {
    if (!organization.value.stripe_account_id) {
      return;
    }
    const account = await $fetch(
      `/api/orgs/payments/stripe/accounts/${organization.value.stripe_account_id}`
    );
    if (account) {
      stripeAccount.value = account;
      console.log(account);
    }
  } catch (error) {
    console.error(error);
  }
}

async function connectStripe() {
  const body: StripeConnectPostBody = {
    org_id: props.orgid,
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

async function linkAccount() {
  const body: StripeConnectLinkAccountPostBody = {
    org_id: props.orgid,
  };
  try {
    const { accountLink } = await $fetch(
      "/api/orgs/payments/stripe/connect/link",
      {
        cache: "no-cache",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      }
    );
    if (accountLink) {
      console.log(accountLink);
      stripeAccounLink.value = accountLink;
      refresh();
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped></style>
