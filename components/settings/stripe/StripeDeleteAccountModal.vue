<template>
    <UModal :visible="true" @close="() => $emits('close')">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ t('title') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="() => $emits('close')" />
          </div>
        </template>

        <div class="p-4">

          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('description') }}
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4">
            <UButton color="gray" variant="ghost" :disabled="isDeleting" @click="() => $emits('close')">{{ t('cancel') }}</UButton>
            <UButton color="red" :disabled="isDeleting" :loading="isDeleting" @click="deleteStripeAccount">{{ t('delete') }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
</template>

<script setup lang="ts">

type Props = {
    orgId: string;
}

const props = defineProps<Props>();

const { t } = useI18n({
    useScope: 'local'
});

const isDeleting = ref(false);
const toast = useToast();
const $emits = defineEmits(["close", "deleted"]);

const stripeStore = useStripeStore();

async function deleteStripeAccount() {
    const orgId = props.orgId;
    if (!orgId) return;
    if (isDeleting.value) return;
    isDeleting.value = true;

    try {
        const res = await $fetch(`/api/orgs/payments/stripe/accounts/${orgId}`, {
            method: 'DELETE',
        });

        if (res.success) {
            toast.add({
                title: t('success'),
                description: t('success_description'),
                color: 'green',
            })
            await stripeStore.fetchStripeAccount();
            $emits("deleted")
        } else {
            toast.add({
                title: t('error'),
                description: t('error_description'),
                color: 'red',
            })
        }
    } catch (error) {
        console.error(error);
        toast.add({
            title: t('error'),
            description: t('error_description'),
            color: 'red',
        })
    } finally {
        isDeleting.value = false;
    }
}
</script>

<style scoped>

</style>

<i18n lang="json">
{
    "de": {
        "title": "Stripe-Konto löschen",
        "description": "Möchtest du dein Stripe-Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden. Vergewissere dich, dass du alle Zahlungen und Abonnements gekündigt hast. Deine Schüler:innen können dann keine Zahlungen mehr tätigen.",
        "cancel": "Abbrechen",
        "delete": "Löschen",
        "success": "Erfolgreich gelöscht",
        "success_description": "Dein Stripe-Konto wurde erfolgreich gelöscht.",
        "error": "Fehler",
        "error_description": "Beim Löschen deines Stripe-Kontos ist ein Fehler aufgetreten."
    },
    "en": {
        "title": "Delete Stripe Account",
        "description": "Are you sure you want to delete your Stripe account? This action cannot be undone. Make sure you have canceled all payments and subscriptions. Your students will no longer be able to make payments.",
        "cancel": "Cancel",
        "delete": "Delete",
        "success": "Deleted successfully",
        "success_description": "Your Stripe account has been deleted successfully.",
        "error": "Error",
        "error_description": "An error occurred while deleting your Stripe account."
    }
}
</i18n>