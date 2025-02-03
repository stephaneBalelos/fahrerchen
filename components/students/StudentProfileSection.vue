<template>
  <UDashboardSection
    icon="i-heroicons-user"
    :title="fulllName"
    :description="student?.email"
    :links="[{ label: 'Student Profile', color: 'black' }]"
  >
    <template #icon="">
      <UAvatar :alt="fulllName" size="lg" />
    </template>
  </UDashboardSection>
</template>

<script setup lang="ts">
import { useCourseStudent } from '~/composables/useStudent';

type Props = {
  student_id: string;
};

const props = defineProps<Props>();

const student = await useCourseStudent(props.student_id);

const fulllName = computed(() => {
  return `${student.firstname} ${student.lastname}`;
});


</script>

<style scoped></style>
