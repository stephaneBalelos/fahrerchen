<template>
  <UDashboardSection
    :title="t('payments-title')"
    :description="t('payments-description')"
  >
    <div>
      <UCard
        v-if="status == 'success' && stripeStore.stripeAppSettings"
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-simple-icons-sepa" class="w-10 h-10" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("sepa_debit.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("sepa_debit.description")
            }}</span>
          </div>
          <UToggle disabled :model-value="true" />
        </div>
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-heroicons-credit-card" class="w-10 h-10" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("card_payment.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("card_payment.description")
            }}</span>
          </div>
          <UToggle v-model="form.credit_card.enabled" @change="onChange" />
        </div>
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-simple-icons-klarna" class="w-10 h-10" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("klarna.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("klarna.description")
            }}</span>
          </div>
          <UToggle v-model="form.klarna.enabled" @change="onChange" />
        </div>
      </UCard>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { AppStripeAccountPaymentMethodSettings } from "~/types/app.types";

const { t } = useI18n({
  useScope: "local",
});

const stripeStore = useStripeStore();
const userOrganizationStore = useUserOrganizationsStore();

if (!userOrganizationStore.selectedOrganization) {
  throw new Error("No organization selected");
}

const { status, refresh } = await useAsyncData(
  `organizations_stripe_account_${userOrganizationStore.selectedOrganization?.id}`,
  async () => {
    if (!userOrganizationStore.selectedOrganization) {
      return null;
    }
    await stripeStore.getStripeAppSettings();
  }
);

const paymentMethods = computed(() => {
  return stripeStore.stripeAppSettings?.payment_methods;
});

const form = reactive<AppStripeAccountPaymentMethodSettings>({
  credit_card: {
    payment_method_id: "card",
    enabled: paymentMethods.value?.credit_card.enabled ?? false,
  },
  klarna: {
    payment_method_id: "klarna",
    enabled: paymentMethods.value?.klarna.enabled ?? false,
  },
});

const onChange = async () => {
  if (!userOrganizationStore.selectedOrganization) {
    return;
  }
  try {
    await stripeStore.updateStripeAppSettings(
      userOrganizationStore.selectedOrganization.id,
      form
    );
  } catch (error) {
    console.error(error);
  } finally {
    refresh();
  }
};
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "payments-title": "Zahlungs Methoden",
    "payments-description": "Zahlungsmethoden verwalten. SEPAs Direct Debit sind standardmäßig aktiviert.",
    "sepa_debit": {
      "title": "Sepa Lastschrift",
      "description": "Zahlungen per Sepa Lastschrift akzeptieren."
    },
    "card_payment": {
      "title": "Kreditkartenzahlung",
      "description": "Zahlungen per Kreditkarte (Visa, Mastercard, American Express) akzeptieren."
    },
    "klarna": {
      "title": "Klarna",
      "description": "Zahlungen per Klarna akzeptieren."
    }
  },
  "en": {
    "payments-title": "Payment Methods",
    "payments-description": "Manage payment methods. SEPA Direct Debit is enabled by default.",
    "sepa_debit": {
      "title": "Sepa Direct Debit",
      "description": "Accept payments by Sepa Direct Debit."
    },
    "card_payment": {
      "title": "Credit Card Payment",
      "description": "Accept payments by credit card (Visa, Mastercard, American Express)."
    },
    "klarna": {
      "title": "Klarna",
      "description": "Accept payments by Klarna."
    }
  }
}
</i18n>
