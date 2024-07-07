<template>
  <UCard class="max-w-sm w-full">
    <UAuthForm
      :fields="fields"
      :validate="validate"
      title="Welcome back!"
      align="top"
      icon="i-heroicons-lock-closed"
      :ui="{ base: 'text-center', footer: 'text-center' }"
      :submit-button="{ label: 'Continue', color: 'primary'}"
      @submit="onSubmit"
    >
      <template #description>
        <!-- Don't have an account? <NuxtLink to="/" class="text-primary font-medium">Sign up</NuxtLink>. -->

        <UAlert
            v-if="loginFailed"
            role="alert"
            color="red"
            variant="subtle"
            title="Invalid email or password."
        />
      </template>

      <template #password-hint>
        <NuxtLink to="/forgot-password" class="text-primary font-medium">Forgot password?</NuxtLink>
      </template>

      <template #footer>
        By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of Service</NuxtLink>.
      </template>
    </UAuthForm>
  </UCard>
</template>

<script setup lang="ts">

import { z } from 'zod'
import type { FormError, FormSubmitEvent } from '#ui/types'

const supabase = useSupabaseClient()
const user = useSupabaseUser()

definePageMeta({
    layout: 'auth',
})

const loginFailed = ref(false)

const fields = [{
  name: 'email',
  type: 'text',
  label: 'Email',
  placeholder: 'Enter your email'
}, {
  name: 'password',
  label: 'Password',
  type: 'password',
  placeholder: 'Enter your password'
}]

const validate = (state: any) => {
  const errors: FormError[] = []
  if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
  if (!state.password) errors.push({ path: 'password', message: 'Password is required' })
  return errors
}

const providers = [{
  label: 'Continue with GitHub',
  icon: 'i-simple-icons-github',
  color: 'white' as const,
  click: () => {
    console.log('Redirect to GitHub')
  }
}]

onMounted(() => {
  if (user.value) {
    navigateTo("/")
  }
})


async function onSubmit(credentials: any) {

    const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password
    })
    if (error) {
        // Handle Error
        loginFailed.value = true
        return;
    }

    navigateTo('/')   
}
</script>

<style scoped></style>