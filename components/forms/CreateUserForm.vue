<template>
    <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
        <UFormGroup label="Firstname" name="firstname">
            <UInput v-model="state.firstname" />
        </UFormGroup>
        <UFormGroup label="Lastname" name="lastname">
            <UInput v-model="state.lastname" />
        </UFormGroup>

        <UPopover :popper="{ placement: 'bottom-start' }">
            <UButton icon="i-heroicons-calendar-days-20-solid" :label="format(state.birth_date, 'd MMM, yyy')" />

            <template #panel="{ close }">
                <DatePicker v-model="state.birth_date" is-required @close="close" />
            </template>
        </UPopover>


        <UButton type="submit">
            Submit
        </UButton>
    </UForm>
</template>

<script setup lang="ts">

import type { Database } from '~/types/database.types';

import { z } from 'zod'
import type { FormSubmitEvent } from '#ui/types'
import { format } from 'date-fns'

import DatePicker from '~/components/forms/Inputs/Datepicker.vue'


const emit = defineEmits<{
    (e: 'submit', value: CreateUserSchema): void
}>()

const schema = z.object({
    firstname: z.string().min(2).max(255),
    lastname: z.string().min(2).max(255),
    birth_date: z.date().min(new Date(1900, 1, 1)).max(new Date()),
})

type CreateUserSchema = z.output<typeof schema>

const state = reactive<CreateUserSchema>({
    firstname: '',
    lastname: '',
    birth_date: new Date(),
})

async function onSubmit(event: FormSubmitEvent<CreateUserSchema>) {
    // Do something with data
    console.log(event.data)
    emit('submit', event.data)
}


</script>

<style scoped></style>