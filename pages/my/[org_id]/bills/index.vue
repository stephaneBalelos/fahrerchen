<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardToolbar>
        <FormsInputsCourseSelect
          v-if="userOrganizationsStore.selectedOrganization"
          v-model="filterForm.course_id"
          :orgid="userOrganizationsStore.selectedOrganization.organization_id"
        />
      </UDashboardToolbar>
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
            <UBadge :color="row.status === 'paid' ? 'green' : 'red'">
              {{ row.status }}
            </UBadge>
          </template>
          <template #action-data="{ row }">
            <UButton
              variant="link"
              color="white"
              :to="userOrganizationsStore.relativePath(`/bills/${row.id}`)"
              >View</UButton
            >
          </template>
        </UTable>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import { z } from "zod";
import type { AppCourse } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
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
    label: "Firstname",
  },
  {
    key: "student_lastname",
    label: "Lastname",
  },
  {
    key: "course_name",
    label: "Course",
  },
  {
    key: "total",
    label: "Amount",
  },
  {
    key: "status",
    label: "Status",
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
    });
  },
  {
    watch: [filterForm.value],
    transform: (data) => {
      return data?.map((bill) => {
        return {
          ...bill,
          status: bill.paid_at ? "paid" : "unpaid",
        };
      });
    },
  }
);
</script>

<style scoped></style>
