<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardNavbar
        v-if="userOrganizationsStore.selectedOrganization"
        :title="t('title')"
      >
        <template #right>
          <FormsInputsCourseSelect
            v-model="filterForm.course_id"
            :orgid="userOrganizationsStore.selectedOrganization.organization_id"
          />
          <StudentSelect
            v-model="filterForm.student_id"
            :orgid="userOrganizationsStore.selectedOrganization.organization_id"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <UTable
          :columns="columns"
          :rows="bills ?? []"
          :loading="status === 'pending'"
        >
          <template #course-data="{ row }">
            {{ row.course_name }}
          </template>
          <template #status-data="{ row }">
            <UBadge v-if="row.status === 'paid'" :color="'green'">
              {{ g("bills.status.paid") }}
            </UBadge>
            <UBadge v-else-if="row.status === 'canceled'" :color="'red'">
              {{ g("bills.status.canceled") }}
            </UBadge>
            <UBadge v-else :color="'orange'">
              {{ g("bills.status.unpaid") }}
            </UBadge>
          </template>
          <template #action-data="{ row }">
            <UButton
              variant="link"
              color="white"
              :to="userOrganizationsStore.relativePath(`/bills/${row.id}`)"
              >{{ t("table.view") }}</UButton
            >
          </template>
        </UTable>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { z } from "zod";
import StudentSelect from "~/components/forms/Inputs/StudentSelect.vue";
import type { AppCourse } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const { t } = useI18n({
  useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const userOrganizationsStore = useUserOrganizationsStore();
const subscriptionBills = useSubscriptionBills();
if (!userOrganizationsStore.selectedOrganization) {
  throw new Error("Organization not found");
}

const _schema = z.object({
  student_id: z.string().uuid().optional(),
  course_id: z.string().uuid().optional(),
});

type FilterForm = z.infer<typeof _schema>;

const filterForm = ref<FilterForm>({
  student_id: undefined,
  course_id: undefined,
});

const courses = ref<AppCourse[]>([]);

courses.value = await useCourses(
  userOrganizationsStore.selectedOrganization.organization_id
);

const columns = [
  {
    key: "student_firstname",
    label: t("table.firstname"),
  },
  {
    key: "student_lastname",
    label: t("table.lastname"),
  },
  {
    key: "course_name",
    label: t("table.course"),
  },
  {
    key: "total",
    label: t("table.amount"),
  },
  {
    key: "status",
    label: t("table.status"),
  },
  {
    key: "action",
  },
];

const { data: bills, status } = useAsyncData(
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    return await subscriptionBills.fetchSubscriptionBills({
      course_id: filterForm.value.course_id,
      student_id: filterForm.value.student_id,
    });
  },
  {
    watch: [filterForm.value],
    transform: (data) => {
      return data?.map((bill) => {
        return {
          ...bill,
          status: bill.paid_at ? "paid" : bill.canceled_at ? "canceled" : "unpaid",
        };
      });
    },
  }
);
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Rechnungen",
    "table": {
      "firstname": "Vorname",
      "lastname": "Nachname",
      "course": "Kurs",
      "amount": "Betrag",
      "status": "Status",
      "view": "Anzeigen"
    }
  },
  "en": {
    "title": "Bills",
    "table": {
      "firstname": "Firstname",
      "lastname": "Lastname",
      "course": "Course",
      "amount": "Amount",
      "status": "Status",
      "view": "View"
    }
  }
}
</i18n>
