<template>
  <UDashboardSection
    :title="t('payments-title')"
    :description="t('payments-description')"
  >
    <div>
      <UCard
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-heroicons-credit-card" class="w-5 h-5" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("card_payment.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("card_payment.description")
            }}</span>
          </div>
          <UToggle v-model="form.credit_card.enabled" @change="onChange"/>
        </div>
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-simple-icons-paypal" class="w-5 h-5" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("paypal.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("paypal.description")
            }}</span>
          </div>
          <UToggle v-model="form.paypal.enabled"  @change="onChange"/>
        </div>
        <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
          <div class="mr-2">
            <UIcon name="i-simple-icons-klarna" class="w-5 h-5" />
          </div>
          <div class="flex flex-col gap-1 grow">
            <div class="flex justify-start gap-1">
              <p class="font-semibold me-2">{{ t("klarna.title") }}</p>
            </div>
            <span class="text-sm text-gray-500">{{
              t("klarna.description")
            }}</span>
          </div>
          <UToggle v-model="form.klarna.enabled" @change="onChange"/>
        </div>
      </UCard>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type Stripe from 'stripe';
import type { AppStripeAccountPaymentMethodSettings, Database } from '~/types/app.types';

const { t } = useI18n({
  useScope: "local",
});


const stripeStore = useStripeStore();
const userOrganizationStore = useUserOrganizationsStore();
const client = useSupabaseClient<Database>();

const { data, error, status, refresh } = await useAsyncData(``, async () => {
  if(!userOrganizationStore.selectedOrganization) {
    return null;
  }
  const { data, error } = await client.from("organizations_stripe_accounts").select("payment_methods").eq("id", userOrganizationStore.selectedOrganization.organization_id).single()
  if (error) {
    console.error(error);
    
  }
  return data?.payment_methods as unknown as AppStripeAccountPaymentMethodSettings;
})

const form = reactive<AppStripeAccountPaymentMethodSettings>({
  credit_card: {
    payment_method_id: 'card',
    enabled: data.value?.credit_card.enabled ?? false,
  },
  paypal: {
    payment_method_id: 'paypal',
    enabled: data.value?.paypal.enabled ?? false,
  },
  klarna: {
    payment_method_id: 'klarna',
    enabled: data.value?.klarna.enabled ?? false,
  },
});

const onChange = async ($event: any) => {
  if(!userOrganizationStore.selectedOrganization) {
    return;
  }
  try {
    const { data, error } = await client.from("organizations_stripe_accounts").update({
      payment_methods: form
    }).eq("id", userOrganizationStore.selectedOrganization.organization_id)
    if (error) {
      throw error;
    }

  } catch (error) {
    console.error(error);
  } finally {
     refresh()
  }
}


</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "payments-title": "Zahlungs Methoden",
    "payments-description": "Zahlungsmethoden verwalten. SEPAs Direct Debit sind standardmäßig aktiviert.",
    "card_payment": {
      "title": "Kreditkartenzahlung",
      "description": "Zahlungen per Kreditkarte (Visa, Mastercard, American Express) akzeptieren."
    },
    "paypal": {
      "title": "PayPal",
      "description": "Zahlungen per PayPal akzeptieren."
    },
    "klarna": {
      "title": "Klarna",
      "description": "Zahlungen per Klarna akzeptieren."
    }
  },
    "en": {
        "payments-title": "Payment Methods",
        "payments-description": "Manage payment methods. SEPA Direct Debit is enabled by default.",
        "card_payment": {
        "title": "Credit Card Payment",
        "description": "Accept payments by credit card (Visa, Mastercard, American Express)."
        },
        "paypal": {
        "title": "PayPal",
        "description": "Accept payments by PayPal."
        },
        "klarna": {
        "title": "Klarna",
        "description": "Accept payments by Klarna."
        }
    }
}
</i18n>
