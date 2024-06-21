<template>
     <UCard class="max-w-sm w-full">
        <UAuthForm :fields="fields" :validate="validate" title="Welcome back!" align="top"
            icon="i-heroicons-lock-closed" :ui="{ base: 'text-center', footer: 'text-center' }" @submit="onSubmit">
            <template #description>
                {{ $t('welcome') }}
                Don't have an account? <NuxtLink to="/" class="text-primary font-medium">Sign up</NuxtLink>.
            </template>

            <template #password-hint>
                <NuxtLink to="/" class="text-primary font-medium">Forgot password?</NuxtLink>
            </template>

            <template #footer>
                By signing in, you agree to our <NuxtLink to="/" class="text-primary font-medium">Terms of Service
                </NuxtLink>.
            </template>
        </UAuthForm>
    </UCard>
</template>

<script setup lang="ts">
import type { FormError } from '#ui/types'

definePageMeta({
    layout: 'auth'
})

const supabase = useSupabaseClient()


const fields = [{
    name: 'email',
    type: 'text',
    label: 'Email',
    placeholder: 'Enter your email'
}]

const validate = (state: any) => {
    const errors: FormError[] = []
    if (!state.email) errors.push({ path: 'email', message: 'Email is required' })
    return errors
}

const onSubmit = async (data: any) => {
    const res = await supabase.auth.resetPasswordForEmail(data.email, {
        redirectTo: 'http://localhost:3000/account/password-reset',
    })

    console.log(res)
}
</script>

<style scoped>

</style>