<template>
    <UDashboardPanel class="py-8">
        <UContainer class="w-full">
            <UDashboardSection :title="`Reset your Password`" :description="`Secure your account with a new password`">
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
            </UDashboardSection>
        </UContainer>
    </UDashboardPanel>
</template>

<script setup lang="ts">
import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'

definePageMeta({
    layout: 'default',
})

const supabase = useSupabaseClient()
const user = useSupabaseUser()
const router = useRouter()

const toasts = useToast()

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

onMounted(() => {
    if (!user.value) {
        router.push('/login')
    }
})

async function onSubmit(event: FormSubmitEvent<Schema>) {
    try {
        const {data, error} = await supabase.auth.updateUser({ password: event.data.passwordConfirm })
        if (error) {
            throw error
        }
        router.push('/account')
        toasts.add({
            title: 'New password set',
            description: 'Your password has been updated',
            color: 'green'
        })
    } catch (error: any) {
        toasts.add({
            title: 'Error',
            description: error.message,
            color: 'red'
        })
    }
    
}
</script>

<style scoped></style>