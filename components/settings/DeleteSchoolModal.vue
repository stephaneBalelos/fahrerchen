<template>
    <UModal title="Delete Account" :visible="true" @close="close">
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
          <p class="text-sm text-gray-600 dark:text-gray-400">
            {{ t('description') }}
          </p>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4">
            <UButton color="gray" variant="ghost" :disabled="isDeleting" @click="close">{{ t('cancel') }}</UButton>
            <UButton color="red" :disabled="isDeleting" :loading="isDeleting" @click="deleteOrganization">{{ t('delete') }}</UButton>
          </div>
        </template>
      </UCard>
    </UModal>
</template>

<script setup lang="ts">
import type { Database } from '~/types/app.types';

type Props = {
    orgId: string;
}

const isDeleting = ref(false);

const props = defineProps<Props>();
const userOrganizationsStore = useUserOrganizationsStore();

const { t } = useI18n({
    useScope: 'local'
});
const modal = useModal();
const toast = useToast();

const client = useSupabaseClient<Database>();

function close() {
    modal.close();
}

async function deleteOrganization() {
    if (isDeleting.value) return;
    isDeleting.value = true;
    try {
        const { error } = await client.from('organizations').delete().eq('id', props.orgId);
        if (error) {
            throw error;
        }
        toast.add({
            title: t('success.title'),
            description: t('success.description'),
            color: 'green'
        })
        userOrganizationsStore.clearSelectedOrganization();
        await userOrganizationsStore.loadOrganizationsMemberships();
        modal.close();
        navigateTo('/my');
    } catch (error) {
        console.error('Error deleting organization', error);
        toast.add({
            title: t('error.title'),
            description: t('error.description'),
            color: 'red'
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
        "title": "Fahrschule löschen",
        "description": "Möchtest du dein fahrschule wirklich löschen? Alle deine Daten werden dauerhaft entfernt. Diese Aktion kann nicht rückgängig gemacht werden.",
        "delete": "Löschen",
        "cancel": "Abbrechen",
        "success": {
            "title": "Fahrschule gelöscht",
            "description": "Deine Fahrschule wurde erfolgreich gelöscht."
        },
        "error": {
            "title": "Fehler beim Löschen der Fahrschule",
            "description": "Beim Löschen der Fahrschule ist ein Fehler aufgetreten. Bitte versuche es erneut."
        }
    },
    "en": {
        "title": "Delete your Driving School",
        "description": "Are you sure you want to delete your driving school? All your data will be permanently removed. This action cannot be undone.",
        "delete": "Delete",
        "cancel": "Cancel",
        "success": {
            "title": "Driving School deleted",
            "description": "Your driving school has been successfully deleted."
        },
        "error": {
            "title": "Error deleting driving school",
            "description": "An error occurred while deleting the driving school. Please try again."
        }
    }
}
</i18n>