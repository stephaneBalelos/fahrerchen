<template>
  <UDashboardPanelContent class="p-0">
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
      <UButton
        :label="t('add_student')"
        trailing-icon="i-heroicons-plus"
        color="gray"
        @click="openAddStudentForm"
      />
    </template>
  </UDashboardToolbar>

    <UTable
      v-model:sort="sort"
      :rows="subscriptions ? subscriptions : []"
      :columns="columns"
      :loading="status === 'pending'"
      class="w-full"
      :ui="{ divide: 'divide-gray-200 dark:divide-gray-800' }"
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
          :label="t(`subscription_status.${row.status}`)"
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
import StudentCourseProfileSlideover from "~/components/courses/StudentCourseProfileSlideover.vue";
import AddStudentsForm from "~/components/forms/AddStudentsForm.vue";
import type {
  AppCourseSubscription,
  AppStudent,
  Database,
} from "~/types/app.types";

const slideover = useSlideover();
const { courseid } = useAttrs() as Props;
const userOrganizationsStore = useUserOrganizationsStore();
const supabase = useSupabaseClient<Database>();


type Props = {
  courseid: string;
};
const { t } = useI18n({
  useScope: "local",
})

const defaultColumns = [
  {
    key: "fullname",
    label: t("fullname"),
    sortable: true,
  },
  {
    key: "email",
    label: t("email"),
    sortable: true,
  },
  {
    key: "status",
    label: t("status"),
    sortable: true,
  },
  {
    key: "actions",
  },
];

const q = ref("");
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

defineShortcuts({
  "/": () => {
    input.value?.input?.focus();
  },
});

const items = (row: AppCourseSubscription & {student: AppStudent}) => [
  [
    {
      label: t("course_profile"),
      click: () => {
        slideover.open(StudentCourseProfileSlideover, {
          subscriptionId: row.id,
          student: row.student,
        });
      },
    },
    {
      label: t("course_subscription"),
      click: () => {
        if (!userOrganizationsStore.selectedOrganization) {
          return;
        }
        navigateTo(`/my/${userOrganizationsStore.selectedOrganization.organization_id}/students/${row.id}`);
      },
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

<i18n lang="json">
{
  "de": {
    "fullname": "Vollständiger Name",
    "email": "E-Mail",
    "status": "Status",
    "add_student": "Student hinzufügen",
    "course_profile": "Kursprofil",
    "course_subscription": "Kursanmeldung",
    "subscription_status": {
      "subscribed": "Eingeschrieben",
      "archived": "Archiviert"
    }
  },
  "en": {
    "fullname": "Full name",
    "email": "Email",
    "status": "Status",
    "add_student": "Add student",
    "course_profile": "Course profile",
    "course_subscription": "Course subscription",
    "subscription_status": {
      "subscribed": "Subscribed",
      "archived": "Archived"
    }
  }
}
</i18n>
