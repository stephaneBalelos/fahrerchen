<template>
  <UContainer>
    <UPageHero :title="t('title')" :description="t('description')">
      <template #icon>
        <UAvatar
          :src="'/favicon-96x96.png'"
          :icon="'i-heroicons-globe-europe-africa'"
          size="sm"
        />
      </template>
      <template #links>
        <LocaleSwitcher />
      </template>
      <div class="flex-1 grid place-items-center">
        <UCard class="max-w-sm w-full">
          <UAuthForm
            :fields="fields"
            :schema="schema"
            align="top"
            icon="i-heroicons-lock-closed"
            :ui="{ base: 'text-center', footer: 'text-center' }"
            :submit-button="{ label: t('continue'), color: 'primary' }"
            :loading="isLoading"
            @submit="onSubmit"
          >
            <template #description>
              <i18n-t keypath="text_to_signup" tag="div" for="signup_link">
                <NuxtLink to="/signup" class="text-primary font-medium">
                  {{ t("signup_link") }}
                </NuxtLink>
              </i18n-t>
            </template>
            <template #password-hint>
              <NuxtLink
                to="/forgot-password"
                class="text-primary font-medium"
                >{{ t("forgot_password") }}</NuxtLink
              >
            </template>
            <template #footer>
              <i18n-t keypath="terms_text" tag="div" for="terms_of_service">
                <NuxtLink
                  to="https://www.karjolen.de/legal/terms"
                  target="_blank"
                  class="text-primary font-medium"
                  >{{ t("terms_of_service") }}</NuxtLink
                >
              </i18n-t>
            </template>
          </UAuthForm>
        </UCard>
      </div>
    </UPageHero>
  </UContainer>
</template>

<script setup lang="ts">
import LocaleSwitcher from "~/components/settings/LocaleSwitcher.vue";
import { z } from "zod";
import type { AuthError } from "@supabase/supabase-js";
const supabase = useSupabaseClient();
const user = useSupabaseUser();

definePageMeta({
  layout: "auth",
});

const { t } = useI18n({
  useScope: "local",
});

const isLoading = ref(false);
const toast = useToast();

const fields = [
  {
    name: "email",
    type: "text",
    label: t("email"),
    placeholder: t("email_placeholder"),
  },
  {
    name: "password",
    label: t("password"),
    type: "password",
    placeholder: t("password_placeholder"),
  },
];

const schema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

type Schema = z.infer<typeof schema>;

onMounted(() => {
  if (user.value) {
    navigateTo("/my");
  }
});

async function onSubmit(credentials: Schema) {
  isLoading.value = true;
  try {
    const { error } = await supabase.auth.signInWithPassword({
      email: credentials.email,
      password: credentials.password,
    });
    if (error) {
      // Handle Error
      throw error;
    }
    navigateTo("/my");
  } catch (e) {
    const error = e as AuthError;

    if (error.code === "invalid_credentials") {
      toast.add({
        title: t("error.credentials.title"),
        description: t("error.credentials.description"),
        color: "red",
      });
    } else {
      toast.add({
        title: t("error.title"),
        description: t("error.description"),
        color: "red",
      });
    }
  } finally {
    isLoading.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Willkommen zurück!",
    "description": "Loggen Sie sich ein, um fortzufahren.",
    "text_to_signup": "Noch kein Konto? {0}",
    "signup_link": "Registrieren",
    "welcome": "Hallo {name}!",
    "email": "E-Mail",
    "email_placeholder": "Geben Sie Ihre E-Mail-Adresse ein",
    "password": "Passwort",
    "password_placeholder": "Geben Sie Ihr Passwort ein",
    "forgot_password": "Passwort vergessen?",
    "continue": "Weiter",
    "invalid_credentials": "Ungültige Anmeldeinformationen",
    "terms_of_service": "Nutzungsbedingungen",
    "terms_text": "Mit dem Anmelden stimmen Sie unseren {0} zu.",
    "error": {
      "credentials": {
        "title": "Oops!",
        "description": "Ihre E-Mail-Adresse oder Ihr Passwort ist falsch. Bitte versuchen Sie es erneut."
      },
      "title": "Fehler",
      "description": "Es ist ein Fehler aufgetreten. Bitte versuchen Sie es erneut."
    }
  },
  "en": {
    "title": "Welcome back!",
    "description": "Log in to continue.",
    "text_to_signup": "Don't have an account? {0}",
    "signup_link": "Sign up",
    "welcome": "Hello {name}!",
    "email": "Email",
    "email_placeholder": "Enter your email",
    "password": "Password",
    "password_placeholder": "Enter your password",
    "forgot_password": "Forgot password?",
    "continue": "Continue",
    "invalid_credentials": "Invalid credentials",
    "terms_of_service": "Terms of Service",
    "terms_text": "By signing in, you agree to our {0}.",
    "error": {
      "credentials": {
        "title": "Oops!",
        "description": "Your email or password is incorrect. Please try again."
      },
      "title": "Error",
      "description": "An error occurred. Please try again."
    }
  }
}
</i18n>
