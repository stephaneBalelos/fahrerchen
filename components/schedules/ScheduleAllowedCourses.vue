<template>
    <div v-if="status === 'success' && data && data.length > 0" class="flex flex-wrap gap-2">
        <div v-for="course in activeCourses" :key="course.id" class="flex items-center gap-2">
            <UBadge v-if="allowedCourseIds.includes(course.id)" color="white">
                {{ g(`course_types.${course.type}.name`) }}
            </UBadge>
        </div>
    </div>
    <div v-else>
        <div v-if="status === 'pending'">
            <USkeleton class="w-full h-6" />
        </div>
        <div v-else class="text-sm text-gray-500 dark:text-gray-400">
            <UAlert :title="t('schedules.no_allowed_courses')" />
        </div>
    </div>
</template>

<script setup lang="ts">

type Props = {
  activityId: string;
};

const { t } = useI18n({
    useScope: "local",
});

const { t: g } = useI18n({
  useScope: "global",
});

const props = defineProps<Props>();
const courseActivitiesStore = useCourseActivitiesStore();
const { activeCourses } = useCoursesStore();

const { data, status } = useAsyncData(
  `course_activities_combination_${props.activityId}`,
  () =>
    courseActivitiesStore.getAllowedCourseForActivity(
      props.activityId,
    ),
  {
    transform: (data) => data || [],
     immediate: true, watch: [() => props.activityId] }
);

const allowedCourseIds = computed(() => {
  if (!data.value) return [];
  return data.value.map((ca) => ca.course_id);
});



</script>

<style scoped>

</style>