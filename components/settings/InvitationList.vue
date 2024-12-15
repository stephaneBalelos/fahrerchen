<template>
  <NuxtErrorBoundary>
    <UCard v-if="invitations && invitations?.length > 0" :title="t('title')" :description="t('description')">
        <template #header>
            <h3 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ t('title') }}
            </h3>
            <p class="text-sm text-gray-500 dark:text-gray-400">
                {{ t('description') }}
            </p>
        </template>
      <ul role="list" class="divide-y divide-gray-200 dark:divide-gray-800">
        <li
          v-for="(invite, index) in invitations"
          :key="index"
          class="flex items-center justify-between gap-3"
        >
          <div class="flex items-center gap-3 min-w-0">
            <div class="text-sm min-w-0">
              <p class="text-gray-900 dark:text-white font-medium truncate">
                {{ invite.email }}
              </p>
              <p class="text-gray-500 dark:text-gray-400 truncate">
                {{ t("invited_at", { date: formatDate(invite.inserted_at) }) }}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-3">
            <UButton
              icon="i-heroicons-trash"
              size="sm"
              color="red"
              square
              variant="ghost"
              @click="deleteInvite(invite)"
            />
          </div>
        </li>
      </ul>
    </UCard>
    <template #error="{ error }">
      <p>{{ error.message }}</p>
    </template>
  </NuxtErrorBoundary>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  orgid: string;
};

const props = defineProps<Props>();

const client = useSupabaseClient<Database>();
const toast = useToast();
const { t } = useI18n();

const {
  data: invitations,
  error,
  status,
  refresh,
} = useAsyncData(`organizations/${props.orgid}/invitations`, async () => {
  const { data, error } = await client
    .from("organizations_invitations")
    .select("*")
    .eq("organization_id", props.orgid)
    .neq("role", "student")
    .order("inserted_at", { ascending: false });

    console.log(data);

  if (error) {
    console.error(error);
    throw error;
  }
  return data;
});


const deleteInvite = async (
  invite: Database["public"]["Tables"]["organizations_invitations"]["Row"]
) => {
  const { error } = await client
    .from("organizations_invitations")
    .delete()
    .eq("id", invite.id);
  if (error) {
    toast.add({
      title: t("error.title"),
      description: t("error.description"),
      color: "red",
    });
    throw error;
  }
  toast.add({
    title: t("success.title"),
    description: t("success.description"),
    color: "green",
  });
  refresh();
};
</script>

<i18n lang="json">
{
  "de": {
    "title": "Einladungen",
    "description": "Hier findest du alle Einladungen, die gesendet wurden.",
    "no_invitations": "Keine Einladungen",
    "invited_at": "Eingeladen am {date}",
    "delete": "Löschen",
    "error": {
      "title": "Es ist ein Fehler aufgetreten",
      "description": "Einladung konnte nicht gelöscht werden"
    },
    "success": {
      "title": "Alles klar",
      "description": "Einladung gelöscht"
    }
  }, 
  "en": {
    "title": "Invitations",
    "description": "Here you can find all invitations that have been sent.",
    "no_invitations": "No invitations",
    "invited_at": "Invited at {date}",
    "delete": "Delete",
    "error": {
      "title": "An error occurred",
      "description": "Invitation could not be deleted"
    },
    "success": {
      "title": "All good",
      "description": "Invitation deleted"
    }
  }
}
</i18n>
