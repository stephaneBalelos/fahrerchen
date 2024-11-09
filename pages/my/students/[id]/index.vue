<template>
  <UDashboardPanel grow>
    <UDashboardPanelContent>
      <UPageHeader v-if="status == 'success'" class="w-full">
        <template #icon>
          <UAvatar
            size="3xl"
            src="https://avatars.githubusercontent.com/u/739984?v=4"
            alt="Avatar"
          />
        </template>
        <template #title>
          {{ student?.firstname }} {{ student?.lastname }}
        </template>
        <template #description>
          <UBadge color="white" variant="solid">Aktiv</UBadge> <br />
        </template>
      </UPageHeader>
    </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const student_id = route.params.id;
const client = useSupabaseClient<Database>();

const {
  data: student,
  error,
  status,
} = useAsyncData(`student_${student_id}`, async () => {
  const { data, error } = await client
    .from("students")
    .select("*")
    .eq("id", student_id)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

const course_progression = ref(35);

const color = computed(() => {
  switch (true) {
    case course_progression.value < 10:
      return "blue";
    case course_progression.value < 20:
      return "amber";
    case course_progression.value < 30:
      return "orange";
    default:
      return "green";
  }
});

function deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>
