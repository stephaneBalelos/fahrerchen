<template>
    <div v-if="status === 'success' && data && data.length > 0" class="flex flex-wrap gap-2">
        dsa
    </div>
</template>

<script setup lang="ts">

const { t } = useI18n({
  useScope: "global",
});

type Props = {
  activityId: string;
};

const props = defineProps<Props>();


const coursesStore = useCoursesStore();
const courseActivitiesStore = useCourseActivitiesStore();

const { data, refresh, status } = useAsyncData(
  `course_activities_combination_${props.activityId}`,
  () =>
    courseActivitiesStore.getAllowedCourseForActivity(
      props.activityId,
    ),
  {
    transform: (data) => data || [],
     immediate: true, watch: [() => props.activityId] }
);



</script>

<style scoped>

</style>