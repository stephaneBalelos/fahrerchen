<template>
  <UDashboardPanelContent>
    <div
      v-if="userOrganizationsStore.selectedOrganization?.organization_id"
      class="grid lg:grid-cols-3 gap-4"
    >
      <UTabs v-if="tabs.length > 0" :items="tabs" class="w-full col-span-2">
        <template #item="{ item }">
          <CourseActivitySchedulesSection
            v-if="course_activities"
            :key="item.key"
            :course-id="props.courseid"
            :org-id="
              userOrganizationsStore.selectedOrganization.organization_id
            "
            :activity-type-id="item.key"
          />
        </template>
      </UTabs>
      <div v-else class="w-full col-span-2">
        <UAlert
          :title="t('no_activities')"
          :description="t('no_activities_description')"
        />
      </div>
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

const { t } = useI18n({
  useScope: "local",
});

const { t:g } = useI18n({
  useScope: "global",
});

const props = useAttrs() as Props;
const client = useSupabaseClient<Database>();
const userOrganizationsStore = useUserOrganizationsStore();
const activity_types = await useCourseActivityTypes()

const { data: course_activities } = useAsyncData(
  "course_activity_schedules",
  async () => {
    if (!userOrganizationsStore.selectedOrganization) {
      return null;
    }
    const { data, error } = await client
      .from("course_activities")
      .select("id, name, description, activity_type")
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
  if (!activity_types) {
    return [];
  }
  return activity_types.map((activity_type) => ({
    label: g(`courses.activities.types.${activity_type.type}`),
    key: activity_type.id
  }));
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "title": "Aktivitäten",
    "no_activities": "Keine Aktivitäten",
    "no_activities_description": "Es gibt keine Aktivitäten für diesen Kurs. Gehen Sie zur Kurseinstellungen, um Aktivitäten hinzuzufügen."
  },
  "en": {
    "title": "Activities",
    "no_activities": "No activities",
    "no_activities_description": "There are no activities for this course."
  }
}
</i18n>
