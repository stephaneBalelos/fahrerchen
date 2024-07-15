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
      <template #title
        >
        {{ student?.firstname }} {{ student?.lastname }}
        </template
      >
      <template #description>
        <UBadge color="white" variant="solid">Aktiv</UBadge> <br>
      </template>
      <UProgress :value="course_progression" :max="40" :color="color">
          <template #indicator="{ percent }">
            <div class="text-right" :style="{ width: `${percent}%` }">
              <span v-if="course_progression < 10" class="text-blue-500">Frischling</span>
              <span v-else-if="course_progression < 20" class="text-green-500">Bereits für die Theorie</span>
              <span v-else-if="course_progression < 99" class="text-green-500">Bereits für die Praxis</span>
              <span v-else class="text-green-500 font-bold">Bestanden!</span>
            </div>
          </template>
        </UProgress>
    </UPageHeader>
    <div v-if="status == 'pending'" class="flex items-center space-x-4">
      <USkeleton class="h-12 w-12" :ui="{ rounded: 'rounded-full' }" />
      <div class="space-y-2">
        <USkeleton class="h-4 w-[250px]" />
        <USkeleton class="h-4 w-[200px]" />
      </div>
    </div>
  </UDashboardPanelContent>
  </UDashboardPanel>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";

definePageMeta({
  layout: "orgs",
});

const route = useRoute();
const userId = route.params.id;
const client = useSupabaseClient<Database>();

const {
  data: student,
  error,
  status,
} = useAsyncData(`student_${userId}`, async () => {
  const { data, error } = await client
    .from("students")
    .select("*")
    .eq("id", userId)
    .single();
  if (error) {
    throw error;
  }
  return data;
});

const course_progression = ref(35)

const color = computed(() => {
  switch (true) {
  case course_progression.value < 10: return 'blue'
  case course_progression.value < 20: return 'amber'
  case course_progression.value < 30: return 'orange'
  default: return 'green'
  }
})

function deleteStudent() {
  console.log("delete student");
}
</script>

<style scoped></style>
