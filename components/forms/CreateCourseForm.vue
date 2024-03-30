<script setup lang="ts">
import { type Database } from '~/types/database.types';
import type { FormError, FormSubmitEvent } from '#ui/types'
import { z } from 'zod';


const supabase = useSupabaseClient<Database>();
const { org } = useGlobalOrgState()

const fileRef = ref<HTMLInputElement>()
const toast = useToast()
const schema = z.object({
    description: z.string().min(14, 'Description is required'),
})

type Schema = z.output<typeof schema>

const emit = defineEmits<{
  (e: 'submit', value: Schema): void
}>()




const state = reactive<Schema>({
    description: '',
})


// function onFileChange(e: Event) {
//     const input = e.target as HTMLInputElement

//     if (!input.files?.length) {
//         return
//     }

//     state.avatar = URL.createObjectURL(input.files[0])
// }

// function onFileClick() {
//     fileRef.value?.click()
// }

async function onSubmit(event: FormSubmitEvent<any>) {
    // Do something with data
    console.log(event.data)

    // Emit event
    emit('submit', event.data)
}


const createCourse = async () => {
    const { data, error } = await supabase.from('courses').insert({
        organisation_id: org.value,
        description: 'This is a new course'
    })
}

</script>

<template>
    <UForm :state="state" :schema="schema" :validate-on="['submit']" @submit="onSubmit">
        <UDashboardSection title="Course"
            description="This information will be displayed publicly so be careful what you share.">

            <!-- <UFormGroup name="name" label="Name"
                description="Will appear on receipts, invoices, and other communication." required
                class="grid grid-cols-2 gap-2 items-center" :ui="{ container: '' }">
                <UInput v-model="state.name" autocomplete="off" icon="i-heroicons-user" size="md" />
            </UFormGroup>

            <UFormGroup name="email" label="Email"
                description="Used to sign in, for email receipts and product updates." required
                class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
                <UInput v-model="state.email" type="email" autocomplete="off" icon="i-heroicons-envelope" size="md" />
            </UFormGroup>

            <UFormGroup name="username" label="Username"
                description="Your unique username for logging in and your profile URL." required
                class="grid grid-cols-2 gap-2" :ui="{ container: '' }">
                <UInput v-model="state.username" type="username" autocomplete="off" size="md" input-class="ps-[77px]">
                    <template #leading>
                        <span class="text-gray-500 dark:text-gray-400 text-sm">nuxt.com/</span>
                    </template>
                </UInput>
            </UFormGroup>

            <UFormGroup name="avatar" label="Avatar" class="grid grid-cols-2 gap-2" help="JPG, GIF or PNG. 1MB Max."
                :ui="{ container: 'flex flex-wrap items-center gap-3', help: 'mt-0' }">
                <UAvatar :src="state.avatar" :alt="state.name" size="lg" />

                <UButton label="Choose" color="white" size="md" @click="onFileClick" />

                <input ref="fileRef" type="file" class="hidden" accept=".jpg, .jpeg, .png, .gif" @change="onFileChange">
            </UFormGroup> -->

            <UFormGroup name="description" label="Course Description" description="Describe your course in detail."
                class="grid gap-2" :ui="{ container: '' }">
                <UTextarea v-model="state.description" :rows="5" autoresize size="md" />
            </UFormGroup>

        </UDashboardSection>
        <UButton type="submit" label="Create Course" color="black" />
    </UForm>

</template>

<style scoped></style>