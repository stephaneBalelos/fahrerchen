<template>
  <UDashboardPage>
    <UDashboardPanel grow>


    </UDashboardPanel>
  </UDashboardPage>
</template>

<script setup lang="ts">
import AddStudentsForm from "~/components/forms/AddStudentsForm.vue";
import type { AppStudent, Database } from "~/types/app.types";

type Props = {
  orgid: string;
  courseid: string;
};

const props = defineProps<Props>();

const defaultColumns = [
  {
    key: "fistname",
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
  }
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

const { data: students, pending } = await useAsyncData(
  `students_${props.orgid}`,
  async () => {
    const { data, error } = await supabase
      .from("students")
      .select("*")
      .eq("organisation_id", props.orgid);
    if (error) {
      throw error;
    }
    return data;
  },
  { watch: [query], immediate: true }
);

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
</script>

<style scoped></style>
