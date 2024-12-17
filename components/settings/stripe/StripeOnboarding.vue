<template>
  <UDashboardSection :title="t('onboarding_title')" :description="t('onboarding_description')">
    <div ref="stripeOnboardingElement" id="stripe-onboarding-element"></div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { loadConnectAndInitialize } from "@stripe/connect-js";

const stripeStore = useStripeStore();
const config = useRuntimeConfig();
const { t, locale } = useI18n({
    useScope: "local"
});

const ui = useAppConfig().ui
console.log(ui)

const stripeOnboardingElement = ref<HTMLElement | null>(null);

const stripeConnectInstance = loadConnectAndInitialize({
  // This is your test publishable API key.
  publishableKey: config.public.stripe_pk,
  fetchClientSecret: stripeStore.getStripeSessionSecret,
  locale: locale.value
});

onMounted(() => {
  if (stripeOnboardingElement.value) {
    const el = stripeConnectInstance.create("account-onboarding");
    stripeOnboardingElement.value.appendChild(el);
  }
});

stripeConnectInstance.create("account-onboarding")
</script>

<style scoped></style>

<i18n lang="json">
{
    "de": {
        "onboarding_title": "Stripe Onboarding",
        "onboarding_description": "Stripe benötigt einige Informationen, um Zahlungen für Ihre Organisation zu verarbeiten."
    },
    "en": {
        "onboarding_title": "Stripe Onboarding",
        "onboarding_description": "Stripe needs some information to process payments for your organization."
    }
}
</i18n>
