<template>
    <UModal :visible="true" @close="close">
        <UCard :ui="{ ring: '', divide: 'divide-y divide-gray-100 dark:divide-gray-800' }">
        <template #header>
          <div class="flex items-center justify-between">
            <h3 class="text-base font-semibold leading-6 text-gray-900 dark:text-white">
              {{ t('title') }}
            </h3>
            <UButton color="gray" variant="ghost" icon="i-heroicons-x-mark-20-solid" class="-my-1" @click="close" />
          </div>
        </template>

        <div class="p-4">
          <p v-if="userOwnedOrgs && userOwnedOrgs.length > 0" class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('cannot_delete_description') }}
          </p>
          <p v-else class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('description') }}
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4">
            <UButton color="gray" variant="ghost" :disabled="isDeleting" @click="close">{{ t('cancel') }}</UButton>
            <UButton v-if="!(userOwnedOrgs && userOwnedOrgs.length > 0)" color="red" :disabled="isDeleting" :loading="isDeleting" @click="deleteAccount">{{ t('delete') }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

const modal = useModal();
const toast = useToast();
const isDeleting = ref(false);
const client = useSupabaseClient<Database>();

const { t } = useI18n({
    useScope: 'local'
});

function close() {
    modal.close();
}

const user = useSupabaseUser();

const { data: userOwnedOrgs } = useAsyncData(async () => {
    if (!user.value) return;
    const { data, error } = await client.from('organizations').select('id').eq('owner_id', user.value.id);
    if (error) {
        throw error;
    }
    return data;
})

async function deleteAccount() {
    if (isDeleting.value) return;
    isDeleting.value = true;
    try {
        const { error } = await client.functions.invoke('delete-user-account');
        if (error) {
            throw error;
        }
        toast.add({
            title: t('success.title'),
            description: t('success.description'),
            color: 'green',
        });
        modal.close();
        client.auth.signOut();
        navigateTo('/');
    } catch (error) {
        console.log(error);
        toast.add({
            title: t('error.title'),
            description: t('error.description'),
            color: 'red',
        });
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
        "title": "Konto löschen",
        "description": "Möchtest du dein Konto wirklich löschen? Diese Aktion kann nicht rückgängig gemacht werden.",
        "cancel": "Abbrechen",
        "delete": "Löschen",
        "cannot_delete_description": "Du kannst dein Konto nicht löschen, da du noch Fahrschulen besitzt. Bitte lösche zuerst deine Fahrschulen.",
        "success": {
            "title": "Konto gelöscht",
            "description": "Dein Konto wurde erfolgreich gelöscht."
        },
        "error": {
            "title": "Fehler beim Löschen",
            "description": "Beim Löschen deines Kontos ist ein Fehler aufgetreten. Bitte versuche es erneut."
        }
    },
    "en": {
        "title": "Delete Account",
        "description": "Are you sure you want to delete your account? This action cannot be undone.",
        "cancel": "Cancel",
        "delete": "Delete",
        "cannot_delete_description": "You cannot delete your account as you still own driving schools. Please delete your driving schools first.",
        "success": {
            "title": "Account Deleted",
            "description": "Your account has been successfully deleted."
        },
        "error": {
            "title": "Error Deleting Account",
            "description": "An error occurred while deleting your account. Please try again."
        }
    }
}
</i18n>