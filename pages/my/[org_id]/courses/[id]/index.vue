<template>
  <UDashboardPanelContent>
    <div
      v-if="userOrganizationsStore.selectedOrganization?.organization_id"
      class="grid lg:grid-cols-3 gap-4"
    >
      <UTabs :items="tabs" class="w-full col-span-2">
        <template #item="{ item }">
          <CourseActivitySchedulesSection
            v-if="course_activities"
            :key="item.key"
            :course-id="props.courseid"
            :activity-id="item.activity_id"
            :activity-name="item.activity_name"
            :activity-description="item.activity_description"
            :org-id="
              userOrganizationsStore.selectedOrganization.organization_id
            "
          />
        </template>
      </UTabs>
      <FormsCourseDocumentsForm
        v-if="userOrganizationsStore.selectedOrganization"
        :orgid="userOrganizationsStore.selectedOrganization.organization_id"
        :courseid="props.courseid"
      />
    </div>
  </UDashboardPanelContent>
</template>

<script setup lang="ts">
import CourseActivitySchedulesSection from "~/components/courses/CourseActivitySchedulesSection.vue";
import type { Database } from "~/types/database.types";
type Props = {
  courseid: string;
};
definePageMeta({
  layout: "orgs",
});

const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();

const { data: course_activities } = useAsyncData(
  "course_activity_schedules",
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    const { data, error } = await client
      .from("course_activities")
      .select("id, name, description")
      .eq("course_id", props.courseid)
      .eq(
        "organization_id",
        userOrganizationsStore.selectedOrganization?.organization_id
      );
    if (error) {
      throw error;
    }
    return data;
  }
);

const tabs = computed(() => {
  if (!course_activities.value) {
    return [];
  }
  return course_activities.value.map((activity) => ({
    label: activity.name,
    key: activity.id,
    activity_id: activity.id,
    activity_name: activity.name,
    activity_description: activity.description,
  }));
});
</script>

<style scoped></style>
