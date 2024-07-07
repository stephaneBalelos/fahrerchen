<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Welcome back!"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      @submit="onSubmit"
    >
      <template #description>
        {{ $t("welcome") }}
        do you remember your password now? <NuxtLink to="/login" class="text-primary font-medium">Login</NuxtLink>.
      </template>

    </UAuthForm>
  </UCard>
</template>

<script setup lang="ts">
import type { FormError } from "#ui/types";

definePageMeta({
  layout: "auth",
});

const supabase = useSupabaseClient();
const toasts = useToast();

const fields = [
  {
    name: "email",
    type: "text",
    label: "Email",
    placeholder: "Enter your email",
  },
];

const validate = (state: any) => {
  const errors: FormError[] = [];
  if (!state.email)
    errors.push({ path: "email", message: "Email is required" });
  return errors;
};

const onSubmit = async (data: any) => {
  try {
    const { data: res, error } = await supabase.auth.resetPasswordForEmail(
      data.email,
      {
        redirectTo: "http://localhost:3000/account/password-reset",
      }
    );

    if (error) {
      toasts.add({
        title: "Error",
        description: error.message,
        color: "red",
      })
      return;
    }
    toasts.add({
      title: "Success",
      description: "Password reset email sent",
      color: "green",
    });
  } catch (error) {
    console.error(error);
    toasts.add({
      title: "Error",
      description: "An error occured while sending the password reset email",
      color: "red",
    });
  }
};
</script>

<style scoped></style>
