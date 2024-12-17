<template>
    <div
      :class="`${isVisible ? 'visible' : 'invisible'}`"
      ref="stripeOnboardingElement"
      :id="`stripe-onboarding-element-onboarding`"
    ></div>
    <div v-if="!isVisible" class="grid gap-2">
      <USkeleton class="h-4 w-full" />
      <USkeleton class="h-60 w-full" />
      <USkeleton class="h-60 w-full" />
    </div>
</template>

<script setup lang="ts">
import { loadConnectAndInitialize } from "@stripe/connect-js";
import { useCssVar } from "@vueuse/core";

const $emit = defineEmits(["exit"]);
const { t, locale } = useI18n({
  useScope: "local",
});

const stripeStore = useStripeStore();
const config = useRuntimeConfig();

const stripeOnboardingElement = ref<HTMLElement | null>(null);
const isVisible = ref(false);

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
      overlayBackdropColor: `rgba(${backgroundColor.value
        .split(" ")
        .join(",")}, .7)`,
    },
  },
});

onMounted(() => {
  if (stripeOnboardingElement.value) {
    const el = stripeConnectInstance.create("account-onboarding");
    el.setOnExit(() => {
      $emit("exit");
    });
    el.setOnLoaderStart((event) => {
      isVisible.value = true;
    });
    stripeOnboardingElement.value.appendChild(el);
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Stripe Onboarding",
    "description": "Stripe benötigt einige Informationen, um Zahlungen für dich abwickeln zu können."
  },
  "en": {
    "title": "Stripe Onboarding",
    "description": "Stripe needs some information to process payments for you."
  }
}
</i18n>
