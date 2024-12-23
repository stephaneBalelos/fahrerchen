<template>
  <UDashboardSection
    :title="t('general_settings_title')"
    :description="t('general_settings_desc')"
    orientation="horizontal"
    class="px-4 py-6"
  >
    <UCard
      :ui="{
        body: {
          base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
        },
      }"
    >
      <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
        <div class="flex flex-col gap-1 grow">
          <div class="flex justify-start gap-1">
            <p class="font-semibold me-2">{{ course?.name }}</p>
            <UBadge color="primary" variant="subtle" size="xs"
              >Klasse {{ course?.type.type }}</UBadge
            >
          </div>
          <span class="text-sm text-gray-500">{{ course?.description }}</span>
        </div>
        <UButton
          color="gray"
          variant="solid"
          @click="openCourseEditForm()"
          >{{ t('change') }}</UButton
        >
      </div>
      <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
        <div class="flex flex-col gap-1 grow">
          <div class="flex justify-start gap-1">
            <p class="font-semibold me-2">{{ t('create_bill_on_subscription') }}</p>
          </div>
          <span class="text-sm text-gray-500">{{ t('create_bill_on_subscription_desc' )}}</span>
        </div>
        <UToggle v-model="createBillOnSubscription" @change="updateCourseSettings" />
      </div>
      <div class="flex items-center justify-between pt-4 first:pt-0 gap-2">
        <div class="flex flex-col gap-1 grow">
          <div class="flex justify-start gap-1">
            <p class="font-semibold me-2">{{ t('allow_self_registration') }}</p>
          </div>
          <span class="text-sm text-gray-500">{{ t('allow_self_registration_desc' )}}</span>
        </div>
        <UToggle v-model="allowSelfRegistration" @change="updateCourseSettings" />
      </div>
    </UCard>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";
import EditCourseForm from "~/components/forms/EditCourseForm.vue";
import { useCourseTypes } from "~/composables/useCourseTypes";

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const { t } = useI18n({
  useScope: "local",
});

const client = useSupabaseClient<Database>();
const slideover = useSlideover();
const createBillOnSubscription = ref(false);
const allowSelfRegistration = ref(false);

const { data:course, error, status, refresh } = useAsyncData(async () => {
  const { data, error } = await client
    .from("courses")
    .select("*")
    .eq("id", props.courseid)
    .single();
    if (error) {
      console.error(error);
      throw error;
    }

    createBillOnSubscription.value = data.create_bill_on_subscription;
    allowSelfRegistration.value = data.allow_self_registration;

  return data;
}, {
  transform: async (data) => {
    const courseType = await useCourseTypes(data.type);
    return {
      ...data,
      type: courseType,
    };
  },
});

function openCourseEditForm() {
  slideover.open(EditCourseForm, {
    course_id: props.courseid,
    "onCourse-updated": async () => {
      await refresh();
    },
  });
}

async function updateCourseSettings() {
  const { data, error } = await client
    .from("courses")
    .update({
      create_bill_on_subscription: createBillOnSubscription.value,
      allow_self_registration: allowSelfRegistration.value,
    })
    .eq("id", props.courseid);
  if (error) {
    console.error(error);
    throw error;
  }
  refresh();
}

</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "general_settings_title": "Allgemeine Einstellungen",
    "general_settings_desc": "Allgemeine Einstellungen für den Kurs",
    "change": "Ändern",
    "create_bill_on_subscription": "Rechnung bei Anmeldung erstellen",
    "create_bill_on_subscription_desc": "Wenn aktiviert, wird eine Rechnung erstellt, wenn sich ein Benutzer für den Kurs anmeldet. Diese Rechnung basiert auf die Kurs aktivitäten.",
    "allow_self_registration": "Selbstregistrierung erlauben",
    "allow_self_registration_desc": "Wenn aktiviert, können Benutzer sich selbst für den Kurs registrieren, ohne dass ein Administrator sie hinzufügen muss."
  },
  "en": {
    "general_settings_title": "General Settings",
    "general_settings_desc": "General settings for the course",
    "change": "Edit",
    "create_bill_on_subscription": "Create bill on subscription",
    "create_bill_on_subscription_desc": "If enabled, a bill will be created when a user subscribes to the course. This bill is based on the course activities.",
    "allow_self_registration": "Allow self registration",
    "allow_self_registration_desc": "If enabled, users can register themselves for the course without an administrator having to add them."
  }
}
</i18n>
