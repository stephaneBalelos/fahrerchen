<script setup lang="ts">
import { type Database } from '~/types/database.types';
import type { FormError, FormSubmitEvent } from '#ui/types'
import { z } from 'zod';


const supabase = useSupabaseClient<Database>();

const fileRef = ref<HTMLInputElement>()
const toast = useToast()

const lessonTypes: string[] = ["EXAM", "OTHER", "PRACTICE", "THEORY"]

const schema = z.object({
    type: z.enum(["DEFAULT", ...lessonTypes]),
    description: z.string().min(14, 'Description is required'),
    mandatory: z.boolean(),
    price: z.number().min(0),
})

export type CreateLessonSchema = z.output<typeof schema>

const emit = defineEmits<{
  (e: 'submit', value: CreateLessonSchema): void
}>()




const state = reactive<CreateLessonSchema>({
    type: 'PRACTICE',
    description: '',
    mandatory: false,
    price: 0,
    
})


async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with data
    console.log(event.data)

    // Emit event
    emit('submit', event.data)
}

</script>

<template>
    <UForm :state="state" :schema="schema" :validate-on="['submit']" @submit="onSubmit">
        <UDashboardSection title="Lesson Details" subtitle="This information will be displayed publicly so be careful what you share."
            description="This information will be displayed publicly so be careful what you share.">

            <UFormGroup name="lessonType" label="Lesson Type"
                description="Will appear on receipts, invoices, and other communication." required
                class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
                <USelectMenu v-model="state.type" :options="lessonTypes" />
            </UFormGroup>
            
            <UFormGroup name="mandatory" label="Mandatory Lesson"
                description="Will appear on receipts, invoices, and other communication." required
                class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
                <UToggle v-model="state.mandatory" size="xl" />
            </UFormGroup>

            <UFormGroup name="description" label="Course Description" description="Describe your course in detail."
                class="grid gap-2" :ui="{ container: '' }" required>
                <UTextarea v-model="state.description" :rows="5" autoresize size="md" />
            </UFormGroup>

            <UFormGroup name="price" label="Course Price" description="Describe your course in detail."
                class="grid gap-2" :ui="{ container: '' }" required>
                 <UInput v-model="state.price" type="number" size="lg">
                    <template #trailing>
                    <span class="text-gray-500 dark:text-gray-400 text-xs">EUR</span>
                    </template>
                </UInput>
            </UFormGroup>

        </UDashboardSection>
        <UButton type="submit" label="Create Course" color="black" />
    </UForm>

</template>

<style scoped></style>