<template>
    <UDashboardSection :title="t('payouts-title')" :description="t('payouts-description')">
        <StripeEmbeddedComponent :component="'payouts'" />

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
        "payouts-title": "Auszahlungseinstellungen",
        "payouts-description": "Hier kannst du deine Auszahlungseinstellungen verwalten."
    },
    "en": {
        "payouts-title": "Payout settings",
        "payouts-description": "Here you can manage your payout settings."
    }
}
</i18n>