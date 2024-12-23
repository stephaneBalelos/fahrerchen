<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      :title="t('title')"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Continue', color: 'primary' }"
      @submit="onSubmit"
      :loading="isLoading"
    >
      <template #description>
        {{ t("description") }} <br>

        <i18n-t keypath="text_to_login" tag="div" for="login_link">
          <NuxtLink to="/login" class="text-primary font-medium">{{
            t("login_link")
          }}</NuxtLink>
        </i18n-t>
      </template>

      <template #footer>
        <i18n-t keypath="terms_text" tag="div" for="terms_of_service">
          <NuxtLink to="/" class="text-primary font-medium">{{
            t("terms_of_service")
          }}</NuxtLink>
        </i18n-t>
      </template>
    </UAuthForm>
  </UCard>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { FormError, FormSubmitEvent } from "#ui/types";

const supabase = useSupabaseClient();
const user = useSupabaseUser();
const toasts = useToast();

definePageMeta({
  layout: "auth",
});

const { t } = useI18n({
  useScope: "local",
});

const isLoading = ref(false);

const fields = [
  {
    name: "name",
    type: "text",
    label: "Name",
    placeholder: "What is your name?",
  },
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "Enter your email",
  },
  {
    name: "password",
    label: "Password",
    type: "password",
    placeholder: "Enter your password",
  },
];

const validate = (state: any) => {
  const errors: FormError[] = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is required" });
  if (!state.password)
    errors.push({ path: "password", message: "Password is required" });
  return errors;
};

onMounted(() => {
  if (user.value) {
    navigateTo("/");
  }
});

async function onSubmit(credentials: any) {
  isLoading.value = true;
  const { data, error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: `${window.location.origin}/account`,
      data: {
        name: credentials.name,
      },
    }
  });
  if (error) {
    // Handle Error
    toasts.add({
      title: "Error",
      description: error.message,
      color: "red",
    });
    console.error(error);
    isLoading.value = false;
    return;
  }
  isLoading.value = false;
  toasts.add({
    title: t("welcome", { name: credentials.name }),
    icon: "i-heroicons-envelope",
    timeout: 60000,
    description: "Check your email to verify your account",
    color: "green",
  });
  navigateTo("/login");
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Anmelden",
    "description": "Erstelle ein Konto, um fortzufahren.",
    "text_to_login": "Bereits ein Konto? {0}",
    "login_link": "Anmelden",
    "email": "Email",
    "password": "Passwort",
    "terms_text": "Mit dem Anmelden stimmen Sie unseren {0} zu",
    "terms_of_service": "Nutzungsbedingungen",
    "welcome": "Willkommen {name}!"
  },
  "en": {
    "title": "Sign in",
    "description": "Create an account to continue.",
    "text_to_login": "Already have an account? {0}",
    "login_link": "Login",
    "email": "Email",
    "password": "Password",
    "terms_text": "By signing in, you agree to our {0}",
    "terms_of_service": "Terms of Service",
    "welcome": "Welcome {name}!"
  }
}
</i18n>
