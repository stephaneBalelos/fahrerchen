<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-if="subscription"
      >
      <template #title>
        <div class="flex items-center gap-2">
          <UAvatar
            :alt="`${subscription.student_firstname} ${subscription.student_lastname}`"
            size="sm"
          />
          <span>{{ subscription.student_full_name }}</span> |
          <span>
            {{  subscription.course_name }}
          </span>
          <UBadge
            v-if="subscription.archived_at"
            color="red"
            size="sm"
          >
            {{ t("archive") }}
          </UBadge>
        </div>
      </template>
        <template #right>
          <UHorizontalNavigation :links="links" />
        </template>
      </UDashboardNavbar>
      <NuxtPage />
    </UDashboardPanel>
  </UDashboardPage>
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
        label: t("activity"),
        to: `/my/${org_id}/students/${subscription_id}/activity`,
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

async function _generateCertificate() {
  if (!subscription.value) {
    return;
  }
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
    "activity": "Aktivität",
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
    "activity": "Activity",
    "bills": "Bills",
    "subscription": "Registration",
    "student_is_inactive": "The student is inactive.",
    "student_is_inactive_description": "The student is inactive and has no active subscriptions.",
    "generate_certifcate": "Generate certificate"
  }
}
</i18n>
