<template>
  <UDashboardSection
    icon="i-heroicons-user"
    :title="t('compose_your_courses')"
    :description="t('compose_your_courses_description')"
  >
  <template #links>
      <UButton
        color="gray"
        icon="i-heroicons-plus"
        @click="openCreateCourseModal"
        >{{ t("create_new_course") }}</UButton
      >
      <UButton
        v-if="isCourseSetupComplete"
        color="primary"
        icon="i-heroicons-check-circle"
        @click="$emits('course-setup-completed')"
        >{{ t("course_setup_complete") }}</UButton
      >
    </template>
    <div v-if="coursesStore.courses && coursesStore.courses.length > 0">
      <UDashboardCard
        v-for="course in coursesStore.courses"
        :key="course.id"
        :title="course.name"
        :description="course.description"
        class="px-0 mt-0"
      >
        <template #icon>
          <UAvatar size="lg" color="primary" :icon="COURSE_ICONS['A']" />
        </template>
        <template #links>
          <UButton
            size="sm"
            color="gray"
            :label="t('edit_course')"
            icon="i-heroicons-pencil-square"
            @click="() => {
                openCreateCourseModal(course.id);
            }"
          />
          <UButton
            size="sm"
            color="red"
            variant="soft"
            icon="i-heroicons-trash"
            @click="() => {}"
          />
        </template>
        <CourseCostsList
          :orgid="course.organization_id"
          :courseid="course.id"
        />

        <CourseActivitiesList
          :orgid="course.organization_id"
          :courseid="course.id"
        />

        <CourseRequirementsList
          :orgid="course.organization_id"
          :courseid="course.id"
        />
      </UDashboardCard>
    </div>
    <div v-else>
      <UPageHero
        :title="t('no_courses')"
        :description="t('no_courses_description')"
        :align="'center'"
        :links="[
          {
            label: t('create_course'),
            click: openCreateCourseModal,
            color: 'primary',
          },
        ]"
      />
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { COURSE_ICONS } from "~/constants";
import EditCourseForm from "../forms/EditCourseForm.vue";
import CourseActivitiesList from "../courses/settings/CourseActivitiesList.vue";
import CourseCostsList from "../courses/settings/CourseCostsList.vue";
import CourseRequirementsList from "../courses/settings/CourseRequiredDocumentsList.vue";

const { t } = useI18n({
  useScope: "local",
});

const modal = useModal();
const userOrganizationsStore = useUserOrganizationsStore();
const coursesStore = useCoursesStore();
const $emits = defineEmits(["course-setup-completed"]);

const openCreateCourseModal = (course_id?: string) => {
  // Logic to open the modal goes here
  if (userOrganizationsStore.selectedOrganization) {
    modal.open(EditCourseForm, {
      organizationId:
        userOrganizationsStore.selectedOrganization.organization_id,
        courseId: course_id,
      "onCourse-created": async () => {
        await coursesStore.loadCourses();
        modal.close();
      },
      "onCourse-updated": async () => {
        await coursesStore.loadCourses();
        modal.close();
      },
    });
  }
};

const isCourseSetupComplete = computed(() => {
  return (
    coursesStore.courses &&
    coursesStore.courses.length > 0
  );
});
</script>

<style scoped></style>
