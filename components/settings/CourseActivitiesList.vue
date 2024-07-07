<template>
    <UDashboardSection
      :title="'Course Activities'"
      :description="'Set the Activities for this course.'"
      orientation="horizontal"
      class="px-4 py-6"
    >
      <template #links>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          variant="soft"
          size="2xs"
          @click="openEditActivityForm('')"
          >Add Activity</UButton
        >
      </template>
      <UCard
        :ui="{
          body: {
            base: 'divide-y divide-gray-200 dark:divide-gray-800 gap-4 flex flex-col',
          },
        }"
      >
        <div
          v-for="field in course_activities"
          class="flex items-center justify-between pt-4 first:pt-0 gap-2"
        >
          <div class="flex flex-col gap-1 grow">
            <p class="font-semibold">{{ field.name }}</p>
            <div class="flex justify-start gap-1">
              <UBadge color="primary" variant="subtle" size="xs"
                >{{ field.price }} &euro;</UBadge
              >
            </div>
            <span class="text-sm text-gray-500">{{ field.description }}</span>
          </div>
          <UButton
            color="gray"
            variant="solid"
            @click="openEditActivityForm(field.id)"
            >Edit</UButton
          >
        </div>
      </UCard>
    </UDashboardSection>
</template>

<script setup lang="ts">
    import type { Database } from '~/types/app.types';
import EditCourseActivityForm from '../forms/EditCourseActivityForm.vue';

const supabase = useSupabaseClient<Database>();
const slideover = useSlideover();
const toast = useToast();

const props = defineProps<{
  orgid: string;
  courseid: string;
}>();

const {
  data: course_activities,
  error,
  pending,
  refresh,
} = useAsyncData(`course_activities_${props.courseid}`, async () => {
  const { data } = await supabase
    .from("course_activities")
    .select("*")
    .eq("course_id", props.courseid);
  return data;
});

const openEditActivityForm = (id?: string) => {
  slideover.open(EditCourseActivityForm, {
    courseid: props.courseid,
    orgid: props.orgid,
    course_activity_id: id,
    "onActivity-saved": () => {
      console.log("Activity saved");
      refresh();
      toast.add({
        title: "Activity saved",
        description: "The Activity has been saved successfully.",
        color: "green",
      });
    },
    "onActivity-deleted": () => {
      console.log("Activity deleted");
      refresh();
      toast.add({
        title: "Activity created",
        description: "The Activity has been created successfully.",
        color: "green",
      });
    },
  });
};
</script>

<style scoped>

</style>