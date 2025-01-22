<template>
  <UDashboardSection
    :title="t('your_payment')"
    :description="`#${bill_id}`"
    orientation="vertical"
    class="px-4 mt-6"
  >
    <div>
      <USkeleton v-if="loading" class="h-48 w-full" />

      <UAlert
        v-if="!intent && !loading"
        color="red"
        variant="soft"
        :title="t('no_payment_intent_error')"
        :description="t('no_payment_intent_error_description')"
      />
      <div v-if="intent && !loading">
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
        <div class="mt-4 flex justify-center">
          <UButton
            icon="i-heroicons-arrow-left"
            size="sm"
            color="gray"
            :label="t('back_to_bill')"
            square
            :to="`/students/${org_id}/subscription/${s_id}/bills/${bill_id}`"
          />
        </div>
      </div>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { loadStripe, type PaymentIntent } from "@stripe/stripe-js";

type Props = {
  stripeAccountId: string;
  paymentIntentClientSecret: string;
};

const props = defineProps<Props>();

const route = useRoute();
const bill_id = route.params.id as string;
const s_id = route.params.s_id as string;
const org_id = route.params.org_id as string;

const loading = ref(true);
const intent = ref<PaymentIntent | null>(null);
const config = useRuntimeConfig();

const { t } = useI18n({
  useScope: "local",
});

const stripe = await loadStripe(config.public.stripe_pk, {
  stripeAccount: props.stripeAccountId
});

onMounted(async () => {
  if (!stripe) {
    throw new Error("Failed to load stripe");
  }

  const { paymentIntent, error } = await stripe.retrievePaymentIntent(
    props.paymentIntentClientSecret
  );

  if (error) {
    throw error;
  }

  if (!paymentIntent) {
    throw new Error("Failed to retrieve payment intent");
  }

  intent.value = paymentIntent;
  loading.value = false;
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "back_to_bill": "Zurück zur Rechnung",
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
    "back_to_bill": "Back to bill",
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
