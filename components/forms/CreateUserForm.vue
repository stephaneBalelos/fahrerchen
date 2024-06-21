<template>
  <UForm :schema="schema" :state="state" class="space-y-4" @submit="onSubmit">
    <UFormGroup label="Firstname" name="firstname">
      <UInput v-model="state.firstname" />
    </UFormGroup>
    <UFormGroup label="Lastname" name="lastname">
      <UInput v-model="state.lastname" />
    </UFormGroup>
    <UFormGroup label="Email" name="email">
      <UInput v-model="state.email" />
    </UFormGroup>

    <UPopover :popper="{ placement: 'bottom-start' }">
      <UButton
        icon="i-heroicons-calendar-days-20-solid"
        :label="format(state.birth_date, 'd MMM, yyy')"
      />

      <template #panel="{ close }">
        <DatePicker v-model="state.birth_date" is-required @close="close" />
      </template>
    </UPopover>

    <UButton type="submit"> Submit </UButton>
  </UForm>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

import { z } from "zod";
import type { FormSubmitEvent } from "#ui/types";
import { format } from "date-fns";

import DatePicker from "~/components/forms/Inputs/Datepicker.vue";

const emit = defineEmits<{
  (e: "submit", value: CreateUserSchema): void;
}>();

const client = useSupabaseClient<Database>();
const { orgData } = useGlobalOrgState();
const toast = useToast();

const schema = z.object({
  email: z.string().email(),
  firstname: z.string().min(2).max(255),
  lastname: z.string().min(2).max(255),
  birth_date: z
    .date()
    .min(new Date(1900, 1, 1))
    .max(new Date()),
});

type CreateUserSchema = z.output<typeof schema>;

const state = reactive<CreateUserSchema>({
  email: "",
  firstname: "",
  lastname: "",
  birth_date: new Date(),
});

async function onSubmit(event: FormSubmitEvent<CreateUserSchema>) {
  // Do something with data
  console.log(event.data);

  const orgId = orgData.value?.id;

  if (!orgId) {
    toast.add({
      title: "Error",
      description: "No organization data found",
      color: "red",
    });
  } else {
    const data = {
      firstname: event.data.firstname,
      lastname: event.data.lastname,
      email: event.data.email,
      birth_date: event.data.birth_date.toISOString(),
    };
    
    try {
        const res = await client.rpc("create_student", {
      ...data,
      organisation_id: orgId,
    });
    console.log(res);
    toast.add({
      title: "Success",
      description: "User created",
        color: "green",
    });
    } catch (error) {
    console.log(error); 
    }

  }
}
</script>

<style scoped></style>
