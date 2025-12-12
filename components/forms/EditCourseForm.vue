<template>
  <UDashboardSlideover :ui="{ width: 'w-screen max-w-xl' }">
    <UDashboardSection :title="'Edit Course'" :description="'SALDKASLD'">
      <div class="flex flex-col">
        <div class="flex flex-col mb-4">
          <p>{{ t("course_costs_title") }}</p>
          <p>{{ t("course_costs_description") }}</p>
        </div>
        <div class="flex flex-col gap-4">
          <CourseCostCombinationCard
            v-for="cost in courseCosts"
            :key="cost.id"
            :cost="cost"
            :course-id="props.course.id"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-col mb-4">
          <p>{{ t("course_activities_title") }}</p>
          <p>{{ t("course_activities_description") }}</p>
        </div>
        <div class="flex flex-col gap-4">
          <CourseActivityCombinationCard
            v-for="activity in courseActivities"
            :key="activity.id"
            :activity="activity"
            :course-id="props.course.id"
          />
        </div>
      </div>
      <div class="flex flex-col">
        <div class="flex flex-col mb-4">
          <p>{{ t("course_required_documents_title") }}</p>
          <p>{{ t("course_required_documents_description") }}</p>
        </div>
        <div class="flex flex-col gap-4">
          Required Documents to be implemented here
        </div>
      </div>
    </UDashboardSection>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppCourse } from "~/types/app.types";
import CourseActivityCombinationCard from "~/components/courses/settings/CourseActivitiyCombinationCard.vue";
import CourseCostCombinationCard from "~/components/courses/settings/CourseCostCombinationCard.vue";

type Props = {
  course: AppCourse;
};
const props = defineProps<Props>();

const { t } = useI18n({
  useScope: "local",
});

const courseActivitiesStore = useCourseActivitiesStore();
const { data: courseActivities } = useAsyncData(
  `course-activities-for-course-${props.course.id}`,
  () =>
    courseActivitiesStore.getCourseActivities(
      props.course.organization_id,
      props.course.id
    )
);

const courseCostsStore = useCourseCostsStore();
const { data: courseCosts } = useAsyncData(
  `course-costs-for-course-${props.course.id}`,
  () =>
    courseCostsStore.getCourseCosts(
      props.course.organization_id,
      props.course.id
    )
);
</script>

<style scoped></style>
