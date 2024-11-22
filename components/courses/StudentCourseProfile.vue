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

    <UDashboardCard
      class="mb-4"
      v-if="data"
      :title="t('course_activity_attendances')"
      :description="t('course_activity_attendances_description')"
    >
      <div
        v-for="activity in data.course?.course_activities"
        :key="activity.id"
        class="flex flex-col mb-4"
      >
        <p class="font-bold">{{ activity.name }}</p>
        <UProgress
          v-if="activity.required > 0"
          :value="activity.attendances[0].count"
          :max="activity.required"
          color="primary"
          indicator
        >
          <template #indicator>
            <span :color="`primary`">
              {{ activity.attendances[0].count }} /
              {{ activity.required }}
            </span>
          </template>
        </UProgress>
        <div v-else>{{ activity.attendances[0].count }}</div>
      </div>
    </UDashboardCard>

    <UDashboardCard
      class="mb-4"
      v-if="data && data.course?.course_required_documents"
      :title="t('course_required_documents')"
      :description="t('course_required_documents_description')"
    >
      <template #links>
        0 / {{ data.course.course_required_documents.length }}
      </template>

      <CourseRequiredDocumentItem v-for="(doc, index) in data.course.course_required_documents" :key="doc.id"
        :doc="doc" :bucket-id="'course_subscription_documents'" :path="`${doc.organization_id}/${data.id}/${doc.id}`" />
    </UDashboardCard>
  </UDashboardSlideover>
</template>

<script setup lang="ts">
import type { Database, AppStudent } from "~/types/app.types";
import CourseRequiredDocumentItem from "../files/CourseDocuments/CourseRequiredDocumentItem.vue";

type Props = {
  subscription_id: string;
  student: AppStudent;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

const supabase = useSupabaseClient<Database>();

const { data, error, status } = useAsyncData(
  `course_progression_${props.subscription_id}`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select(
        "*, course:courses(id, course_required_documents(*), course_activities(*, attendances:course_activity_attendances(count)))"
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
</script>

<style scoped></style>

<i18n lang="json">
{
  "de": {
    "course_profile": "Kursprofil",
    "course_activity_attendances": "Kursaktivitätsbesuche",
    "course_activity_attendances_description": "Anzahl der Besuche der Kursaktivitäten",
    "course_required_documents": "Erforderliche Dokumente",
    "course_required_documents_description": "Erforderliche Dokumente für den Kurs"
  },
  "en": {
    "course_profile": "Course Profile",
    "course_activity_attendances": "Course Activity Attendances",
    "course_activity_attendances_description": "Number of visits to course activities",
    "course_required_documents": "Required Documents",
    "course_required_documents_description": "Required documents for the course"
  }
}
</i18n>
