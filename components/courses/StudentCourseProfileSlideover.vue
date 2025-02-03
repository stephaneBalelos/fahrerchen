<template>
  <UDashboardSlideover :title="t('course_profile')">
    <CoursesStudentCourseProfile
      :subscription-id="props.subscriptionId"
      :student="props.student"
    >
    <template #icon>
      <UAvatar
        :alt="`${props.student.firstname} ${props.student.lastname}`"
        size="lg"
        class="mr-4"
      />
    </template>
    <template #title>
      {{ `${props.student.firstname} ${props.student.lastname}` }}
    </template>
    <template #description>
      {{ `${props.student.email}` }}
    </template>
    </CoursesStudentCourseProfile>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { AppStudent } from "~/types/app.types";

type Props = {
  subscriptionId: string;
  student: AppStudent;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();


</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_profile": "Kursprofil",
    "course_profile_desc": "Kursprofil"
  },
  "en": {
    "course_profile": "Course profile",
    "course_profile_desc": "Course profile"
  }
}
</i18n>
