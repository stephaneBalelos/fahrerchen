<template>
  <UDashboardPage>
    <UDashboardPanel grow>
      <UDashboardToolbar>
        <USelectMenu
          v-model="selectedCourse"
          :options="courses"
          option-attribute="name"
          placeholder="Course"
        />
      </UDashboardToolbar>
      <UDashboardPanelContent class="p-0">
        <UTable
          :columns="columns"
          :rows="bills ?? []"
          :loading="status === 'pending'"
        >
          <template #course_subscriptions.course_id-data="{ row }">
            {{
              courses.find(
                (course) => course.id === row.course_subscriptions.course_id
              )?.name
            }}
          </template>
          <template #status-data="{ row }">
            <UBadge :color="row.status === 'paid' ? 'green' : 'red'">
              {{ row.status }}
            </UBadge>
          </template>
          <template #action-data="{ row }">
            <ULink :to="`/my/bills/${row.id}`">View</ULink>
          </template>
        </UTable>
      </UDashboardPanelContent>
    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import type { AppCourse, Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const { selected_organization_id } = useUserOrganizations();
const client = useSupabaseClient<Database>();

const selectedCourse = ref<AppCourse>();
const courses = await useCourses();

const columns = [
  {
    key: "course_subscriptions.students.firstname",
    label: "Firstname",
  },
  {
    key: "course_subscriptions.students.lastname",
    label: "Lastname",
  },
  {
    key: "course_subscriptions.course_id",
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

const {
  data: bills,
  error,
  status,
  refresh,
} = useAsyncData(
  `${selected_organization_id}_subscriptions_bills`,
  async () => {
    let req = client
      .from("course_subscription_bills")
      .select("*, course_subscriptions(*, students(*))")
      .eq("organization_id", selected_organization_id.value);
    // if (selectedCourse.value) {
    //   req = req.eq("course_id", selectedCourse.value);
    // }
    const { data, error } = await req;
    console.log(data);
    if (error) {
      console.error(error);
      throw error;
    }

    return data ? data : [];
  },
  {
    watch: [selectedCourse],
    transform: (data) => {
      return data.map((bill) => {
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
