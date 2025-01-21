<template>
  <UDashboardPanel grow>
    <UDashboardNavbar v-if="subscription" :title="`${subscription.student_firstname} ${subscription.student_lastname}`"/>
    <UDashboardToolbar
      class="py-0 px-1.5 overflow-x-auto"
    >
      <UHorizontalNavigation :links="links" />
    </UDashboardToolbar>
    <UDashboardPanelContent>
      <NuxtPage />
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const subscription_id = route.params.id as string;
const org_id = route.params.org_id as string;
const client = useSupabaseClient<Database>();


const { t } = useI18n({
  useScope: "local",
});


const { data: subscription } = useAsyncData(
  `subscriptions_${subscription_id}`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .eq("id", subscription_id).single()
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
    "subscription_not_found": "Das Abonnement wurde nicht gefunden.",
    "create_bill": "Rechnung erstellen",
    "bill_generated": "Rechnung erstellt",
    "bill_generated_description": "Die Rechnung wurde erfolgreich erstellt.",
    "bill_not_generated": "Rechnung nicht erstellt",
    "bill_not_generated_description": "Die Rechnung konnte nicht erstellt werden. Bitte versuchen Sie es später erneut."
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
    "subscription_not_found": "The subscription was not found.",
    "create_bill": "Create bill",
    "bill_generated": "Bill generated",
    "bill_generated_description": "The bill was successfully generated.",
    "bill_not_generated": "Bill not generated",
    "bill_not_generated_description": "The bill could not be generated. Please try again later."
  }
}
</i18n>
