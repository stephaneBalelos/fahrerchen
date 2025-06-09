<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-if="subscriptionStore.subscription"
      >
      <template #title>
        <div class="flex items-center gap-2">
          <UAvatar
            :alt="`${subscriptionStore.subscription.student_firstname} ${subscriptionStore.subscription.student_lastname}`"
            size="sm"
          />
          <span>{{ subscriptionStore.subscription.student_full_name }}</span> |
          <span>
            {{  subscriptionStore.subscription.course_name }}
          </span>
          <UBadge
            v-if="subscriptionStore.subscription.archived_at"
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

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const subscription_id = route.params.id as string;
const org_id = route.params.org_id as string;
const subscriptionStore = useSubscriptionStore();

const { t } = useI18n({
  useScope: "local",
});

await useAsyncData(async() => {
  return await subscriptionStore.loadSubscription(subscription_id);
})




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

onUnmounted(() => {
  subscriptionStore.reset()
  console.log(subscriptionStore.subscription)
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
