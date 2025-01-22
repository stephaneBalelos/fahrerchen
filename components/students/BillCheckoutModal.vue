<template>
  <UModal fullscreen>
    <UCard
      :ui="{
        base: 'h-full flex flex-col',
        rounded: '',
        divide: 'divide-y divide-gray-100 dark:divide-gray-800',
        body: {
          base: 'grow',
        },
      }"
    >
      <template #header>
        <div class="flex items-center justify-between">
          <h3
            class="text-base font-semibold leading-6 text-gray-900 dark:text-white"
          >
            {{ t("checkout") }} #{{ props.billId }}
          </h3>
        </div>
      </template>

      <div class="absulute inset-0 overflow-y-auto">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          <div class="w-full">
            <StudentsStudentProfileCard
              v-if="studentStore.student"
              :student-id="studentStore.student.id"
            />
            <UCard class="mb-4">
              <p
                class="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4"
              >
                {{ t("review") }}
              </p>
              <BillsBillingList :bill-id="props.billId" />
            </UCard>
          </div>
          <div class="w-full">
            <form @submit="handleSubmit">
              <div ref="paymentElement">
                <!-- A Stripe Element will be inserted here. -->
              </div>
              <UCard class="mt-4">
                <div class="flex justify-between items-center">
                  <div class="flex flex-col">
                    <div
                      class="text-sm font-semibold text-gray-500 dark:text-gray-400"
                    >
                      {{ t("total") }}
                    </div>
                    <div
                      class="text-lg font-bold text-gray-900 dark:text-gray-100"
                    >
                      {{ formatCurrency(billTotal) }}
                    </div>
                  </div>

                  <UButton
                    :loading="loading"
                    :disabled="loading"
                    color="primary"
                    type="submit"
                  >
                    {{ t("pay_now") }}
                  </UButton>
                </div>
              </UCard>
            </form>
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <UButton
            :disabled="loading"
            color="red"
            variant="ghost"
            @click="$emit('close')"
            >{{ t("close") }}</UButton
          >
        </div>
      </template>
    </UCard>
  </UModal>
</template>

<script setup lang="ts">
import {
  loadStripe,
  type Stripe,
  type StripeElements,
} from "@stripe/stripe-js";
import { formatCurrency } from "~/utils/formatters";
import { useCssVar } from '@vueuse/core';


type Props = {
  billId: string;
};

const props = defineProps<Props>();
const $emit = defineEmits(["close"]);
const toast = useToast();
const { t } = useI18n({
  useScope: "local",
});

const loading = ref(false);

const config = useRuntimeConfig();

const paymentElement = ref<HTMLElement | null>(null);

const stripe = ref<Stripe | null>(null);

const elements = ref<StripeElements | null>(null);

const studentStore = useStudentStore();

const billTotal = ref(0);

const primaryColor = useCssVar("--color-primary-400");
const backgroundColor = useCssVar("--ui-background");
const foregroundColor = useCssVar("--ui-foreground");
const borderColor = useCssVar("--color-gray-800");

onMounted(async () => {
  try {
    const { stripeAccountId, clientSecret, total } = await fetchSecret();

    if (!stripeAccountId || !clientSecret) {
      throw new Error("Failed to fetch secret");
    }

    billTotal.value = total;

    stripe.value = await loadStripe(config.public.stripe_pk, {
      stripeAccount: stripeAccountId,
    });

    if (!stripe.value) {
      throw new Error("Failed to load stripe");
    }

    const appearance = {
      variables: {
        borderRadius: "8px",
        colorPrimary: `rgb(${primaryColor.value.split(" ").join(",")})`,
        colorText: `rgb(${foregroundColor.value.split(" ").join(",")})`,
        colorBackground: `rgb(${backgroundColor.value.split(" ").join(",")})`,
        colorBorder: `rgb(${borderColor.value.split(" ").join(",")})`,
        overlayBackdropColor: `rgba(${backgroundColor.value
          .split(" ")
          .join(",")}, .7)`,
      },
    };

    elements.value = stripe.value.elements({
      clientSecret: clientSecret,
      appearance: appearance,
    });

    const paymentEl = elements.value.create("payment", {
      layout: "accordion",
    });

    if (!paymentElement.value) {
      throw new Error("Failed to load payment element");
    }

    paymentEl.mount(paymentElement.value);
  } catch (error) {
    console.error(error);
  }
});

async function fetchSecret() {
  const res = await $fetch(
    `/api/orgs/payments/stripe/checkout-session/${props.billId}`
  );
  if (!res.stripeAccountId || !res.clientSecret) {
    throw new Error("Failed to fetch client secret");
  }
  return res;
}

async function handleSubmit(event: Event) {
  event.preventDefault();
  loading.value = true;

  if (!stripe.value || !elements.value) {
    return;
  }

  const { error } = await stripe.value.confirmPayment({
    elements: elements.value,
    confirmParams: {
      return_url: window.location.href + "/payment-completed",
    },
  });

  if (error) {
    console.error(error);
    toast.add({
      title: "Error",
      description:
        t(`stripe_errors.${error.code}`) ||
        t(`stripe_errors.payment_intent_unknown_error`),
      color: "red",
    });
  }

  loading.value = false;
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "checkout": "Kasse",
    "close": "Abbrechen",
    "pay_now": "Jetzt bezahlen",
    "review": "Überprüfen sie ihre Rechnung",
    "total": "Gesamt",
    "stripe_errors": {
      "payment_intent_authentication_failure": "Die Zahlung konnte nicht authentifiziert werden. Bitte versuche es erneut.",
      "payment_intent_payment_failure": "Die Zahlung konnte nicht durchgeführt werden. Bitte versuche es erneut.",
      "payment_intent_payment_canceled": "Die Zahlung wurde abgebrochen.",
      "payment_intent_unknown_error": "Ein unbekannter Fehler ist aufgetreten. Bitte versuche es erneut.",
      "card_declined": "Die Karte wurde abgelehnt. Bitte versuche es mit einer anderen Karte."
    }
  },
  "en": {
    "checkout": "Checkout",
    "close": "Cancel",
    "pay_now": "Pay now",
    "review": "Review your bill",
    "total": "Total",
    "stripe_errors": {
      "payment_intent_authentication_failure": "Payment could not be authenticated. Please try again.",
      "payment_intent_payment_failure": "Payment could not be completed. Please try again.",
      "payment_intent_payment_canceled": "Payment was canceled.",
      "payment_intent_unknown_error": "An unknown error occurred. Please try again.",
      "card_declined": "Card was declined. Please try again with another card."
    }
  }
}
</i18n>
