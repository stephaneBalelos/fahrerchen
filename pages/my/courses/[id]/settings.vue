<template>
  <UDashboardPanelContent
    class="p-0 pb-24 divide-y divide-gray-200 dark:divide-gray-800"
  >
    <UDashboardSection
      :title="'Course Requirements'"
      :description="'Set the requirements for this course.'"
      orientation="horizontal"
      class="px-4 py-6"
    >
      <template #links>
        <UButton
          color="primary"
          icon="i-heroicons-plus"
          variant="soft"
          size="2xs"
          @click="openEditRequirementForm('')"
          >Add Requirement</UButton
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
          v-for="field in course_requirements"
          class="flex items-center justify-between pt-4 first:pt-0 gap-2"
        >
          <div class="flex flex-col gap-1 grow">
            <p class="font-semibold">{{ field.name }}</p>
            <div class="flex justify-start gap-1">
              <UBadge color="primary" variant="subtle" size="xs"
                >{{ field.required }} required</UBadge
              >
              <UBadge color="primary" variant="subtle" size="xs"
                >{{ field.price }} &euro;</UBadge
              >
            </div>
            <span class="text-sm text-gray-500">{{ field.description }}</span>
          </div>
          <UButton
            color="gray"
            variant="solid"
            @click="openEditRequirementForm(field.id)"
            >Edit</UButton
          >
        </div>
      </UCard>
    </UDashboardSection>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import type { AppStudent, Database } from "~/types/app.types";
import EditCourseRequirementFrom from "~/components/forms/EditCourseRequirementFrom.vue";

type Props = {
  orgid: string;
  courseid: string;
};

const props = useAttrs() as Props;

const supabase = useSupabaseClient<Database>();
const slideover = useSlideover();
const toast = useToast();

const {
  data: course_requirements,
  error,
  pending,
  refresh,
} = useAsyncData(`course_requirement_${props.courseid}`, async () => {
  const { data } = await supabase
    .from("course_requirements")
    .select("*")
    .eq("course_id", props.courseid);
  return data;
});

const openEditRequirementForm = (id: string) => {
  console.log("Edit requirement form opened");
  slideover.open(EditCourseRequirementFrom, {
    courseid: props.courseid,
    orgid: props.orgid,
    requirementid: id,
    "onRequirement-saved": () => {
      console.log("Requirement saved");
      refresh();
      toast.add({
        title: "Requirement saved",
        description: "The requirement has been saved successfully.",
        color: "green",
      });
    },
    "onRequirement-created": () => {
      console.log("Requirement created");
      refresh();
      toast.add({
        title: "Requirement created",
        description: "The requirement has been created successfully.",
        color: "green",
      });
    },
  });
};
</script>

<style scoped></style>
