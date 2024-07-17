<template>
  <UDashboardSection
    icon="i-heroicons-user"
    title="Payment Configuration"
    description="Configure your payment settings"
    :links="[{ label: 'Save changes', color: 'black' }]"
  >
    <template #links>
      <UButton @click="connectStripe" color="black" variant="solid"
        >Connect with Stripe</UButton
      >
    </template>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database, StripeConnectPostBody } from "~/types/app.types";

type Props = {
  orgid: string;
};

const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();

  const { data:org, error, status } = await useAsyncData(`organization_${props.orgid}`, async () => {
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

async function connectStripe() {
    console.log(props.orgid);

    const body: StripeConnectPostBody = {
        org_id: props.orgid,
    };

  try {
    const { accountId } = await $fetch("/api/orgs/payments/stripe/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(body),
    });
    if (accountId) {
      console.log(accountId);
    }
  } catch (error) {
    console.error(error);
  }
}
</script>

<style scoped></style>
