<script setup lang="ts">
import type { FormError, FormSubmitEvent } from "#ui/types";
import type { UserRole } from "~/types/app.types";
import type { Database } from "~/types/database.types";

const props = defineProps<{
  orgid: string;
}>();

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const emit = defineEmits(["close"]);

const client = useSupabaseClient<Database>();
type AddMemberFormProps = {
  role: UserRole;
  email: string;
};

const toasts = useToast();

const roles: UserRole[] = ["owner", "manager", "teacher"];

const state = reactive<AddMemberFormProps>({
  role: "manager",
  email: "",
});

const validate = (state: AddMemberFormProps): FormError[] => {
  const errors = [];
  if (!state.email)
    errors.push({ path: "email", message: "Please enter an email." });
  if (!roles.includes(state.role))
    errors.push({ path: "role", message: "willst du mich verarschen?!" });
  return errors;
};

async function onSubmit(event: FormSubmitEvent<AddMemberFormProps>) {
  const orgId = props.orgid

  if (orgId) {
    const {data, error} = await client.functions.invoke("invite-user", {
    method: 'POST',
    body: {
      email: event.data.email,
      role: event.data.role,
      orgid: orgId,
    },
  });
  console.log(data);
  if (error) {
    console.error(error);
    toasts.add({
      id: "member-invited-error",
      title: "Error",
      description: "Could not invite member",
      color: "red",
    });
    return;
  }
  toasts.add({
    id: "member-invited",
    title: "Success",
    description: "Member invited",
    color: "green",
  });
  emit("close");
  }
}
</script>

<template>
  <UForm
  id="add-member-form"
    :validate="validate"
    :validate-on="['submit']"
    :state="state"
    class="space-y-4"
    @submit="onSubmit"
  >
    <UFormGroup :label="t('form.email.label')" name="email">
      <UInput
        v-model="state.email"
        type="email"
        :placeholder="t('form.email.placeholder')"
        autofocus
      />
    </UFormGroup>

    <UFormGroup :label="t('form.role.label')" name="role">
      <USelectMenu
        v-model="state.role"
        :options="roles"
      >
        <template #option="{ option }">
          {{ g(`roles.${option}`) }}
        </template>

        <template #label>
          {{ g(`roles.${state.role}`) }}
        </template>
      </USelectMenu>
    </UFormGroup>

    <div class="flex justify-end gap-3">
      <UButton
        :label="t('cancel')"
        color="gray"
        variant="ghost"
        @click="emit('close')"
      />
      <UButton type="submit" :label="t('invite')" color="black" />
    </div>
  </UForm>
</template>

<i18n lang="json">
{
  "de": {
    "form": {
      "email": {
        "label": "E-Mail",
        "placeholder": "maxmuestermannweb.de"
      },
      "role": {
        "label": "Rolle"
      }
    },
    "cancel": "Abbrechen",
    "invite": "Einladen"   

  },
  "en": {
    "form": {
      "email": {
        "label": "Email",
        "placeholder": "johndoegmail.com"
      },
      "role": {
        "label": "Role"
      }
    },
    "cancel": "Cancel",
    "invite": "Invite"
  }
}
</i18n>
