<template>
  <UDashboardPanel grow>
    <UDashboardNavbar
      v-if="subscription"
      :title="`${subscription.student_firstname} ${subscription.student_lastname}`"
    >
      <template #right>
        <UButton variant="ghost" :loading="isDownloadingCertificate" @click="generateCertificate">
          {{ t("generate_certifcate") }}
        </UButton>
      </template>
    </UDashboardNavbar>
    <UDashboardToolbar class="py-0 px-1.5 overflow-x-auto">
      <UHorizontalNavigation :links="links" />
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <NuxtPage />
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import { format } from "date-fns";
import type { Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const subscription_id = route.params.id as string;
const org_id = route.params.org_id as string;
const client = useSupabaseClient<Database>();
const isDownloadingCertificate = ref(false);

const { t } = useI18n({
  useScope: "local",
});

const { data: subscription } = useAsyncData(
  `subscriptions_${subscription_id}`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .eq("id", subscription_id)
      .single();
    if (error) {
      throw error;
    }

    return data;
  }
);

const links = computed(() => {
  return [
    [
      {
        label: t("overview"),
        to: `/my/${org_id}/students/${subscription_id}`,
        exact: true,
      },
      {
        label: t("bills"),
        to: `/my/${org_id}/students/${subscription_id}/bills`,
      },
      {
        label: t("subscription"),
        to: `/my/${org_id}/students/${subscription_id}/subscription`,
      },
    ],
  ];
});

async function generateCertificate() {
  if (isDownloadingCertificate.value) {
    return;
  }
  isDownloadingCertificate.value = true;
  try {
    const res = await $fetch<Blob>(`/api/orgs/subscriptions/${subscription_id}/generate-certificate`, {
        method: "GET",
    });
    const date = format(new Date(), "yyyy-MM-dd");
    

    const blob = new Blob([res], { type: "application/pdf" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `ausbildungsnachweis-b-${subscription.value.student_firstname}-${subscription.value.student_lastname}-${date}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  } catch (error) {
    console.error(error);
  } finally {
    isDownloadingCertificate.value = false;
  }
}
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Student",
    "active": "Aktiv",
    "archive": "Archiv",
    "overview": "Überblick",
    "bills": "Rechnungen",
    "subscription": "Einschreibung",
    "student_is_inactive": "Der Schüler ist inaktiv.",
    "student_is_inactive_description": "Der Schüler ist inaktiv und hat keine aktiven Abonnements.",
    "generate_certifcate": "Zertifikat generieren"
  },
  "en": {
    "title": "Student",
    "active": "Active",
    "archive": "Archive",
    "overview": "Overview",
    "bills": "Bills",
    "subscription": "Registration",
    "student_is_inactive": "The student is inactive.",
    "student_is_inactive_description": "The student is inactive and has no active subscriptions.",
    "generate_certifcate": "Generate certificate"
  }
}
</i18n>
