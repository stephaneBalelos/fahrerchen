<template>
  <UDashboardPanel grow>
    <div class="h-full grid place-items-center">
      <UContainer>
        <ULandingCTA
          v-if="!hasError"
          :title="t('loading_title')"
          :description="t('loading_description')"
          card
        >
          <UProgress animation="elastic" size="xs" :indicator="false" />
        </ULandingCTA>
        <UAlert
          v-if="hasError"
          class="w-96"
          :title="t('loading_error_title')"
          :description="t('loading_error_description')"
          color="red"
          variant="soft"
          :actions="[
            {
              variant: 'solid',
              color: 'gray',
              label: t('back_to_home'),
              click: () => navigateTo('/'),
            },
          ]"
        />
      </UContainer>
    </div>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

definePageMeta({
  validate: async (route) => {
    // get query params invitation_id and signature
    const { invitation_id, signature } = route.query;

    if (!invitation_id || !signature) {
      return false;
    }

    if (typeof invitation_id !== "string" || typeof signature !== "string") {
      return false;
    }

    return true;
  },
});

const hasError = ref(false);

const { t } = useI18n({
  useScope: "local",
});

const route = useRoute();
const client = useSupabaseClient<Database>();

type InvitationResponse = {
  email: string;
  orgid: string;
  otp?: string;
};

onMounted(async () => {
  const { invitation_id, signature } = route.query;
  console.log(invitation_id, signature);

  if (!invitation_id || !signature) {
    throw new Error("Invalid invitation");
  }

  if (typeof invitation_id !== "string" || typeof signature !== "string") {
    throw new Error("Invalid invitation");
  }

  try {
    const { data, error } = await client.functions.invoke<InvitationResponse>(
      "accept-invitation",
      {
        method: "POST",
        body: {
          invitation_id,
          signature,
        },
      }
    );

    if (error) {
      throw error;
    }

    if (data?.otp) {
      await client.auth.verifyOtp({
        email: data.email,
        token: data.otp,
        type: "email",
      });
      navigateTo(`/my/${data.orgid}`);
    } else {
      navigateTo("/my");
    }
  } catch (error) {
    console.error(error);
    hasError.value = true;
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "loading_title": "Ein Moment bitte",
    "loading_description": "Wir prüfen die Einladung...",
    "loading_error_title": "Mist, da ist etwas schief gelaufen",
    "loading_error_description": "Dieser Link schein nicht mehr gültig zu sein",
    "back_to_home": "Zurück zur Startseite"
  },
  "en": {
    "loading_title": "One moment please",
    "loading_description": "Checking the invitation...",
    "loading_error_title": "Oops, something went wrong",
    "loading_error_description": "This link seems to be invalid",
    "back_to_home": "Back to the homepage"
  }
}
</i18n>
