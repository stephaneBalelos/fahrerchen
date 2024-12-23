<template>
    <UDashboardSection :title="t('account-title')" :description="t('account-description')">
        <StripeEmbeddedComponent :component="'account-management'" />
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
        "account-title": "Konto",
        "account-description": "Hier kannst du dein Konto verwalten."
    },
    "en": {
        "account-title": "Account",
        "account-description": "Here you can manage your account."
    }
}
</i18n>