<template>
  <UDashboardSection
    v-if="data"
    :title="props.title"
    :description="props.description"
  >
    <template #icon>
      <slot name="icon">
        <UAvatar icon="i-heroicons-user" size="lg" />
      </slot>
    </template>
    <template #title>
      <slot name="title" />
    </template>
    <template #description>
      <slot name="description" />
    </template>
    <div>
      <StudentsCourseStudentProgression
        :subscription-id="props.subscriptionId"
      />
      <UDashboardCard
        v-if="data.course"
        class="mb-4"
        :title="t('course_required_documents')"
        :description="t('course_required_documents_description')"
      >
        <template #links> 0 / {{ data.course.docs.length }} </template>
        <CourseRequiredDocumentItem
          v-for="doc in data.course.docs"
          :key="doc.id"
          :doc="doc"
          :bucket-id="'course_subscription_documents'"
          :path="`${doc.organization_id}/${data.id}/${doc.id}`"
        />
      </UDashboardCard>
    </div>
  </UDashboardSection>
</template>

<script setup lang="ts">
import type { Database, AppStudent } from "~/types/app.types";
import CourseRequiredDocumentItem from "../files/CourseDocuments/CourseRequiredDocumentItem.vue";

type Props = {
  title?: string;
  description?: string;
  subscriptionId: string;
  student: AppStudent;
};

const { t } = useI18n({
  useScope: "local",
});

const props = defineProps<Props>();

const supabase = useSupabaseClient<Database>();

const { data } = useAsyncData(
  `course_progression_${props.subscriptionId}_docs`,
  async () => {
    const { data, error } = await supabase
      .from("course_subscriptions")
      .select("*, course:courses(id, docs:course_required_documents(*))")
      .eq("id", props.subscriptionId)

      .single();

    if (error) {
      throw error;
    }
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
