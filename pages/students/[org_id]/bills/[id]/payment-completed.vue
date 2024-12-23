<template>
  <UContainer class="w-full">
    <UAlert
      v-if="!intent"
      color="red"
      variant="soft"
      :title="t('no_payment_intent_error')"
      :description="t('no_payment_intent_error_description')"
      :actions="[
        {
          label: t('back_to_bill'),
          color: 'red',
          variant: 'soft',
          click: () => navigateTo(`/students/${org_id}/bills/${bill_id}`),
        },
      ]"
    />
    <UDashboardSection
      v-else
      :title="t('your_payment')"
      :description="`#${bill_id}`"
    >
      <div>
          <UAlert
            v-if="intent.status === 'succeeded'"
            color="green"
            variant="soft"
            :title="t('payment_succeeded')"
            :description="t('payment_succeeded_description')"
          />
          <UAlert
            v-else-if="intent.status === 'requires_action'"
            color="yellow"
            variant="soft"
            :title="t('payment_requires_action')"
            :description="t('payment_requires_action_description')"
          />
          <UAlert
            v-else-if="intent.status === 'requires_payment_method'"
            color="red"
            variant="soft"
            :title="t('payment_requires_payment_method')"
            :description="t('payment_requires_payment_method_description')"
          />
          <UAlert
            v-else-if="intent.status === 'processing'"
            color="blue"
            variant="soft"
            :title="t('payment_processing')"
            :description="t('payment_processing_description')"
          />
          <UAlert
            v-else-if="intent.status === 'canceled'"
            color="red"
            variant="soft"
            :title="t('payment_canceled')"
            :description="t('payment_canceled_description')"
          />
      </div>
    </UDashboardSection>
  </UContainer>
</template>

<script setup lang="ts">
import { loadStripe, type PaymentIntent, type Stripe } from "@stripe/stripe-js";

const loading = ref(true);
const route = useRoute();
const bill_id = route.params.id as string;
const org_id = route.params.org_id as string;
const { payment_intent_client_secret } = route.query;

const stripeStore = useStripeStore();

const config = useRuntimeConfig();

const stripe = ref<Stripe | null>(null);

const intent = ref<PaymentIntent | null>(null);

const { t } = useI18n({
  useScope: "local",
});

onMounted(async () => {
  if (payment_intent_client_secret) {

    const stripeAccount = await stripeStore.loadStripeAccount(org_id);

    if (!stripeAccount) {
      throw createError({
        statusCode: 404,
      });
    }

    stripe.value = await loadStripe(config.public.stripe_pk, {
        stripeAccount: stripeAccount.stripe_account_id
    });

    if (!stripe.value) {
      throw createError({
        statusCode: 404,
      });
    }

    const { paymentIntent, error } = await stripe.value.retrievePaymentIntent(
      payment_intent_client_secret as string
    );

    if (error) {
      throw error;
    }

    if (!paymentIntent) {
      throw new Error("Failed to retrieve payment intent");
    }

    intent.value = paymentIntent;
  }
  loading.value = false;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "your_payment": "Deine Zahlung",
    "payment_succeeded": "Zahlung erfolgreich",
    "payment_succeeded_description": "Deine Zahlung war erfolgreich.",
    "payment_requires_action": "Zahlung benötigt Aktion",
    "payment_requires_action_description": "Deine Zahlung benötigt eine Aktion.",
    "payment_requires_payment_method": "Zahlung benötigt Zahlungsmethode",
    "payment_requires_payment_method_description": "Deine Zahlung benötigt eine Zahlungsmethode.",
    "payment_processing": "Zahlung wird bearbeitet",
    "payment_processing_description": "Deine Zahlung wird bearbeitet.",
    "payment_canceled": "Zahlung abgebrochen",
    "payment_canceled_description": "Deine Zahlung wurde abgebrochen.",
    "no_payment_intent_error": "Kein Zahlungsintend gefunden",
    "no_payment_intent_error_description": "Es wurde kein Zahlungsintend gefunden."
  },
  "en": {
    "your_payment": "Your payment",
    "payment_succeeded": "Payment succeeded",
    "payment_succeeded_description": "Your payment was successful.",
    "payment_requires_action": "Payment requires action",
    "payment_requires_action_description": "Your payment requires an action.",
    "payment_requires_payment_method": "Payment requires payment method",
    "payment_requires_payment_method_description": "Your payment requires a payment method.",
    "payment_processing": "Payment processing",
    "payment_processing_description": "Your payment is processing.",
    "payment_canceled": "Payment canceled",
    "payment_canceled_description": "Your payment was canceled.",
    "no_payment_intent_error": "No payment intent found",
    "no_payment_intent_error_description": "No payment intent was found."
  }
}
</i18n>
