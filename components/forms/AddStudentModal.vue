<script setup lang="ts">
import type { FormSubmitEvent } from "#ui/types";
import { z } from "zod";
import type { Database } from "~/types/database.types";

const props = defineProps<{
  orgid: string;
}>();

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const emit = defineEmits(["close"]);

const client = useSupabaseClient<Database>();

const toasts = useToast();

const _schema = z.object({
  email: z.string().email(g("form_errors.email")),
});

type AddMemberFormProps = z.infer<typeof _schema>;

const state = reactive<AddMemberFormProps>({
  email: "",
});

async function onSubmit(event: FormSubmitEvent<AddMemberFormProps>) {
  const orgId = props.orgid;

  if (orgId) {
    const { data, error } = await client.functions.invoke("invite-user", {
      method: "POST",
      body: {
        email: event.data.email,
        role: "student",
        orgid: orgId,
      },
    });
    console.log(data);
    if (error) {
      console.error(error);
      toasts.add({
        id: "student-invited-error",
        title: "Error",
        description: "Could not invite student",
        color: "red",
      });
      return;
    }
    toasts.add({
      id: "student-invited",
      title: "Success",
      description: "student invited",
      color: "green",
    });
    emit("close");
  }
}
</script>

<template>
  <UDashboardModal
    :title="t('invite_student')"
    :description="t('invite_student_description')"
    :ui="{ width: 'sm:max-w-md', height: 'h-auto' }"
  >
    <UForm
      id="add-student-form"
      :schema="_schema"
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

      <UAlert
        :title="t('tip_title')"
        :description="t('tip_description')"
      />

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
  </UDashboardModal>
</template>

<i18n lang="json">
{
  "de": {
    "invite_student": "Fahrschüler einladen",
    "invite_student_description": "Fahrschüler per E-Mail einladen",
    "tip_title": "Was passiert, wenn ich einen Fahrschüler einlade?",
    "tip_description": "Der Fahrschüler erhält eine E-Mail-Einladung, um sich für die Fahrschule anzumelden. Sie können die Einladung jederzeit widerrufen. Sie müssen dananch der/die in einem Kurs einschreiben.",
    "form": {
      "email": {
        "label": "E-Mail",
        "placeholder": "maxmuestermannweb.de"
      }
    },
    "cancel": "Abbrechen",
    "invite": "Einladen"
  },
  "en": {
    "invite_student": "Invite Student",
    "invite_student_description": "Invite student by email",
    "tip_title": "What happens when I invite a student?",
    "tip_description": "The student will receive an email invitation to sign up for the driving school. You can revoke the invitation at any time. You must then enroll the student in a course.",
    "form": {
      "email": {
        "label": "Email",
        "placeholder": "johndoegmail.com"
      }
    },
    "cancel": "Cancel",
    "invite": "Invite"
  }
}
</i18n>
