<template>
  <UDashboardPanel grow>
    <UDashboardNavbar
      :title="`${student?.firstname} ${student?.lastname}`"
      :badge="t('active')"
    >
      <template #right>
        <USelectMenu
          v-if="subscriptions"
          v-model="selectedSubscriptionId"
          :options="subscriptions"
          :value-attribute="'id'"
          :option-attribute="'course_name'"
        >
          <template #label>
            <div v-if="selectedSubscriptionId" class="flex gap-2 items-center">
              <UBadge
                v-if="
                  subscriptions.find((sub) => sub.id === selectedSubscriptionId)
                    ?.archived_at
                "
                size="sm"
                >{{ t("archive") }}</UBadge
              >
              <span>{{
                subscriptions.find((sub) => sub.id === selectedSubscriptionId)
                  ?.course_name
              }}</span>
            </div>
          </template>
          <template #option="{ option: subscription }">
            <span>{{ subscription.course_name }}</span>
          </template>
        </USelectMenu>
      </template>
    </UDashboardNavbar>
    <UDashboardToolbar
      v-if="selectedSubscriptionId"
      class="py-0 px-1.5 overflow-x-auto"
    >
      <UHorizontalNavigation :links="links" />
    </UDashboardToolbar>
    <UDashboardPanelContent v-if="selectedSubscriptionId">
      <NuxtPage :subscription_id="selectedSubscriptionId" />
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const student_id = route.params.id as string;
const org_id = route.params.org_id as string;
const client = useSupabaseClient<Database>();

const { t } = useI18n({
  useScope: "local",
});

const student = await useCourseStudent(student_id);

const selectedSubscriptionId = ref();

const { data: subscriptions } = useAsyncData(
  `student_${student_id}_subscriptions`,
  async () => {
    const { data, error } = await client
      .from("course_subscriptions_view")
      .select("*")
      .eq("student_id", student_id)
      .eq("organization_id", org_id);
    if (error) {
      throw error;
    }
    if (data.length) {
      selectedSubscriptionId.value = data[0].id;
    }
    return data;
  }
);

const links = [
  {
    label: t("overview"),
    to: `/my/${org_id}/students/${student_id}`,
    exact: true,
  },
  {
    label: t("bills"),
    to: `/my/${org_id}/students/${student_id}/bills`,
  },
  {
    label: t("subscription"),
    to: `/my/${org_id}/students/${student_id}/subscription`,
  },
];
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
    "subscription": "Abonnement"
  },
  "en": {
    "title": "Student",
    "active": "Active",
    "archive": "Archive",
    "overview": "Overview",
    "bills": "Bills",
    "subscription": "Subscription"
  }
}
</i18n>
