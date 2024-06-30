<template>
  <UDashboardSlideover :title="fullname">
    <div class="d-flex">
      <UAvatar
        size="3xl"
        :alt="`${props.student.firstname} ${props.student.lastname}`"
      />
    </div>
    <UForm :state="state" class="space-y-4">
      <UFormGroup
        label="Firstname"
        name="firstname"
        required

      >
        <UInput v-model="state.firstname" />
      </UFormGroup>
      <UFormGroup
        label="Lastname"
        name="lastname"
        required

      >
        <UInput v-model="state.lastname" />
      </UFormGroup>
      <UFormGroup
        label="Email"
        name="email"
        required

      >
        <UInput v-model="state.email" />
      </UFormGroup>
    </UForm>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppStudent } from "~/types/app.types";

const props = defineProps<{
  student: AppStudent;
}>();

const state = reactive({
  email: props.student.email,
  firstname: props.student.firstname,
  lastname: props.student.lastname,
  birth_date: props.student.birth_date,
});

const fullname = computed(() => `${state.firstname} ${state.lastname}`);
</script>

<style scoped></style>
