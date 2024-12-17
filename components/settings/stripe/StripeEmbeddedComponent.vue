<template>
  <div ref="stripeOnboardingElement" :id="`stripe-onboarding-element-${props.component}`"></div>
</template>

<script setup lang="ts">
import { loadConnectAndInitialize, type ConnectElementTagName } from '@stripe/connect-js';
import { useCssVar } from '@vueuse/core';


type Props = {
    component: ConnectElementTagName
}

const props = defineProps<Props>();

const { locale } = useI18n();

const stripeStore = useStripeStore();
const config = useRuntimeConfig();

const stripeOnboardingElement = ref<HTMLElement | null>(null);

const primaryColor = useCssVar("--color-primary-400");
const backgroundColor = useCssVar("--ui-background");
const foregroundColor = useCssVar("--ui-foreground");
const borderColor = useCssVar("--color-gray-800");

const stripeConnectInstance = loadConnectAndInitialize({
  // This is your test publishable API key.
  publishableKey: config.public.stripe_pk,
  fetchClientSecret: stripeStore.getStripeSessionSecret,
  locale: locale.value,
  appearance: {
    variables: {
      colorPrimary: `rgb(${primaryColor.value.split(" ").join(",")})`,
      colorText: `rgb(${foregroundColor.value.split(" ").join(",")})`,
      colorBackground: `rgb(${backgroundColor.value.split(" ").join(",")})`,
      colorBorder: `rgb(${borderColor.value.split(" ").join(",")})`,
      overlayBackdropColor: `rgba(${backgroundColor.value.split(" ").join(",")}, .7)`,
    },
  },
});

onMounted(() => {
  if (stripeOnboardingElement.value) {
    const el = stripeConnectInstance.create(props.component);
    stripeOnboardingElement.value.appendChild(el);
  }
});

</script>

<style scoped>

</style>