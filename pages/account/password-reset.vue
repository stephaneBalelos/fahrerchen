<template>
  <UDashboardPanel class="py-8">
    <UContainer class="w-full">
      <UDashboardSection :title="t('title')" :description="t('description')">
        <UForm
          :schema="schema"
          :state="state"
          class="space-y-4"
          @submit="onSubmit"
        >
          <UFormGroup :label="t('new_password')" name="password">
            <UInput v-model="state.password" type="password" />
          </UFormGroup>
          <UFormGroup :label="t('password_confirm')" name="passwordConfirm">
            <UInput v-model="state.passwordConfirm" type="password" />
          </UFormGroup>

          <div class="flex gap-4 pt-4">
            <UButton
              color="black"
              :label="t('reset_password')"
              size="md"
              type="submit"
            />
            <UButton color="red" label="Cancel" size="md" :to="'/account'" />
          </div>
        </UForm>
      </UDashboardSection>
    </UContainer>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";

definePageMeta({
  layout: "default",
});

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const router = useRouter();

const toasts = useToast();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const schema = z
  .object({
    password: z
      .string()
      .min(8, g("form_errors.min", { field: t("new_password"), min: 8 })),
    passwordConfirm: z.string(),
  })
  .refine((data) => data.password === data.passwordConfirm, {
    message: t("passwords_dont_match"), // error message
    path: ["passwordConfirm"], // path of error
  });

type Schema = z.output<typeof schema>;

const state = reactive({
  password: undefined,
  passwordConfirm: undefined,
});

onMounted(() => {
  if (!user.value) {
    router.push("/login");
  }
});

async function onSubmit(event: FormSubmitEvent<Schema>) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: event.data.passwordConfirm,
    });
    if (error) {
      throw error;
    }
    router.push("/account");
    toasts.add({
      title: t("password_updated"),
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toasts.add({
      title: t("error"),
      description: t("error_description"),
      color: "red",
    });
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Passwort zurücksetzen",
    "description": "Sichern Sie Ihr Konto mit einem neuen Passwort",
    "new_password": "Neues Passwort",
    "password_confirm": "Passwort bestätigen",
    "reset_password": "Passwort zurücksetzen",
    "cancel": "Abbrechen",
    "passwords_dont_match": "Passwörter stimmen nicht überein",
    "new_password_set": "Neues Passwort gesetzt",
    "password_updated": "Ihr Passwort wurde aktualisiert",
    "error": "Ein Fehler ist aufgetreten beim Aktualisieren Ihres Passworts",
    "error_description": "Bitte versuchen Sie es erneut"
  },
  "en": {
    "title": "Reset your Password",
    "description": "Secure your account with a new password",
    "new_password": "New password",
    "password_confirm": "Password Confirm",
    "reset_password": "Reset password",
    "cancel": "Cancel",
    "passwords_dont_match": "Passwords don't match",
    "new_password_set": "New password set",
    "password_updated": "Your password has been updated",
    "error": "An error occurred while updating your password",
    "error_description": "Please try again"
  }
}
</i18n>
