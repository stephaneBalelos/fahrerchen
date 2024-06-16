<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="New password" name="password">
            <UInput v-model="state.password" type="password" />
        </UFormGroup>

        <UFormGroup label="Password Confirm" name="passwordConfirm">
            <UInput v-model="state.passwordConfirm" type="password" />
        </UFormGroup>

        <UButton type="submit">
            Change password
        </UButton>
    </UForm>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
    layout: 'auth',
})

const supabase = useSupabaseClient()

const schema = z.object({
    password: z.string().min(8, 'Invalid email'),
    passwordConfirm: z.string()
}).refine((data) => data.password === data.passwordConfirm, {
    message: "Passwords don't match",
    path: ["passwordConfirm"], // path of error
})

type Schema = z.output<typeof schema>

const state = reactive({
    password: undefined,
    passwordConfirm: undefined
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    console.log(event.data)
    const res = await supabase.auth.updateUser({ password: event.data.passwordConfirm })
    console.log(res)
}
</script>

<style scoped></style>