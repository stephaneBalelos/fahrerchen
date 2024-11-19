<template>
  <UDashboardSlideover :title="t('course_profile')">
    <UDashboardSection
      v-if="data"
      icon="i-heroicons-user"
      :title="props.student.firstname + ' ' + props.student.lastname"
      :description="props.student.email"
    >
      <template #icon="">
        <UAvatar alt="m d" size="lg" />
      </template>

    </UDashboardSection>

    <UDashboardCard v-if="data"
      :title="t('course_activity_attendances')"
      :description="t('course_activity_attendances_description')"
    >
      <div v-for="activity in data.course?.course_activities" :key="activity.id" class="flex flex-col mb-4">
        <p class="font-bold">{{ activity.name }}</p>
        <UProgress v-if="activity.required > 0" :value="activity.attendances[0].count" :max="activity.required" color="primary" indicator>
          <template #indicator>
            <span :color="color">{{ activity.attendances[0].count }} / {{ activity.required }}</span>
          </template>
        </UProgress>
        <div v-else>{{ activity.attendances[0].count }}</div>
      </div>
    </UDashboardCard>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database, AppStudent } from "~/types/app.types";

type Props = {
  subscription_id: string;
  student: AppStudent;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

// const { subscription, student, course } = useAttrs() as Props;
const supabase = useSupabaseClient<Database>();

const course_progression = ref(35);

const { data, error, status } = useAsyncData(
  `course_progression_${props.subscription_id}`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select(
        "*, course:courses(id, course_activities(*, attendances:course_activity_attendances(count)))"
      )
      .eq("id", props.subscription_id)

      .single();

    if (error) {
      throw error;
    }
    console.log(data);
    return data;
  }
);

const color = computed(() => {
  switch (true) {
    case course_progression.value < 10:
      return "blue";
    case course_progression.value < 20:
      return "amber";
    case course_progression.value < 30:
      return "orange";
    default:
      return "green";
  }
});
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_profile": "Kursprofil",
    "course_activity_attendances": "Kursaktivitätsbesuche",
    "course_activity_attendances_description": "Anzahl der Besuche der Kursaktivitäten"
  },
  "en": {
    "course_profile": "Course Profile",
    "course_activity_attendances": "Course Activity Attendances",
    "course_activity_attendances_description": "Number of visits to course activities"
  }
}
</i18n>
