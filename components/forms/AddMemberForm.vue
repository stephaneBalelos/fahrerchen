<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import path from "path";
import { z } from "zod";
import type { UserRole } from "~/types/app.types";
import type { Database } from "~/types/database.types";

const emit = defineEmits(["close"]);

const { orgData } = useGlobalOrgState();

const client = useSupabaseClient<Database>();
type AddMemberFormProps = {
  role: UserRole;
  email: string;
};

const roles: UserRole[] = ["manager", "owner", "student", "teacher"];

const state = reactive<AddMemberFormProps>({
  role: "manager",
  email: "",
});

// https://ui.nuxt.com/components/form
const validate = (state: AddMemberFormProps): FormError[] => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  if (!roles.includes(state.role))
    errors.push({ path: "role", message: "willst du mich verarschen?!" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<AddMemberFormProps>) {
  const orgId = orgData.value?.id
  if (orgId) {
    const res = await client.functions.invoke("invite-team-member", {
    method: 'POST',
    body: {
      email: event.data.email,
      role: event.data.role,
      orgid: orgId,
    },
  });
  emit("close");
  }
}
</script>

<template>
  <UForm
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
    id="add-member-form"
  >
    <UFormGroup label="Email" name="email">
      <UInput
        v-model="state.email"
        type="email"
        placeholder="john.doe@example.com"
        autofocus
      />
    </UFormGroup>

    <UFormGroup label="Role" name="role">
      <USelectMenu
        v-model="state.role"
        :options="roles"
        :ui-menu="{ select: 'capitalize', option: { base: 'capitalize' } }"
      />
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        label="Cancel"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton type="submit" label="Save" color="black" />
    </div>
  </UForm>
</template>
