<template>
  <div>
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
          @click="isNewStudentSlideOverOpen = true"
        />
      </template>
    </UDashboardToolbar>

    <UTable
      v-model="selected"
      v-model:sort="sort"
      :rows="students ? students : []"
      :columns="columns"
      :loading="pending"
      sort-mode="manual"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
      @select="onSelect"
    >
      <template #name-data="{ row }">
        <div class="flex items-center gap-3">
          <UAvatar v-bind="row.avatar" :alt="row.name" size="xs" />

          <span class="text-gray-900 dark:text-white font-medium">{{
            row.name
          }}</span>
        </div>
      </template>

      <template #status-data="{ row }">
        <UBadge
          :label="row.status"
          :color="
            row.status === 'subscribed'
              ? 'green'
              : row.status === 'bounced'
              ? 'orange'
              : 'red'
          "
          variant="subtle"
          class="capitalize"
        />
      </template>
      <template #actions-data="{ row }">
        <UDropdown :items="items(row)">
          <UButton
            color="gray"
            variant="ghost"
            icon="i-heroicons-ellipsis-horizontal-20-solid"
          />
        </UDropdown>
      </template>
    </UTable>
    <UDashboardSlideover
      v-model="isNewStudentSlideOverOpen"
      title="Create News Course"
    >
      <AddStudentsForm
        @student-added="onStudentAdded"
        :orgid="org"
        :courseid="courseid"
      />
      <template #footer>
        <UButton @click="isNewStudentSlideOverOpen = false">Cancel</UButton>
      </template>
    </UDashboardSlideover>
  </div>
</template>

<script setup lang="ts">
import AddStudentsForm from "~/components/forms/AddStudentsForm.vue";
import EditStudentForm from "~/components/forms/EditStudentForm.vue";
import type { AppStudent, Database } from "~/types/app.types";

const { org } = useGlobalOrgState();
const route = useRoute();
const slideover = useSlideover();

const courseid = route.params.id as string;

const defaultColumns = [
  {
    key: "firstname",
    label: "First Name",
    sortable: true,
  },
  {
    key: "lastname",
    label: "Last Name",
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
  },
];

const supabase = useSupabaseClient<Database>();

const q = ref("");
const selected = ref<AppStudent[]>([]);
const selectedColumns = ref(defaultColumns);
const selectedStatuses = ref([]);
const selectedLocations = ref([]);
const sort = ref({ column: "id", direction: "asc" as const });
const input = ref<{ input: HTMLInputElement }>();
const isNewStudentSlideOverOpen = ref(false);
const isEditStudentSlideOverOpen = ref(false);

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
  pending,
  refresh,
} = await useAsyncData(
  `students_${org.value}`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("id, inserted_at, students(*)")
      .eq("organisation_id", org.value)
      .eq("course_id", courseid);
    if (error) {
      console.log(error);
      throw error;
    }
    return data;
  },
  { watch: [query], immediate: true }
);

const students = computed(() => {
  if (!course_subscriptions.value) return [];
  return course_subscriptions.value.map((sub) => sub.students as AppStudent);
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

function onStudentAdded() {
  console.log("student added");
}

defineShortcuts({
  "/": () => {
    input.value?.input?.focus();
  },
});

const items = (row: AppStudent) => [
  [
    {
      label: "Edit",
      icon: "i-heroicons-pencil-square-20-solid",
      click: () => {
        slideover.open(EditStudentForm, { student: row });
      },
    },
    {
      label: "Duplicate",
      icon: "i-heroicons-document-duplicate-20-solid",
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
  [
    {
      label: "Delete",
      icon: "i-heroicons-trash-20-solid",
    },
  ],
];
</script>

<style scoped></style>
