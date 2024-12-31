<template>
  <UDashboardToolbar>
    <template #left>
      <!-- <USelectMenu
            v-model="selectedStatuses"
            icon="i-heroicons-check-circle"
            placeholder="Status"
            multiple
            :options="defaultStatuses"
            :ui-menu="{ option: { base: 'capitalize' } }"
          />
          <USelectMenu
            v-model="selectedLocations"
            icon="i-heroicons-map-pin"
            placeholder="Location"
            :options="defaultLocations"
            multiple
          /> -->
    </template>

    <template #right>
      <USelectMenu
        v-model="selectedColumns"
        icon="i-heroicons-adjustments-horizontal-solid"
        :options="defaultColumns"
        multiple
        class="hidden lg:block"
      >
        <template #label> Display </template>
      </USelectMenu>
      <UButton
        label="Add Student"
        trailing-icon="i-heroicons-plus"
        color="gray"
        @click="openAddStudentForm"
      />
    </template>
  </UDashboardToolbar>

  <UDashboardPanelContent class="p-0">
    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="subscriptions ? subscriptions : []"
      :columns="columns"
      :loading="status === 'pending'"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #fullname-data="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar :alt="row.fullname" size="xs" />
          <span class="text-gray-900 dark:text-white font-medium">{{
            row.fullname
          }}</span>
        </div>
      </template>
      <template #status-data="{ row }">
        <UBadge
          :label="row.status"
          :color="
            row.status === 'subscribed'
              ? 'green'
              : row.status === 'archived'
              ? 'orange'
              : 'red'
          "
          variant="subtle"
          class="capitalize"
        />
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)" @click.stop>
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseSubscriptionBill from "~/components/courses/CourseSubscriptionBill.vue";
import StudentCourseProfileSlideover from "~/components/courses/StudentCourseProfileSlideover.vue";
import AddStudentsForm from "~/components/forms/AddStudentsForm.vue";
import type {
  AppCourseSubscription,
  AppStudent,
  Database,
} from "~/types/app.types";

const route = useRoute();
const slideover = useSlideover();
const { courseid } = useAttrs() as Props;
const userOrganizationsStore = useUserOrganizationsStore();
const supabase = useSupabaseClient<Database>();


type Props = {
  courseid: string;
};


const defaultColumns = [
  {
    key: "fullname",
    label: "name",
    sortable: true,
  },
  {
    key: "email",
    label: "Email",
    sortable: true,
  },
  {
    key: "status",
    label: "Status",
    sortable: true,
  },
  {
    key: "actions",
    label: "Actions",
  },
];

const q = ref("");
const selected = ref<AppStudent[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref([]);
const selectedLocations = ref([]);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();

const columns = computed(() =>
  defaultColumns.filter((column) => selectedColumns.value.includes(column))
);

const query = computed(() => ({
  q: q.value,
  statuses: selectedStatuses.value,
  locations: selectedLocations.value,
  sort: sort.value.column,
  order: sort.value.direction,
}));

const {
  data: course_subscriptions,
  status,
  refresh,
} = await useAsyncData(
  `subscriptions_${courseid}`,
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("*, student:students(*)")
      .eq("organization_id", userOrganizationsStore.selectedOrganization.organization_id)
      .eq("course_id", courseid);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  },
  {
    watch: [query],
    immediate: true,
    transform: (data) => {
      return data?.map((sub) => {
        return {
          ...sub,
          status: sub.archived_at ? "archived" : "subscribed",
          email: sub.student?.email,
          fullname: `${sub.student?.firstname} ${sub.student?.lastname}`,
        };
      });
    },
  }
);

const subscriptions = computed(() => {
  if (!course_subscriptions.value) return [];
  return course_subscriptions.value.filter((sub) => sub.student !== null);
});

// const defaultLocations = users.value.reduce((acc, user) => {
//   if (!acc.includes(user.location)) {
//     acc.push(user.location)
//   }
//   return acc
// }, [] as string[])

// const defaultStatuses = users.value.reduce((acc, user) => {
//   if (!acc.includes(user.status)) {
//     acc.push(user.status)
//   }
//   return acc
// }, [] as string[])

function onSelect(row: AppStudent) {
  const index = selected.value.findIndex((item) => item.id === row.id);
  if (index === -1) {
    selected.value.push(row);
  } else {
    selected.value.splice(index, 1);
  }
}

defineShortcuts({
  "/": () => {
    input.value?.input?.focus();
  },
});

const items = (row: AppCourseSubscription & {student: AppStudent}) => [
  [
    {
      label: "Course Profile",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        slideover.open(StudentCourseProfileSlideover, {
          subscription_id: row.id,
          student: row.student,
        });
      },
    },
    {
      label: "Rechnung",
      icon: "i-heroicons-document-duplicate-20-solid",
      click: () => {
        slideover.open(CourseSubscriptionBill, { subscription_id: row.id });
      },
    },
  ],
  [
    {
      label: "Archive",
      icon: "i-heroicons-archive-box-20-solid",
    },
    {
      label: "Move",
      icon: "i-heroicons-arrow-right-circle-20-solid",
    },
  ],
];

function openAddStudentForm() {
  if (!userOrganizationsStore.selectedOrganization) {
    return;
  }
  slideover.open(AddStudentsForm, {
    courseid: courseid,
    orgid: userOrganizationsStore.selectedOrganization.organization_id,
    "onStudent-added": () => {
      refresh();
    },
  });
}
</script>

<style scoped></style>
