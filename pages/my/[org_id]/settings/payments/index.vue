<template>
    <UDashboardSection :title="t('payments-title')" :description="t('payments-description')">
        <StripeEmbeddedComponent :component="'payments'" />
    </UDashboardSection>
</template>

<script setup lang="ts">
import StripeEmbeddedComponent from "~/components/settings/stripe/StripeEmbeddedComponent.vue";

const { t } = useI18n({
    useScope: "local",
});

</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "payments-title": "Zahlungseinstellungen",
        "payments-description": "Hier kannst du deine Zahlungseinstellungen verwalten."
    },
    "en": {
        "payments-title": "Payment settings",
        "payments-description": "Here you can manage your payment settings."
    }
}
</i18n>