<script setup lang="ts">
import { type Database } from "~/types/database.types";
import EditCourseForm from "~/components/forms/EditCourseForm.vue";

definePageMeta({
  layout: "orgs",
});

const supabase = useSupabaseClient<Database>();
const orgState = useUserOrganizations();
const toast = useToast();
const slideover = useSlideover();

const { data, error, status, refresh } = await useAsyncData(
  "courses",
  async () => {
    const { data, error } = await supabase
      .from("courses")
      .select("*")
      .eq("organization_id", orgState.selected_organization_id.value);
    if (error) {
      throw error;
    }
    return data;
  },
  { watch: [orgState.selected_organization_id], immediate: true }
);

onMounted(async () => {
  await refresh();
});

const openCreateCourseForm = () => {
  slideover.open(EditCourseForm, {
    "onCourse-created": () => {
      refresh();
      slideover.close();
      toast.add({
        title: "Course created",
        description: "Course has been created successfully",
        color: "green",
      });
    },
  });
};
</script>

<template>
  <UDashboardPanelContent>
    <UPageHeader
      class="courses-header"
      headline="Course"
      title="My Courses"
      description="All Courses"
      :links="[
        {
          label: 'Create New Course',
          color: 'white',
          icon: 'i-heroicons-folder-plus',
          click: () => openCreateCourseForm(),
        },
      ]"
    />
    <div class="grid grid-cols-1 gap-3" v-if="data && data?.length > 0">
      <UDashboardCard
        v-for="(d, index) in data"
        :key="index"
        :title="d.name"
        class="course-card"
        :description="d.description ? d.description : 'No description'"
        :links="[
          {
            label: 'Details',
            color: 'gray',
            trailingIcon: 'i-heroicons-arrow-right-20-solid',
            to: '/my/courses/' + d.id,
          },
        ]"
      />
    </div>
    <div v-else>
      // No data
      <UButton id="create-course-btn" @click="openCreateCourseForm"
        >Create your first course</UButton
      >
    </div>
  </UDashboardPanelContent>
</template>

<style scoped></style>
