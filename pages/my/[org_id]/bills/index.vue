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
            :orgid="userOrganizationsStore.selectedOrganization.id"
          />
          <StudentSelect
            v-model="filterForm.student_id"
            :orgid="userOrganizationsStore.selectedOrganization.id"
          />
        </template>
      </UDashboardNavbar>
      <UDashboardPanelContent class="p-0">
        <UTable
          :columns="columns"
          :rows="bills ?? []"
          :loading="status === 'pending'"
        >
          <template #student-data="{ row }">
            <div class="flex items-center gap-2">
              <UAvatar
                :src="row.cs.student.avatar_url ?? undefined"
                :alt="`${row.cs.student.firstname} ${row.cs.student.lastname}`"
                size="sm"
                class="mr-2"
              />
              <div class="flex flex-col">
                <p class="font-medium text-md text-gray-900 dark:text-gray-100">
                  {{ `${row.cs.student.firstname} ${row.cs.student.lastname}` }}
                </p>
                <p class="text-sm text-gray-500 dark:text-gray-400">
                  {{ row.cs.student.email }}
                </p>
              </div>
            </div>
          </template>
          <template #course-data="{ row }">
            <UBadge v-if="row.cs.course" :color="row.cs.archived_at ? 'gray' : 'green'" variant="soft">
              {{ g(`course_types.${row.cs.course.type}.name_full`) }}
            </UBadge>
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
          <template #total-data="{ row }">
            <p class="text-lg text-gray-900 dark:text-gray-100 font-medium">
              {{ formatCurrency(row.total_with_vat) }}
            </p>
          </template>
          <template #action-data="{ row }">
            <UButton
              color="white"
              :to="userOrganizationsStore.relativePath(`/bills/${row.id}`)"
              :icon="'i-heroicons-chevron-right-20-solid'"
              trailing
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
import { formatCurrency } from "~/utils/formatters";

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

const columns = [
  {
    key: "student",
    label: t("table.student"),
  },
  {
    key: "course",
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
      organization_id: userOrganizationsStore.selectedOrganization.id,
    });
  },
  {
    watch: [filterForm.value],
    transform: (data) => {
      return data?.map((bill) => {
        return {
          ...bill,
          status: bill.paid_at
            ? "paid"
            : bill.canceled_at
            ? "canceled"
            : "unpaid",
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
      "student": "Schüler:in",
      "course": "Kurs",
      "amount": "Betrag",
      "status": "Status",
      "view": "Anzeigen"
    }
  },
  "en": {
    "title": "Bills",
    "table": {
      "student": "Student",
      "course": "Course",
      "amount": "Amount",
      "status": "Status",
      "view": "View"
    }
  }
}
</i18n>
