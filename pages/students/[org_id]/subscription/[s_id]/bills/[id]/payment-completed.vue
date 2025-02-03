<template>
  <UContainer class="w-full">
    <PaymentCompletedSection
      v-if="stripeStore.stripeAppSettings"
      :stripe-account-id="stripeStore.stripeAppSettings.stripe_account_id"
      :payment-intent-client-secret="payment_intent_client_secret"
    />
  </UContainer>
</template>

<script setup lang="ts">
import PaymentCompletedSection from "~/components/students/PaymentCompletedSection.vue";

const route = useRoute();
const query = route.query;
const payment_intent_client_secret =
  query.payment_intent_client_secret as string;

const stripeStore = useStripeStore();
</script>

<style scoped></style>
