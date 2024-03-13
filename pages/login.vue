<template>
    <UCard class="max-w-sm w-full">
        <UAuthForm :fields="fields" :validate="validate" :providers="providers" title="Welcome back!" align="top"
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

async function onSubmit(data: any) {
    console.log(data)
    // const res = await supabase.auth.signInWithPassword({
    //     email: 
    // })
}
</script>

<style scoped></style>