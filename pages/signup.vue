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
            :submit-button="{ label: 'Continue', color: 'primary' }"
            :loading="isLoading"
            @submit="onSubmit"
          >
            <template #description>
              <i18n-t keypath="text_to_login" tag="div" for="login_link">
                <NuxtLink to="/login" class="text-primary font-medium">{{
                  t("login_link")
                }}</NuxtLink>
              </i18n-t>
            </template>
            <template #footer>
              <i18n-t keypath="terms_text" tag="div" for="terms_of_service">
                <NuxtLink to="https://www.karjolen.de/legal/terms" target="_blank" class="text-primary font-medium">{{
                  t("terms_of_service")
                }}</NuxtLink>
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

const schema = z.object({
  name: z.string().nonempty("Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

type Schema = z.infer<typeof schema>;

onMounted(() => {
  if (user.value) {
    navigateTo("/");
  }
});

async function onSubmit(credentials: Schema) {
  isLoading.value = true;
  const { error } = await supabase.auth.signUp({
    email: credentials.email,
    password: credentials.password,
    options: {
      emailRedirectTo: `${window.location.origin}/account`,
      data: {
        name: credentials.name,
      },
    },
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
    "title": "Willkommen bei Karjolen!",
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
    "title": "Welcome to Karjolen!",
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
