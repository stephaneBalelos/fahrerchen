<template>
    <UDashboardSection :title="t('account-title')" :description="t('account-description')">
        <template #links>
            <UButton color="red" variant="soft" @click="openDeleteStripeAccountModal">{{ t('delete-stripe-account') }}</UButton>
        </template>
        <StripeEmbeddedComponent :component="'account-management'" />
    </UDashboardSection>
</template>

<script setup lang="ts">
import StripeDeleteAccountModal from "~/components/settings/stripe/StripeDeleteAccountModal.vue";
import StripeEmbeddedComponent from "~/components/settings/stripe/StripeEmbeddedComponent.vue";

const { t } = useI18n({
    useScope: "local",
});

const modal = useModal();

function openDeleteStripeAccountModal() {
    modal.open(StripeDeleteAccountModal);
}

</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "account-title": "Konto",
        "account-description": "Hier kannst du dein Konto verwalten.",
        "delete-stripe-account": "Stripe-Konto löschen"
    },
    "en": {
        "account-title": "Account",
        "account-description": "Here you can manage your account.",
        "delete-stripe-account": "Delete Stripe Account"
    }
}
</i18n>