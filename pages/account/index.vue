<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import FileUploader from "~/components/forms/Inputs/FileUploader.vue";
import type { Database } from "~/types/database.types";

definePageMeta({
  layout: "default",
});

const isDeleteAccountModalOpen = ref(false);
const userStore = useUserStore();
const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const query = useRoute().query;

const schema = z.object({
  firstname: z
    .string()
    .min(2, g("form_errors.min", { field: t("form.firstname.label"), min: 2 })),
  lastname: z
    .string()
    .min(2, g("form_errors.min", { field: t("form.lastname.label"), min: 2 })),
});

type Schema = z.output<typeof schema>;

const state = reactive<Schema>({
  firstname: "",
  lastname: "",
});

const stop = watchEffect(() => {
  if (userStore.user) {
    state.firstname = userStore.user.firstname ? userStore.user.firstname : "";
    state.lastname = userStore.user.lastname ? userStore.user.lastname : "";
  }
});

const toast = useToast();

async function onSubmit(event: FormSubmitEvent<Schema>) {
  if (userStore.user) {
    try {
      const update = await client
        .from("users")
        .update({
          firstname: event.data.firstname,
          lastname: event.data.lastname,
        })
        .eq("id", userStore.user.id);
      if (update.error) {
        toast.add({
          title: t("update_error"),
          color: "red",
        });
      } else {
        toast.add({
          title: t("profile_updated"),
          icon: "i-heroicons-check-circle",
        });

        if (query.redirect) {
          navigateTo(query.redirect as string);
        }
      }
    } catch (err) {
      toast.add({ title: t("update_error"), color: "red" });
      console.log(err);
    }
  }
}

onUnmounted(() => {
  stop();
});
</script>

<template>
  <ClientOnly>
    <UDashboardPanelContent class="pb-24">
      <UContainer>
        <UDashboardSection
          :title="t('theme_title')"
          :description="t('theme_description')"
        >
          <template #links>
            <UColorModeSelect color="gray" />
          </template>
        </UDashboardSection>

        <UDivider class="mb-4" />

        <UForm
          v-if="userStore.user"
          :state="state"
          :schema="schema"
          @submit="onSubmit"
        >
          <UDashboardSection
            :title="t('profile_title')"
            :description="t('profile_description')"
          >
            <template #links>
              <UButton type="submit" :label="t('profile_save')" color="black" />
            </template>

            <UFormGroup
              name="avatar"
              :label="t('form.avatar.label')"
              :description="t('form.avatar.description')"
              class="grid grid-cols-2 gap-2"
              :help="t('form.avatar.help')"
              :ui="{
                container: 'flex flex-wrap items-center gap-3',
                help: 'mt-0',
              }"
            >
              <FileUploader
                :bucket-id="'users_avatars'"
                :path="userStore.user.id"
              />
            </UFormGroup>

            <UFormGroup
              name="firstname"
              :label="t('form.firstname.label')"
              :description="t('form.firstname.description')"
              required
              class="grid grid-cols-2 gap-2 items-center"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.firstname"
                autocomplete="off"
                icon="i-heroicons-user"
                size="md"
              />
            </UFormGroup>
            <UFormGroup
              name="lastname"
              :label="t('form.lastname.label')"
              :description="t('form.lastname.description')"
              required
              class="grid grid-cols-2 gap-2 items-center"
              :ui="{ container: '' }"
            >
              <UInput
                v-model="state.lastname"
                autocomplete="off"
                icon="i-heroicons-user"
                size="md"
              />
            </UFormGroup>
          </UDashboardSection>
        </UForm>

        <UDivider class="mb-4" />

        <UDashboardSection
          :title="t('account_title')"
          :description="t('account_description')">
          <div class="flex gap-4">
            <UButton
              color="black"
              :label="t('change_password')"
              size="md"
              :to="'/account/password-reset'"
            />
            <UButton
              color="red"
              :label="t('account_delete')"
              size="md"
              @click="isDeleteAccountModalOpen = true"
            />
          </div>
        </UDashboardSection>

        <!-- ~/components/settings/DeleteAccountModal.vue -->
        <!-- <SettingsDeleteAccountModal v-model="isDeleteAccountModalOpen" /> -->
      </UContainer>
    </UDashboardPanelContent>
  </ClientOnly>
</template>

<i18n lang="json">
{
  "de": {
    "theme_title": "Farbmodus",
    "theme_description": "Passe das Aussehen und das Gefühl deines Dashboards an.",
    "profile_title": "Profil",
    "profile_description": "Ihre persönlichen Informationen bearbeiten.",
    "profile_save": "Änderungen speichern",
    "account_title": "Konto",
    "account_description": "Brauchen Sie unseren Service nicht mehr? Sie können Ihr Konto hier löschen. Diese Aktion ist nicht rückgängig zu machen. Alle Informationen, die mit diesem Konto zusammenhängen, werden dauerhaft gelöscht.",
    "account_delete": "Konto löschen",
    "change_password": "Passwort ändern",
    "form": {
      "firstname": {
        "label": "Vorname",
        "description": "Wird auf Quittungen, Rechnungen und anderen Mitteilungen angezeigt."
      },
      "lastname": {
        "label": "Nachname",
        "description": "Wird auf Quittungen, Rechnungen und anderen Mitteilungen angezeigt."
      },
      "avatar": {
        "label": "Avatar",
        "description": "JPG, GIF oder PNG. 1MB Max.",
        "help": "JPG, GIF oder PNG. 1MB Max."
      }
    },
    "update_error": "Fehler beim Aktualisieren des Profils",
    "profile_updated": "Profil aktualisiert"
  },
  "en": {
    "theme_title": "Theme",
    "theme_description": "Customize the look and feel of your dashboard.",
    "profile_title": "Profile",
    "profile_description": "Edit your personal information.",
    "profile_save": "Save changes",
    "account_title": "Account",
    "account_description": "No longer want to use our service? You can delete your account here. This action is not reversible. All information related to this account will be deleted permanently.",
    "account_delete": "Delete account",
    "change_password": "Change password",
    "form": {
      "firstname": {
        "label": "Firstname",
        "description": "Will appear on receipts, invoices, and other communication."
      },
      "lastname": {
        "label": "Lastname",
        "description": "Will appear on receipts, invoices, and other communication."
      },
      "avatar": {
        "label": "Avatar",
        "description": "JPG, GIF or PNG. 1MB Max.",
        "help": "JPG, GIF or PNG. 1MB Max."
      }
    },
    "update_error": "Error trying to update the profile",
    "profile_updated": "Profile updated"
  }
}
</i18n>
