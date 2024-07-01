<template>
    Calendar
</template>

<script setup lang="ts">
import type { CreateLessonSchema } from "~/components/forms/CreateLessonForm.vue";
import type { Database } from "~/types/database.types";

definePageMeta({
  layout: "orgs",
});
const route = useRoute();
const orgState = useGlobalOrgState();
const supabase = useSupabaseClient<Database>();

const {
  data: course,
  error,
  refresh,
} = await useAsyncData(`course_${route.params.id}`, async () => {
  const { data, error } = await supabase
    .from("courses")
    .select("*")
    .eq("id", route.params.id)
    .single();
  if (error) {
    throw error;
  }
  console.log(data);
  return data;
});

watch(
  () => route.params,
  async () => {
    await refresh();
  },
  { deep: true }
);

// onMounted(async () => {
//     console.log('mounted')
//     await refresh()
// })

const open = ref(false);
</script>

<style scoped></style>
