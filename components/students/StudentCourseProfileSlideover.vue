<template>
  <UDashboardSlideover 
    :ui="{
      width: 'w-screen max-w-xl',
    }"
  >
{{ props.studentId }}
  </UDashboardSlideover>
</template>

<script setup lang="ts">

type Props = {
  studentId: string;
};


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
