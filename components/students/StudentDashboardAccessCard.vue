<template>
  <UAlert
    v-if="student && student.user_id"
    :title="t('access_granted')"
    :description="t('access_granted_description')"
    color="green"
    variant="soft"
  />
  <UAlert
    v-else-if="student && invitation"
    :title="t('access_pending')"
    :description="t('access_pending_description', {date: formatDate(invitation.inserted_at)})"
    color="orange"
    variant="soft"
  />
  <UAlert
    v-else
    :title="t('access_not_granted')"
    :description="t('access_not_granted_description')"
    :actions="[
      {
        label: t('send_invitation'),
        color: 'gray',
        variant: 'ghost',
        click: sendInvitation,
        loading: isSendingInvitation,
      },
    ]"
  />
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import { formatDate } from "~/utils/formatters";

type Props = {
  studentId: string;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();
const toasts = useToast();
const isSendingInvitation = ref(false);

const student = await useCourseStudent(props.studentId);

const client = useSupabaseClient<Database>();

const { data: invitation, refresh } = useAsyncData(async () => {
  const { data, error } = await client
    .from("organizations_invitations")
    .select("*")
    .eq("status", 0)
    .eq("email", student.email);
  if (error) {
    throw error;
  }
  return data[0];
});

async function sendInvitation() {
  if (!student) {
    return;
  }
  const orgId = student.organization_id;
  const email = student.email;
  try {
    isSendingInvitation.value = true;
    const { data, error } = await client.functions.invoke("invite-user", {
      method: "POST",
      body: {
        email: email,
        role: "student",
        orgid: orgId,
      },
    });

    console.log(data, error);
    if (error) {
      toasts.add({
        id: "student-invited-error",
        title: "Error",
        description: "Could not invite student",
        color: "red",
      });
      throw error;
    }
    toasts.add({
      id: "student-invited",
      title: "Success",
      description: "student invited",
      color: "green",
    });
  } catch (error) {
    console.error(error);
  } finally {
    isSendingInvitation.value = false;
    await refresh();
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "access_granted": "Zugriff gewährt",
    "access_granted_description": "Der Schüler hat Zugriff auf das Dashboard.",
    "access_pending": "Zugriff ausstehend",
    "access_pending_description": "Der Schüler hat noch keinen Zugriff auf das Dashboard. Die Einladung wurde am {date} gesendet.",
    "access_not_granted": "Zugriff nicht gewährt",
    "access_not_granted_description": "Der Schüler hat noch keinen Zugriff auf das Dashboard.",
    "send_invitation": "Einladung senden"
  },
  "en": {
    "access_granted": "Access granted",
    "access_granted_description": "The student has access to the dashboard.",
    "access_pending": "Access pending",
    "access_pending_description": "The student does not yet have access to the dashboard. The invitation was sent on {date}.",
    "access_not_granted": "Access not granted",
    "access_not_granted_description": "The student does not yet have access to the dashboard.",
    "send_invitation": "Send invitation"
  }
}
</i18n>
